"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

/** Cabecera cliente: logo + nav + toggle de tema oscuro. */
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
    <header className="sticky top-0 z-[500] border-b border-neutral-200 bg-white/95 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-2 sm:px-4">
        <Link href="/" className="flex items-center gap-2" aria-label="GasoCerca, inicio">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" width={36} height={36} aria-hidden="true" />
          <span className="text-xl font-extrabold tracking-tight">
            Gaso<span className="text-energia-600">Cerca</span>
          </span>
        </Link>
        <nav aria-label="Principal" className="ml-auto flex items-center gap-1 text-sm">
          <Link href="/legal" className="rounded px-2 py-1 hover:underline">
            Legal
          </Link>
          <button
            onClick={toggle}
            className="ml-1 rounded-full border border-neutral-300 px-3 py-1 text-sm dark:border-neutral-700"
            aria-pressed={dark}
            aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {dark ? "☀️ Claro" : "🌙 Oscuro"}
          </button>
        </nav>
      </div>
    </header>
  );
}
