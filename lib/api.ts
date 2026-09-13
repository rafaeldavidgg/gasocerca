/**
 * Cliente HTTP del frontend hacia nuestro propio /api (nunca al MITERD).
 * @module lib/api
 */
import type { ApiEstaciones, CCAA, Municipio, Producto, Provincia } from "@/types";

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Error ${res.status} en ${url}`);
  return (await res.json()) as T;
}

export const api = {
  estaciones: (q: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(q)) if (v) p.set(k, v);
    const s = p.toString();
    return get<ApiEstaciones>(`/api/estaciones${s ? `?${s}` : ""}`);
  },
  ccaa: () => get<CCAA[]>("/api/listas?tipo=ccaa"),
  provincias: () => get<Provincia[]>("/api/listas?tipo=provincias"),
  municipios: (idProvincia: string) =>
    get<Municipio[]>(`/api/listas?tipo=municipios&idProvincia=${encodeURIComponent(idProvincia)}`),
  productos: () => get<Producto[]>("/api/listas?tipo=productos"),
};
