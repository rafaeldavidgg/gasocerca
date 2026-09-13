import Link from "next/link";

/**
 * Pie con atribución obligatoria MITERD/datos.gob.es y fecha.
 * La fecha concreta de actualización se muestra en la página principal
 * junto a cada búsqueda (viene del campo "Fecha" del Ministerio).
 */
export default function Footer() {
  return (
    <footer className="mt-8 border-t border-neutral-200 bg-neutral-50 text-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto max-w-6xl space-y-2 px-3 py-6 sm:px-4">
        <p>
          <strong>Fuente:</strong> Ministerio para la Transición Ecológica y el Reto Demográfico
          (MITERD) /{" "}
          <a className="underline" href="https://datos.gob.es/es/catalogo/e05068001-precio-de-carburantes-en-las-gasolineras-espanolas">
            datos.gob.es
          </a>{" "}
          · Precios en €/L con IVA incluido. Distancias en línea recta (Haversine), no por
          carretera.
        </p>
        <p className="text-neutral-600 dark:text-neutral-400">
          Precios orientativos remitidos por las gasolineras (Orden ITC/2308/2007). Pueden variar.
          Régimen fiscal distinto en Canarias, Ceuta y Melilla. La geolocalización se procesa solo
          en tu móvil: no se guarda ni se envía al servidor. Sin cookies de rastreo ni registro.
        </p>
        <nav aria-label="Secundaria" className="flex flex-wrap gap-3">
          <Link className="underline" href="/legal">
            Aviso legal, metodología y privacidad
          </Link>
          <a
            className="underline"
            href="https://energia.serviciosmin.gob.es/ServiciosRestCarburantes/PreciosCarburantes/help"
          >
            Documentación del API MITERD
          </a>
          <a
            className="underline"
            href="https://geoportalgasolineras.es/geoportal-instalaciones/Instalaciones/Carburantes"
          >
            Geoportal de carburantes
          </a>
        </nav>
        <p className="text-neutral-500">GasoCerca · MIT · Hecho con datos abiertos.</p>
      </div>
    </footer>
  );
}
