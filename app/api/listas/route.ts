/**
 * GET /api/listas?tipo=ccaa|provincias|municipios|productos&idProvincia=
 * Proxy a los listados del MITERD con caché.
 */
import { NextResponse } from "next/server";
import { getCCAA, getMunicipios, getProductos, getProvincias } from "@/lib/miteco";
import { getOrLoad } from "@/lib/cache";
import { CACHE_CONTROL, PRODUCTOS_FALLBACK } from "@/lib/app";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tipo = url.searchParams.get("tipo") ?? "";
  const idProvincia = url.searchParams.get("idProvincia") ?? "";
  try {
    if (tipo === "ccaa") {
      const { data } = await getOrLoad("ccaa", getCCAA);
      return NextResponse.json(data, { headers: { "Cache-Control": CACHE_CONTROL } });
    }
    if (tipo === "provincias") {
      const { data } = await getOrLoad("prov", getProvincias);
      return NextResponse.json(data, { headers: { "Cache-Control": CACHE_CONTROL } });
    }
    if (tipo === "municipios") {
      if (!idProvincia) return NextResponse.json([], { headers: { "Cache-Control": CACHE_CONTROL } });
      const { data } = await getOrLoad(`mun:${idProvincia}`, () => getMunicipios(idProvincia));
      return NextResponse.json(data, { headers: { "Cache-Control": CACHE_CONTROL } });
    }
    // productos
    try {
      const { data } = await getOrLoad("prod", getProductos);
      return NextResponse.json(data, { headers: { "Cache-Control": CACHE_CONTROL } });
    } catch {
      return NextResponse.json(PRODUCTOS_FALLBACK, {
        headers: { "Cache-Control": CACHE_CONTROL },
      });
    }
  } catch {
    return NextResponse.json({ error: "Fallo al obtener listados del MITERD" }, { status: 502 });
  }
}
