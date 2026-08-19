export interface OfflineCache {
  beaches: any[];
  restaurants: any[];
  actividades: any[];
  timestamp: number;
}

const CACHE_KEYS = {
  DATASETS: 'margarita_offline_datasets',
  FAVORITES: 'margarita_user_favorites',
  CACHED_RESPONSES: 'margarita_ai_cache',
  LAST_SYNC: 'margarita_last_sync',
};

export const StorageManager = {
  saveDatasets(beaches: any[], restaurants: any[], actividades: any[]): void {
    if (typeof window === 'undefined') return;
    try {
      const cacheData: OfflineCache = {
        beaches,
        restaurants,
        actividades,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEYS.DATASETS, JSON.stringify(cacheData));
      localStorage.setItem(CACHE_KEYS.LAST_SYNC, Date.now().toString());
    } catch (error) {
      console.error('Error al guardar datasets:', error);
    }
  },

  getDatasets(): OfflineCache | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(CACHE_KEYS.DATASETS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  },

  saveFavorite(placeId: string): void {
    if (typeof window === 'undefined') return;
    try {
      const favorites = this.getFavorites();
      if (!favorites.includes(placeId)) {
        favorites.push(placeId);
        localStorage.setItem(CACHE_KEYS.FAVORITES, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error al guardar favorito:', error);
    }
  },

  removeFavorite(placeId: string): void {
    if (typeof window === 'undefined') return;
    try {
      const favorites = this.getFavorites().filter((id) => id !== placeId);
      localStorage.setItem(CACHE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error al remover favorito:', error);
    }
  },

  getFavorites(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(CACHE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  },

  cacheAIResponse(key: string, responseText: string): void {
    if (typeof window === 'undefined') return;
    try {
      const cache = this.getAllCachedResponses();
      cache[key] = { text: responseText, timestamp: Date.now() };
      localStorage.setItem(CACHE_KEYS.CACHED_RESPONSES, JSON.stringify(cache));
    } catch (error) {
      console.error('Error al guardar respuesta de IA:', error);
    }
  },

  getCachedResponse(key: string): string | null {
    if (typeof window === 'undefined') return null;
    try {
      const cache = this.getAllCachedResponses();
      return cache[key] ? cache[key].text : null;
    } catch (error) {
      return null;
    }
  },

  getAllCachedResponses(): Record<string, { text: string; timestamp: number }> {
    if (typeof window === 'undefined') return {};
    try {
      const data = localStorage.getItem(CACHE_KEYS.CACHED_RESPONSES);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      return {};
    }
  },

  clearAllCache(): void {
    if (typeof window === 'undefined') return;
    Object.values(CACHE_KEYS).forEach((key) => localStorage.removeItem(key));
  },
};