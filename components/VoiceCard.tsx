
import React from 'react';
import { VoiceProfile } from '../types';

interface VoiceCardProps {
  voice: VoiceProfile;
  selected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onFavoriteToggle: (e: React.MouseEvent) => void;
  onPreview: (e: React.MouseEvent) => void;
  isPreviewing: boolean;
}

export const VoiceCard: React.FC<VoiceCardProps> = ({ 
  voice, 
  selected, 
  isFavorite, 
  onSelect, 
  onFavoriteToggle, 
  onPreview,
  isPreviewing
}) => {
  return (
    <div
      onClick={onSelect}
      className={`relative group flex flex-col p-3 rounded-2xl transition-all duration-200 text-left cursor-pointer border-2 ${
        selected 
          ? 'bg-white border-studio-orange shadow-md ring-2 ring-studio-orange/5' 
          : 'bg-white/50 border-studio-peach/20 hover:border-studio-orange/30 hover:bg-white'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="relative shrink-0">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden shadow-sm transition-transform ${isPreviewing ? 'scale-110 ring-2 ring-studio-orange' : ''}`}>
            <img 
              src={voice.avatar} 
              alt={voice.name} 
              className={`w-full h-full object-cover transition-all ${
                selected ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'
              }`} 
            />
          </div>
          {selected && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-studio-brown text-white rounded-full flex items-center justify-center border border-white shadow-sm">
               <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
            </div>
          )}
        </div>
        
        <div className="flex gap-1 shrink-0">
          <button 
            onClick={onPreview}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
              isPreviewing 
                ? 'bg-studio-orange text-white shadow-inner' 
                : 'bg-studio-cream text-studio-brown/20 hover:bg-studio-brown hover:text-white'
            }`}
          >
            {isPreviewing ? (
              <div className="flex gap-0.5 items-end h-2">
                <div className="w-0.5 bg-current animate-music-bar-1" style={{height: '100%'}} />
                <div className="w-0.5 bg-current animate-music-bar-3" style={{height: '60%'}} />
              </div>
            ) : (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
          <button 
            onClick={onFavoriteToggle}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
              isFavorite 
                ? 'bg-studio-orange/10 text-studio-orange' 
                : 'bg-studio-cream text-studio-brown/10 hover:text-studio-orange'
            }`}
          >
            <svg className={`w-3 h-3 ${isFavorite ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className={`font-black text-[11px] uppercase tracking-tight truncate leading-none mb-1 ${selected ? 'text-studio-orange' : 'text-studio-brown'}`}>
          {voice.name}
        </h3>
        <p className="text-[9px] text-studio-brown/50 line-clamp-2 leading-snug mb-2 font-medium">
          {voice.description}
        </p>
        
        <div className="flex flex-wrap gap-1">
          {voice.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[7px] font-black uppercase tracking-tighter bg-studio-peach/10 text-studio-orange px-1.5 py-0.5 rounded-md border border-studio-orange/5">{tag}</span>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between pt-2 border-t border-studio-peach/10">
        <span className="text-[7px] font-black uppercase text-studio-brown/40">{voice.accent}</span>
        <span className="text-[7px] font-bold text-studio-brown/20 uppercase">{voice.gender}</span>
      </div>
    </div>
  );
};
