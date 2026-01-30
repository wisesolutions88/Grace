
import React from 'react';
import { useNarrator } from '../hooks/useNarrator';

interface NarratorButtonProps {
  text: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'minimal';
}

const NarratorButton: React.FC<NarratorButtonProps> = ({ text, className = '', variant = 'primary' }) => {
  const { speak, isPlaying, isLoading } = useNarrator();

  const getStyles = () => {
    switch (variant) {
      case 'secondary':
        return isPlaying ? 'bg-sage text-white' : 'bg-sage/10 text-sage';
      case 'minimal':
        return isPlaying ? 'text-terracotta' : 'text-stone-300 hover:text-terracotta';
      default:
        return isPlaying ? 'bg-terracotta text-white shadow-lg' : 'bg-stone-100 text-stone-400';
    }
  };

  return (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
      disabled={isLoading}
      className={`p-2.5 rounded-full transition-all active:scale-90 ${getStyles()} ${className}`}
      title={isPlaying ? "Stop listening" : "Listen to this"}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : isPlaying ? (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
      ) : (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      )}
    </button>
  );
};

export default NarratorButton;
