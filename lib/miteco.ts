/**
 * Cliente del MITERD (Ministerio para la Transición Ecológica) + normalización.
 * SOLO se usa en el servidor (Route Handlers). El navegador nunca llama al
 * Ministerio directamente (evita CORS y reduce tráfico).
 * @module lib/miteco
 */
import type {
  CCAA,
  Gasolinera,
  MitecoEESS,
  MitecoEstacionesResponse,
  Municipio,
  Producto,
  Provincia,
} from "@/types";
import { parseCoord } from "@/lib/geo";

const BASE =
  process.env.MITERD_BASE_URL ??
  "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/";

/** Claves que NO son precios dentro de cada estación. */
const NO_PRECIO = new Set([
  "IDEESS",
  "Rótulo",
  "Dirección",
  "C.P.",
  "Municipio",
  "Provincia",
  "CCAA",
  "IDCCAA",
  "IDProvincia",
  "IDMunicipio",
  "Horario",
  "Margen",
  "Remisión",
  "Tipo Venta",
  "Latitud",
  "Longitud (WGS84)",
  "% BioEtanol",
  "% Éster metílico",
]);

/**
 * Normaliza un precio del Ministerio: "1,589" -> 1.589, "" -> null.
 * @param raw valor crudo
 * @returns €/L con IVA o null si no venden ese carburante.
 */
export function normalizarPrecio(raw: string | undefined | null): number | null {
  if (raw == null) return null;
  const t = String(raw).trim();
  if (t === "") return null;
  const n = Number(t.replace(",", "."));
  return Number.isFinite(n) && n > 0 ? Math.round(n * 1000) / 1000 : null;
}

/**
 * Convierte una estación cruda del MITERD a nuestro modelo {@link Gasolinera}.
 */
export function normalizarEstacion(e: MitecoEESS): Gasolinera {
  const precios: Record<string, number | null> = {};
  for (const [k, v] of Object.entries(e)) {
    if (NO_PRECIO.has(k)) continue;
    if (!k.startsWith("Precio")) continue;
    precios[k] = normalizarPrecio(v);
  }
  // La longitud viene con clave rara; acceso defensivo.
  const lngRaw =
    e["Longitud (WGS84)"] ??
    (e as Record<string, string | undefined>)["Longitud_x0020__x0028_WGS84_x0029_"];
  return {
    ideess: e.IDEESS,
    rotulo: (e["Rótulo"] ?? "").trim(),
    direccion: (e["Dirección"] ?? "").trim(),
    cp: (e["C.P."] ?? "").trim(),
    municipio: (e.Municipio ?? "").trim(),
    provincia: (e.Provincia ?? "").trim(),
    idCCAA: e.IDCCAA ?? "",
    idProvincia: e.IDProvincia ?? "",
    idMunicipio: e.IDMunicipio ?? "",
    horario: (e.Horario ?? "").trim(),
    margen: (e.Margen ?? "").trim(),
    tipoVenta: (e["Tipo Venta"] ?? "").trim(),
    lat: parseCoord(e.Latitud),
    lng: parseCoord(lngRaw),
    precios,
  };
}

/** Hace fetch al Ministerio con timeout y user-agent. Lanza si falla. */
async function fetchMiteco<T>(path: string): Promise<T> {
  const url = new URL(path.replace(/^\//, ""), BASE).toString();
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 25_000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent": "GasoCerca/1.0 (+https://gasocercamia.vercel.app; contacto público vía GitHub)",
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`MITERD ${res.status} en ${path}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(t);
  }
}

/** Obtiene estaciones según filtro y las normaliza. */
export async function getEstaciones(opts: {
  idProvincia?: string;
  idMunicipio?: string;
  idProducto?: string;
}): Promise<{ fecha: string; estaciones: Gasolinera[] }> {
  const { idProvincia, idMunicipio, idProducto } = opts;
  let path = "EstacionesTerrestres/";
  if (idMunicipio) path = `EstacionesTerrestres/FiltroMunicipio/${idMunicipio}`;
  else if (idProvincia && idProducto)
    path = `EstacionesTerrestres/FiltroProvinciaProducto/${idProvincia}/${idProducto}`;
  else if (idProvincia) path = `EstacionesTerrestres/FiltroProvincia/${idProvincia}`;
  else if (idProducto) path = `EstacionesTerrestres/FiltroProducto/${idProducto}`;
  const data = await fetchMiteco<MitecoEstacionesResponse>(path);
  return {
    fecha: data.Fecha ?? "",
    estaciones: (data.ListaEESSPrecio ?? []).map(normalizarEstacion),
  };
}

export async function getCCAA(): Promise<CCAA[]> {
  return fetchMiteco<CCAA[]>("Listados/ComunidadesAutonomas/");
}
export async function getProvincias(): Promise<Provincia[]> {
  return fetchMiteco<Provincia[]>("Listados/Provincias/");
}
export async function getMunicipios(idProvincia: string): Promise<Municipio[]> {
  return fetchMiteco<Municipio[]>(`Listados/MunicipiosPorProvincia/${idProvincia}`);
}
export async function getProductos(): Promise<Producto[]> {
  return fetchMiteco<Producto[]>("Listados/ProductosPetroliferos/");
}
