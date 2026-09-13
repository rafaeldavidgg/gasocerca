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

function pin(color: string, grande: boolean) {
  return L.divIcon({
    className: "",
    html: `<div style="background:${color};color:#fff;font-weight:800;border-radius:9999px;padding:${grande ? "8px 10px" : "5px 7px"};font-size:${grande ? 16 : 13}px;border:2px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.4)">⛽</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function Centrar({ loc }: { loc: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (loc) map.flyTo([loc.lat, loc.lng], 12, { duration: 0.8 });
  }, [loc, map]);
  return null;
}

/** Mapa OSM con pines. La más barata en verde grande, resto en gris. */
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
    loc ? [loc.lat, loc.lng] : conCoord[0]?.g.lat != null ? [conCoord[0].g.lat as number, conCoord[0].g.lng as number] : [40.4168, -3.7038];

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <MapContainer center={centro} zoom={loc ? 12 : 6} scrollWheelZoom={false} className="h-72 w-full sm:h-96" aria-label="Mapa de gasolineras">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Centrar loc={loc} />
        {loc && <Marker position={[loc.lat, loc.lng]} icon={pin("#2563eb", true)}><Popup>📍 Estás aquí</Popup></Marker>}
        {conCoord.map(({ g, precio, dist }) => (
          <Marker
            key={g.ideess}
            position={[g.lat as number, g.lng as number]}
            icon={pin(g.ideess === idBarata ? "#16a34a" : "#525252", g.ideess === idBarata)}
          >
            <Popup>
              <strong>{g.rotulo}</strong>
              <br />{fmtPrecio(precio)}{dist != null && ` · ${fmtDist(dist)}`}
              <br />{g.direccion}, {g.municipio}
              <br /><a href={`/estacion/${g.ideess}?provincia=${g.idProvincia}`}>Ver detalle →</a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <button onClick={onCentrar} className="w-full bg-neutral-100 p-2 text-sm font-semibold hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800">
        🎯 Centrar en mi ubicación
      </button>
    </div>
  );
}
