
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import HomeView from './components/HomeView';
import JournalView from './components/JournalView';
import CommunityView from './components/CommunityView';
import MicroStudyView from './components/MicroStudyView';
import MentorChat from './components/MentorChat';
import Onboarding from './components/Onboarding';
import NarratorButton from './components/NarratorButton';
import { EmotionalState, MicroStudy, UserProfile, PrayerRequest, JournalEntry } from './types';
import { MOCK_STUDIES } from './constants';
import { generateLifeTriggeredStudy, generateDailyEncouragement } from './geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'journal' | 'community' | 'profile'>('home');
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeStudy, setActiveStudy] = useState<MicroStudy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [encouragement, setEncouragement] = useState('Finding grace in the middle of everything.');
  const [journal, setJournal] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('user_journal');
    return saved ? JSON.parse(saved) : [];
  });
  const [savedLibrary, setSavedLibrary] = useState<MicroStudy[]>(() => {
    const saved = localStorage.getItem('saved_studies');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [prayers, setPrayers] = useState<PrayerRequest[]>(() => {
    const saved = localStorage.getItem('user_prayers');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Struggling with toddler tantrums and my own patience today.', author: 'Anonymous', timestamp: new Date(), prayersCount: 8 },
      { id: '2', text: 'Grateful for a full night of sleep for the baby!', author: 'Sarah', timestamp: new Date(), prayersCount: 15 },
    ];
  });

  useEffect(() => {
    if (user) localStorage.setItem('user_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('user_journal', JSON.stringify(journal));
  }, [journal]);

  useEffect(() => {
    localStorage.setItem('saved_studies', JSON.stringify(savedLibrary));
  }, [savedLibrary]);

  useEffect(() => {
    localStorage.setItem('user_prayers', JSON.stringify(prayers));
  }, [prayers]);

  useEffect(() => {
    if (user) {
      const fetchEncouragement = async () => {
        try {
          const msg = await generateDailyEncouragement(user.name);
          setEncouragement(msg);
        } catch (e) {
          console.error("Couldn't load AI encouragement", e);
        }
      };
      fetchEncouragement();
    }
  }, [user?.name]);

  const handleEmotionSelect = async (state: EmotionalState | string) => {
    setIsLoading(true);
    try {
      const study = await generateLifeTriggeredStudy(state);
      setActiveStudy(study);
      setSearchQuery('');
    } catch (e) {
      console.error(e);
      setActiveStudy(MOCK_STUDIES[0]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Grace & Gather',
      text: 'Hey sister! I found this app that helps me find quiet moments of grace in the daily chaos. I think you\'d love it.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied! You can now paste it to a friend.');
    }
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'date'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString()
    };
    setJournal(prev => [newEntry, ...prev]);
  };

  const addPrayerRequest = (text: string) => {
    const newPrayer: PrayerRequest = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      author: user?.name || 'Anonymous',
      timestamp: new Date(),
      prayersCount: 0
    };
    setPrayers(prev => [newPrayer, ...prev]);
  };

  const handleSupportPrayer = (id: string) => {
    setPrayers(prev => prev.map(p => p.id === id ? { ...p, prayersCount: p.prayersCount + 1 } : p));
  };

  const saveStudyToLibrary = (study: MicroStudy) => {
    if (!savedLibrary.find(s => s.id === study.id)) {
      setSavedLibrary(prev => [study, ...prev]);
    }
  };

  if (!user) {
    return <Onboarding onComplete={setUser} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="max-w-md mx-auto h-full">
        {activeTab === 'home' && (
          <HomeView 
            user={user} 
            encouragement={encouragement} 
            onEmotionSelect={handleEmotionSelect} 
            isLoading={isLoading} 
          />
        )}
        
        {activeTab === 'explore' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <header className="space-y-2">
              <h2 className="text-3xl font-serif text-warm-grey">Seek Wisdom</h2>
              <p className="text-sm text-stone-400 leading-relaxed">Ask anything. Whether it's "peace during tantrums" or "marriage help"—we'll find God's heart for you.</p>
            </header>
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchQuery && handleEmotionSelect(searchQuery)}
                placeholder="Search specific topics or feelings..."
                className="w-full bg-stone-50 border-none rounded-2xl py-5 px-6 text-sm focus:ring-2 focus:ring-terracotta/10 transition-all placeholder:text-stone-300 shadow-inner"
              />
              <button onClick={() => searchQuery && handleEmotionSelect(searchQuery)} className="absolute right-4 top-1/2 -translate-y-1/2 text-terracotta p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </div>
            <div className="grid gap-4">
              <h3 className="text-[10px] uppercase font-bold text-stone-400 tracking-widest mt-4">Curated Studies</h3>
              {MOCK_STUDIES.map(s => (
                <button key={s.id} onClick={() => setActiveStudy(s)} className="text-left bg-white border border-stone-100 p-6 rounded-3xl hover:border-terracotta/20 transition-all shadow-sm">
                  <span className="text-[9px] uppercase font-black text-sage tracking-widest">{s.category}</span>
                  <h4 className="text-xl font-serif text-stone-800 my-1">{s.title}</h4>
                  <p className="text-stone-400 text-sm italic">"{s.verse}"</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'journal' && (
          <JournalView entries={journal} onAddEntry={addJournalEntry} />
        )}

        {activeTab === 'community' && (
          <CommunityView 
            prayers={prayers} 
            onAddPrayer={addPrayerRequest} 
            onSupportPrayer={handleSupportPrayer} 
          />
        )}

        {activeTab === 'profile' && (
          <div className="space-y-10 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col items-center pt-10 space-y-4 text-center">
               <div className="w-32 h-32 bg-stone-50 rounded-full flex items-center justify-center border-8 border-white shadow-2xl text-5xl relative">
                  🌿
                  <div className="absolute -bottom-1 -right-1 bg-sage text-white text-[8px] font-bold py-1 px-3 rounded-full uppercase tracking-tighter shadow-md">LVL {Math.floor(user.daysActive / 5) + 1}</div>
               </div>
               <div>
                 <h2 className="text-3xl font-serif text-stone-800">{user.name}</h2>
                 <p className="text-[10px] font-black uppercase text-stone-300 tracking-[0.3em]">Moments of Focus: {user.daysActive}</p>
               </div>
               
               <button 
                 onClick={handleShare}
                 className="flex items-center gap-2 px-6 py-2 border border-terracotta/30 rounded-full text-[10px] font-black uppercase tracking-widest text-terracotta hover:bg-terracotta/5 transition-colors active:scale-95"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                 Invite a Sister
               </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 px-2">Saved Wisdom</h3>
              {savedLibrary.length === 0 ? (
                <p className="text-center py-10 text-stone-300 font-serif italic text-sm">No saved studies yet. Tap the heart during a study to save it here.</p>
              ) : (
                <div className="grid gap-3">
                  {savedLibrary.map(s => (
                    <button key={s.id} onClick={() => setActiveStudy(s)} className="text-left bg-white border border-stone-100 p-5 rounded-3xl flex justify-between items-center group hover:border-terracotta/20 transition-all shadow-sm">
                      <div className="flex-1">
                        <span className="text-[8px] uppercase font-black text-sage tracking-widest">{s.category}</span>
                        <h4 className="font-serif text-stone-800 group-hover:text-terracotta transition-colors">{s.title}</h4>
                      </div>
                      <span className="text-terracotta opacity-50">❤️</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <section className="bg-stone-800 text-stone-100 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <h3 className="text-xl font-serif italic mb-4">Grace Over Perfection</h3>
              <p className="text-stone-400 text-sm leading-relaxed mb-6 font-light">The algorithm of this world demands consistency. The heart of God demands your presence. You are enough, right now.</p>
              <div className="flex gap-2 h-1.5 bg-stone-700 rounded-full overflow-hidden">
                <div className="w-1/3 bg-sage h-full rounded-full"></div>
              </div>
              <p className="text-[9px] uppercase tracking-widest font-bold mt-3 text-stone-500">Your journey is exactly where it needs to be.</p>
            </section>
          </div>
        )}

        {isLoading && (
          <div className="fixed inset-0 z-[120] bg-white/95 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-300">
            <div className="relative">
              <div className="w-20 h-20 border-2 border-stone-100 rounded-full"></div>
              <div className="absolute inset-0 w-20 h-20 border-2 border-terracotta border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-2xl font-serif text-stone-800 italic">"Be still, and know..."</p>
              <p className="text-[10px] text-stone-300 uppercase tracking-[0.2em] font-black">We're gathering something special for you</p>
            </div>
          </div>
        )}

        {activeStudy && (
          <div className="relative z-[150]">
             <MicroStudyView 
              study={activeStudy} 
              onClose={() => setActiveStudy(null)} 
            />
            <button 
              onClick={() => saveStudyToLibrary(activeStudy)}
              className="fixed top-8 right-8 z-[200] p-3 rounded-full bg-white/80 backdrop-blur-md shadow-lg text-terracotta active:scale-90 transition-all hover:bg-white"
              title="Save to Heart"
            >
              {savedLibrary.find(s => s.id === activeStudy.id) ? (
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              )}
            </button>
          </div>
        )}

        <MentorChat />
      </div>
    </Layout>
  );
};

export default App;
