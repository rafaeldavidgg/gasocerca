/**
 * GET /api/estaciones?idProvincia=&idMunicipio=&idProducto=
 * Proxy al MITERD con caché edge (15 min) + fallback stale.
 */
import { NextResponse } from "next/server";
import { getEstaciones } from "@/lib/miteco";
import { getOrLoad } from "@/lib/cache";
import { CACHE_CONTROL } from "@/lib/app";

export const runtime = "nodejs";
export const revalidate = 900;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const idProvincia = url.searchParams.get("idProvincia") ?? undefined;
  const idMunicipio = url.searchParams.get("idMunicipio") ?? undefined;
  const idProducto = url.searchParams.get("idProducto") ?? undefined;
  const key = `est:${idProvincia ?? "-"}:${idMunicipio ?? "-"}:${idProducto ?? "-"}`;
  try {
    const { data, stale, cachedAt, staleHours } = await getOrLoad(key, () =>
      getEstaciones({ idProvincia, idMunicipio, idProducto }),
    );
    return NextResponse.json(
      {
        fecha: data.fecha,
        cachedAt,
        stale,
        staleHours,
        count: data.estaciones.length,
        estaciones: data.estaciones,
      },
      { headers: { "Cache-Control": CACHE_CONTROL } },
    );
  } catch (e) {
    return NextResponse.json(
      { error: "No se pudo contactar con el Ministerio (MITERD). Inténtalo de nuevo en unos minutos." },
      { status: 502 },
    );
  }
}
