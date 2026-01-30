
import React, { useState, useEffect } from 'react';
import { MicroStudy } from '../types';
import { useNarrator } from '../hooks/useNarrator';

interface MicroStudyViewProps {
  study: MicroStudy;
  onClose: () => void;
}

const MicroStudyView: React.FC<MicroStudyViewProps> = ({ study, onClose }) => {
  const [step, setStep] = useState(0);
  const { speak, stop, isPlaying, isLoading } = useNarrator();

  const steps = [
    { label: 'The Verse', icon: '📖' },
    { label: 'Reflection', icon: '💡' },
    { label: 'Prayer', icon: '🙏' },
    { label: 'Today\'s Step', icon: '✨' },
  ];

  const handleNarrateStep = () => {
    let text = "";
    switch(step) {
      case 0: text = `The verse is: ${study.verse}. From ${study.reference}.`; break;
      case 1: text = `Reflection: ${study.reflection}`; break;
      case 2: text = `The prayer: ${study.prayer}`; break;
      case 3: text = `Your step for today: ${study.action}`; break;
    }
    speak(text);
  };

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
            <p className="text-3xl font-serif leading-relaxed text-stone-800 italic mb-6">"{study.verse}"</p>
            <p className="text-sm uppercase tracking-[0.3em] font-bold text-terracotta">{study.reference}</p>
          </div>
        );
      case 1:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h4 className="text-xs uppercase tracking-widest font-bold text-sage mb-4">A word for your heart</h4>
            <p className="text-stone-600 leading-relaxed text-lg font-light">{study.reflection}</p>
          </div>
        );
      case 2:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-terracotta/5 p-8 rounded-3xl border border-terracotta/10">
            <h4 className="text-lg font-bold text-terracotta mb-4 flex items-center gap-2">
              <span className="text-2xl">🙏</span> A Quiet Moment
            </h4>
            <p className="text-stone-700 italic leading-relaxed text-lg">"{study.prayer}"</p>
          </div>
        );
      case 3:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center space-y-6">
            <h4 className="text-xl font-serif text-stone-800">One Small Action</h4>
            <div className="bg-sage/10 p-10 rounded-full w-56 h-56 flex items-center justify-center mx-auto border-2 border-dashed border-sage/30 shadow-inner">
              <p className="text-sage font-medium text-lg leading-snug">{study.action}</p>
            </div>
            <div className="pt-4">
              <p className="text-sm text-stone-400">You're doing better than you think.</p>
            </div>
          </div>
        );
    }
  };

  const handleClose = () => {
    stop();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#FDFBF7] flex flex-col p-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex justify-between items-start">
        <button onClick={handleClose} className="p-2 -ml-2 text-stone-400 hover:text-stone-600 transition-colors">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-1">Micro-Study</span>
          <h2 className="text-xs font-serif italic text-stone-500">{study.title}</h2>
        </div>

        <button 
          onClick={handleNarrateStep}
          disabled={isLoading}
          className={`p-3 rounded-full transition-all ${isPlaying ? 'bg-terracotta text-white shadow-lg' : 'bg-stone-100 text-stone-400'}`}
        >
          {isLoading ? (
             <div className="w-5 h-5 border-2 border-stone-300 border-t-terracotta rounded-full animate-spin"></div>
          ) : isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        {renderContent()}
      </div>

      <div className="mt-auto max-w-sm mx-auto w-full pb-8">
        <div className="flex justify-center gap-3 mb-10">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-terracotta shadow-sm shadow-terracotta/20' : 'bg-stone-200'}`} 
            />
          ))}
        </div>
        
        <button 
          onClick={() => {
            stop();
            if (step < 3) setStep(step + 1);
            else handleClose();
          }}
          className="w-full bg-stone-800 text-white py-5 rounded-2xl font-bold tracking-widest text-sm uppercase shadow-xl active:scale-95 transition-all hover:bg-stone-900"
        >
          {step < 3 ? 'Deepen Focus' : 'Take Heart & Finish'}
        </button>
      </div>
    </div>
  );
};

export default MicroStudyView;
