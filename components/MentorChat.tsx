
import React, { useState, useRef, useEffect } from 'react';
import { getMentorResponse } from '../geminiService';

const MentorChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'I’m Grace. I’m here whenever you need a listening ear or a biblical perspective on motherhood. What’s on your heart?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chat]);

  const handleSend = async () => {
    if (!message.trim()) return;
    const userMsg = message;
    setMessage('');
    setChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await getMentorResponse([], userMsg);
      setChat(prev => [...prev, { role: 'model', text: response }]);
    } catch (e) {
      setChat(prev => [...prev, { role: 'model', text: "I'm sorry, my connection is a bit weak. Take a deep breath—I'm still here with you." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="fixed bottom-28 right-6 bg-terracotta text-white p-4 rounded-full shadow-2xl z-40 animate-bounce hover:scale-110 transition-transform active:scale-90"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
    </button>
  );

  return (
    <div className="fixed inset-x-6 bottom-28 bg-white rounded-3xl shadow-2xl z-50 flex flex-col max-h-[70vh] border border-stone-100 animate-in slide-in-from-bottom-4 duration-300">
      <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50 rounded-t-3xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-terracotta/10 rounded-full flex items-center justify-center text-terracotta font-serif italic text-lg">G</div>
          <div>
            <h4 className="text-sm font-bold text-stone-800">Grace</h4>
            <p className="text-[10px] text-sage font-bold uppercase tracking-widest">Mentor is Online</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-stone-300 hover:text-stone-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
        {chat.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-stone-800 text-white rounded-tr-none' : 'bg-stone-100 text-stone-700 rounded-tl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-stone-100 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
              <div className="w-1 h-1 bg-stone-400 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-stone-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1 h-1 bg-stone-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-stone-100 flex gap-2">
        <input 
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          className="flex-1 bg-stone-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-terracotta/20 transition-all"
        />
        <button 
          onClick={handleSend}
          className="bg-terracotta text-white p-3 rounded-xl hover:bg-opacity-90 transition-all active:scale-90"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </button>
      </div>
    </div>
  );
};

export default MentorChat;
