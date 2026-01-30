
import React, { useState } from 'react';
import { PrayerRequest } from '../types';
import NarratorButton from './NarratorButton';

interface CommunityViewProps {
  prayers: PrayerRequest[];
  onAddPrayer: (text: string) => void;
  onSupportPrayer: (id: string) => void;
}

const CommunityView: React.FC<CommunityViewProps> = ({ prayers, onAddPrayer, onSupportPrayer }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newPrayer, setNewPrayer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPrayer.trim()) {
      onAddPrayer(newPrayer.trim());
      setNewPrayer('');
      setIsFormOpen(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="space-y-1">
        <h2 className="text-3xl font-serif text-warm-grey">Gather & Pray</h2>
        <p className="text-stone-400 text-sm italic">Real moms. Real prayers. No pretense.</p>
      </div>

      {!isFormOpen ? (
        <button 
          onClick={() => setIsFormOpen(true)}
          className="w-full bg-terracotta text-white py-5 rounded-[2rem] font-bold flex items-center justify-center gap-3 hover:bg-opacity-90 shadow-lg shadow-terracotta/20 transition-all active:scale-95 group"
        >
          <span className="text-xl group-hover:rotate-12 transition-transform">🙏</span>
          <span className="uppercase tracking-widest text-xs">Share a Request</span>
        </button>
      ) : (
        <form 
          onSubmit={handleSubmit}
          className="bg-white border border-stone-100 p-6 rounded-[2rem] shadow-xl animate-in slide-in-from-top-4 duration-300 space-y-4"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">Your Prayer Request</h3>
            <button 
              type="button" 
              onClick={() => setIsFormOpen(false)}
              className="text-stone-300 hover:text-stone-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <textarea 
            autoFocus
            placeholder="How can your sisters stand with you today?"
            value={newPrayer}
            onChange={(e) => setNewPrayer(e.target.value)}
            className="w-full bg-stone-50 border-none rounded-2xl p-4 text-sm min-h-[120px] focus:ring-2 focus:ring-terracotta/10 transition-all resize-none"
          />
          <button 
            type="submit"
            disabled={!newPrayer.trim()}
            className="w-full bg-stone-800 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs disabled:opacity-30 transition-all active:scale-95"
          >
            Send Request to the Circle
          </button>
        </form>
      )}

      <div className="space-y-4">
        {prayers.map(prayer => (
          <div key={prayer.id} className="bg-stone-50 border border-stone-100 p-6 rounded-[2rem] transition-all group shadow-sm hover:border-stone-200">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] shadow-sm">🕯️</div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  {prayer.author === 'Anonymous' ? 'A Sister' : prayer.author}
                </span>
              </div>
              <NarratorButton text={prayer.text} variant="minimal" className="scale-75 opacity-30" />
            </div>
            <p className="text-stone-700 leading-relaxed mb-6 italic font-light">"{prayer.text}"</p>
            <button 
              className="w-full py-3 bg-white border border-stone-100 rounded-2xl text-[10px] uppercase font-bold tracking-[0.2em] text-terracotta transition-all active:scale-95 shadow-sm hover:shadow-md hover:border-terracotta/20"
              onClick={() => onSupportPrayer(prayer.id)}
            >
              🙏 Standing with you ({prayer.prayersCount})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityView;
