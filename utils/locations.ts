interface Coordinates {
  lat: number;
  lng: number;
}

export interface PlaceEntity {
  id: string;
  nombre: string;
  zona: string;
  perfil: string;
  coordenadas: Coordinates;
  [key: string]: any;
}

// Fórmula de Haversine para calcular distancia en kilómetros
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

// Función para buscar y ordenar elementos por cercanía
export function getNearbyEntities(
  lat: number,
  lng: number,
  datasets: PlaceEntity[][],
  limit = 5
) {
  const allEntities = datasets.flat();

  const withDistances = allEntities.map((entity) => ({
    ...entity,
    distanceKm: calculateDistance(lat, lng, entity.coordenadas.lat, entity.coordenadas.lng),
  }));

  withDistances.sort((a, b) => a.distanceKm - b.distanceKm);
  return withDistances.slice(0, limit);
}