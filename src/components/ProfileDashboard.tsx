
import React from 'react';
import { UserProfile } from '../types';

const MOCK_PROFILE: UserProfile = {
  name: 'Neural_Art_01',
  rank: 'Master Architect',
  level: 42,
  exp: 8450,
  nextLevelExp: 10000,
  stats: {
    totalSynthesis: 1248,
    tracksMastered: 84,
    dialoguesConducted: 312,
    personasCreated: 12
  },
  achievements: [
    { id: '1', title: 'Sonic Pioneer', icon: '🚀', description: 'First track mastered.', unlocked: true, progress: 100 },
    { id: '2', title: 'Polyglot', icon: '🌐', description: '5 different accents.', unlocked: true, progress: 100 },
    { id: '3', title: 'Persona God', icon: '🧬', description: 'Engineered 10 DNA profiles.', unlocked: true, progress: 100 },
  ]
};

export const ProfileDashboard: React.FC = () => {
  const progressPercent = (MOCK_PROFILE.exp / MOCK_PROFILE.nextLevelExp) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-slide pb-10">
      {/* Hero Section */}
      <div className="relative bg-white border border-studio-peach rounded-3xl p-5 md:p-8 shadow-md overflow-hidden">
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="relative shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-studio-peach p-0.5 shadow-sm overflow-hidden ring-4 ring-white">
              <img src="https://i.pravatar.cc/300?u=vox" className="w-full h-full object-cover rounded-[1.4rem]" alt="Profile" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-studio-brown text-white px-3 py-1 rounded-full font-black text-[8px] uppercase tracking-widest shadow-md">
              LVL {MOCK_PROFILE.level}
            </div>
          </div>

          <div className="flex-1 space-y-3 text-center md:text-left">
            <div>
              <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-studio-brown">
                {MOCK_PROFILE.name}
              </h1>
              <p className="text-studio-orange font-black uppercase tracking-[0.2em] text-[10px] mt-1">
                {MOCK_PROFILE.rank}
              </p>
            </div>

            <div className="space-y-1 max-w-sm mx-auto md:mx-0">
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-studio-brown/40">
                <span>Experience</span>
                <span>{MOCK_PROFILE.exp} XP</span>
              </div>
              <div className="h-2 w-full bg-studio-cream border border-studio-peach rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-studio-brown rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(MOCK_PROFILE.stats).map(([key, val]) => (
              <div key={key} className="bg-white border border-studio-peach rounded-2xl p-4 text-center shadow-sm">
                <p className="text-xl font-black text-studio-brown">{val}</p>
                <p className="text-[7px] font-black uppercase tracking-tighter text-studio-brown/30 mt-0.5">
                  {key.replace(/([A-Z])/g, ' $1')}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-studio-peach rounded-2xl p-5 shadow-md">
            <h3 className="text-[8px] font-black uppercase tracking-widest text-studio-brown/30 mb-4 text-center">Engine Affinity</h3>
            <div className="h-40 relative flex items-end justify-between gap-2 px-2">
              {[60, 85, 45, 95, 70, 30, 55, 80].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-studio-peach/10 rounded-t-lg relative overflow-hidden border-t border-studio-peach/20" style={{ height: `${h}%` }}>
                    <div className="absolute bottom-0 left-0 w-full bg-studio-orange/20" style={{ height: '100%' }} />
                  </div>
                  <span className="text-[6px] font-black uppercase tracking-tighter text-studio-brown/40">
                    {['KR', 'PK', 'CH', 'FN', 'ZY', 'MU', 'DE', 'LI'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-studio-peach rounded-2xl p-5 shadow-md h-fit">
          <h3 className="text-[8px] font-black uppercase tracking-widest text-studio-brown/30 mb-4">Mastery Badges</h3>
          <div className="space-y-2">
            {MOCK_PROFILE.achievements.map(ach => (
              <div key={ach.id} className="p-3 rounded-xl border border-studio-peach/30 bg-studio-cream/20 flex items-center gap-3">
                <span className="text-xl">{ach.icon}</span>
                <div className="min-w-0">
                  <p className="font-black text-[9px] uppercase truncate">{ach.title}</p>
                  <p className="text-[7px] font-medium text-studio-brown/40 leading-tight">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
