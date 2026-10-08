"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

/** Cabecera editorial: franja senal + barra asfalto con marca. */
export default function HeaderClient() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("gasocerca:tema");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const d = saved ? saved === "oscuro" : prefers;
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("gasocerca:tema", next ? "oscuro" : "claro");
    } catch {}
  };

  return (
    <header className="sticky top-0 z-[500]">
      <p className="bg-energia-600 px-3 py-1 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-white">
        Precios oficiales MITERD · Actualizado a diario
      </p>
      <div className="border-b-2 border-tinta bg-tinta text-papel dark:border-neutral-600">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4">
          <Link href="/" className="flex min-w-0 items-center gap-2" aria-label="GasoCerca, inicio">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" width={34} height={34} aria-hidden="true" />
            <span className="font-display text-xl uppercase leading-none tracking-wide sm:text-2xl">
              Gaso<span className="text-energia-400">Cerca</span>
            </span>
          </Link>
          <nav
            aria-label="Principal"
            className="ml-auto flex shrink-0 items-center gap-1 text-sm sm:gap-2"
          >
            <Link
              href="/legal"
              className="rounded-lg px-2 py-1 text-papel/90 underline decoration-energia-400 decoration-2 underline-offset-4 hover:text-papel"
            >
              Legal
            </Link>
            <button
              onClick={toggle}
              className="gc-press rounded-xl border-2 border-papel/40 bg-transparent px-2 py-1 text-xs font-bold text-papel hover:border-energia-400 hover:text-energia-300 sm:px-3 sm:text-sm"
              aria-pressed={dark}
              aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {dark ? "☀️ Claro" : "🌙 Oscuro"}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
