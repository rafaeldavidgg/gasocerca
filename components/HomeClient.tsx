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

const Mapa = dynamic(() => import("@/components/MapaGasolineras"), {
  ssr: false,
  loading: () => (
    <div className="grid h-72 place-items-center rounded-xl bg-neutral-100 dark:bg-neutral-900" role="status">
      Cargando mapa…
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
    api.productos().then((p) => setProductos(p)).catch(() => {});
    api.provincias().then(setProvincias).catch(() => {});
  }, []);

  useEffect(() => {
    if (!idProv) return setMunicipios([]);
    api.municipios(idProv).then(setMunicipios).catch(() => setMunicipios([]));
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
      { enableHighAccuracy: true, timeout: 10_000 },
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
      setError("No se pudo contactar con el Ministerio (MITERD). Comprueba tu conexión y reintenta.");
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
      dist: g.lat != null && g.lng != null && loc ? haversineKm(loc.lat, loc.lng, g.lat, g.lng) : null,
    }));
    if (ocultarSinPrecio) arr = arr.filter((x) => x.precio != null);
    if (solo24h) arr = arr.filter((x) => es24h(x.g.horario));
    if (soloFav) arr = arr.filter((x) => favs.includes(x.g.ideess));
    if (loc) arr = arr.filter((x) => x.dist == null || x.dist <= radio);
    arr.sort((a, b) =>
      orden === "precio"
        ? (a.precio ?? Infinity) - (b.precio ?? Infinity)
        : (a.dist ?? Infinity) - (b.dist ?? Infinity),
    );
    return arr;
  }, [data, producto, nombreProducto, loc, radio, orden, solo24h, ocultarSinPrecio, soloFav, favs]);

  const masBarata = lista[0];
  /** Clave que identifica cada búsqueda: solo entonces el mapa reajusta el zoom. */
  const ajustarKey = `${data?.cachedAt ?? "nada"}|${data?.count ?? 0}|${loc ? `${loc.lat.toFixed(4)},${loc.lng.toFixed(4)}` : "sin-loc"}`;

  return (
    <div className="space-y-4">
      <section className="rounded-2xl bg-gradient-to-br from-energia-600 to-energia-800 p-5 text-white sm:p-6">
        <h1 className="text-2xl font-extrabold sm:text-3xl">La gasolina más barata, cerca de ti</h1>
        <p className="mt-1 text-white/90">
          Precios oficiales del Ministerio, actualizados a diario. Sin registro y gratis.
        </p>
      </section>

      {data && (
        <p className="rounded-xl bg-neutral-100 px-3 py-2 text-sm dark:bg-neutral-900" role="status">
          📅 Actualización del Ministerio: <strong>{data.fecha || "—"}</strong> · {data.count} estaciones
          {data.stale && (
            <span className="ml-2 rounded bg-amber-200 px-2 py-0.5 text-amber-900">
              Aviso: el Ministerio falla ahora mismo; mostramos datos de hace {data.staleHours} h
            </span>
          )}
        </p>
      )}
      {geoError && (
        <p className="rounded-xl bg-amber-100 px-3 py-2 text-sm text-amber-900" role="alert">
          ⚠️ {geoError}
        </p>
      )}

      <section aria-label="Filtros de búsqueda" className="grid gap-3 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="grid gap-1 text-sm">
            Carburante
            <select
              className="rounded-lg border border-neutral-300 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-900"
              value={producto}
              onChange={(e) => {
                const id = e.target.value;
                setProducto(id);
                setNombreProducto(etiquetaProducto(id, productos.find((p) => p.IDProducto === id)?.NombreProducto));
                buscarDebounced({ pr: id });
              }}
            >
              {(productos.length ? productos : [{ IDProducto: "1", NombreProducto: "Gasolina 95 E5", NombreProductoAbreviatura: "" }, { IDProducto: "4", NombreProducto: "Gasóleo A", NombreProductoAbreviatura: "" }]).map((p) => (
                <option key={p.IDProducto} value={p.IDProducto}>
                  {p.NombreProducto}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            Provincia
            <select
              className="rounded-lg border border-neutral-300 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-900"
              value={idProv}
              onChange={(e) => { setIdProv(e.target.value); setIdMuni(""); setLoc(null); buscarDebounced({ p: e.target.value }); }}
            >
              <option value="">Todas</option>
              {provincias.map((p) => (
                <option key={p.IDPovincia} value={p.IDPovincia}>{p.Provincia}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            Municipio
            <select
              className="rounded-lg border border-neutral-300 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-900"
              value={idMuni}
              disabled={!idProv}
              onChange={(e) => { setIdMuni(e.target.value); setLoc(null); buscarDebounced({ p: idProv, m: e.target.value }); }}
            >
              <option value="">Todos</option>
              {municipios.map((m) => (
                <option key={m.IDMunicipio} value={m.IDMunicipio}>{m.Municipio}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button onClick={usarUbicacion} className="rounded-full bg-energia-600 px-4 py-2 font-semibold text-white hover:bg-energia-700">
            📍 Usar mi ubicación
          </button>
          <div role="group" aria-label="Radio de búsqueda en kilómetros" className="flex flex-wrap gap-1">
            {RADIOS.map((r) => (
              <button
                key={r}
                onClick={() => setRadio(r)}
                aria-pressed={radio === r}
                className={`rounded-full border px-3 py-1 ${radio === r ? "border-energia-600 bg-energia-100 font-bold dark:bg-energia-900" : "border-neutral-300 dark:border-neutral-700"}`}
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
          <label className="ml-1 flex items-center gap-1">
            Orden
            <select value={orden} onChange={(e) => setOrden(e.target.value as Orden)} className="rounded-lg border border-neutral-300 bg-white p-1.5 dark:border-neutral-700 dark:bg-neutral-900">
              <option value="precio">Más baratas</option>
              <option value="distancia">Más cercanas</option>
            </select>
          </label>
          <button onClick={() => void buscar()} disabled={loading} className="rounded-full bg-neutral-900 px-5 py-2 font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900">
            {loading ? "Buscando…" : "Buscar"}
          </button>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <label className="flex items-center gap-1.5"><input type="checkbox" checked={solo24h} onChange={(e) => setSolo24h(e.target.checked)} className="h-4 w-4 accent-green-600" /> Solo 24 h</label>
          <label className="flex items-center gap-1.5"><input type="checkbox" checked={ocultarSinPrecio} onChange={(e) => setOcultarSinPrecio(e.target.checked)} className="h-4 w-4 accent-green-600" /> Ocultar sin precio</label>
          <label className="flex items-center gap-1.5"><input type="checkbox" checked={soloFav} onChange={(e) => setSoloFav(e.target.checked)} className="h-4 w-4 accent-green-600" /> ⭐ Solo favoritas</label>
        </div>
      </section>

      {loading && <p role="status" className="py-6 text-center">⏳ Cargando precios oficiales…</p>}
      {error && <p role="alert" className="rounded-xl bg-red-100 px-3 py-2 text-red-900">{error}</p>}

      {!loading && !error && data && lista.length === 0 && (
        <p className="rounded-xl border border-dashed border-neutral-300 p-6 text-center dark:border-neutral-700" role="status">
          Sin resultados con esos filtros. Prueba con más radio o quita “solo 24 h”.
        </p>
      )}
      {!loading && !error && !data && (
        <p className="rounded-xl border border-dashed border-neutral-300 p-6 text-center text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
          Elige provincia/municipio o pulsa <strong>Buscar</strong> para ver precios reales del Ministerio.
        </p>
      )}

      {lista.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <section aria-label="Mapa de gasolineras" className="lg:sticky lg:top-16 lg:self-start">
            <Mapa puntos={lista.slice(0, 200).map((x) => ({ g: x.g, precio: x.precio, dist: x.dist }))} loc={loc} idBarata={masBarata?.g.ideess} ajustarKey={ajustarKey} onCentrar={usarUbicacion} />
          </section>
          <section aria-label="Lista de gasolineras">
            <h2 className="mb-2 text-lg font-bold">
              {lista.length} gasolineras {loc ? `a menos de ${radio} km` : ""}
            </h2>
            <ul className="space-y-3">
              {lista.slice(0, visibles).map(({ g, precio, dist }) => {
                const esBarata = masBarata?.g.ideess === g.ideess;
                const fav = favs.includes(g.ideess);
                return (
                  <li key={g.ideess} className={`rounded-2xl border p-3 ${esBarata ? "border-energia-500 ring-2 ring-energia-400" : "border-neutral-200 dark:border-neutral-800"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold">
                          {esBarata && <span className="mr-1 rounded bg-energia-600 px-1.5 py-0.5 text-xs text-white">MÁS BARATA</span>}
                          {g.rotulo}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">{g.direccion} · {g.municipio} ({g.provincia})</p>
                        <p className="text-xs text-neutral-500">🕒 {g.horario || "—"}{dist != null && <> · 📍 {fmtDist(dist)}</>}</p>
                      </div>
                      <p className="text-right text-2xl font-extrabold text-energia-700 dark:text-energia-300" aria-label={`Precio ${fmtPrecio(precio)}`}>
                        {fmtPrecio(precio)}
                      </p>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm">
                      <Link href={`/estacion/${g.ideess}?provincia=${g.idProvincia}`} className="rounded-full border border-neutral-300 px-3 py-1 hover:underline dark:border-neutral-700">
                        Ver detalle
                      </Link>
                      <button onClick={() => setFavs(toggleFavorito(g.ideess))} aria-pressed={fav} aria-label={fav ? "Quitar de favoritas" : "Guardar en favoritas"} className="rounded-full border border-neutral-300 px-3 py-1 dark:border-neutral-700">
                        {fav ? "★ Guardada" : "☆ Guardar"}
                      </button>
                      <a href={enlaceWhatsApp(g.rotulo, fmtPrecio(precio), g.direccion)} target="_blank" rel="noopener noreferrer" className="rounded-full border border-neutral-300 px-3 py-1 dark:border-neutral-700">
                        Compartir por WhatsApp
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
            {visibles < lista.length && (
              <button onClick={() => setVisibles((v) => v + PAGE)} className="mt-3 w-full rounded-xl border border-neutral-300 p-3 font-semibold dark:border-neutral-700">
                Mostrar más ({lista.length - visibles} restantes)
              </button>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
