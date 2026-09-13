/**
 * Caché en memoria del servidor con estrategia stale-while-revalidate casera:
 * si el MITERD falla, servimos la última caché buena marcándola como `stale`.
 * @module lib/cache
 */

interface Entry<T> {
  at: number;
  data: T;
}

const store = new Map<string, Entry<unknown>>();
const TTL_MS = 15 * 60 * 1000; // 15 min fresca

/**
 * Lee de caché o ejecuta `loader` y guarda el resultado.
 * @returns datos + flags de frescura.
 */
export async function getOrLoad<T>(
  key: string,
  loader: () => Promise<T>,
): Promise<{ data: T; stale: boolean; cachedAt: string; staleHours: number }> {
  const now = Date.now();
  const hit = store.get(key) as Entry<T> | undefined;
  const fresh = hit && now - hit.at < TTL_MS;
  if (fresh && hit) {
    return { data: hit.data, stale: false, cachedAt: new Date(hit.at).toISOString(), staleHours: 0 };
  }
  try {
    const data = await loader();
    store.set(key, { at: now, data });
    return { data, stale: false, cachedAt: new Date(now).toISOString(), staleHours: 0 };
  } catch (err) {
    if (hit) {
      const staleHours = Math.round(((now - hit.at) / 3_600_000) * 10) / 10;
      return { data: hit.data, stale: true, cachedAt: new Date(hit.at).toISOString(), staleHours };
    }
    throw err;
  }
}
