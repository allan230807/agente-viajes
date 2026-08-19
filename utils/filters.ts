import { calculateDistance, PlaceEntity } from './locations';

export interface FilterOptions {
  maxCost?: number;
  category?: string;
  limit?: number;
}

/**
 * Ordena cualquier lista de entidades por cercanía (de más cercano a más lejano)
 * utilizando la fórmula de Haversine.
 */
export function sortByProximity<T extends PlaceEntity>(
  entities: T[],
  userLat: number,
  userLng: number
): (T & { distanceKm: number })[] {
  return entities
    .map((entity) => ({
      ...entity,
      distanceKm: calculateDistance(
        userLat,
        userLng,
        entity.coordenadas.lat,
        entity.coordenadas.lng
      ),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

/**
 * Filtra opcionalmente por costo o categoría, pero prioriza y ordena
 * estrictamente por lo más cercano al usuario.
 */
export function getClosestPlaces(
  datasets: PlaceEntity[][],
  userLat: number,
  userLng: number,
  options?: FilterOptions
) {
  let combinedEntities = datasets.flat();

  // Filtro opcional por presupuesto máximo (si aplica)
  if (options?.maxCost !== undefined) {
    combinedEntities = combinedEntities.filter((item) => {
      const cost = item.costo_usd ?? item.precio_servicios_usd ?? 0;
      return cost <= options.maxCost!;
    });
  }

  // Filtro opcional por categoría o tipo
  if (options?.category) {
    const query = options.category.toLowerCase();
    combinedEntities = combinedEntities.filter((item) => {
      const cat = (item.categoria || item.tipo || "").toLowerCase();
      return cat.includes(query);
    });
  }

  // Ordenar de forma estricta por cercanía (lo más cercano primero)
  const sortedEntities = sortByProximity(combinedEntities, userLat, userLng);

  // Limitar cantidad de resultados si se requiere
  if (options?.limit) {
    return sortedEntities.slice(0, options.limit);
  }

  return sortedEntities;
}