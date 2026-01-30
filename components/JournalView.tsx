
import React from 'react';
import { JournalEntry } from '../types';

interface JournalViewProps {
  entries: JournalEntry[];
  onAddEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
}

const JournalView: React.FC<JournalViewProps> = ({ entries, onAddEntry }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-3xl font-serif text-warm-grey">Reflection Journal</h2>
        <p className="text-stone-400 text-sm">A sacred space for your thoughts, prayers, and growth.</p>
      </div>

      <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Add a quick reflection</p>
        <textarea 
          placeholder="What's on your heart today?"
          className="w-full bg-white border border-stone-100 rounded-2xl p-4 text-sm min-h-[100px] focus:ring-2 focus:ring-terracotta/10 transition-all resize-none shadow-sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              const val = (e.target as HTMLTextAreaElement).value;
              if (val.trim()) {
                onAddEntry({ title: 'Daily Reflection', content: val, type: 'reflection' });
                (e.target as HTMLTextAreaElement).value = '';
              }
            }
          }}
        />
        <p className="text-[10px] text-stone-300 font-medium">Press Enter to save your reflection.</p>
      </div>

      <div className="space-y-4 pb-10">
        {entries.length === 0 ? (
          <div className="text-center py-20 text-stone-300 font-serif italic">Your journal is waiting for your first word...</div>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="bg-white border border-stone-100 p-6 rounded-3xl group transition-all hover:border-terracotta/20 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${entry.type === 'reflection' ? 'bg-sage' : 'bg-terracotta'}`}></span>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{entry.date}</span>
                </div>
                <span className="text-[9px] uppercase tracking-widest font-black text-stone-200">{entry.type}</span>
              </div>
              <h4 className="font-serif text-stone-800 text-lg mb-2">{entry.title}</h4>
              <p className="text-stone-600 text-sm leading-relaxed">{entry.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JournalView;
