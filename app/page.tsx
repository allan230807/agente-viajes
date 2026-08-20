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
        targets: loaderRef.current.querySelectorAll('.glass-shape'),
        translateY: [-20, 20],
        rotate: [-10, 10],
        scale: [0.95, 1.05],
        opacity: [0.6, 1],
        direction: 'alternate',
        loop: true,
        delay: anime.stagger(150),
        easing: 'easeInOutSine',
        duration: 800,
      });
    }
  }, []);

  return (
    <div ref={loaderRef} className="w-full py-24 flex justify-center items-center gap-8">
      <div className="glass-shape w-16 h-16 rounded-3xl bg-blue-500/20 border border-blue-400/40 backdrop-blur-lg shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center text-3xl">🌴</div>
      <div className="glass-shape w-20 h-20 rounded-[2.5rem] bg-cyan-500/20 border border-cyan-400/40 backdrop-blur-lg shadow-[0_0_25px_rgba(34,211,238,0.3)] flex items-center justify-center text-4xl">🌊</div>
      <div className="glass-shape w-16 h-16 rounded-3xl bg-blue-600/20 border border-blue-300/40 backdrop-blur-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center justify-center text-3xl">☀️</div>
    </div>
  );
};

export default function TravelPage() {
  const [view, setView] = useState<'main' | 'directory' | 'sectors' | 'results'>('main');
  const [selectedCategory, setSelectedCategory] = useState<'beaches' | 'restaurants' | 'actividades' | 'gps' | 'custom' | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  
  const [skeletonLoading, setSkeletonLoading] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 10.9547, lng: -63.85695 });
  const [items, setItems] = useState<any[]>([]);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [followUpQuery, setFollowUpQuery] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  
  const [isQuickOpen, setIsQuickOpen] = useState<boolean>(false);
  const [quickQuery, setQuickQuery] = useState<string>('');
  const [quickAnswer, setQuickAnswer] = useState<string>('');
  const [quickLoading, setQuickLoading] = useState<boolean>(false);

  const [userPlan, setUserPlan] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !skeletonLoading) {
      anime({
        targets: containerRef.current.children,
        opacity: [0, 1],
        translateY: [30, 0],
        delay: anime.stagger(100),
        easing: 'easeOutElastic(1, .8)',
        duration: 1000,
      });
    }
  }, [view, selectedSector, skeletonLoading]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log('Usando ubicación por defecto', err)
      );
    }
  }, []);

  const processAIApiCall = async (promptText: string, isFollowUp: boolean = false) => {
    const tempId = generateId();
    setIsAiLoading(true);

    setChatHistory(prev => [
      ...prev,
      { id: tempId, role: 'ai', content: 'Leyendo datasets, buscando en internet y contrastando opciones reales...', isLoading: true }
    ]);

    try {
      const contextText = chatHistory
        .filter(m => !m.isLoading)
        .map(m => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.content}`)
        .join('\n');
      
      const finalPrompt = isFollowUp 
        ? `Historial de conversación:\n${contextText}\n\nUsuario: ${promptText}`
        : `Solicitud del usuario: ${promptText}`;

      // AQUÍ ESTÁ EL AJUSTE: Enviamos los datasets completos para que el backend los procese y cruce con la web
      const res = await fetch('/api/travel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: finalPrompt, 
          lat: coords.lat, 
          lng: coords.lng,
          datasets: {
            beaches: beaches,
            restaurants: restaurants,
            actividades: actividades
          }
        }),
      });
      
      const data = await res.json();

      let aiResponseText = "No pude formular una respuesta.";
      if (data) {
        if (data.response) aiResponseText = data.response;
        else if (data.message) aiResponseText = data.message;
        else if (data.text) aiResponseText = data.text;
        else if (data.content) aiResponseText = data.content;
        else if (typeof data === 'string') aiResponseText = data;
        else aiResponseText = JSON.stringify(data);
      }

      setChatHistory(prev => prev.map(msg => 
        msg.id === tempId ? { ...msg, content: aiResponseText, isLoading: false } : msg
      ));
      setIsAiLoading(false);
      
      setTimeout(() => {
        anime({
          targets: `.chat-msg-${tempId}`,
          opacity: [0, 1],
          translateX: [-20, 0],
          easing: 'easeOutExpo',
          duration: 600
        });
      }, 50);

    } catch (error: any) {
      setChatHistory(prev => prev.map(msg => 
        msg.id === tempId ? { ...msg, content: `⚠️ Error de conexión: ${error.message}`, isLoading: false } : msg
      ));
      setIsAiLoading(false);
    }
  };

  const handleCategorySelect = async (category: 'beaches' | 'restaurants' | 'actividades' | 'gps') => {
    setSelectedCategory(category);
    setSkeletonLoading(true);
    setChatHistory([]);

    if (category === 'gps') {
      setView('results');
      const initialPrompt = "Recomiéndame los mejores lugares cercanos a mi ubicación actual en Margarita.";
      setChatHistory([{ id: generateId(), role: 'user', content: initialPrompt }]);
      setItems([...beaches.slice(0, 2), ...restaurants.slice(0, 2)]);
      await processAIApiCall(initialPrompt);
      setSkeletonLoading(false);
      return;
    }

    setTimeout(() => {
      setSkeletonLoading(false);
      setView('sectors');
    }, 600);
  };

  const handleSectorSelect = async (sector: string) => {
    setSelectedSector(sector);
    setSkeletonLoading(true);
    setView('results');

    let dataset: any[] = [];
    if (selectedCategory === 'beaches') dataset = beaches;
    if (selectedCategory === 'restaurants') dataset = restaurants;
    if (selectedCategory === 'actividades') dataset = actividades;

    const filtered = dataset.filter((item: any) => item.sector?.toLowerCase() === sector.toLowerCase());
    setItems(filtered.length > 0 ? filtered : dataset.slice(0, 4));

    const promptText = `Dame recomendaciones interactivas para el sector ${sector} en Margarita para la categoría de ${selectedCategory}.`;
    setChatHistory([{ id: generateId(), role: 'user', content: promptText }]);
    
    await processAIApiCall(promptText);
    setSkeletonLoading(false);
  };

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPlan.trim()) return;
    
    setSelectedCategory('custom');
    setSkeletonLoading(true);
    setView('results');
    setItems([]); 

    const promptText = `Mi plan es el siguiente: "${userPlan}". Propón un itinerario organizado y opciones que se ajusten a esto en Margarita, considerando tiempos y logística.`;
    setChatHistory([{ id: generateId(), role: 'user', content: promptText }]);
    
    await processAIApiCall(promptText);
    setSkeletonLoading(false);
  };

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuery.trim() || isAiLoading) return;

    const userMsg = followUpQuery.trim();
    setChatHistory(prev => [...prev, { id: generateId(), role: 'user', content: userMsg }]);
    setFollowUpQuery('');
    
    await processAIApiCall(userMsg, true);
  };

  const handleQuickAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    setQuickLoading(true);
    try {
      const res = await fetch('/api/travel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: quickQuery, 
          lat: coords.lat, 
          lng: coords.lng,
          datasets: { beaches, restaurants, actividades }
        }),
      });
      const data = await res.json();
      let quickRes = data.response || data.message || "Respuesta rápida generada.";
      setQuickAnswer(quickRes);
    } catch (err: any) {
      setQuickAnswer(`Error: ${err.message}`);
    } finally {
      setQuickLoading(false);
    }
  };

  const sectorsList = ['Pampatar', 'Porlamar', 'Juan Griego', 'El Yaque', 'Placita / Guacuco'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-slate-100 flex flex-col p-4 md:p-8 relative overflow-x-hidden font-sans">
      
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <header className="w-full max-w-5xl mx-auto flex justify-between items-center py-4 px-6 mb-6 bg-slate-900/40 backdrop-blur-md border border-slate-700/40 rounded-2xl shadow-xl z-20 relative">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setView('main'); setSelectedCategory(null); setUserPlan(''); setChatHistory([]); }}>
          <span className="text-2xl">🌴</span>
          <span className="text-xl font-bold tracking-wide bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Margarita AI Travel
          </span>
        </div>
        <div className="flex gap-3">
          {view !== 'directory' && (
            <button onClick={() => setView('directory')} className="text-xs px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 text-blue-300 transition-all font-medium shadow-lg">
              📖 Ver Directorio
            </button>
          )}
          {view !== 'main' && (
            <button onClick={() => { setView('main'); setSelectedCategory(null); setUserPlan(''); setChatHistory([]); }} className="text-xs px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/85 border border-slate-700/60 transition-all flex items-center gap-1.5 font-medium">
              ← Volver
            </button>
          )}
        </div>
      </header>

      <main ref={containerRef} className="flex-1 w-full max-w-5xl mx-auto flex flex-col items-center justify-start z-10 relative">
        
        {view === 'main' && !skeletonLoading && (
          <div className="w-full text-center space-y-8 pb-10">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wider uppercase">
                Asistente Turístico Inteligente
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                ¿Qué deseas descubrir en <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Margarita</span>? 🌊
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <button onClick={() => handleCategorySelect('beaches')} className="group p-6 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-slate-700/40 hover:border-blue-500/50 hover:bg-slate-800/60 hover:-translate-y-1 transition-all flex flex-col items-center text-center shadow-lg">
                <div className="text-4xl mb-3">🏖️</div>
                <span className="font-semibold text-lg text-slate-200">Playas</span>
              </button>
              <button onClick={() => handleCategorySelect('restaurants')} className="group p-6 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-slate-700/40 hover:border-blue-500/50 hover:bg-slate-800/60 hover:-translate-y-1 transition-all flex flex-col items-center text-center shadow-lg">
                <div className="text-4xl mb-3">🍽️</div>
                <span className="font-semibold text-lg text-slate-200">Restaurantes</span>
              </button>
              <button onClick={() => handleCategorySelect('actividades')} className="group p-6 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-slate-700/40 hover:border-blue-500/50 hover:bg-slate-800/60 hover:-translate-y-1 transition-all flex flex-col items-center text-center shadow-lg">
                <div className="text-4xl mb-3">🏄‍♂️</div>
                <span className="font-semibold text-lg text-slate-200">Actividades</span>
              </button>
              <button onClick={() => handleCategorySelect('gps')} className="group p-6 rounded-2xl bg-blue-600/20 backdrop-blur-md border border-blue-500/40 hover:border-blue-400 hover:bg-blue-600/30 hover:-translate-y-1 transition-all flex flex-col items-center text-center shadow-lg">
                <div className="text-4xl mb-3">📍</div>
                <span className="font-semibold text-lg text-blue-300">Cercanos GPS</span>
              </button>
            </div>

            <div className="mt-12 max-w-2xl mx-auto bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 shadow-2xl backdrop-blur-md text-left">
              <span className="text-xl font-bold text-white mb-2 flex items-center gap-2">🗺️ ¿Cuál es tu plan?</span>
              <p className="text-sm text-slate-400 mb-4">Escribe qué te gustaría hacer y generaremos un itinerario a tu medida.</p>
              <form onSubmit={handlePlanSubmit} className="flex flex-col gap-3">
                <textarea
                  value={userPlan}
                  onChange={(e) => setUserPlan(e.target.value)}
                  placeholder="Ej: Quiero ir a una playa tranquila en la mañana y luego al cine más moderno..."
                  rows={3}
                  className="w-full p-4 rounded-xl bg-slate-950/50 border border-slate-700 focus:border-blue-500 focus:outline-none text-sm text-slate-200 resize-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!userPlan.trim()}
                  className="self-end px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-sm transition-all disabled:opacity-50"
                >
                  Proponer actividades ✨
                </button>
              </form>
            </div>
          </div>
        )}

        {view === 'directory' && !skeletonLoading && (
          <div className="w-full text-left space-y-12 pb-16 px-4 md:px-0">
            <div className="border-b border-slate-700/50 pb-6 mb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Directorio Completo de Margarita
              </h1>
              <p className="text-slate-400 mt-3">Explora toda nuestra base de datos de ubicaciones, gastronomía y entretenimiento.</p>
            </div>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">🏖️ Playas <span className="text-sm font-normal bg-slate-800 px-3 py-1 rounded-full text-slate-300">{beaches.length}</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {beaches.map((b: any, i) => (
                  <article key={i} className="p-5 rounded-2xl bg-slate-900/40 border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                    <h3 className="text-xl font-semibold text-blue-300">{b.name || b.nombre}</h3>
                    {b.sector && <span className="text-xs text-blue-500/80 font-medium block mt-1">📍 {b.sector}</span>}
                    <p className="text-sm text-slate-400 mt-3 leading-relaxed">{b.description || b.descripcion || "Playa hermosa en la isla."}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {skeletonLoading && <VisualLoader />}

        {view === 'sectors' && !skeletonLoading && (
          <div className="w-full text-center space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
              <span className="text-blue-400 text-xs font-semibold uppercase tracking-widest">Paso 2</span>
              <h2 className="text-3xl font-bold text-white">Elige un Sector 🗺️</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              {sectorsList.map((sector) => (
                <button key={sector} onClick={() => handleSectorSelect(sector)} className="p-5 rounded-xl bg-slate-900/60 border border-slate-700/50 hover:border-blue-500/60 hover:bg-slate-800 transition-all text-sm font-semibold shadow-md">
                  📍 {sector}
                </button>
              ))}
            </div>
          </div>
        )}

        {view === 'results' && !skeletonLoading && (
          <div className="w-full max-w-3xl mx-auto flex flex-col h-[calc(100vh-140px)] pb-6">
            
            {items.length > 0 && (
              <div className="mb-6 shrink-0">
                <span className="text-sm font-semibold text-slate-300 mb-3 block">Lugares de nuestra base de datos:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/40 border border-slate-700/40 flex flex-col justify-between">
                      <h4 className="font-bold text-white text-sm">{item.name || item.nombre}</h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description || item.descripcion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto rounded-2xl bg-slate-900/30 border border-slate-700/40 p-4 space-y-4 mb-4 custom-scrollbar">
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`chat-msg-${msg.id} flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  
                  {msg.role === 'ai' && <div className="text-3xl mr-3 mt-1">🤖</div>}
                  
                  <div className={`p-5 rounded-2xl max-w-[85%] text-sm md:text-base leading-relaxed whitespace-pre-wrap backdrop-blur-lg ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-none shadow-lg shadow-blue-900/30' 
                      : 'bg-slate-900/70 border border-slate-700/60 text-slate-100 rounded-bl-none shadow-xl'
                  }`}>
                    
                    {msg.isLoading ? (
                      <div className="flex flex-col gap-3 py-1">
                        <span className="text-slate-300 text-sm">{msg.content}</span>
                        <div className="flex items-center gap-2 h-6">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-400/85 backdrop-blur-md border border-white/20 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.6)]"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400/85 backdrop-blur-md border border-white/20 animate-pulse [animation-delay:0.2s] shadow-[0_0_10px_rgba(34,211,238,0.6)]"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500/85 backdrop-blur-md border border-white/20 animate-pulse [animation-delay:0.4s] shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                        </div>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>

                  {msg.role === 'user' && <div className="text-3xl ml-3 mt-1">👤</div>}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleFollowUpSubmit} className="flex gap-2 shrink-0">
              <input
                type="text"
                value={followUpQuery}
                onChange={(e) => setFollowUpQuery(e.target.value)}
                placeholder="Pregunta algo más sobre esto..."
                disabled={isAiLoading}
                className="flex-1 p-4 rounded-xl bg-slate-900/80 border border-slate-700 focus:border-blue-500 focus:outline-none text-sm text-slate-200 disabled:opacity-50 transition-colors"
              />
              <button
                type="submit"
                disabled={!followUpQuery.trim() || isAiLoading}
                className="px-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold disabled:opacity-50 transition-all flex items-center justify-center shadow-lg shadow-blue-600/20"
              >
                {isAiLoading ? '...' : 'Enviar 🚀'}
              </button>
            </form>

          </div>
        )}

      </main>

      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={() => setIsQuickOpen(!isQuickOpen)} className="p-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-600/40 border border-blue-400 text-2xl transition-transform hover:scale-105 active:scale-95">
          {isQuickOpen ? '✕' : '⚡'}
        </button>
        {isQuickOpen && (
          <div className="absolute bottom-16 right-0 w-80 sm:w-96 p-5 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-blue-500/40 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">Consultas Rápidas</h3>
            </div>
            <form onSubmit={handleQuickAssistant} className="space-y-3">
              <textarea value={quickQuery} onChange={(e) => setQuickQuery(e.target.value)} placeholder="Ej: ¿Playa con buen oleaje?" rows={2} className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700/60 text-xs focus:outline-none focus:border-blue-500 resize-none text-slate-200" />
              <button type="submit" disabled={quickLoading || !quickQuery.trim()} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-semibold disabled:opacity-50">
                {quickLoading ? 'Analizando...' : 'Preguntar IA'}
              </button>
            </form>
            {quickAnswer && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/60 text-xs text-slate-300 max-h-40 overflow-y-auto whitespace-pre-wrap">
                {quickAnswer}
              </div>
            )}
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />
    </div>
  );
}