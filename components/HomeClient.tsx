"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { ApiEstaciones, Gasolinera, Municipio, Orden, Producto, Provincia } from "@/types";
import { api } from "@/lib/api";
import { haversineKm } from "@/lib/geo";
import {
  PRECIO_KEY_POR_PRODUCTO,
  enlaceWhatsApp,
  es24h,
  etiquetaProducto,
  fmtDist,
  fmtPrecio,
  leerFavoritos,
  toggleFavorito,
} from "@/lib/app";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Empty } from "@/components/ui/empty";
import { Field, FieldSelect } from "@/components/ui/field";

const Mapa = dynamic(() => import("@/components/MapaGasolineras"), {
  ssr: false,
  loading: () => (
    <div
      className="gc-ticket grid h-72 place-items-center rounded-ticket bg-white dark:bg-neutral-950"
      role="status"
    >
      <p className="font-display uppercase tracking-wide">Cargando mapa…</p>
    </div>
  ),
});

const RADIOS = [3, 5, 10, 25, 50];
const PAGE = 20;

/** Clave de precio MITERD para un producto (con fallback por nombre). */
function precioDe(g: Gasolinera, idProducto: string, nombre?: string): number | null {
  const key = PRECIO_KEY_POR_PRODUCTO[idProducto];
  if (key && g.precios[key] != null) return g.precios[key] ?? null;
  if (nombre && g.precios[`Precio ${nombre}`] != null) return g.precios[`Precio ${nombre}`] ?? null;
  // Último recurso: primer precio disponible que contenga parte del nombre
  const vals = Object.entries(g.precios).filter(([, v]) => v != null) as [string, number][];
  if (!nombre) return vals[0]?.[1] ?? null;
  const hint = nombre.split(" ")[0]?.toLowerCase() ?? "";
  return vals.find(([k]) => k.toLowerCase().includes(hint))?.[1] ?? vals[0]?.[1] ?? null;
}

/** Página principal: buscador + lista + mapa. */
export default function HomeClient() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  const [producto, setProducto] = useState("1");
  const [nombreProducto, setNombreProducto] = useState("Gasolina 95 E5");
  const [idProv, setIdProv] = useState("");
  const [idMuni, setIdMuni] = useState("");
  const [radio, setRadio] = useState(10);
  const [orden, setOrden] = useState<Orden>("precio");
  const [solo24h, setSolo24h] = useState(false);
  const [ocultarSinPrecio, setOcultarSinPrecio] = useState(true);
  const [soloFav, setSoloFav] = useState(false);
  const [favs, setFavs] = useState<string[]>([]);
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState("");

  const [data, setData] = useState<ApiEstaciones | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visibles, setVisibles] = useState(PAGE);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setFavs(leerFavoritos());
    api
      .productos()
      .then((p) => setProductos(p))
      .catch(() => {});
    api
      .provincias()
      .then(setProvincias)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!idProv) return setMunicipios([]);
    api
      .municipios(idProv)
      .then(setMunicipios)
      .catch(() => setMunicipios([]));
  }, [idProv]);

  const usarUbicacion = () => {
    setGeoError("");
    if (!navigator.geolocation) return setGeoError("Tu navegador no soporta geolocalización.");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        // Modo "cerca de mí": se limpia el territorio y se busca directo por radio.
        setIdProv("");
        setIdMuni("");
        void buscar({ p: "", m: "" });
      },
      () => setGeoError("Geolocalización denegada. Activa el permiso o busca por municipio."),
      { enableHighAccuracy: true, timeout: 10_000 }
    );
  };

  const buscar = async (override?: { p?: string; m?: string; pr?: string }) => {
    setLoading(true);
    setError("");
    setVisibles(PAGE);
    try {
      const res = await api.estaciones({
        idProvincia: override?.p ?? idProv ?? undefined,
        idMunicipio: override?.m ?? idMuni ?? undefined,
        idProducto: (override?.pr ?? producto) || undefined,
      });
      setData(res);
    } catch {
      setError(
        "No se pudo contactar con el Ministerio (MITERD). Comprueba tu conexión y reintenta."
      );
    } finally {
      setLoading(false);
    }
  };

  // Búsqueda con debounce al cambiar filtros de territorio/producto
  const buscarDebounced = (o?: { p?: string; m?: string; pr?: string }) => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => void buscar(o), 350);
  };

  const lista = useMemo(() => {
    if (!data) return [];
    let arr = data.estaciones.map((g) => ({
      g,
      precio: precioDe(g, producto, nombreProducto),
      dist:
        g.lat != null && g.lng != null && loc ? haversineKm(loc.lat, loc.lng, g.lat, g.lng) : null,
    }));
    if (ocultarSinPrecio) arr = arr.filter((x) => x.precio != null);
    if (solo24h) arr = arr.filter((x) => es24h(x.g.horario));
    if (soloFav) arr = arr.filter((x) => favs.includes(x.g.ideess));
    if (loc) arr = arr.filter((x) => x.dist == null || x.dist <= radio);
    arr.sort((a, b) =>
      orden === "precio"
        ? (a.precio ?? Infinity) - (b.precio ?? Infinity)
        : (a.dist ?? Infinity) - (b.dist ?? Infinity)
    );
    return arr;
  }, [data, producto, nombreProducto, loc, radio, orden, solo24h, ocultarSinPrecio, soloFav, favs]);

  const precioMinimo = useMemo(() => {
    let min: number | null = null;
    for (const x of lista) {
      if (x.precio == null) continue;
      if (min == null || x.precio < min) min = x.precio;
    }
    return min;
  }, [lista]);
  /** Clave que identifica cada búsqueda: solo entonces el mapa reajusta el zoom. */
  const ajustarKey = `${data?.cachedAt ?? "nada"}|${data?.count ?? 0}|${loc ? `${loc.lat.toFixed(4)},${loc.lng.toFixed(4)}` : "sin-loc"}`;

  return (
    <div className="space-y-4">
      <section className="gc-ticket overflow-hidden rounded-ticket bg-tinta text-papel">
        <div className="border-b-2 border-dashed border-papel/25 px-5 pb-4 pt-5 sm:px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-energia-300">
            Poste de precios · Datos MITERD
          </p>
          <h1 className="gc-display mt-1 break-words font-display text-3xl uppercase leading-[0.95] sm:text-5xl">
            La mas barata, <span className="text-energia-300">cerca de ti</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-papel/80">
            Precios oficiales del Ministerio, actualizados a diario. Sin registro y gratis.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-widest sm:px-6">
          <span className="rounded-md bg-energia-600 px-2 py-1 text-white">MITERD oficial</span>
          <span className="rounded-md bg-papel/10 px-2 py-1 text-papel/80">Sin registro</span>
          <span className="rounded-md bg-papel/10 px-2 py-1 text-papel/80">Gratis</span>
        </div>
      </section>

      {data && (
        <Alert tono={data.stale ? "warning" : "info"}>
          <p>
            📅 Actualización del Ministerio: <strong className="gc-num">{data.fecha || "—"}</strong>{" "}
            · <span className="gc-num">{data.count}</span> estaciones
            {data.stale && (
              <span className="ml-2 rounded-md border-2 border-tinta bg-white px-2 py-0.5 font-bold text-tinta">
                Aviso: el Ministerio falla ahora mismo; mostramos datos de hace {data.staleHours} h
              </span>
            )}
          </p>
        </Alert>
      )}
      {geoError && (
        <Alert tono="warning">
          <p>⚠️ {geoError}</p>
        </Alert>
      )}

      <Card aria-label="Filtros de búsqueda" className="grid gap-4 p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Carburante">
            <FieldSelect
              value={producto}
              onChange={(e) => {
                const id = e.target.value;
                setProducto(id);
                setNombreProducto(
                  etiquetaProducto(id, productos.find((p) => p.IDProducto === id)?.NombreProducto)
                );
                buscarDebounced({ pr: id });
              }}
            >
              {(productos.length
                ? productos
                : [
                    {
                      IDProducto: "1",
                      NombreProducto: "Gasolina 95 E5",
                      NombreProductoAbreviatura: "",
                    },
                    { IDProducto: "4", NombreProducto: "Gasóleo A", NombreProductoAbreviatura: "" },
                  ]
              ).map((p) => (
                <option key={p.IDProducto} value={p.IDProducto}>
                  {p.NombreProducto}
                </option>
              ))}
            </FieldSelect>
          </Field>
          <Field label="Provincia">
            <FieldSelect
              value={idProv}
              onChange={(e) => {
                setIdProv(e.target.value);
                setIdMuni("");
                setLoc(null);
                buscarDebounced({ p: e.target.value });
              }}
            >
              <option value="">Todas</option>
              {provincias.map((p) => (
                <option key={p.IDPovincia} value={p.IDPovincia}>
                  {p.Provincia}
                </option>
              ))}
            </FieldSelect>
          </Field>
          <Field label="Municipio">
            <FieldSelect
              value={idMuni}
              disabled={!idProv}
              onChange={(e) => {
                setIdMuni(e.target.value);
                setLoc(null);
                buscarDebounced({ p: idProv, m: e.target.value });
              }}
            >
              <option value="">Todos</option>
              {municipios.map((m) => (
                <option key={m.IDMunicipio} value={m.IDMunicipio}>
                  {m.Municipio}
                </option>
              ))}
            </FieldSelect>
          </Field>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Button
            variante="primary"
            onClick={usarUbicacion}
            className="min-h-[44px] w-full sm:w-auto"
          >
            📍 Usar mi ubicación
          </Button>
          <div
            role="group"
            aria-label="Radio de búsqueda en kilómetros"
            className="flex flex-wrap gap-1.5"
          >
            {RADIOS.map((r) => (
              <button
                key={r}
                onClick={() => setRadio(r)}
                aria-pressed={radio === r}
                className={`gc-press rounded-full border-2 px-3 py-1 font-mono text-sm ${
                  radio === r
                    ? "border-tinta bg-tinta text-white shadow-sticker"
                    : "border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900"
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
          {loc && (
            <span className="text-neutral-600 dark:text-neutral-400">
              Mostrando a menos de {radio} km de ti
            </span>
          )}
          <label className="ml-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neutral-500">
            Orden
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value as Orden)}
              className="rounded-xl border-2 border-tinta bg-white px-2 py-1.5 text-sm normal-case shadow-sticker dark:border-neutral-600 dark:bg-neutral-900"
            >
              <option value="precio">Más baratas</option>
              <option value="distancia">Más cercanas</option>
            </select>
          </label>
          <Button
            variante="dark"
            onClick={() => void buscar()}
            disabled={loading}
            className="min-h-[44px] w-full sm:w-auto"
          >
            {loading ? "Buscando…" : "Buscar"}
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 border-t-2 border-dashed border-tinta/20 pt-3 text-sm">
          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="checkbox"
              checked={solo24h}
              onChange={(e) => setSolo24h(e.target.checked)}
              className="h-4 w-4 accent-green-700"
            />{" "}
            Solo 24 h
          </label>
          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="checkbox"
              checked={ocultarSinPrecio}
              onChange={(e) => setOcultarSinPrecio(e.target.checked)}
              className="h-4 w-4 accent-green-700"
            />{" "}
            Ocultar sin precio
          </label>
          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="checkbox"
              checked={soloFav}
              onChange={(e) => setSoloFav(e.target.checked)}
              className="h-4 w-4 accent-green-700"
            />{" "}
            ⭐ Solo favoritas
          </label>
        </div>
      </Card>

      {loading && (
        <div
          role="status"
          className="gc-ticket rounded-ticket bg-white p-6 text-center dark:bg-neutral-950"
        >
          <p className="font-display uppercase tracking-wide">⏳ Cargando precios oficiales…</p>
        </div>
      )}
      {error && (
        <Alert tono="danger">
          <p>{error}</p>
          <button onClick={() => void buscar()} className="ml-auto font-bold underline">
            Reintentar
          </button>
        </Alert>
      )}

      {!loading && !error && data && lista.length === 0 && (
        <Empty
          icono="🛣️"
          titulo="Sin resultados"
          texto="Prueba con más radio o quita “solo 24 h”."
        />
      )}
      {!loading && !error && !data && (
        <Empty
          icono="⛽"
          titulo="Elige y busca"
          texto={
            <>
              Elige provincia/municipio o pulsa <strong>Buscar</strong> para ver precios reales del
              Ministerio.
            </>
          }
        />
      )}

      {lista.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <section aria-label="Mapa de gasolineras" className="lg:sticky lg:top-24 lg:self-start">
            <Mapa
              puntos={lista.slice(0, 200).map((x) => ({ g: x.g, precio: x.precio, dist: x.dist }))}
              loc={loc}
              precioMinimo={precioMinimo}
              ajustarKey={ajustarKey}
              onCentrar={usarUbicacion}
            />
          </section>
          <section aria-label="Lista de gasolineras">
            <h2 className="mb-2 font-display text-xl uppercase tracking-wide">
              <span className="gc-num">{lista.length}</span> gasolineras{" "}
              {loc ? `a menos de ${radio} km` : ""}
            </h2>
            <ul className="space-y-3">
              {lista.slice(0, visibles).map(({ g, precio, dist }) => {
                const esBarata = precio != null && precioMinimo != null && precio === precioMinimo;
                const fav = favs.includes(g.ideess);
                return (
                  <li
                    key={g.ideess}
                    className={`gc-ticket rounded-ticket p-3 ${esBarata ? "bg-energia-50 dark:bg-energia-900/30" : "bg-white dark:bg-neutral-950"}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold leading-tight">
                          {esBarata && (
                            <span className="gc-sticker mr-2 inline-block rounded-md bg-energia-600 px-1.5 py-0.5 align-middle text-[11px] font-bold uppercase tracking-widest text-white">
                              Más barata
                            </span>
                          )}
                          {g.rotulo}
                        </p>
                        <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">
                          {g.direccion} · {g.municipio} ({g.provincia})
                        </p>
                        <p className="mt-0.5 text-xs text-neutral-500">
                          🕒 {g.horario || "—"}
                          {dist != null && (
                            <>
                              {" "}
                              · 📍 <span className="gc-num font-mono">{fmtDist(dist)}</span>
                            </>
                          )}
                        </p>
                      </div>
                      <p
                        className="gc-num shrink-0 text-right font-mono text-xl font-bold text-energia-700 dark:text-energia-300 sm:text-2xl"
                        aria-label={`Precio ${fmtPrecio(precio)}`}
                      >
                        {fmtPrecio(precio)}
                      </p>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 border-t-2 border-dashed border-tinta/15 pt-2 text-sm">
                      <Link
                        href={`/estacion/${g.ideess}?provincia=${g.idProvincia}`}
                        className="gc-press rounded-full border-2 border-tinta bg-white px-3 py-1 font-semibold shadow-sticker dark:border-neutral-600 dark:bg-neutral-900"
                      >
                        Ver detalle
                      </Link>
                      <button
                        onClick={() => setFavs(toggleFavorito(g.ideess))}
                        aria-pressed={fav}
                        aria-label={fav ? "Quitar de favoritas" : "Guardar en favoritas"}
                        className="gc-press rounded-full border-2 border-tinta bg-white px-3 py-1 shadow-sticker dark:border-neutral-600 dark:bg-neutral-900"
                      >
                        {fav ? "★ Guardada" : "☆ Guardar"}
                      </button>
                      <a
                        href={enlaceWhatsApp(g.rotulo, fmtPrecio(precio), g.direccion)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gc-press rounded-full border-2 border-tinta bg-energia-600 px-3 py-1 font-semibold text-white shadow-sticker"
                      >
                        Compartir
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
            {visibles < lista.length && (
              <Button
                variante="ghost"
                onClick={() => setVisibles((v) => v + PAGE)}
                className="mt-3 w-full"
              >
                Mostrar más ({lista.length - visibles} restantes)
              </Button>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
