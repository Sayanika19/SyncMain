import json
from collections import defaultdict
from difflib import get_close_matches
from flask import Flask, render_template, Response, jsonify, request
import cv2
import classifier
import pyttsx3
import time
import os
import threading
from deep_translator import GoogleTranslator
from deepface import DeepFace
from mtcnn import MTCNN
from collections import deque

app = Flask(__name__)

class WordSuggestor:
    def __init__(self):
        try:
            with open('word_freq.json') as f:
                self.word_freq = json.load(f)
        except FileNotFoundError:
            self.word_freq = {
                "hello": 100, "hi": 99, "goodbye": 98, "bye": 97, "yes": 96,
                "no": 95, "please": 94, "thank": 93, "you": 92, "me": 91,
                # ... (rest of your word frequency dictionary)
            }
        self.user_history = defaultdict(int)
        
    def update_history(self, word):
        self.user_history[word.lower()] += 1
        
    def get_suggestions(self, prefix, num=5):
        candidates = [w for w in self.word_freq if w.lower().startswith(prefix.lower())]
        candidates.sort(key=lambda w: (
            self.user_history.get(w.lower(), 0),
            self.word_freq.get(w, 0)
        ), reverse=True)
        return candidates[:num]
    
    def get_corrections(self, word, num=3):
        if word.lower() in [w.lower() for w in self.word_freq]:
            return []
        return get_close_matches(word.lower(), self.word_freq.keys(), n=num)

class EmotionDetector:
    def __init__(self, min_confidence=70):
        self.MIN_CONFIDENCE = min_confidence
        self.SMOOTHING_WINDOW = 5
        self.DETECTOR = MTCNN()
        self.EMOTION_COLORS = {
            'angry': (0, 0, 255),
            'disgust': (0, 102, 0),
            'fear': (255, 255, 0),
            'happy': (0, 255, 0),
            'sad': (255, 0, 0),
            'surprise': (255, 153, 255),
            'neutral': (255, 255, 255),
        }
        self.frame = None
        self.results = []
        self.emotion_history = {}
        self.lock = threading.Lock()
        self.running = False
        self.processing_thread = None

    def start(self):
        if self.processing_thread is None or not self.processing_thread.is_alive():
            self.running = True
            self.processing_thread = threading.Thread(target=self._processing_loop, daemon=True)
            self.processing_thread.start()

    def _processing_loop(self):
        while self.running:
            if self.frame is not None:
                try:
                    rgb_frame = cv2.cvtColor(self.frame, cv2.COLOR_BGR2RGB)
                    detections = self.DETECTOR.detect_faces(rgb_frame)
                    processed_results = []

                    for det in detections:
                        x, y, w, h = det['box']
                        cropped_face = rgb_frame[y:y+h, x:x+w]
                        analysis = DeepFace.analyze(
                            img_path=cropped_face,
                            actions=['emotion'],
                            enforce_detection=False,
                            detector_backend='mtcnn',
                            silent=True
                        )
                        if isinstance(analysis, list):
                            analysis = analysis[0]
                        dominant_emotion = analysis['dominant_emotion']
                        confidence = analysis['emotion'][dominant_emotion]
                        if confidence >= self.MIN_CONFIDENCE:
                            processed_results.append((x, y, w, h, dominant_emotion, confidence))
                    
                    with self.lock:
                        self.results = processed_results
                except Exception as e:
                    print(f"Emotion detection error: {e}")
            time.sleep(0.05)

    def update_frame(self, frame):
        self.frame = cv2.resize(frame, (640, 480))

    def get_emotions(self):
        with self.lock:
            return self.results.copy()

    def stop(self):
        self.running = False
        if self.processing_thread and self.processing_thread.is_alive():
            self.processing_thread.join(timeout=1)

# Initialize components
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    raise RuntimeError("Could not open video capture")
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

emotion_detector = EmotionDetector(min_confidence=70)
emotion_detector.start()

prediction_text = "....."
last_prediction_time = 0
selected_language = "en"
suggestor = WordSuggestor()
speech_engine = None

def init_speech_engine():
    global speech_engine
    try:
        speech_engine = pyttsx3.init()
        voices = speech_engine.getProperty('voices')
        for voice in voices:
            if "female" in voice.name.lower():
                speech_engine.setProperty('voice', voice.id)
                break
    except Exception as e:
        print(f"Error initializing speech engine: {e}")
        speech_engine = None

init_speech_engine()

def translate_text(text, target_lang):
    if target_lang == "en" or not text.strip():
        return text
    try:
        return GoogleTranslator(source='auto', target=target_lang).translate(text)
    except Exception as e:
        print(f"Translation error: {e}")
        return text

def speak(text):
    if not speech_engine:
        return
        
    try:
        # Stop any current speech
        speech_engine.stop()
        # Queue new speech
        speech_engine.say(text)
        # Start in a separate thread to avoid blocking
        def run_engine():
            try:
                speech_engine.runAndWait()
            except RuntimeError as e:
                if "run loop already started" in str(e):
                    pass  # This is expected when interrupting speech
                else:
                    print(f"Speech error: {e}")
        
        threading.Thread(target=run_engine, daemon=True).start()
    except Exception as e:
        print(f"Error in speech synthesis: {e}")

def speak_translation(original, translation, language):
    if language == "en":
        speak(original)
    else:
        speak(f"{original} ({translation})")

def speak_text(text):
    if not text.strip():
        return None
        
    try:
        translated = translate_text(text, selected_language)
        speak_translation(text, translated, selected_language)
        return translated
    except Exception as e:
        print(f"Error in speak_text: {e}")
        return None

def generate_frames():
    global prediction_text, last_prediction_time
    while True:
        try:
            success, frame = cap.read()
            if not success:
                print("Failed to read frame from camera")
                break

            frame = cv2.flip(frame, 1)
            emotion_detector.update_frame(frame.copy())
            
            emotion_results = emotion_detector.get_emotions()
            for x, y, w, h, emotion, confidence in emotion_results:
                color = emotion_detector.EMOTION_COLORS.get(emotion, (255, 255, 255))
                cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
                label = f"{emotion} ({confidence:.1f}%)"
                cv2.putText(frame, label, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

            current_time = time.time()
            if current_time - last_prediction_time > 2:
                last_prediction_time = current_time
                frame, prediction_text = classifier.get_prediction(frame)
                if prediction_text.strip():
                    speak_text(prediction_text)

            _, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        except Exception as e:
            print(f"Error in frame generation: {e}")
            break

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/predict')
def predict():
    global prediction_text
    translated = translate_text(prediction_text, selected_language)
    return jsonify({
        'prediction': prediction_text,
        'translated': translated,
        'language': selected_language
    })

@app.route('/translate_sentence', methods=['POST'])
def translate_sentence():
    data = request.get_json()
    text = data.get('text', '')
    target_lang = data.get('language', 'en')
    
    try:
        if target_lang == "en":
            translated = text
        else:
            translated = translate_text(text, target_lang)
        return jsonify({
            'original': text,
            'translated': translated,
            'language': target_lang
        })
    except Exception as e:
        print(f"Translation error: {e}")
        return jsonify({
            'original': text,
            'translated': text,
            'language': target_lang,
            'error': str(e)
        }), 500

@app.route('/speak_translation', methods=['POST'])
def api_speak_translation():
    data = request.get_json()
    text = data.get('text', '')
    language = data.get('language', 'en')
    
    try:
        if language == "en":
            speak(text)
        else:
            translated = translate_text(text, language)
            speak_translation(text, translated, language)
        return jsonify({'status': 'success'})
    except Exception as e:
        print(f"Error speaking translation: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/emotion')
def emotion():
    emotion_results = emotion_detector.get_emotions()
    if emotion_results:
        return jsonify({'emotion': emotion_results[0][4]})
    return jsonify({'emotion': 'No face detected'})

@app.route('/get_suggestions')
def get_suggestions():
    prefix = request.args.get('prefix', '').lower()
    suggestions = suggestor.get_suggestions(prefix)
    corrections = []
    if len(suggestions) < 3:
        corrections = suggestor.get_corrections(prefix)
    return jsonify({
        'suggestions': suggestions,
        'corrections': corrections
    })

@app.route('/update_history', methods=['POST'])
def update_history():
    data = request.get_json()
    word = data.get('word', '').lower()
    if word:
        suggestor.update_history(word)
    return jsonify({'status': 'success'})

@app.route('/change_language', methods=['POST'])
def change_language():
    global selected_language
    selected_language = request.json.get("language", "en")
    return jsonify({'message': f'Language changed to {selected_language}'})

@app.route('/shutdown', methods=['POST'])
def shutdown():
    on_shutdown()
    return jsonify({'status': 'shutting down'})

def on_shutdown():
    try:
        print("Shutting down resources...")
        emotion_detector.stop()
        cap.release()
        if speech_engine:
            speech_engine.stop()
        print("Cleanup complete")
    except Exception as e:
        print(f"Error during shutdown: {e}")

if __name__ == "__main__":
    try:
        import atexit
        atexit.register(on_shutdown)
        app.run(host='0.0.0.0', port=5003, debug=True, use_reloader=False)
    except KeyboardInterrupt:
        on_shutdown()
    except Exception as e:
        print(f"Application error: {e}")
        on_shutdown()