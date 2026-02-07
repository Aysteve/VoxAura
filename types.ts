
export type VoiceName = 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
export type EngineMode = 'turbo' | 'hd';
export type MusicMode = 'basic' | 'advanced';

export interface VoiceProfile {
  id: VoiceName;
  name: string;
  description: string;
  gender: 'Male' | 'Female' | 'Neutral';
  age: 'Child' | 'Young' | 'Adult' | 'Elder';
  accent: string;
  language: string;
  avatar: string;
  category: 'Public' | 'Personal' | 'Favorite';
  tags: string[];
  greeting: string;
  style?: string;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlocked: boolean;
  progress: number;
}

export interface UserProfile {
  name: string;
  rank: string;
  level: number;
  exp: number;
  nextLevelExp: number;
  stats: {
    totalSynthesis: number;
    tracksMastered: number;
    dialoguesConducted: number;
    personasCreated: number;
  };
  achievements: Achievement[];
}

export interface MusicProductionParams {
  bpm: string;
  key: string;
  intensity: number;
  vibeX: number; // 0 (Organic) to 100 (Synthetic)
  vibeY: number; // 0 (Chill) to 100 (Energetic)
  depth: string;
  volumes: {
    vocals: number;
    drums: number;
    bass: number;
    synth: number;
  };
  effects: {
    reverb: number;
    delay: number;
    saturation: number;
  };
  instruments: string[];
}

export interface MultiSpeakerTurn {
  speaker: string;
  voice: VoiceName;
  text: string;
}

export interface TTSGeneration {
  id: string;
  text: string;
  voice: string;
  voiceName: string;
  timestamp: number;
  audioUrl?: string;
  emotion: string;
  type: 'tts' | 'music' | 'design' | 'dialogue';
  isFavorite?: boolean;
  speed?: number;
  pitch?: number;
}
