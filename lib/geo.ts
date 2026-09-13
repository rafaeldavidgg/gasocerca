/**
 * Utilidades geográficas: fórmula de Haversine (línea recta, no carretera).
 * @module lib/geo
 */

/**
 * Calcula la distancia en km entre dos puntos WGS84 por línea recta.
 * @param lat1 latitud origen
 * @param lon1 longitud origen
 * @param lat2 latitud destino
 * @param lon2 longitud destino
 * @returns km (number). NaN si algún dato es inválido.
 */
export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // radio terrestre medio en km
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Convierte una lat/lng con coma decimal ("40,123") a number.
 * @returns number|null si no es parseable.
 */
export function parseCoord(v: string | undefined | null): number | null {
  if (v == null) return null;
  const n = Number(String(v).trim().replace(",", "."));
  return Number.isFinite(n) ? n : null;
}
