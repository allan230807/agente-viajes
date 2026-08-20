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

// Loader dinámico y acuático para la burbuja del chat
const ChatBubbleLoader = () => {
  return (
    <div className="flex items-center gap-2 py-1 px-1">
      <div className="w-2.5 h-2.5 rounded-full bg-teal-300 animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2.5 h-2.5 rounded-full bg-cyan-300 animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-bounce"></div>
      <span className="text-xs text-teal-200 font-mono tracking-wider ml-1">Buscando marea... 🌊</span>
    </div>
  );
};

const VisualLoader = () => {
  const loaderRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (loaderRef.current) {
      anime({
        targets: loaderRef.current.querySelectorAll('.glass-shape'),
        translateY: [-20, 20],
        rotate: [-15, 15],
        scale: [0.9, 1.15],
        direction: 'alternate',
        loop: true,
        delay: anime.stagger(120),
        easing: 'easeInOutSine',
        duration: 700,
      });
    }
  }, []);

  return (
    <div ref={loaderRef} className="w-full py-20 flex justify-center items-center gap-4">
      <div className="glass-shape w-12 h-12 rounded-2xl bg-teal-400/20 border border-teal-300/50 backdrop-blur-md flex items-center justify-center text-xl shadow-[0_0_20px_rgba(45,212,191,0.5)]">💧</div>
      <div className="glass-shape w-14 h-14 rounded-3xl bg-cyan-400/20 border border-cyan-300/50 backdrop-blur-md flex items-center justify-center text-2xl shadow-[0_0_25px_rgba(6,182,212,0.6)]">🌊</div>
      <div className="glass-shape w-12 h-12 rounded-2xl bg-emerald-400/20 border border-emerald-300/50 backdrop-blur-md flex items-center justify-center text-xl shadow-[0_0_20px_rgba(52,211,153,0.5)]">🌴</div>
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

  const containerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !skeletonLoading) {
      anime({
        targets: containerRef.current.children,
        opacity: [0, 1],
        translateY: [15, 0],
        delay: anime.stagger(60),
        easing: 'easeOutExpo',
        duration: 700,
      });
    }
  }, [view, skeletonLoading]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log('Ubicación predeterminada', err)
      );
    }
  }, []);

  const processAIApiCall = async (promptText: string, isFollowUp: boolean = false) => {
    const tempId = generateId();
    setIsAiLoading(true);

    setChatHistory(prev => [
      ...prev,
      { id: tempId, role: 'ai', content: '', isLoading: true }
    ]);

    try {
      const contextText = chatHistory
        .filter(m => !m.isLoading)
        .map(m => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.content}`)
        .join('\n');
      
      const formattingInstruction = `[Instrucción estricta: Sé breve y directo. Usa párrafos cortos separados por saltos de línea y emojis adecuados. No aglomeres texto. Separa claramente la recomendación principal de la pregunta final que harás al usuario al final del mensaje].\n\n`;

      const finalPrompt = isFollowUp 
        ? `${formattingInstruction}Historial de conversación:\n${contextText}\n\nNueva consulta del usuario: ${promptText}`
        : `${formattingInstruction}${promptText}`;

      const res = await fetch('/api/travel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: finalPrompt, 
          lat: coords.lat, 
          lng: coords.lng,
          budget: budget,
          datasets: { beaches, restaurants, actividades }
        }),
      });
      
      const data = await res.json().catch(() => ({}));
      
      // Captura robusta de la respuesta para evitar bucles o fallos vacíos
      let aiResponseText = data.response || data.message || data.text || data.reply;
      
      if (!res.ok || !aiResponseText) {
        aiResponseText = data.error || data.message || `⚠️ No pudimos conectar con el servidor de la isla (${res.status}). Intenta de nuevo.`;
      }

      setChatHistory(prev => prev.map(msg => 
        msg.id === tempId ? { ...msg, content: aiResponseText, isLoading: false } : msg
      ));
      setIsAiLoading(false);

    } catch (error: any) {
      setChatHistory(prev => prev.map(msg => 
        msg.id === tempId ? { ...msg, content: `🌊 Tuvimos un pequeño corte en la señal marina. ¿Me lo repites por favor?`, isLoading: false } : msg
      ));
      setIsAiLoading(false);
    }
  };

  const handleCategorySelect = async (category: 'beaches' | 'restaurants' | 'actividades' | 'gps') => {
    setSkeletonLoading(true);
    setChatHistory([]);

    if (category === 'gps') {
      setView('results');
      const initialPrompt = `Búscame los mejores lugares cercanos para 4 personas con un presupuesto de ${budget} dólares.`;
      setChatHistory([{ id: generateId(), role: 'user', content: initialPrompt }]);
      await processAIApiCall(initialPrompt);
      setSkeletonLoading(false);
      return;
    }

    setTimeout(async () => {
      setSkeletonLoading(false);
      setView('results');
      const categoryPrompt = `Quiero recomendaciones de ${category} para un grupo de 4 personas con un presupuesto total de ${budget} dólares.`;
      setChatHistory([{ id: generateId(), role: 'user', content: categoryPrompt }]);
      await processAIApiCall(categoryPrompt);
    }, 400);
  };

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPlan.trim()) return;
    
    setSkeletonLoading(true);
    setView('results');

    const promptText = `Mi plan para 4 personas con un presupuesto de ${budget} dólares es: "${userPlan}". Dame recomendaciones.`;
    setChatHistory([{ id: generateId(), role: 'user', content: promptText }]);
    
    await processAIApiCall(promptText);
    setUserPlan('');
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

  const handleChipClick = async (chipText: string) => {
    if (isAiLoading) return;
    const cleanText = chipText.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
    const userMsg = `Quiero saber sobre: ${cleanText}`;
    
    setChatHistory(prev => [...prev, { id: generateId(), role: 'user', content: userMsg }]);
    await processAIApiCall(userMsg, true);
  };

  const emojiScaleSize = 1.2 + (budget / 1000) * 1.8;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-950 via-cyan-950 to-slate-900 text-teal-50 flex flex-col p-4 md:p-6 overflow-y-auto font-sans selection:bg-teal-400 selection:text-slate-950">
      
      {/* Header Liquid Glass Aguamarina */}
      <header className="w-full max-w-4xl mx-auto flex justify-between items-center py-3 px-5 mb-4 bg-teal-950/60 backdrop-blur-xl border border-teal-400/40 rounded-2xl shadow-[0_0_30px_rgba(45,212,191,0.2)] shrink-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform" onClick={() => { setView('main'); setUserPlan(''); setChatHistory([]); }}>
          <span className="text-xl">🌊</span>
          <span className="text-lg font-extrabold tracking-wide bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-md">
            Margarita AI
          </span>
        </div>
        <div className="flex gap-2">
          {view !== 'directory' && (
            <button onClick={() => setView('directory')} className="text-xs px-3.5 py-1.5 rounded-xl bg-teal-900/50 hover:bg-teal-800/70 border border-teal-400/50 text-teal-200 transition-all active:scale-95 shadow-[0_0_15px_rgba(45,212,191,0.25)] font-medium backdrop-blur-md">
              Directorio 📂
            </button>
          )}
          {view !== 'main' && (
            <button onClick={() => { setView('main'); setUserPlan(''); setChatHistory([]); }} className="text-xs px-3.5 py-1.5 rounded-xl bg-teal-950/70 hover:bg-teal-900/80 border border-teal-400/40 text-teal-200 transition-all active:scale-95 backdrop-blur-md shadow-sm">
              ← Volver
            </button>
          )}
        </div>
      </header>

      {/* Contenedor principal */}
      <main ref={containerRef} className="flex-1 w-full max-w-4xl mx-auto flex flex-col pb-6">
        
        {view === 'main' && !skeletonLoading && (
          <div className="w-full text-center space-y-6">
            <div className="space-y-2">
              <span className="px-4 py-1 rounded-full bg-teal-500/15 border border-teal-400/50 text-teal-300 text-[11px] font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(45,212,191,0.3)] backdrop-blur-md inline-block">
                Asistente Turístico Aguamarina 💧
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white px-2">
                ¿Qué deseas descubrir en <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-300">Margarita</span>? 🏝️
              </h1>
            </div>

            {/* Slider de Presupuesto Liquid Glass */}
            <div className="max-w-sm mx-auto bg-teal-950/60 border border-teal-400/40 rounded-2xl p-4 shadow-[0_0_35px_rgba(45,212,191,0.2)] backdrop-blur-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-teal-200">Presupuesto para 4 personas</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-cyan-300">${budget} USD</span>
                  <span style={{ fontSize: `${emojiScaleSize}rem`, transition: 'transform 0.2s ease' }} className="inline-block leading-none">
                    🥳
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-teal-950 rounded-lg appearance-none cursor-pointer accent-teal-400 shadow-inner"
              />
              <div className="flex justify-between text-[10px] text-teal-300/80 mt-1 font-mono">
                <span>$50</span>
                <span>$500</span>
                <span>$1000</span>
              </div>
            </div>

            {/* Botones de categorías con Efecto Acuático */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              <button 
                onClick={() => handleCategorySelect('beaches')} 
                className="p-4 rounded-2xl bg-teal-950/60 border border-teal-400/40 hover:border-teal-300 hover:shadow-[0_0_25px_rgba(45,212,191,0.5)] active:scale-95 transition-all duration-300 flex flex-col items-center shadow-xl backdrop-blur-md group"
              >
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🏖️</div>
                <span className="font-semibold text-sm text-teal-100">Playas</span>
              </button>
              <button 
                onClick={() => handleCategorySelect('restaurants')} 
                className="p-4 rounded-2xl bg-teal-950/60 border border-cyan-400/40 hover:border-cyan-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 transition-all duration-300 flex flex-col items-center shadow-xl backdrop-blur-md group"
              >
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🍽️</div>
                <span className="font-semibold text-sm text-cyan-100">Restaurantes</span>
              </button>
              <button 
                onClick={() => handleCategorySelect('actividades')} 
                className="p-4 rounded-2xl bg-teal-950/60 border border-emerald-400/40 hover:border-emerald-300 hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] active:scale-95 transition-all duration-300 flex flex-col items-center shadow-xl backdrop-blur-md group"
              >
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🏄‍♂️</div>
                <span className="font-semibold text-sm text-emerald-100">Actividades</span>
              </button>
              <button 
                onClick={() => handleCategorySelect('gps')} 
                className="p-4 rounded-2xl bg-cyan-950/70 border border-teal-300/60 hover:border-teal-200 hover:shadow-[0_0_30px_rgba(45,212,191,0.6)] active:scale-95 transition-all duration-300 flex flex-col items-center shadow-xl backdrop-blur-md group"
              >
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">📍</div>
                <span className="font-semibold text-sm text-teal-200">Cercanos GPS</span>
              </button>
            </div>

            {/* Formulario de plan personalizado */}
            <div className="max-w-md mx-auto bg-teal-950/60 border border-teal-400/40 rounded-2xl p-5 shadow-[0_0_35px_rgba(45,212,191,0.2)] backdrop-blur-xl text-left">
              <h2 className="text-sm font-bold text-teal-100 mb-2 flex items-center gap-2">
                <span>🗺️</span> ¿Tienes algún plan en mente?
              </h2>
              <form onSubmit={handlePlanSubmit} className="flex flex-col gap-3">
                <textarea
                  value={userPlan}
                  onChange={(e) => setUserPlan(e.target.value)}
                  placeholder="Ej: Queremos ir a comer pescado y pasear..."
                  rows={2}
                  className="w-full p-3 rounded-xl bg-teal-950/90 border border-teal-400/50 focus:border-cyan-300 focus:outline-none text-xs md:text-sm text-teal-100 resize-none shadow-inner backdrop-blur-md"
                />
                <button
                  type="submit"
                  disabled={!userPlan.trim()}
                  className="self-end px-4.5 py-2 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-xs md:text-sm active:scale-95 transition-all duration-300 disabled:opacity-50 shadow-[0_0_20px_rgba(45,212,191,0.5)] hover:shadow-[0_0_30px_rgba(45,212,191,0.8)]"
                >
                  Consultar plan ✨
                </button>
              </form>
            </div>
          </div>
        )}

        {view === 'directory' && !skeletonLoading && (
          <div className="w-full space-y-6 pb-8">
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-300">Directorio Completo 🏝️</h1>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-teal-200 mb-3 flex items-center gap-2">🏖️ Playas de la Isla</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {beaches.map((b: any, i: number) => (
                    <div key={`b-${i}`} className="p-4 rounded-2xl bg-teal-950/60 border border-teal-400/40 backdrop-blur-xl shadow-xl active:scale-[0.98] transition-transform">
                      <h3 className="font-semibold text-sm text-teal-200">{b.name || b.nombre}</h3>
                      <p className="text-xs text-teal-300/80 mt-1">{b.description || b.descripcion}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-base font-bold text-cyan-200 mb-3 flex items-center gap-2">🍽️ Restaurantes y Gastronomía</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {restaurants.map((r: any, i: number) => (
                    <div key={`r-${i}`} className="p-4 rounded-2xl bg-teal-950/60 border border-cyan-400/40 backdrop-blur-xl shadow-xl active:scale-[0.98] transition-transform">
                      <h3 className="font-semibold text-sm text-cyan-200">{r.name || r.nombre}</h3>
                      <p className="text-xs text-teal-300/80 mt-1">{r.description || r.descripcion}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-base font-bold text-emerald-200 mb-3 flex items-center gap-2">🏄‍♂️ Actividades y Recreación</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {actividades.map((a: any, i: number) => (
                    <div key={`a-${i}`} className="p-4 rounded-2xl bg-teal-950/60 border border-emerald-400/40 backdrop-blur-xl shadow-xl active:scale-[0.98] transition-transform">
                      <h3 className="font-semibold text-sm text-emerald-200">{a.name || a.nombre}</h3>
                      <p className="text-xs text-teal-300/80 mt-1">{a.description || a.descripcion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {skeletonLoading && <VisualLoader />}

        {view === 'results' && !skeletonLoading && (
          <div className="w-full max-w-2xl mx-auto flex flex-col flex-1">
            
            {/* Historial de chat con burbujas y loader dinámico */}
            <div className="space-y-4 mb-28 pr-1">
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-300`}>
                  <div className={`p-4 rounded-2xl max-w-[90%] text-xs md:text-sm leading-relaxed backdrop-blur-xl shadow-xl whitespace-pre-line ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 text-slate-950 font-semibold rounded-br-none shadow-[0_0_20px_rgba(45,212,191,0.4)] border border-teal-200/80' 
                      : 'bg-teal-950/90 border border-teal-400/50 text-teal-100 rounded-bl-none shadow-[0_0_25px_rgba(4,47,46,0.6)]'
                  }`}>
                    {msg.isLoading ? <ChatBubbleLoader /> : msg.content}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Barra inferior fija con botones de recomendación rápida interactivos y chat */}
            <div className="fixed bottom-3 left-3 right-3 max-w-2xl mx-auto flex flex-col gap-2 z-50">
              
              {/* Chips de recomendaciones rápidas con envío inmediato */}
              <div className="flex gap-2 overflow-x-auto pb-1 px-1 scrollbar-none">
                {['Más económico 💵', '¿Cómo llegar? 📍', 'Planes familiares 👨‍👩‍👦'].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAiLoading}
                    onClick={() => handleChipClick(chip)}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-950/90 border border-teal-400/50 text-teal-200 text-[11px] font-medium whitespace-nowrap active:scale-95 transition-all duration-300 backdrop-blur-md hover:bg-teal-900 hover:border-teal-300 hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] shadow-lg disabled:opacity-50"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Formulario de chat */}
              <form onSubmit={handleFollowUpSubmit} className="flex gap-2 bg-teal-950/95 backdrop-blur-2xl p-2 rounded-2xl border border-teal-400/50 shadow-[0_0_30px_rgba(45,212,191,0.3)]">
                <input
                  type="text"
                  value={followUpQuery}
                  onChange={(e) => setFollowUpQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleFollowUpSubmit(e); }}
                  placeholder="Escribe lo que quieras responder..."
                  disabled={isAiLoading}
                  className="flex-1 p-3 rounded-xl bg-teal-950 border border-teal-400/50 focus:border-cyan-300 focus:outline-none text-xs md:text-sm text-teal-100 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!followUpQuery.trim() || isAiLoading}
                  className="px-5 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-xs md:text-sm disabled:opacity-50 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(45,212,191,0.5)] hover:shadow-[0_0_30px_rgba(45,212,191,0.8)]"
                >
                  Enviar 🚀
                </button>
              </form>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}