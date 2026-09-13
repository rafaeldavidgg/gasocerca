"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fmtPrecio } from "@/lib/app";
import type { Gasolinera } from "@/types";

/** Vista detalle de una gasolinera por IDEESS. */
export default function EstacionPage({
  params,
  searchParams,
}: {
  params: { ideess: string };
  searchParams: { provincia?: string };
}) {
  const [g, setG] = useState<Gasolinera | null>(null);
  const [fecha, setFecha] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const prov = searchParams.provincia ? `?idProvincia=${searchParams.provincia}` : "";
    fetch(`/api/estacion/${params.ideess}${prov}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((j) => {
        setG(j.estacion);
        setFecha(j.fecha ?? "");
      })
      .catch(() => setError("No se encontró la estación o el Ministerio no responde."));
  }, [params.ideess, searchParams.provincia]);

  if (error) return <p role="alert" className="rounded-xl bg-red-100 p-4 text-red-900">{error} <Link className="underline" href="/">Volver</Link></p>;
  if (!g) return <p role="status" className="py-10 text-center">⏳ Cargando estación…</p>;

  const precios = Object.entries(g.precios).filter(([, v]) => v != null);
  return (
    <article className="space-y-4">
      <Link href="/" className="text-sm underline">← Volver a buscar</Link>
      <h1 className="text-2xl font-extrabold">{g.rotulo}</h1>
      <p className="text-neutral-600 dark:text-neutral-400">{g.direccion} · {g.cp} {g.municipio} ({g.provincia})</p>
      <p className="text-sm">🕒 {g.horario || "—"} · Venta: {g.tipoVenta || "—"} · Margen: {g.margen || "—"}</p>
      <p className="rounded-xl bg-neutral-100 px-3 py-2 text-sm dark:bg-neutral-900">📅 Precios del Ministerio a fecha: <strong>{fecha || "—"}</strong></p>
      <h2 className="text-lg font-bold">Precios (€/L con IVA)</h2>
      <dl className="grid gap-2 sm:grid-cols-2">
        {precios.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between rounded-xl border border-neutral-200 p-3 dark:border-neutral-800">
            <dt className="text-sm">{k.replace(/^Precio\s+/, "")}</dt>
            <dd className="text-xl font-extrabold text-energia-700 dark:text-energia-300">{fmtPrecio(v)}</dd>
          </div>
        ))}
        {precios.length === 0 && <p>Sin precios publicados.</p>}
      </dl>
      {g.lat != null && (
        <a
          className="inline-block rounded-full bg-energia-600 px-4 py-2 font-semibold text-white"
          href={`https://www.openstreetmap.org/?mlat=${g.lat}&mlon=${g.lng}#map=16/${g.lat}/${g.lng}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Cómo llegar (OpenStreetMap)
        </a>
      )}
    </article>
  );
}
