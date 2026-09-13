"use client";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Gasolinera } from "@/types";
import { fmtDist, fmtPrecio } from "@/lib/app";

export interface Punto {
  g: Gasolinera;
  precio: number | null;
  dist: number | null;
}

/** Precio corto para caber dentro del pin ("1,589"). */
function precioCorto(v: number | null): string {
  if (v == null) return "s/p";
  return v.toFixed(3).replace(".", ",");
}

/**
 * Pin de gasolinera con el precio dentro.
 * La ganadora (más barata) es verde con estrella; el resto, píldora blanca con borde gris.
 * El `iconSize` coincide con el contenido para que Leaflet no lo deforme ni lo recorte.
 */
function iconoEstacion(precio: number | null, ganadora: boolean): L.DivIcon {
  const html = ganadora
    ? `<div class="gc-pin gc-pin-ganadora" role="presentation"><span class="gc-pin-ico" aria-hidden="true">★</span><span>${precioCorto(precio)}</span></div>`
    : `<div class="gc-pin" role="presentation"><span class="gc-pin-ico" aria-hidden="true">⛽</span><span>${precioCorto(precio)}</span></div>`;
  // Ancho aproximado según nº de caracteres para que el ancla quede centrada.
  const w = ganadora ? 86 : 78;
  const h = ganadora ? 36 : 32;
  return L.divIcon({
    className: "gc-divicon",
    html,
    iconSize: [w, h],
    iconAnchor: [w / 2, h + 7], // punta inferior del pin
    popupAnchor: [0, -(h + 7)],
  });
}

/**
 * Punto azul pulsante estilo "estás aquí" (como Google Maps),
 * totalmente distinto de los pines de gasolinera.
 */
function iconoUsuario(): L.DivIcon {
  return L.divIcon({
    className: "gc-divicon",
    html: `<div class="gc-user" role="presentation"><span class="gc-user-halo"></span><span class="gc-user-dot"></span></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

function Centrar({ loc }: { loc: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (loc) map.flyTo([loc.lat, loc.lng], 12, { duration: 0.8 });
  }, [loc, map]);
  return null;
}

/** Mapa OSM con pines de precio. La más barata destaca en verde con ★. */
export default function MapaGasolineras({
  puntos,
  loc,
  idBarata,
  onCentrar,
}: {
  puntos: Punto[];
  loc: { lat: number; lng: number } | null;
  idBarata?: string;
  onCentrar: () => void;
}) {
  const conCoord = puntos.filter((p) => p.g.lat != null && p.g.lng != null);
  const centro: [number, number] =
    loc
      ? [loc.lat, loc.lng]
      : conCoord[0]?.g.lat != null
        ? [conCoord[0].g.lat as number, conCoord[0].g.lng as number]
        : [40.4168, -3.7038];

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <MapContainer
        center={centro}
        zoom={loc ? 12 : 6}
        scrollWheelZoom={false}
        className="h-72 w-full sm:h-96"
        aria-label="Mapa de gasolineras"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Centrar loc={loc} />
        {loc && (
          <Marker position={[loc.lat, loc.lng]} icon={iconoUsuario()} zIndexOffset={2000}>
            <Popup>📍 Estás aquí</Popup>
          </Marker>
        )}
        {conCoord.map(({ g, precio, dist }) => {
          const ganadora = g.ideess === idBarata;
          return (
            <Marker
              key={g.ideess}
              position={[g.lat as number, g.lng as number]}
              icon={iconoEstacion(precio, ganadora)}
              zIndexOffset={ganadora ? 1000 : 0}
            >
              <Popup>
                <strong>
                  {ganadora && "★ Más barata · "}
                  {g.rotulo}
                </strong>
                <br />
                {fmtPrecio(precio)}
                {dist != null && ` · ${fmtDist(dist)}`}
                <br />
                {g.direccion}, {g.municipio}
                <br />
                <a href={`/estacion/${g.ideess}?provincia=${g.idProvincia}`}>Ver detalle →</a>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <div
        className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400"
        aria-label="Leyenda del mapa"
      >
        <span className="flex items-center gap-1.5">
          <span className="gc-legend gc-legend-ganadora" aria-hidden="true">★</span> Más barata
        </span>
        <span className="flex items-center gap-1.5">
          <span className="gc-legend" aria-hidden="true">⛽</span> Gasolinera
        </span>
        <span className="flex items-center gap-1.5">
          <span className="gc-legend-user" aria-hidden="true" />
          Tu ubicación
        </span>
      </div>
      <button
        onClick={onCentrar}
        className="w-full bg-neutral-100 p-2 text-sm font-semibold hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
      >
        🎯 Centrar en mi ubicación
      </button>
    </div>
  );
}
