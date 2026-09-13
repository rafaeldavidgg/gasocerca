/**
 * Constantes y helpers de formato/favoritos de la app.
 * @module lib
 */

/** Cabecera de caché pública para Vercel Edge (15 min + SWR 15 min). */
export const CACHE_CONTROL = "public, s-maxage=900, stale-while-revalidate=900";

/** Productos más usados, para preselección si la API de listados falla. */
export const PRODUCTOS_FALLBACK = [
  { IDProducto: "1", NombreProducto: "Gasolina 95 E5", NombreProductoAbreviatura: "G95E5" },
  { IDProducto: "3", NombreProducto: "Gasolina 98 E5", NombreProductoAbreviatura: "G98E5" },
  { IDProducto: "4", NombreProducto: "Gasóleo A", NombreProductoAbreviatura: "GOA" },
  { IDProducto: "5", NombreProducto: "Gasóleo Premium", NombreProductoAbreviatura: "NGO" },
  { IDProducto: "17", NombreProducto: "GLP", NombreProductoAbreviatura: "GLP" },
];

/** Clave exacta del precio en el MITERD para cada producto habitual. */
export const PRECIO_KEY_POR_PRODUCTO: Record<string, string> = {
  "1": "Precio Gasolina 95 E5",
  "3": "Precio Gasolina 98 E5",
  "4": "Precio Gasoleo A",
  "5": "Precio Gasoleo Premium",
  "6": "Precio Gasoleo B",
  "8": "Precio Bioetanol",
  "10": "Precio Biodiesel",
  "11": "Precio Gases licuados del petróleo",
  "12": "Precio Gas Natural Comprimido",
  "13": "Precio Gas Natural Licuado",
  "15": "Precio Gasoleo C",
  "16": "Precio Bioetanol",
  "17": "Precio Gases licuados del petróleo",
  "20": "Precio Hidrogeno",
};

/** Etiqueta corta legible para un ID de producto. */
export function etiquetaProducto(id: string, nombre?: string): string {
  if (nombre) return nombre;
  const f = PRODUCTOS_FALLBACK.find((p) => p.IDProducto === id);
  return f ? f.NombreProducto : `Producto ${id}`;
}

/** Formatea €/L con 3 decimales españoles. */
export function fmtPrecio(v: number | null | undefined): string {
  if (v == null) return "—";
  return `${v.toFixed(3).replace(".", ",")} €/L`;
}

/** Formatea distancia en km. */
export function fmtDist(km: number | null | undefined): string {
  if (km == null || !Number.isFinite(km)) return "";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1).replace(".", ",")} km`;
}

/** ¿Horario 24h? El MITERD usa "L-D: 24H". */
export function es24h(horario: string): boolean {
  return /24\s*h/i.test(horario ?? "");
}

/** ¿Rótulo low-cost? Heurística por nombre. */
export function esLowCost(rotulo: string): boolean {
  return /PLENOIL|PETROPRIX|BALLENOIL|GASEXPRESS|LOW\s*COST|E\.LECLERC|ALCAMPO|CARREFOUR|COSTCO|BONAREA/i.test(
    rotulo ?? "",
  );
}

const FAV_KEY = "gasocerca:favoritos:v1";

/** Lee favoritos (IDEESS) de localStorage. */
export function leerFavoritos(): string[] {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** Alterna un favorito y devuelve la lista nueva. */
export function toggleFavorito(ideess: string): string[] {
  const cur = leerFavoritos();
  const next = cur.includes(ideess) ? cur.filter((x) => x !== ideess) : [...cur, ideess];
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify(next));
  } catch {
    /* almacenamiento lleno/bloqueado: ignorar */
  }
  return next;
}

/** Enlace para compartir una gasolinera por WhatsApp. */
export function enlaceWhatsApp(rotulo: string, precio: string, direccion: string): string {
  const texto = `⛽ ${rotulo} a ${precio} (${direccion}) — visto en GasoCerca`;
  return `https://wa.me/?text=${encodeURIComponent(texto)}`;
}
