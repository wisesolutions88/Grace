
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [season, setSeason] = useState('');

  const seasons = [
    'New Mom (0-1 yr)',
    'Toddler Years',
    'School Age',
    'Teen Years',
    'Empty Nester',
    'Working Mom',
    'Stay-at-Home Mom'
  ];

  const handleFinish = () => {
    onComplete({
      name: name || 'Mama',
      daysActive: 1,
      lastActiveDate: new Date().toISOString(),
      savedStudies: []
    });
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#FDFBF7] flex flex-col p-8 items-center justify-center text-center animate-in fade-in duration-700">
      {step === 1 && (
        <div className="space-y-8 max-w-xs animate-in slide-in-from-bottom-4">
          <div className="w-24 h-24 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🌿</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-serif text-stone-800">Welcome to Grace & Gather</h1>
            <p className="text-stone-500 text-sm leading-relaxed">A space designed for your soul, not your schedule. What should we call you?</p>
          </div>
          <input 
            type="text" 
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-stone-100 rounded-2xl py-4 px-6 text-center focus:ring-2 focus:ring-terracotta/20 transition-all shadow-sm"
          />
          <button 
            onClick={() => setStep(2)}
            disabled={!name}
            className="w-full bg-terracotta text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl active:scale-95 transition-all disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 max-w-sm animate-in slide-in-from-right-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-serif text-stone-800">What season are you in?</h2>
            <p className="text-stone-500 text-sm">We'll tailor your daily wisdom to where you are right now.</p>
          </div>
          <div className="grid grid-cols-1 gap-2 max-h-[40vh] overflow-y-auto px-2">
            {seasons.map(s => (
              <button 
                key={s}
                onClick={() => setSeason(s)}
                className={`py-4 px-6 rounded-2xl text-sm font-medium transition-all border ${season === s ? 'bg-sage border-sage text-white shadow-md' : 'bg-white border-stone-100 text-stone-600 hover:border-sage/30'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <button 
            onClick={handleFinish}
            disabled={!season}
            className="w-full bg-stone-800 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl active:scale-95 transition-all disabled:opacity-30"
          >
            Enter the Space
          </button>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
