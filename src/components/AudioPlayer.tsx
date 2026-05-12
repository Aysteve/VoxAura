
import React, { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  url: string;
  filename?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, filename }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number>();

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play().catch(console.error);
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `VoxAura-${Date.now()}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      if (total) setProgress((current / total) * 100);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = 2;
      const gap = 1;
      const barCount = Math.floor(canvas.width / (barWidth + gap));
      ctx.fillStyle = isPlaying ? '#FF9644' : '#FFCE99';
      for (let i = 0; i < barCount; i++) {
        const randomHeight = isPlaying 
          ? (Math.sin(Date.now() * 0.01 + i * 0.2) * 0.5 + 0.5) * canvas.height * 0.8
          : (Math.random() * 0.1 + 0.1) * canvas.height * 0.3;
        const x = i * (barWidth + gap);
        const y = (canvas.height - randomHeight) / 2;
        ctx.beginPath();
        ctx.roundRect?.(x, y, barWidth, randomHeight, 1) ?? ctx.rect(x, y, barWidth, randomHeight);
        ctx.fill();
      }
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [isPlaying]);

  return (
    <div className="flex items-center gap-2 bg-white p-1.5 pr-3 rounded-xl border border-studio-peach/40 shadow-sm">
      <audio ref={audioRef} src={url} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} className="hidden" />
      <button onClick={togglePlay} className="w-7 h-7 bg-studio-brown hover:bg-studio-orange rounded-lg flex items-center justify-center text-white shadow shrink-0 active:scale-90 transition-all">
        {isPlaying ? (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        ) : (
          <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        )}
      </button>
      <div className="flex flex-col gap-1 flex-1 min-w-[40px]">
        <canvas ref={canvasRef} width={60} height={12} className="w-full h-3 opacity-60" />
        <div className="w-full h-0.5 bg-studio-peach/20 rounded-full overflow-hidden">
          <div className="h-full bg-studio-orange transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <button onClick={handleDownload} className="p-1 text-studio-brown/20 hover:text-studio-orange transition-colors">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
      </button>
    </div>
  );
};
