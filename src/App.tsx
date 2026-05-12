
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { VOICES, EMOTIONS, MUSIC_TAGS, VOICE_DESIGN_CASES } from './constants';
import { VoiceCard } from './components/VoiceCard';
import { AudioPlayer } from './components/AudioPlayer';
import { LiveLab } from './components/LiveLab';
import { ProfileDashboard } from './components/ProfileDashboard';
import { VoiceCloneModal } from './components/VoiceCloneModal';
import { generateTTS, generateMusic, generateLyrics, generateMultiSpeakerTTS } from './services/geminiService';
import { TTSGeneration, VoiceProfile, MusicProductionParams, MultiSpeakerTurn } from './types';

type TabType = 'home' | 'speech' | 'music' | 'library' | 'design' | 'resonance' | 'profile';

const App: React.FC = () => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [rightPanelTab, setRightPanelTab] = useState<'settings' | 'history'>('settings');
  
  const [inputText, setInputText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<VoiceProfile>(VOICES[0]);
  const [selectedEmotion, setSelectedEmotion] = useState('Neutral');
  const [customPersona, setCustomPersona] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const [filterGender, setFilterGender] = useState<string>('All');
  const [filterAccent, setFilterAccent] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'Name' | 'Accent'>('Name');

  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [isDialogueMode, setIsDialogueMode] = useState(false);
  const [dialogueTurns, setDialogueTurns] = useState<MultiSpeakerTurn[]>([
    { speaker: 'Joe', voice: 'Charon', text: 'Hey there. What are we discussing today?' },
    { speaker: 'Jane', voice: 'Kore', text: 'I was thinking about the future of neural audio.' }
  ]);
  
  const [musicTitle, setMusicTitle] = useState('');
  const [musicStyle, setMusicStyle] = useState('Lo-fi Hip Hop');
  const [musicParams, setMusicParams] = useState<MusicProductionParams>({
    bpm: '90', key: 'C Maj', intensity: 5, depth: 'Wide',
    vibeX: 50, vibeY: 50,
    volumes: { vocals: 0.8, drums: 0.5, bass: 0.6, synth: 0.4 },
    effects: { reverb: 3, delay: 2, saturation: 1 },
    instruments: ['Piano', 'Synth Pad']
  });

  const [designPrompt, setDesignPrompt] = useState('');
  const [designName, setDesignName] = useState('');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(0);

  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<TTSGeneration[]>([]);
  const [error, setError] = useState<string | null>(null);

  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);

  useEffect(() => { checkKey(); }, []);

  const checkKey = async () => {
    if (window.aistudio?.hasSelectedApiKey) {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected as boolean);
    } else { setHasKey(true); }
  };

  const handlePreviewVoice = async (voice: VoiceProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewingVoiceId === voice.name) {
      previewAudioRef.current?.pause();
      setPreviewingVoiceId(null);
      return;
    }
    setPreviewingVoiceId(voice.name);
    try {
      const { audioUrl } = await generateTTS(voice.greeting, voice.id, 'Cheerful');
      if (previewAudioRef.current) {
        previewAudioRef.current.src = audioUrl;
        previewAudioRef.current.play();
        previewAudioRef.current.onended = () => setPreviewingVoiceId(null);
      }
    } catch (err: any) {
      setError("Preview failed.");
      setPreviewingVoiceId(null);
    }
  };

  const toggleFavorite = (voiceName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(voiceName)) next.delete(voiceName);
      else next.add(voiceName);
      return next;
    });
  };

  const handleGenerateLyrics = async () => {
    if (!musicTitle) {
      setError("Provide a title for the architect.");
      return;
    }
    setIsGenerating(true);
    try {
      const lyrics = await generateLyrics(musicTitle, musicStyle);
      setInputText(lyrics);
    } catch (err: any) {
      setError(err.message || "Engine error.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      let audioUrl = '';
      let type: 'tts' | 'music' | 'design' | 'dialogue' = 'tts';
      let entryText = inputText;

      if (activeTab === 'music') {
        const result = await generateMusic(musicTitle || "Untitled", inputText, musicStyle, selectedVoice.id, musicParams);
        audioUrl = result.audioUrl;
        type = 'music';
        entryText = musicTitle || "Sonic Piece";
      } else if (activeTab === 'speech' && isDialogueMode) {
        const result = await generateMultiSpeakerTTS(dialogueTurns, 'Charon', 'Kore');
        audioUrl = result.audioUrl;
        type = 'dialogue';
        entryText = `Dialogue Turn`;
      } else if (activeTab === 'design') {
        const result = await generateTTS(`Initializing vocal profile ${designName}.`, selectedVoice.id, 'Neutral', designPrompt);
        audioUrl = result.audioUrl;
        type = 'design';
        entryText = `Persona: ${designName}`;
      } else {
        const result = await generateTTS(
          inputText, 
          selectedVoice.id, 
          selectedEmotion, 
          `Speed: ${speed}x`,
          customPersona || undefined
        );
        audioUrl = result.audioUrl;
        type = 'tts';
      }
      
      const newEntry: TTSGeneration = {
        id: Math.random().toString(36).substr(2, 5),
        text: entryText,
        voice: selectedVoice.id,
        voiceName: type === 'design' ? designName : selectedVoice.name,
        emotion: selectedEmotion,
        timestamp: Date.now(),
        audioUrl,
        type,
      };

      setHistory(prev => [newEntry, ...prev]);
      setRightPanelTab('history');
      if (window.innerWidth > 768) setIsRightPanelOpen(true);
    } catch (err: any) { 
      setError("Engine Error"); 
    } finally { 
      setIsGenerating(false); 
    }
  };

  const SidebarItem = ({ id, label, icon }: { id: TabType, label: string, icon: string }) => (
    <button
      onClick={() => { setActiveTab(id); setIsMobileMenuOpen(false); }}
      className={`group flex items-center gap-2 p-2 rounded-xl transition-all w-full ${
        activeTab === id ? 'bg-studio-peach text-studio-brown shadow-sm' : 'text-studio-brown/40 hover:bg-studio-peach/10'
      }`}
    >
      <span className="text-lg">{icon}</span>
      {(isSidebarHovered || isMobileMenuOpen) && (
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      )}
    </button>
  );

  const filteredVoices = useMemo(() => {
    let list = VOICES.filter(v => {
      const matchesGender = filterGender === 'All' || v.gender === filterGender;
      const matchesAccent = filterAccent === 'All' || v.accent === filterAccent;
      const matchesSearch = searchQuery === '' || 
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        v.description.toLowerCase().includes(searchQuery.toLowerCase());
      // Fix: Explicitly type tag as string in the callback to avoid unknown type error on line 195
      const matchesTags = selectedTags.size === 0 || Array.from(selectedTags).every((tag: string) => v.tags.includes(tag));
      return matchesGender && matchesAccent && matchesSearch && matchesTags;
    });
    if (sortBy === 'Name') list.sort((a, b) => a.name.localeCompare(b.name));
    else list.sort((a, b) => a.accent.localeCompare(b.accent));
    return list;
  }, [filterGender, filterAccent, searchQuery, selectedTags, sortBy]);

  const uniqueAccents = Array.from(new Set(VOICES.map(v => v.accent))).sort();
  const uniqueGenders = Array.from(new Set(VOICES.map(v => v.gender))).sort();
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    VOICES.forEach(v => v.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort().slice(0, 10);
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const clearFilters = () => {
    setFilterGender('All');
    setFilterAccent('All');
    setSearchQuery('');
    setSelectedTags(new Set());
  };

  return (
    <div className="flex h-screen bg-studio-cream text-studio-brown overflow-hidden font-sans">
      <audio ref={previewAudioRef} className="hidden" />
      
      {isCloneModalOpen && (
        <VoiceCloneModal 
          onClose={() => setIsCloneModalOpen(false)} 
          onCloned={(desc) => {
            setCustomPersona(desc);
            setActiveTab('speech');
          }} 
        />
      )}

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-studio-brown/40 backdrop-blur-sm z-[55] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        className={`fixed md:relative inset-y-0 left-0 z-[60] flex flex-col border-r border-studio-peach/40 bg-white py-4 items-start gap-4 shrink-0 transition-all duration-300 ${
          isSidebarHovered ? 'w-[180px]' : 'w-[64px]'
        } ${isMobileMenuOpen ? 'translate-x-0 w-[200px]' : '-translate-x-full md:translate-x-0'} px-2`}
      >
        <div className="flex items-center gap-2 ml-2 mb-2 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-8 h-8 rounded-lg bg-studio-brown flex items-center justify-center text-studio-cream font-black shadow-md">V</div>
          {(isSidebarHovered || isMobileMenuOpen) && <span className="font-black text-[10px] tracking-tight uppercase">VOXAURA</span>}
        </div>
        
        <nav className="flex flex-col gap-1 w-full">
          <SidebarItem id="home" label="Home" icon="🏠" />
          <SidebarItem id="speech" label="Speech" icon="🗣️" />
          <SidebarItem id="music" label="Music" icon="🎵" />
          <SidebarItem id="resonance" label="Live" icon="🌊" />
          <SidebarItem id="design" label="Design" icon="✨" />
          <SidebarItem id="library" label="Library" icon="📚" />
          <SidebarItem id="profile" label="Profile" icon="👤" />
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 bg-[#FBF9EE] relative">
        <header className="h-[52px] border-b border-studio-peach/40 flex items-center justify-between px-4 bg-white/40 backdrop-blur-lg z-40">
           <div className="flex items-center gap-2">
              <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-1.5 text-studio-brown hover:bg-studio-peach/20 rounded-lg">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <h2 className="text-[9px] font-black uppercase tracking-widest opacity-40">{activeTab}</h2>
           </div>
           <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                className={`p-2 rounded-xl transition-all ${isRightPanelOpen ? 'bg-studio-peach shadow-inner' : 'bg-white border border-studio-peach shadow-sm'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <div 
                onClick={() => setActiveTab('profile')}
                className="w-8 h-8 rounded-lg bg-studio-peach border-2 border-white shadow-sm overflow-hidden cursor-pointer"
              >
                <img src="https://i.pravatar.cc/100?u=vox" className="object-cover" alt="User" />
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 md:p-6 custom-scrollbar">
          {activeTab === 'speech' && (
            <div className="max-w-3xl mx-auto space-y-4 animate-slide">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 px-1">
                  <div>
                    <h1 className="text-xl font-black uppercase italic tracking-tighter">Speech Lab</h1>
                    <p className="text-[8px] font-bold text-studio-brown/30 uppercase tracking-[0.2em]">Neural Synthesis Engine</p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => setIsCloneModalOpen(true)}
                      className="flex-1 sm:flex-none bg-studio-cream border border-studio-peach px-4 py-2 rounded-xl text-[8px] font-black uppercase hover:border-studio-orange transition-all flex items-center justify-center gap-2"
                    >
                      <span>🧬</span> Clone
                    </button>
                    <div className="flex bg-white p-1 rounded-xl border border-studio-peach shadow-sm shrink-0">
                       <button onClick={() => setIsDialogueMode(false)} className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase transition-all ${!isDialogueMode ? 'bg-studio-brown text-white' : 'text-studio-brown/40'}`}>Solo</button>
                       <button onClick={() => setIsDialogueMode(true)} className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase transition-all ${isDialogueMode ? 'bg-studio-brown text-white' : 'text-studio-brown/40'}`}>Dialogue</button>
                    </div>
                  </div>
               </div>

               {!isDialogueMode ? (
                 <div className="space-y-4">
                    <div className="bg-white border border-studio-peach rounded-2xl p-4 md:p-6 space-y-4 shadow-md">
                      <div className="space-y-2">
                        <textarea 
                          value={inputText} 
                          onChange={e => setInputText(e.target.value)} 
                          className="w-full text-lg md:text-xl font-light bg-transparent outline-none resize-none min-h-[120px] leading-relaxed" 
                          placeholder="Type script here..." 
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-studio-peach/10">
                        <div className="space-y-3">
                           <h3 className="text-[8px] font-black uppercase text-studio-brown/40">Acoustics</h3>
                           <div className="space-y-2">
                              <div className="flex justify-between text-[8px] font-black uppercase">
                                <span>Speed</span>
                                <span className="text-studio-brown">{speed.toFixed(1)}x</span>
                              </div>
                              <input type="range" min="0.5" max="2.0" step="0.1" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} className="w-full h-1" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <h3 className="text-[8px] font-black uppercase text-studio-brown/40">Persona</h3>
                           <textarea 
                             value={customPersona} 
                             onChange={e => setCustomPersona(e.target.value)}
                             className="w-full bg-studio-cream border border-studio-peach p-2 rounded-xl text-[10px] font-medium outline-none min-h-[60px]" 
                             placeholder="Voice description..."
                           />
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 pt-4 border-t border-studio-peach/10">
                        <div className="flex flex-wrap gap-1.5">
                           {EMOTIONS.slice(0, 6).map(e => (
                             <button key={e.label} onClick={() => setSelectedEmotion(e.label)} className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase border transition-all ${selectedEmotion === e.label ? 'bg-studio-orange text-white border-studio-orange' : 'bg-studio-cream border-studio-peach text-studio-brown/40'}`}>{e.icon} {e.label}</button>
                           ))}
                        </div>
                        <button onClick={handleGenerate} disabled={isGenerating || !inputText} className="w-full bg-studio-brown text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md hover:bg-studio-orange active:scale-[0.98] transition-all">
                           {isGenerating ? 'Synthesizing...' : 'Synthesize Audio'}
                        </button>
                      </div>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-3">
                    {dialogueTurns.map((turn, i) => (
                      <div key={i} className={`flex gap-2 items-start ${turn.speaker === 'Joe' ? '' : 'flex-row-reverse'}`}>
                         <div className="w-10 h-10 rounded-xl bg-studio-peach shrink-0 shadow-sm flex items-center justify-center font-black uppercase text-[10px]">{turn.speaker}</div>
                         <div className="flex-1">
                            <textarea 
                              value={turn.text} 
                              onChange={e => {
                                const newTurns = [...dialogueTurns];
                                newTurns[i].text = e.target.value;
                                setDialogueTurns(newTurns);
                              }}
                              className="w-full bg-white border border-studio-peach rounded-xl p-3 text-xs font-medium outline-none min-h-[80px]" 
                            />
                         </div>
                      </div>
                    ))}
                    <button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-studio-brown text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md mt-4">Render Conversation</button>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'library' && (
            <div className="max-w-6xl mx-auto space-y-4 animate-slide">
               <div className="flex flex-col gap-4">
                 <div className="space-y-1">
                   <h1 className="text-xl font-black uppercase italic tracking-tighter">Directory</h1>
                   <p className="text-[8px] font-black text-studio-brown/30 uppercase tracking-widest">Found {filteredVoices.length} neural signatures</p>
                 </div>
                 
                 <div className="bg-white border border-studio-peach p-4 rounded-2xl shadow-md space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                       <div className="sm:col-span-1 relative">
                         <input 
                           type="text" 
                           value={searchQuery} 
                           onChange={e => setSearchQuery(e.target.value)} 
                           placeholder="Search..." 
                           className="w-full bg-studio-cream border border-studio-peach px-8 py-2 rounded-xl text-[10px] font-bold outline-none"
                         />
                         <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-studio-brown/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-2">
                         <select value={filterGender} onChange={e => setFilterGender(e.target.value)} className="bg-studio-cream border border-studio-peach px-2 py-2 rounded-xl text-[8px] font-black uppercase">
                           <option value="All">All Genders</option>
                           {uniqueGenders.map(g => <option key={g} value={g}>{g}</option>)}
                         </select>
                         <select value={filterAccent} onChange={e => setFilterAccent(e.target.value)} className="bg-studio-cream border border-studio-peach px-2 py-2 rounded-xl text-[8px] font-black uppercase">
                           <option value="All">All Regions</option>
                           {uniqueAccents.map(a => <option key={a} value={a}>{a}</option>)}
                         </select>
                       </div>

                       <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="bg-studio-cream border border-studio-peach px-2 py-2 rounded-xl text-[8px] font-black uppercase">
                         <option value="Name">Sort A-Z</option>
                         <option value="Accent">Sort Region</option>
                       </select>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                       {availableTags.map(tag => (
                         <button 
                           key={tag} 
                           onClick={() => toggleTag(tag)}
                           className={`px-3 py-1 rounded-lg text-[7px] font-black uppercase transition-all border ${
                             selectedTags.has(tag) ? 'bg-studio-brown text-white border-studio-brown' : 'bg-white text-studio-brown/30 border-studio-peach/40'
                           }`}
                         >
                           {tag}
                         </button>
                       ))}
                       {selectedTags.size > 0 && <button onClick={clearFilters} className="text-[7px] font-black uppercase text-studio-orange underline ml-2">Clear</button>}
                    </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {filteredVoices.map(v => (
                    <VoiceCard 
                      key={v.name + v.accent} 
                      voice={v} 
                      selected={selectedVoice.name === v.name && selectedVoice.accent === v.accent} 
                      isFavorite={favorites.has(v.name + v.accent)} 
                      onSelect={() => { setSelectedVoice(v); setCustomPersona(''); setActiveTab('speech'); }} 
                      onFavoriteToggle={(e) => toggleFavorite(v.name + v.accent, e)} 
                      onPreview={(e) => handlePreviewVoice(v, e)} 
                      isPreviewing={previewingVoiceId === v.name} 
                    />
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'home' && (
            <div className="max-w-4xl mx-auto space-y-8 py-10 md:py-20 text-center animate-slide">
               <div className="space-y-4">
                 <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-studio-brown uppercase italic leading-[0.85]">Vox<span className="text-studio-orange">Aura</span></h1>
                 <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-studio-brown/30">Next-Gen Neural Audio Lab</p>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div onClick={() => setActiveTab('speech')} className="bg-white border border-studio-peach rounded-3xl p-6 cursor-pointer group hover:shadow-lg transition-all">
                     <div className="text-3xl mb-3">🎙️</div>
                     <h3 className="text-sm font-black uppercase italic">Speech Lab</h3>
                     <p className="text-[10px] text-studio-brown/50">Multi-speaker neural synthesis.</p>
                  </div>
                  <div onClick={() => setActiveTab('music')} className="bg-white border border-studio-peach rounded-3xl p-6 cursor-pointer group hover:shadow-lg transition-all">
                     <div className="text-3xl mb-3">🎵</div>
                     <h3 className="text-sm font-black uppercase italic">Music Engine</h3>
                     <p className="text-[10px] text-studio-brown/50">Compose neural melodies.</p>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'resonance' && <LiveLab />}
          {activeTab === 'profile' && <ProfileDashboard />}
          {activeTab === 'design' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-slide">
               <h1 className="text-xl font-black uppercase italic text-center">Persona Lab</h1>
               <div className="bg-white border border-studio-peach rounded-2xl p-6 space-y-4 shadow-lg">
                 <textarea value={designPrompt} onChange={e => setDesignPrompt(e.target.value)} className="w-full bg-studio-cream p-4 rounded-xl text-xs outline-none min-h-[100px]" placeholder="Voice DNA blueprint..." />
                 <input type="text" value={designName} onChange={e => setDesignName(e.target.value)} placeholder="Persona Identifier" className="w-full bg-studio-cream p-3 rounded-xl font-black text-[10px] uppercase" />
                 <button onClick={handleGenerate} disabled={isGenerating || !designPrompt} className="w-full bg-studio-brown text-white py-3 rounded-xl font-black text-[10px] uppercase shadow-md">Encode DNA</button>
               </div>
            </div>
          )}

          {activeTab === 'music' && (
            <div className="max-w-4xl mx-auto space-y-4 animate-slide">
               <h1 className="text-xl font-black uppercase italic">Music Engine</h1>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-studio-peach rounded-2xl p-4 space-y-3">
                     <input type="text" value={musicTitle} onChange={e => setMusicTitle(e.target.value)} className="w-full bg-transparent font-black uppercase text-[10px] outline-none" placeholder="Production Title" />
                     <textarea value={inputText} onChange={e => setInputText(e.target.value)} className="w-full text-sm font-light min-h-[150px] outline-none" placeholder="Lyrics..." />
                     <button onClick={handleGenerateLyrics} className="text-[8px] font-black uppercase text-studio-orange">✨ Auto-Lyrics</button>
                  </div>
                  <div className="space-y-4">
                     <div className="bg-white border border-studio-peach rounded-2xl p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                           <div>
                              <label className="text-[8px] font-black uppercase opacity-40">BPM</label>
                              <input type="number" value={musicParams.bpm} onChange={e => setMusicParams({...musicParams, bpm: e.target.value})} className="w-full bg-studio-cream p-2 rounded-lg text-[10px]" />
                           </div>
                           <div>
                              <label className="text-[8px] font-black uppercase opacity-40">Intensity</label>
                              <input type="range" min="1" max="10" value={musicParams.intensity} onChange={e => setMusicParams({...musicParams, intensity: parseInt(e.target.value)})} className="w-full h-1" />
                           </div>
                        </div>
                        <button onClick={handleGenerate} disabled={isGenerating || !inputText} className="w-full bg-studio-brown text-white py-3 rounded-xl font-black text-[10px] uppercase">Render Master</button>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </main>
      </div>

      {/* Right Panel / History */}
      <aside className={`fixed md:relative inset-y-0 right-0 z-[55] w-full md:w-[280px] border-l border-studio-peach bg-white flex flex-col transition-transform duration-300 shadow-2xl ${
        isRightPanelOpen ? 'translate-x-0' : 'translate-x-full md:hidden'
      }`}>
        <div className="h-[52px] border-b border-studio-peach flex items-center justify-between px-4 bg-[#FDFCF7]/80 shrink-0">
           <div className="flex gap-4 h-full">
              <button onClick={() => setRightPanelTab('settings')} className={`text-[9px] font-black uppercase tracking-widest relative h-full flex items-center ${rightPanelTab === 'settings' ? 'text-studio-brown' : 'text-studio-brown/20'}`}>Engine</button>
              <button onClick={() => setRightPanelTab('history')} className={`text-[9px] font-black uppercase tracking-widest relative h-full flex items-center ${rightPanelTab === 'history' ? 'text-studio-brown' : 'text-studio-brown/20'}`}>Archive</button>
           </div>
           <button onClick={() => setIsRightPanelOpen(false)} className="text-studio-brown/40 p-1 hover:bg-studio-peach/10 rounded-lg">✕</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#FDFCF7]">
           {rightPanelTab === 'settings' ? (
             <div className="space-y-6">
                <div className="space-y-3">
                   <h3 className="text-[8px] font-black uppercase text-studio-brown/30">Active Persona</h3>
                   <div className="bg-white border border-studio-peach rounded-xl p-3 flex items-center gap-3 shadow-sm cursor-pointer" onClick={() => setActiveTab('library')}>
                      <img src={selectedVoice.avatar} className="w-8 h-8 rounded-lg object-cover" alt="" />
                      <div className="min-w-0">
                         <p className="font-black text-[10px] uppercase truncate">{selectedVoice.name}</p>
                         <p className="text-[7px] text-studio-brown/30 font-bold uppercase">{selectedVoice.accent}</p>
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="space-y-3">
                {history.length === 0 ? (
                  <div className="py-20 text-center opacity-20"><p className="text-[8px] font-black uppercase">No records</p></div>
                ) : history.map(h => (
                   <div key={h.id} className="bg-white border border-studio-peach rounded-xl p-3 space-y-3 shadow-sm">
                      <div className="flex justify-between items-center">
                         <span className="text-[7px] font-black uppercase text-studio-brown/30">{h.voiceName}</span>
                         <span className="text-[7px] font-black uppercase px-1.5 py-0.5 bg-studio-brown/5 rounded">{h.type}</span>
                      </div>
                      <AudioPlayer url={h.audioUrl || ''} filename={`vox-${h.id}.wav`} />
                   </div>
                ))}
             </div>
           )}
        </div>
      </aside>

      {error && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-studio-brown text-studio-cream px-6 py-3 rounded-full shadow-2xl z-[110] flex items-center gap-4 border-t-2 border-studio-orange animate-in slide-in-from-bottom-5">
           <span className="text-[9px] font-black uppercase tracking-widest">{error}</span>
           <button onClick={() => setError(null)} className="text-studio-orange font-black">✕</button>
        </div>
      )}
    </div>
  );
};

export default App;
