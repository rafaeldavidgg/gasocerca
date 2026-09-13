/**
 * Tipos centrales de GasoCerca.
 * @module types
 */

/** Respuesta cruda del MITERD para estaciones. */
export interface MitecoEstacionesResponse {
  Fecha: string;
  ListaEESSPrecio: MitecoEESS[];
  Nota?: string;
  ResultadoConsulta?: string;
}

/**
 * Estación tal y como la devuelve el Ministerio.
 * Los precios usan coma decimal ("1,589") y "" si no venden ese carburante.
 * La longitud viene en la clave "Longitud (WGS84)".
 */
export interface MitecoEESS {
  IDEESS: string;
  "Rótulo": string;
  "Dirección": string;
  "C.P.": string;
  Municipio: string;
  Provincia: string;
  CCAA?: string;
  IDCCAA: string;
  IDProvincia: string;
  IDMunicipio: string;
  Horario: string;
  Margen: string;
  Remisión?: string;
  "Tipo Venta"?: string;
  Latitud: string;
  "Longitud (WGS84)": string;
  [precioKey: string]: string | undefined;
}

/** Gasolinera normalizada para la app (precios como number|null). */
export interface Gasolinera {
  ideess: string;
  rotulo: string;
  direccion: string;
  cp: string;
  municipio: string;
  provincia: string;
  idCCAA: string;
  idProvincia: string;
  idMunicipio: string;
  horario: string;
  margen: string;
  tipoVenta: string;
  lat: number | null;
  lng: number | null;
  /** Precios en €/L con IVA, clave = nombre oficial del producto. */
  precios: Record<string, number | null>;
  /** Distancia en km calculada en cliente (Haversine). */
  distanciaKm?: number | null;
}

export interface CCAA {
  IDCCAA: string;
  CCAA: string;
}

export interface Provincia {
  IDPovincia: string;
  IDCCAA: string;
  Provincia: string;
  CCAA: string;
}

export interface Municipio {
  IDMunicipio: string;
  IDProvincia: string;
  IDCCAA: string;
  Municipio: string;
  Provincia: string;
  CCAA: string;
}

export interface Producto {
  IDProducto: string;
  NombreProducto: string;
  NombreProductoAbreviatura: string;
}

/** Respuesta de nuestro proxy /api/estaciones. */
export interface ApiEstaciones {
  fecha: string;
  cachedAt: string;
  stale: boolean;
  staleHours?: number;
  count: number;
  estaciones: Gasolinera[];
}

export type Orden = "precio" | "distancia";
