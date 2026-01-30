
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { EmotionalState, MicroStudy } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Use Pro for more nuanced, high-quality spiritual guidance
const MODEL_PRO = "gemini-3-pro-preview";
const MODEL_FLASH = "gemini-3-flash-preview";

export const generateLifeTriggeredStudy = async (emotion: EmotionalState | string): Promise<MicroStudy> => {
  const isSearch = !Object.values(EmotionalState).includes(emotion as EmotionalState);
  
  const response = await ai.models.generateContent({
    model: isSearch ? MODEL_PRO : MODEL_FLASH,
    contents: isSearch 
      ? `A mom is looking for biblical wisdom regarding: "${emotion}". Create a high-quality 5-minute micro-study. Use Google Search to find current cultural context for moms and timeless scripture. Tone: Gentle, wise, relatable.`
      : `A mom is feeling ${emotion}. Create a 5-minute micro-study for her. Tone: Warm, conversational, honest—like a wise friend. Address her specific emotional reality.`,
    config: {
      tools: isSearch ? [{ googleSearch: {} }] : undefined,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          verse: { type: Type.STRING },
          reference: { type: Type.STRING },
          reflection: { type: Type.STRING },
          prayer: { type: Type.STRING },
          action: { type: Type.STRING },
          category: { type: Type.STRING },
        },
        required: ["title", "verse", "reference", "reflection", "prayer", "action", "category"]
      }
    }
  });

  const data = JSON.parse(response.text || '{}');
  return {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    durationMinutes: 5
  };
};

export const getMentorResponse = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string) => {
  const chat = ai.chats.create({
    model: MODEL_PRO,
    config: {
      systemInstruction: "You are 'Grace', a wise and loving spiritual mentor for moms. You offer biblical perspective with zero judgment. You focus on 'Grace, not Perfection'. Keep responses concise (under 3 sentences) unless asked for more depth. Always prioritize the mom's mental well-being.",
    },
    // We pass history manually in the sendMessage if needed, or initialize with it.
  });
  
  const response = await chat.sendMessage({ message });
  return response.text;
};

export const generateDailyEncouragement = async (name: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: MODEL_FLASH,
    contents: `Write a short, warm, 2-sentence encouragement for a mom named ${name} who is trying to find God in her daily chaos. Focus on grace, not perfection. Today is ${new Date().toLocaleDateString()}.`,
  });
  return response.text.trim();
};

export const generateStudyAudio = async (text: string): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read this with a warm, gentle, maternal, and encouraging voice: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Generation failed", error);
    return undefined;
  }
};
