import Link from "next/link";

/**
 * Pie editorial con atribución obligatoria MITERD/datos.gob.es y fecha.
 * La fecha concreta de actualización se muestra en la página principal
 * junto a cada búsqueda (viene del campo "Fecha" del Ministerio).
 */
export default function Footer() {
  return (
    <footer className="mt-8 border-t-2 border-tinta bg-tinta text-sm text-papel/90 dark:border-neutral-600">
      <div className="mx-auto max-w-6xl space-y-3 px-3 py-6 sm:px-4">
        <p className="font-display text-lg uppercase tracking-wide text-papel">
          Gaso<span className="text-energia-400">Cerca</span>{" "}
          <span className="ml-2 rounded-md bg-energia-600 px-1.5 py-0.5 align-middle text-[11px] font-bold text-white">
            Datos abiertos
          </span>
        </p>
        <p>
          <strong>Fuente:</strong> Ministerio para la Transición Ecológica y el Reto Demográfico
          (MITERD) /{" "}
          <a
            className="underline decoration-energia-400 decoration-2 underline-offset-4"
            href="https://datos.gob.es/es/catalogo/e05068001-precio-de-carburantes-en-las-gasolineras-espanolas"
          >
            datos.gob.es
          </a>{" "}
          · Precios en €/L con IVA incluido. Distancias en línea recta (Haversine), no por
          carretera.
        </p>
        <p className="text-papel/70">
          Precios orientativos remitidos por las gasolineras (Orden ITC/2308/2007). Pueden variar.
          Régimen fiscal distinto en Canarias, Ceuta y Melilla. La geolocalización se procesa solo
          en tu móvil: no se guarda ni se envía al servidor. Sin cookies de rastreo ni registro.
        </p>
        <nav aria-label="Secundaria" className="flex flex-wrap gap-3">
          <Link
            className="underline decoration-energia-400 decoration-2 underline-offset-4"
            href="/legal"
          >
            Aviso legal, metodología y privacidad
          </Link>
          <a
            className="underline decoration-energia-400 decoration-2 underline-offset-4"
            href="https://energia.serviciosmin.gob.es/ServiciosRestCarburantes/PreciosCarburantes/help"
          >
            Documentación del API MITERD
          </a>
          <a
            className="underline decoration-energia-400 decoration-2 underline-offset-4"
            href="https://geoportalgasolineras.es/geoportal-instalaciones/Instalaciones/Carburantes"
          >
            Geoportal de carburantes
          </a>
        </nav>
        <p className="border-t border-dashed border-papel/30 pt-3 text-papel/60">
          GasoCerca · MIT · Hecho con datos abiertos.
        </p>
      </div>
    </footer>
  );
}
