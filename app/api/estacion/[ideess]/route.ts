/**
 * GET /api/estacion/[ideess]?idProvincia=
 * Detalle: busca la estación por IDEESS (recorre la provincia o todo el país).
 * Sin BBDD: reutiliza la caché de /api/estaciones.
 */
import { NextResponse } from "next/server";
import { getEstaciones } from "@/lib/miteco";
import { getOrLoad } from "@/lib/cache";
import { CACHE_CONTROL } from "@/lib/app";

export const runtime = "nodejs";
export const revalidate = 900;

export async function GET(req: Request, { params }: { params: { ideess: string } }) {
  const url = new URL(req.url);
  const idProvincia = url.searchParams.get("idProvincia") ?? undefined;
  try {
    const key = `est:${idProvincia ?? "-"}:-:-`;
    const { data, stale, cachedAt } = await getOrLoad(key, () =>
      getEstaciones({ idProvincia }),
    );
    const found = data.estaciones.find((e) => e.ideess === params.ideess);
    if (!found) return NextResponse.json({ error: "Estación no encontrada" }, { status: 404 });
    return NextResponse.json(
      { fecha: data.fecha, cachedAt, stale, estacion: found },
      { headers: { "Cache-Control": CACHE_CONTROL } },
    );
  } catch {
    return NextResponse.json({ error: "Fallo al obtener la estación" }, { status: 502 });
  }
}
