import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Aviso legal, metodología y privacidad | GasoCerca",
  description:
    "Fuente de datos MITERD, metodología de precios y distancias, glosario y privacidad de GasoCerca.",
};

const h2 = "font-display text-xl uppercase tracking-wide";
const link = "underline decoration-energia-600 decoration-2 underline-offset-4";

export default function LegalPage() {
  return (
    <article className="space-y-4">
      <header className="gc-ticket rounded-ticket bg-tinta p-5 text-papel">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-energia-300">
          Datos abiertos · Metodologia
        </p>
        <h1 className="gc-display font-display text-3xl uppercase">Legal, datos y metodologia</h1>
        <p className="mt-1 text-sm text-papel/80">
          De donde salen los precios, como se calculan las distancias y que hacemos con tus datos.
        </p>
      </header>

      <Card className="space-y-2 p-5">
        <h2 className={h2}>Fuente de datos</h2>
        <p className="text-sm leading-relaxed">
          Ministerio para la Transición Ecológica y el Reto Demográfico (MITERD). API pública:{" "}
          <a
            className={link}
            href="https://energia.serviciosmin.gob.es/ServiciosRestCarburantes/PreciosCarburantes/"
          >
            ServiciosRestCarburantes
          </a>{" "}
          ·{" "}
          <a
            className={link}
            href="https://energia.serviciosmin.gob.es/ServiciosRestCarburantes/PreciosCarburantes/help"
          >
            Documentación
          </a>{" "}
          · Catálogo en{" "}
          <a
            className={link}
            href="https://datos.gob.es/es/catalogo/e05068001-precio-de-carburantes-en-las-gasolineras-espanolas"
          >
            datos.gob.es
          </a>{" "}
          ·{" "}
          <a
            className={link}
            href="https://geoportalgasolineras.es/geoportal-instalaciones/Instalaciones/Carburantes"
          >
            Geoportal oficial
          </a>
          .
        </p>
        <p className="text-sm leading-relaxed">
          Por la Orden ITC/2308/2007 las gasolineras remiten sus precios a diario. La fecha exacta
          de actualización se muestra siempre junto a cada búsqueda (campo <code>Fecha</code> del
          Ministerio). Si el Ministerio falla, mostramos la última caché buena avisando de su
          antigüedad (“datos de hace X horas”).
        </p>
      </Card>

      <Card className="space-y-2 p-5">
        <h2 className={h2}>Metodología</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>Precios en €/litro con IVA incluido, tal y como los remite cada estación.</li>
          <li>
            La coma decimal del Ministerio (“1,589”) se normaliza a número; el vacío (“”) significa
            que no vende ese carburante.
          </li>
          <li>
            Distancia en <strong>línea recta</strong> con fórmula de Haversine. No es distancia por
            carretera ni tiempo de viaje.
          </li>
          <li>
            Caché del servidor de 15 min (s-maxage=900 + stale-while-revalidate) para no saturar el
            API público.
          </li>
        </ul>
      </Card>

      <Card className="space-y-2 p-5">
        <h2 className={h2}>Glosario de campos</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>
            <strong>Rótulo:</strong> marca visible de la estación (Repsol, Plenoil…).
          </li>
          <li>
            <strong>Tipo Venta:</strong> P = venta al público en general (casi todas).
          </li>
          <li>
            <strong>Margen:</strong> D = derecho de venta, I = venta en régimen de comisión.
          </li>
          <li>
            <strong>Horario:</strong> texto libre; “L-D: 24H” significa 24 horas (filtro “Solo 24
            h”).
          </li>
        </ul>
      </Card>

      <Alert tono="warning">
        <p>
          <strong>Aviso importante:</strong> precios orientativos remitidos por las gasolineras:
          pueden variar en el surtidor. Régimen fiscal distinto en Canarias, Ceuta y Melilla
          (precios sin los mismos impuestos que en Península y Baleares).
        </p>
      </Alert>

      <Card className="space-y-2 p-5">
        <h2 className={h2}>Privacidad (RGPD)</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>
            La geolocalización se procesa <strong>solo en tu móvil</strong> para calcular
            distancias. No se guarda ni se envía a nuestros servidores (de hecho no tenemos base de
            datos).
          </li>
          <li>
            Favoritos y tema oscuro se guardan solo en tu <code>localStorage</code>.
          </li>
          <li>Sin cookies de rastreo, sin registro, sin cuentas. Código público en GitHub.</li>
        </ul>
      </Card>
    </article>
  );
}
