interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

const GEMINI_API_KEY = 'AIzaSyCvpM9YncEDYgrYleNuWHztVdWZEC17hCU';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const SYSTEM_PROMPT = `You are a helpful assistant that ONLY answers questions related to sign language, deaf culture, accessibility, and communication for people with hearing or speech impairments. 

Your expertise includes:
- American Sign Language (ASL), International Sign Language (ISL), British Sign Language (BSL), and other sign languages
- Deaf culture and community
- Accessibility tools and technologies
- Communication strategies for deaf and mute individuals
- Sign language learning resources and techniques
- History and linguistics of sign languages

If someone asks about topics unrelated to sign language, deaf culture, or accessibility, politely respond: "I'm only able to assist with questions related to sign language, deaf culture, and accessibility. How can I help you with these topics?"

Always be encouraging, inclusive, and supportive. Provide practical, helpful information that empowers users in their sign language journey.`;

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\nUser question: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('No response from Gemini API');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Sorry, I\'m having trouble connecting right now. Please try again in a moment.');
  }
};