'use client';
import { useState, useEffect } from 'react';
import { StorageManager } from '@/utils/storage';
import { beaches } from '@/data/beaches';
import { restaurants } from '@/data/restaurants';
import { actividades} from '@/data/activities';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCache, setLoadingCache] = useState(true);
  const [coords, setCoords] = useState({ lat: 10.957, lng: -63.840 }); // Coordenadas por defecto (Porlamar)

  // 1. Sincronizar caché offline y obtener geolocalización al arrancar
  useEffect(() => {
    const existingCache = StorageManager.getDatasets();
    if (!existingCache) {
      StorageManager.saveDatasets(beaches, restaurants, actividades);
      console.log('Datasets cargados en caché local con éxito.');
    }
    setLoadingCache(false);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('No se pudo obtener la geolocalización, usando valor por defecto:', error);
        }
      );
    }
  }, []);

  // 2. Manejar consulta al asistente de IA
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setRecommendation('');

    try {
      const res = await fetch('/api/travel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          lat: coords.lat,
          lng: coords.lng,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRecommendation(data.data);
      } else {
        setRecommendation('Ocurrió un error al obtener la recomendación.');
      }
    } catch (err) {
      setRecommendation('Error de red. Verifique su conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 lg:p-24 bg-slate-950 text-white">
      <div className="max-w-3xl w-full">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Margarita AI 🏝️
          </h1>
          <p className="text-gray-400 text-sm">
            Asistente de viaje hiperlocal y offline-first.
          </p>
          <div className="mt-2 text-xs text-slate-500 font-mono">
            {loadingCache ? 'Sincronizando caché...' : '🟢 Modo Offline Activo'} | GPS: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
          </div>
        </header>

        {/* Formulario de consulta */}
        <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="¿Qué te gustaría hacer o comer cerca? (Ej: Quiero comer empanadas o ir a una playa tranquila)"
            className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 resize-none h-28"
          />
          <button
            type="submit"
            disabled={loading}
            className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:opacity-95 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Buscando lugares cercanos...' : 'Preguntar al Asistente'}
          </button>
        </form>

        {/* Resultados */}
        {recommendation && (
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 whitespace-pre-wrap leading-relaxed text-slate-200">
            <h2 className="text-lg font-bold mb-3 text-cyan-400">Recomendaciones:</h2>
            {recommendation}
          </div>
        )}
      </div>
    </main>
  );
}