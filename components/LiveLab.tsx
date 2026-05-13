
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { encode, decode, decodeAudioData, blobToBase64 } from '../services/audioUtils';

export const LiveLab: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcripts, setTranscripts] = useState<{ type: 'user' | 'model', text: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const stopSession = () => {
    setIsActive(false);
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
  };

  const startSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscripts(prev => [...prev, { type: 'model', text }]);
            }
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setTranscripts(prev => [...prev, { type: 'user', text }]);
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            setError("Session error. Verify permissions.");
            stopSession();
          },
          onclose: () => setIsActive(false)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are an expressive vocal assistant. You can see the user.',
          inputAudioTranscription: {},
          outputAudioTranscription: {}
        }
      });

      sessionRef.current = await sessionPromise;
      setIsActive(true);

      const interval = setInterval(async () => {
        if (!canvasRef.current || !videoRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, 320, 240);
          canvasRef.current.toBlob(async (blob) => {
            if (blob) {
              const base64 = await blobToBase64(blob);
              sessionPromise.then(session => {
                session.sendRealtimeInput({
                  media: { data: base64, mimeType: 'image/jpeg' }
                });
              });
            }
          }, 'image/jpeg', 0.6);
        }
      }, 1000);

      return () => {
        clearInterval(interval);
        stopSession();
      };

    } catch (err: any) {
      setError("Camera/Microphone access required.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black uppercase italic tracking-tighter">Resonance Lab</h2>
          <p className="text-xs text-studio-brown/40 font-medium tracking-tight">Zero-latency conversational neural engine.</p>
        </div>
        <button
          onClick={isActive ? stopSession : startSession}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-full font-black uppercase text-xs tracking-widest transition-all ${
            isActive 
              ? 'bg-red-500/10 text-red-600 border border-red-200' 
              : 'bg-studio-brown text-studio-cream shadow-md'
          }`}
        >
          {isActive ? 'Stop' : 'Connect'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative aspect-video rounded-3xl overflow-hidden bg-studio-cream/50 border border-studio-peach">
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover grayscale"
          />
          <canvas ref={canvasRef} width="320" height="240" className="hidden" />
          {!isActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-studio-cream/80 backdrop-blur-[2px]">
              <div className="w-10 h-10 rounded-full border-2 border-studio-peach border-t-studio-orange animate-spin mb-3" />
              <p className="text-[10px] text-studio-brown/40 font-black uppercase tracking-widest">Awaiting Bridge</p>
            </div>
          )}
          {isActive && (
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-studio-peach">
              <div className="w-1.5 h-1.5 rounded-full bg-studio-orange animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-studio-orange">Live Bridge</span>
            </div>
          )}
        </div>

        <div className="bg-studio-cream/30 rounded-3xl flex flex-col h-[280px] border border-studio-peach">
          <div className="p-3 border-b border-studio-peach flex items-center justify-between">
            <span className="font-black text-[9px] text-studio-brown/30 uppercase tracking-widest">Resonance Log</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {transcripts.length === 0 ? (
              <div className="h-full flex items-center justify-center text-studio-brown/20 italic text-[11px]">
                Initiate bridge to begin resonance...
              </div>
            ) : (
              transcripts.map((t, i) => (
                <div key={i} className={`flex ${t.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-[11px] font-medium leading-relaxed ${
                    t.type === 'user' 
                      ? 'bg-studio-brown text-studio-cream' 
                      : 'bg-white border border-studio-peach text-studio-brown'
                  }`}>
                    {t.text}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-[10px] font-bold border border-red-100 flex items-center gap-3">
          {error}
        </div>
      )}
    </div>
  );
};
