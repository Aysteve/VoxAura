
import React, { useState, useRef } from 'react';
import { analyzeVoice } from '../services/geminiService';
import { blobToBase64 } from '../services/audioUtils';

interface VoiceCloneModalProps {
  onClose: () => void;
  onCloned: (description: string) => void;
}

export const VoiceCloneModal: React.FC<VoiceCloneModalProps> = ({ onClose, onCloned }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [timer, setTimer] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => setRecordedBlob(new Blob(chunks, { type: 'audio/wav' }));
      mediaRecorder.start();
      setIsRecording(true);
      setTimer(0);
      timerIntervalRef.current = window.setInterval(() => setTimer(t => t + 1), 1000);
    } catch (err) { alert("Microphone access denied."); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const handleClone = async () => {
    if (!recordedBlob) return;
    setIsProcessing(true);
    try {
      const base64 = await blobToBase64(recordedBlob);
      const description = await analyzeVoice(base64);
      onCloned(description);
      onClose();
    } catch (err) { alert("Failed to analyze voice."); } finally { setIsProcessing(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-studio-brown/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-studio-orange" />
        <div className="text-center space-y-1">
          <h2 className="text-lg font-black uppercase italic tracking-tighter">Voice Clone</h2>
          <p className="text-[7px] font-black uppercase tracking-widest text-studio-brown/30">Capture DNA</p>
        </div>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-50 ring-4 ring-red-500/10' : 'bg-studio-cream border border-studio-peach'}`}>
            {isRecording ? <div className="flex gap-0.5 items-end h-5"><div className="w-1 bg-red-500 animate-music-bar-1"/><div className="w-1 bg-red-500 animate-music-bar-2"/></div> : <span className="text-2xl">🎙️</span>}
          </div>
          <p className="text-[9px] text-center font-medium text-studio-brown/60 max-w-[180px]">
            {isRecording ? "Speak clearly..." : recordedBlob ? "Ready!" : "Record 5-10s of clear speech."}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {!isRecording && !recordedBlob ? (
            <button onClick={startRecording} className="w-full bg-studio-brown text-white py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest">Start Capture</button>
          ) : isRecording ? (
            <button onClick={stopRecording} className="w-full bg-red-500 text-white py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest">Stop</button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setRecordedBlob(null)} className="flex-1 bg-studio-cream text-studio-brown py-2.5 rounded-xl font-black text-[9px] uppercase">Retry</button>
              <button onClick={handleClone} disabled={isProcessing} className="flex-1 bg-studio-brown text-white py-2.5 rounded-xl font-black text-[9px] uppercase">{isProcessing ? 'DNA Mapping...' : 'Clone'}</button>
            </div>
          )}
          <button onClick={onClose} className="w-full text-[7px] font-black uppercase text-studio-brown/30 pt-2">Abort</button>
        </div>
      </div>
    </div>
  );
};
