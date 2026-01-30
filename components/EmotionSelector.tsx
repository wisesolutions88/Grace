
import React from 'react';
import { EMOTIONS } from '../constants';
import { EmotionalState } from '../types';

interface EmotionSelectorProps {
  onSelect: (state: EmotionalState) => void;
  isLoading: boolean;
}

const EmotionSelector: React.FC<EmotionSelectorProps> = ({ onSelect, isLoading }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-serif text-warm-grey">How is your heart today?</h3>
      <div className="grid grid-cols-2 gap-3">
        {EMOTIONS.map((item) => (
          <button
            key={item.state}
            disabled={isLoading}
            onClick={() => onSelect(item.state)}
            className={`${item.color} p-4 rounded-2xl flex items-center gap-3 transition-transform active:scale-95 hover:shadow-md border border-transparent hover:border-stone-200 group disabled:opacity-50`}
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">{item.emoji}</span>
            <span className="text-sm font-medium text-stone-700">{item.state}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmotionSelector;
