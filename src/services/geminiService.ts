
// Refactored to follow @google/genai SDK guidelines:
// 1. Used ai.models.generateContent directly.
// 2. Simplified contents property to use string or single Content object where appropriate.
// 3. Ensured correct response property access (.text getter).

import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { VoiceName, EngineMode, MusicProductionParams, MultiSpeakerTurn } from "../types";
import { decode, createWavBlob } from "./audioUtils";

export const analyzeVoice = async (audioBase64: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze this audio sample and provide a highly detailed, one-paragraph technical description of the speaker's vocal characteristics. 
  Focus on: tone (raspy, smooth, nasal), pitch (high/low), cadence (fast, melodic, monotone), and any specific unique identifiers. 
  This description will be used to simulate this voice in a TTS engine. Do not include introductory text, just the description.`;

  try {
    // Fixed: Simplified contents structure to a single object with parts as per guidelines
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "audio/wav",
              data: audioBase64
            }
          }
        ]
      },
    });
    return response.text || "A unique and clear professional voice.";
  } catch (err) {
    throw new Error("Voice analysis failed. Ensure the sample is clear.");
  }
};

export const generateLyrics = async (title: string, style: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Write a professional song structure for a track titled "${title}" in the genre of ${style}. 
  Include [Verse 1], [Chorus], [Verse 2], [Chorus], [Bridge], and [Outro]. 
  Make the lyrics poetic, rhythmic, and suitable for musical synthesis. 
  Only return the lyrics.`;

  try {
    // Fixed: Simplified contents to string as per guidelines
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
    });
    return response.text || "Lyrics generation failed.";
  } catch (err) {
    throw new Error("Lyric Architect is currently busy.");
  }
};

export const generateMusic = async (
  title: string,
  lyrics: string,
  style: string,
  vocalist: VoiceName = 'Kore',
  params: MusicProductionParams
): Promise<{ audioUrl: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const organicSynthetic = params.vibeX > 50 ? 'Electronic/Synthetic' : 'Acoustic/Organic';
  const chillEnergetic = params.vibeY > 50 ? 'High-energy/Uptempo' : 'Relaxed/Down-tempo';

  const systemInstruction = `You are a Neural Music Synthesizer. 
  Your goal: Transform lyrics into a musical vocal performance.
  Vibe: ${style} - ${organicSynthetic} and ${chillEnergetic}.
  Guidelines:
  - Do not speak; SING the lyrics.
  - Pace: Follow a steady ${params.bpm} BPM tempo.
  - Rhythm: Use vocal beatboxing and percussive mouth sounds for the drum track.
  - Instruments: Incorporate textures of ${params.instruments.join(', ')}.`;

  try {
    // Fixed: Simplified contents to string as per guidelines
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: `TITLE: ${title}\n\nPERFORM THESE LYRICS:\n${lyrics}`,
      config: {
        systemInstruction,
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: vocalist } },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio returned.");
    return { audioUrl: URL.createObjectURL(createWavBlob(decode(base64Audio), 24000)) };
  } catch (err: any) {
    throw new Error("The Production Studio is currently unavailable.");
  }
};

export const generateMultiSpeakerTTS = async (
  turns: MultiSpeakerTurn[],
  joeVoice: VoiceName,
  janeVoice: VoiceName
): Promise<{ audioUrl: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `TTS the following conversation:
  ${turns.map(t => `${t.speaker}: ${t.text}`).join('\n')}`;

  try {
    // Fixed: Simplified contents to string as per guidelines
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: prompt,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              { speaker: 'Joe', voiceConfig: { prebuiltVoiceConfig: { voiceName: joeVoice } } },
              { speaker: 'Jane', voiceConfig: { prebuiltVoiceConfig: { voiceName: janeVoice } } },
            ]
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("Dialogue synthesis failed.");
    return { audioUrl: URL.createObjectURL(createWavBlob(decode(base64Audio), 24000)) };
  } catch (err: any) {
    throw new Error("Dialogue engine failed.");
  }
};

export const generateTTS = async (
  text: string, 
  voice: VoiceName, 
  emotion: string = "Neutral",
  stylePrompt?: string,
  personaDescription?: string,
  mode: EngineMode = 'turbo'
): Promise<{ audioUrl: string }> => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API key not configured. Please set VITE_GEMINI_API_KEY in your .env file.");
  }
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Emotion: ${emotion}. Persona: ${personaDescription || 'Professional'}. Style: ${stylePrompt || 'Natural'}. Text: "${text}"`;
  
  try {
    // Fixed: Simplified contents to string as per guidelines
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: prompt,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("Synthesis failed");
    return { audioUrl: URL.createObjectURL(createWavBlob(decode(base64Audio), 24000)) };
  } catch (err: any) {
    throw new Error((err?.message as string) || "Engine error");
  }
};
