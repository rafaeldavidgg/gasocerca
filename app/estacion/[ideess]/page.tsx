"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fmtPrecio } from "@/lib/app";
import type { Gasolinera } from "@/types";
import { Card, CardDivider } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

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

  if (error) {
    return (
      <Alert tono="danger">
        <p>{error}</p>
        <Link className="ml-auto font-bold underline" href="/">
          Volver
        </Link>
      </Alert>
    );
  }
  if (!g) {
    return (
      <div
        role="status"
        className="gc-ticket rounded-ticket bg-white p-10 text-center dark:bg-neutral-950"
      >
        <p className="font-display uppercase tracking-wide">⏳ Cargando estación…</p>
      </div>
    );
  }

  const precios = Object.entries(g.precios).filter(([, v]) => v != null);
  return (
    <article className="space-y-4">
      <Link
        href="/"
        className="inline-block text-sm font-bold underline decoration-energia-600 decoration-2 underline-offset-4"
      >
        ← Volver a buscar
      </Link>
      <header className="gc-ticket overflow-hidden rounded-ticket bg-tinta text-papel">
        <div className="px-5 pb-4 pt-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-energia-300">
            Ficha MITERD · {g.municipio} ({g.provincia})
          </p>
          <h1 className="gc-display mt-1 font-display text-3xl uppercase leading-none sm:text-4xl">
            {g.rotulo}
          </h1>
          <p className="mt-2 text-sm text-papel/80">
            {g.direccion} · {g.cp} {g.municipio} ({g.provincia})
          </p>
          <p className="mt-1 text-xs uppercase tracking-widest text-papel/70">
            🕒 {g.horario || "—"} · Venta: {g.tipoVenta || "—"} · Margen: {g.margen || "—"}
          </p>
        </div>
        <p className="border-t-2 border-dashed border-papel/25 bg-papel/5 px-5 py-2 text-sm">
          📅 Precios del Ministerio a fecha:{" "}
          <strong className="gc-num font-mono">{fecha || "—"}</strong>
        </p>
      </header>

      <section aria-label="Precios">
        <h2 className="mb-2 font-display text-xl uppercase tracking-wide">
          Precios <span className="text-sm text-neutral-500">€/L con IVA</span>
        </h2>
        {precios.length === 0 ? (
          <div
            role="status"
            className="gc-ticket rounded-ticket border-dashed bg-white p-6 text-center dark:bg-neutral-950"
          >
            Sin precios publicados.
          </div>
        ) : (
          <dl className="grid gap-2 sm:grid-cols-2">
            {precios.map(([k, v]) => (
              <Card key={k} className="flex items-center justify-between gap-2 p-3">
                <dt className="text-sm font-medium">{k.replace(/^Precio\s+/, "")}</dt>
                <dd className="gc-num font-mono text-xl font-bold text-energia-700 dark:text-energia-300">
                  {fmtPrecio(v)}
                </dd>
              </Card>
            ))}
          </dl>
        )}
      </section>

      {g.lat != null && (
        <div className="flex flex-wrap gap-2">
          <a
            href={`https://www.openstreetmap.org/?mlat=${g.lat}&mlon=${g.lng}#map=16/${g.lat}/${g.lng}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variante="primary">Cómo llegar (OpenStreetMap)</Button>
          </a>
        </div>
      )}
      <CardDivider />
    </article>
  );
}
