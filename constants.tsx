
import { VoiceProfile, EnhancePreset } from './types';

export const VOICES: VoiceProfile[] = [
  // --- KORE (Clear, Professional Female Voices) ---
  { id: 'Kore', name: 'Sophia', description: 'Clear West Coast professional voice.', gender: 'Female', age: 'Adult', accent: 'USA', language: 'English', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', category: 'Public', tags: ['Professional', 'Clear'], greeting: "Hi, I'm Sophia. Ready to start our session." },
  { id: 'Kore', name: 'Linda', description: 'Experienced news anchor tone.', gender: 'Female', age: 'Adult', accent: 'USA', language: 'English', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', category: 'Public', tags: ['Formal', 'Reliable'], greeting: "Good morning. This is Linda with your daily briefing." },
  { id: 'Kore', name: 'Elizabeth', description: 'Posh, RP-accented aristocrat.', gender: 'Female', age: 'Elder', accent: 'UK', language: 'English', avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop', category: 'Public', tags: ['Elegant', 'Formal'], greeting: "Good day. I am Elizabeth. Enchanted to meet you." },
  { id: 'Kore', name: 'Priya', description: 'Warm and caring regional educator.', gender: 'Female', age: 'Adult', accent: 'India', language: 'English', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', category: 'Public', tags: ['Warm', 'Friendly'], greeting: "Namaste. I am Priya. Let's find a solution together." },

  // --- PUCK (Energetic, Dynamic Male Voices) ---
  { id: 'Puck', name: 'Tyler', description: 'Energetic tech startup founder.', gender: 'Male', age: 'Young', accent: 'USA', language: 'English', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', category: 'Public', tags: ['Energetic', 'Tech'], greeting: "Hey! Tyler here. Let's build something awesome." },
  { id: 'Puck', name: 'Brad', description: 'Over-the-top action movie trailer voice.', gender: 'Male', age: 'Adult', accent: 'USA', language: 'English', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop', category: 'Public', tags: ['Action', 'Intense'], greeting: "In a world... where your words come to life." },
  { id: 'Puck', name: 'Oliver', description: 'Friendly London cab driver.', gender: 'Male', age: 'Adult', accent: 'UK', language: 'English', avatar: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=100&h=100&fit=crop', category: 'Public', tags: ['Friendly', 'Lively'], greeting: "Morning, mate! Oliver here. Where to?" },

  // --- CHARON (Calm, Neutral, Balanced Voices) ---
  { id: 'Charon', name: 'Alex', description: 'Neutral, balanced office assistant.', gender: 'Neutral', age: 'Adult', accent: 'USA', language: 'English', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?w=100&h=100&fit=crop', category: 'Public', tags: ['Balanced', 'Office'], greeting: "Hello. I'm Alex. How can I assist with your documents today?" },
  { id: 'Charon', name: 'Morgan', description: 'Calm, soothing meditation guide.', gender: 'Neutral', age: 'Adult', accent: 'Canada', language: 'English', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', category: 'Public', tags: ['Calm', 'Soothing'], greeting: "Take a deep breath. Morgan here to guide your practice." },
  { id: 'Charon', name: 'Rowan', description: 'Soft Welsh lilt for poetry reading.', gender: 'Neutral', age: 'Young', accent: 'UK', language: 'English', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', category: 'Public', tags: ['Soft', 'Poetic'], greeting: "Welcome. Rowan here. Shall we read something beautiful?" },
  { id: 'Charon', name: 'Kenji', description: 'Precise Japanese-accented specialist.', gender: 'Neutral', age: 'Adult', accent: 'Japan', language: 'English', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?w=100&h=100&fit=crop', category: 'Public', tags: ['Precise', 'Calm'], greeting: "Konnichiwa. Kenji here. Let's focus on the detail." },

  // --- FENRIR (Deep, Resonant Male Voices) ---
  { id: 'Fenrir', name: 'Marcus', description: 'Deep, resonant Southern charm.', gender: 'Male', age: 'Elder', accent: 'USA', language: 'English', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', category: 'Public', tags: ['Deep', 'Warm'], greeting: "Well hello there. Marcus here. Take a seat and let's talk." },
  { id: 'Fenrir', name: 'Gus', description: 'Gritty, street-wise detective.', gender: 'Male', age: 'Adult', accent: 'USA', language: 'English', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', category: 'Public', tags: ['Gritty', 'Storytelling'], greeting: "I've seen it all. I'm Gus. What's the case?" },
  { id: 'Fenrir', name: 'Hamish', description: 'Deep Scottish Highlands baritone.', gender: 'Male', age: 'Adult', accent: 'UK', language: 'English', avatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=100&h=100&fit=crop', category: 'Public', tags: ['Deep', 'Authoritative'], greeting: "Aye, Hamish here. The mountains are calling." },

  // --- ZEPHYR (Light, Breezy Female Voices) ---
  { id: 'Zephyr', name: 'Chloe', description: 'Breezy and light lifestyle narrator.', gender: 'Female', age: 'Young', accent: 'USA', language: 'English', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', category: 'Public', tags: ['Light', 'Vibrant'], greeting: "Hi! I'm Chloe. Ready to narrate your next vlog." },
  { id: 'Zephyr', name: 'Mia', description: 'Sweet and bubbly pre-school teacher.', gender: 'Female', age: 'Young', accent: 'USA', language: 'English', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', category: 'Public', tags: ['Sweet', 'Friendly'], greeting: "Hi children! I'm Miss Mia. Are we ready for a story?" },
  { id: 'Zephyr', name: 'Saoirse', description: 'Whimsical Irish storyteller.', gender: 'Female', age: 'Young', accent: 'Ireland', language: 'English', avatar: 'https://images.unsplash.com/photo-1491349174775-aaaf99c9e703?w=100&h=100&fit=crop', category: 'Public', tags: ['Storytelling', 'Vibrant'], greeting: "Top of the morning! I'm Saoirse. Got a tale for you." },
  { id: 'Zephyr', name: 'Arjun', description: 'Tech-focused Indian professional.', gender: 'Male', age: 'Adult', accent: 'India', language: 'English', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', category: 'Public', tags: ['Tech', 'Professional'], greeting: "Namaste. I am Arjun. Ready to assist with your technical needs." },

  // --- AFRICAN VOICES (Enhanced with authentic characteristics) ---
  { id: 'Kore', name: 'Amara', description: 'Warm, melodic Nigerian educator with rich West African intonation.', gender: 'Female', age: 'Adult', accent: 'Nigeria', language: 'English', avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=100&h=100&fit=crop', category: 'Public', tags: ['Warm', 'Educator', 'African'], greeting: "Hello! I'm Amara. Let's learn something wonderful today." },
  { id: 'Puck', name: 'Jelani', description: 'Energetic Kenyan entrepreneur with vibrant East African rhythm.', gender: 'Male', age: 'Adult', accent: 'Kenya', language: 'English', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', category: 'Public', tags: ['Energetic', 'Entrepreneur', 'African'], greeting: "Jambo! Jelani here. Let's build something great!" },
  { id: 'Charon', name: 'Nomsa', description: 'Wise South African healer with thoughtful Southern African cadence.', gender: 'Female', age: 'Elder', accent: 'South Africa', language: 'English', avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop', category: 'Public', tags: ['Wise', 'Healing', 'African'], greeting: "Sawubona. I am Nomsa. How may I help restore your peace?" },
  { id: 'Fenrir', name: 'Simba', description: 'Deep Ghanaian storyteller with resonant Central African flair.', gender: 'Male', age: 'Adult', accent: 'Ghana', language: 'English', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', category: 'Public', tags: ['Deep', 'Storyteller', 'African'], greeting: "Akwaaba! Simba here. Let me share an ancient tale." },
  { id: 'Zephyr', name: 'Zola', description: 'Bright Moroccan artist with cheerful North African lilt.', gender: 'Female', age: 'Young', accent: 'Morocco', language: 'English', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', category: 'Public', tags: ['Creative', 'Artistic', 'African'], greeting: "Marhaba! I'm Zola. Let's create something beautiful!" },
  { id: 'Kore', name: 'Amina', description: 'Graceful Tanzanian professional with smooth East African flow.', gender: 'Female', age: 'Adult', accent: 'Tanzania', language: 'English', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', category: 'Public', tags: ['Graceful', 'Professional', 'African'], greeting: "Habari! Amina here. How can I assist you today?" },
  { id: 'Fenrir', name: 'Kofi', description: 'Commanding Ugandan leader with authoritative East African presence.', gender: 'Male', age: 'Adult', accent: 'Uganda', language: 'English', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', category: 'Public', tags: ['Commanding', 'Authoritative', 'African'], greeting: "Hello! I am Kofi. Let's discuss matters of importance." },
];

export const EMOTIONS = [
  'Neutral',
  'Cheerful', 
  'Empathetic',
  'Serious',
  'Excited',
  'Whispering',
  'Angry',
  'Sad'
];

export const ENHANCE_PRESETS: EnhancePreset[] = [
  { name: 'Studio Quality', description: 'Professional studio recording with noise reduction', settings: { noiseReduction: 0.9, clarity: 0.8, compression: 0.6 } },
  { name: 'Podcast Ready', description: 'Optimized for podcasting with balanced audio', settings: { noiseReduction: 0.7, clarity: 0.9, compression: 0.5 } },
  { name: 'Voice Memo', description: 'Clean up casual recordings for clarity', settings: { noiseReduction: 0.8, clarity: 0.7, compression: 0.4 } },
  { name: 'Interview', description: 'Enhance dialogue with natural sound', settings: { noiseReduction: 0.6, clarity: 0.8, compression: 0.3 } }
];

export const MUSIC_TAGS = [
  'Intro', 'Verse', 'Pre-chorus', 'Chorus', 'Hook', 'Drop', 'Bridge', 'Solo', 'Build-up', 'Instrumental', 'Breakdown', 'Break', 'Interlude', 'Outro'
];

export const VOICE_DESIGN_CASES = [
  { name: 'Sultry Narrator', prompt: 'Magnetic-voiced female, breathy and low-pitched, speaking slowly with a hint of mystery.', baseId: 'Zephyr' },
  { name: 'Fast Salesperson', prompt: 'Fast-talking, persuasive male salesperson, confident, energetic, and slightly pushy.', baseId: 'Puck' },
  { name: 'Warm Grandpa', prompt: 'Elderly male voice, raspy but kind, slow-paced, with a gentle laugh in his tone.', baseId: 'Fenrir' },
  { name: 'Cyborg Assistant', prompt: 'Robotic female voice, monotone, precise articulation, metallic timbre.', baseId: 'Charon' }
];
