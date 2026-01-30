
import React from 'react';
import EmotionSelector from './EmotionSelector';
import NarratorButton from './NarratorButton';
import { UserProfile, EmotionalState } from '../types';

interface HomeViewProps {
  user: UserProfile;
  encouragement: string;
  onEmotionSelect: (state: EmotionalState) => void;
  isLoading: boolean;
}

const HomeView: React.FC<HomeViewProps> = ({ user, encouragement, onEmotionSelect, isLoading }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <header className="space-y-3">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-terracotta font-bold tracking-[0.2em] text-[10px] uppercase">Breath of Grace</p>
            <h1 className="text-4xl font-serif text-warm-grey">Hello, {user.name}</h1>
          </div>
          <NarratorButton text={`Good morning ${user.name}. ${encouragement}`} variant="minimal" />
        </div>
        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 italic text-stone-500 text-sm font-light">
          "{encouragement}"
        </div>
      </header>

      <section className="bg-sage/10 p-7 rounded-[2.5rem] border border-sage/10 relative overflow-hidden group">
        <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sage text-[10px] uppercase tracking-[0.2em] font-black">Today's Focus</span>
            <NarratorButton text="Daily Manna. Come to me, all who are weary and burdened, and I will give you rest. Matthew 11:28" variant="minimal" className="scale-75 opacity-50" />
          </div>
          <p className="text-2xl font-serif text-stone-800 leading-snug">"Come to me, all who are weary and burdened, and I will give you rest."</p>
          <p className="text-[10px] text-sage font-black tracking-widest uppercase">— Matthew 11:28</p>
        </div>
      </section>

      <EmotionSelector onSelect={onEmotionSelect} isLoading={isLoading} />
    </div>
  );
};

export default HomeView;
