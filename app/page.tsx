'use client';

import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import anime from 'animejs';
import { beaches } from '@/data/beaches';
import { restaurants } from '@/data/restaurants';
import { actividades } from '@/data/activities';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  isLoading?: boolean;
}

const generateId = () => Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);

const VisualLoader = () => {
  const loaderRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (loaderRef.current) {
      anime({
        targets: loaderRef.current.querySelectorAll('.loader-dot'),
        scale: [0.8, 1.2],
        opacity: [0.5, 1],
        direction: 'alternate',
        loop: true,
        delay: anime.stagger(150),
        easing: 'easeInOutSine',
      });
    }
  }, []);

  return (
    <div ref={loaderRef} className="flex justify-center gap-2 py-10">
      {[1, 2, 3].map(i => <div key={i} className="loader-dot w-3 h-3 bg-blue-500 rounded-full"></div>)}
    </div>
  );
};

export default function TravelPage() {
  const [view, setView] = useState<'main' | 'directory' | 'results'>('main');
  const [skeletonLoading, setSkeletonLoading] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 10.9547, lng: -63.85695 });
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [followUpQuery, setFollowUpQuery] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [userPlan, setUserPlan] = useState<string>('');
  const [budget, setBudget] = useState<number>(300);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const processAIApiCall = async (promptText: string, isFollowUp: boolean = false) => {
    const tempId = generateId();
    setIsAiLoading(true);
    setChatHistory(prev => [...prev, { id: tempId, role: 'ai', content: '...', isLoading: true }]);

    try {
      const res = await fetch('/api/travel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: isFollowUp ? promptText : promptText, 
          lat: coords.lat, lng: coords.lng, budget, 
          datasets: { beaches, restaurants, actividades }
        }),
      });
      const data = await res.json();
      setChatHistory(prev => prev.map(msg => msg.id === tempId ? { ...msg, content: data.response, isLoading: false } : msg));
    } catch {
      setChatHistory(prev => prev.map(msg => msg.id === tempId ? { ...msg, content: 'Ups, error de conexión.', isLoading: false } : msg));
    }
    setIsAiLoading(false);
  };

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuery.trim() || isAiLoading) return;
    const userMsg = followUpQuery.trim();
    setChatHistory(prev => [...prev, { id: generateId(), role: 'user', content: userMsg }]);
    setFollowUpQuery('');
    await processAIApiCall(userMsg, true);
  };

  // Cálculo de tamaño para el emoji dinámico
  const emojiSize = 1.5 + (budget / 1000) * 1.5;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="p-4 flex justify-between items-center sticky top-0 bg-slate-950/80 backdrop-blur-md z-50 border-b border-slate-800">
        <h1 className="font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Margarita AI 🌴</h1>
        {view !== 'main' && <button onClick={() => setView('main')} className="text-xs bg-slate-800 px-3 py-1 rounded-lg">Inicio</button>}
      </header>

      <main className="flex-1 p-4 max-w-md mx-auto w-full">
        {view === 'main' && !skeletonLoading && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <h2 className="text-2xl font-bold">¿Qué exploramos hoy?</h2>
            
            {/* Slider Presupuesto con Emoji Dinámico */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold">Presupuesto</span>
                <span className="font-bold text-cyan-400" style={{ fontSize: `${emojiSize}rem` }}>
                  🥳
                </span>
              </div>
              <input type="range" min="50" max="1000" step="25" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full accent-cyan-500" />
              <div className="text-center mt-2 font-mono text-cyan-400">${budget} USD</div>
            </div>

            {/* Botones compactos */}
            <div className="grid grid-cols-2 gap-2">
              {[ {icon:'🏖️', label:'Playas', val:'beaches'}, {icon:'🍽️', label:'Comer', val:'restaurants'}, {icon:'🏄‍♂️', label:'Actividades', val:'actividades'}, {icon:'📍', label:'Cercanos', val:'gps'} ].map((item) => (
                <button key={item.val} onClick={() => { setSkeletonLoading(true); setView('results'); setTimeout(() => { setSkeletonLoading(false); processAIApiCall(`Recomendaciones de ${item.label} para 4 personas con $${budget}`); setChatHistory([{id:generateId(), role:'user', content:`Quiero ${item.label}`}]); }, 800); }} 
                  className="p-3 bg-slate-900 border border-slate-800 rounded-xl active:scale-95 transition-transform flex flex-col items-center">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {skeletonLoading && <VisualLoader />}

        {view === 'results' && !skeletonLoading && (
          <div className="flex flex-col h-[80vh]">
            <div className="flex-1 overflow-y-auto space-y-4 pb-20">
              {chatHistory.map(msg => (
                <div key={msg.id} className={`p-3 rounded-2xl max-w-[90%] text-sm ${msg.role === 'user' ? 'bg-blue-600 ml-auto' : 'bg-slate-800'}`}>
                  {msg.content}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            
            <form onSubmit={handleFollowUpSubmit} className="absolute bottom-4 left-4 right-4 flex gap-2">
              <input
                type="text"
                value={followUpQuery}
                onChange={(e) => setFollowUpQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleFollowUpSubmit(e); }}
                className="flex-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-sm"
                placeholder="Escribe aquí..."
              />
              <button type="submit" className="px-4 bg-cyan-600 rounded-xl font-bold">🚀</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}