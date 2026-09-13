import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso legal, metodología y privacidad | GasoCerca",
  description: "Fuente de datos MITERD, metodología de precios y distancias, glosario y privacidad de GasoCerca.",
};

export default function LegalPage() {
  return (
    <article className="prose max-w-none space-y-4 dark:prose-invert">
      <h1 className="text-2xl font-extrabold">Legal, datos y metodología</h1>

      <section>
        <h2 className="text-lg font-bold">Fuente de datos</h2>
        <p>
          Ministerio para la Transición Ecológica y el Reto Demográfico (MITERD). API pública:{" "}
          <a className="underline" href="https://energia.serviciosmin.gob.es/ServiciosRestCarburantes/PreciosCarburantes/">
            ServiciosRestCarburantes
          </a>{" "}
          ·{" "}
          <a className="underline" href="https://energia.serviciosmin.gob.es/ServiciosRestCarburantes/PreciosCarburantes/help">
            Documentación
          </a>{" "}
          · Catálogo en{" "}
          <a className="underline" href="https://datos.gob.es/es/catalogo/e05068001-precio-de-carburantes-en-las-gasolineras-espanolas">
            datos.gob.es
          </a>{" "}
          ·{" "}
          <a className="underline" href="https://geoportalgasolineras.es/geoportal-instalaciones/Instalaciones/Carburantes">
            Geoportal oficial
          </a>
          .
        </p>
        <p>
          Por la Orden ITC/2308/2007 las gasolineras remiten sus precios a diario. La fecha exacta de
          actualización se muestra siempre junto a cada búsqueda (campo <code>Fecha</code> del
          Ministerio). Si el Ministerio falla, mostramos la última caché buena avisando de su
          antigüedad (“datos de hace X horas”).
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold">Metodología</h2>
        <ul className="list-disc pl-5">
          <li>Precios en €/litro con IVA incluido, tal y como los remite cada estación.</li>
          <li>La coma decimal del Ministerio (“1,589”) se normaliza a número; el vacío (“”) significa que no vende ese carburante.</li>
          <li>Distancia en <strong>línea recta</strong> con fórmula de Haversine. No es distancia por carretera ni tiempo de viaje.</li>
          <li>Caché del servidor de 15 min (s-maxage=900 + stale-while-revalidate) para no saturar el API público.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold">Glosario de campos</h2>
        <ul className="list-disc pl-5">
          <li><strong>Rótulo:</strong> marca visible de la estación (Repsol, Plenoil…).</li>
          <li><strong>Tipo Venta:</strong> P = venta al público en general (casi todas).</li>
          <li><strong>Margen:</strong> D = derecho de venta, I = venta en régimen de comisión.</li>
          <li><strong>Horario:</strong> texto libre; “L-D: 24H” significa 24 horas (filtro “Solo 24 h”).</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold">Aviso importante</h2>
        <p className="rounded-xl bg-amber-100 p-3 text-amber-900">
          Precios orientativos remitidos por las gasolineras: pueden variar en el surtidor.
          Régimen fiscal distinto en Canarias, Ceuta y Melilla (precios sin los mismos impuestos
          que en Península y Baleares).
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold">Privacidad (RGPD)</h2>
        <ul className="list-disc pl-5">
          <li>La geolocalización se procesa <strong>solo en tu móvil</strong> para calcular distancias. No se guarda ni se envía a nuestros servidores (de hecho no tenemos base de datos).</li>
          <li>Favoritos y tema oscuro se guardan solo en tu <code>localStorage</code>.</li>
          <li>Sin cookies de rastreo, sin registro, sin cuentas. Código público en GitHub.</li>
        </ul>
      </section>
    </article>
  );
}
