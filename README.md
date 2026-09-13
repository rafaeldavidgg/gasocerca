# ⛽ GasoCerca — Gasolineras más baratas cerca de ti

![build](https://github.com/rafaeldavidgg/gasocerca/actions/workflows/ci.yml/badge.svg)
![license](https://img.shields.io/badge/license-MIT-green)
![vercel](https://img.shields.io/badge/deploy-Vercel-black)
![datos](https://img.shields.io/badge/datos-MITERD_oficial-blue)

Página web pública, gratis y sin registro, para ver **precios oficiales de carburantes en
España** y encontrar **la gasolinera más barata cerca de tu ubicación**.

- 🔴 Demo: **https://gasocerca.vercel.app**
- 📦 Repo: este mismo (público, MIT).
- 💰 Coste: 0 € (Vercel free + GitHub free, sin APIs de pago, sin base de datos).

## Fuente de datos oficial (obligatoria y exclusiva)

**Ministerio para la Transición Ecológica y el Reto Demográfico (MITERD).**

- Base: https://energia.serviciosmin.gob.es/ServiciosRestCarburantes/PreciosCarburantes/
- Documentación: https://energia.serviciosmin.gob.es/ServiciosRestCarburantes/PreciosCarburantes/help
- Catálogo: https://datos.gob.es/es/catalogo/e05068001-precio-de-carburantes-en-las-gasolineras-espanolas
- Geoportal: https://geoportalgasolineras.es/geoportal-instalaciones/Instalaciones/Carburantes

Por la **Orden ITC/2308/2007** las gasolineras remiten precios a diario. Cada estación trae
`IDEESS`, `Rótulo`, dirección, municipio, provincia, `Latitud`, `Longitud (WGS84)`, horario,
tipo de venta, margen y precios como `Precio Gasolina 95 E5`, `Precio Gasoleo A`, etc.

**Normalización:** los precios vienen con coma decimal (`"1,589"`) y vacíos (`""`) si no
venden ese carburante → se convierten a `number | null`. Siempre se guarda y muestra el
campo `Fecha` de actualización del Ministerio.

## Arquitectura (opción 2: frontend + backend ligero, sin BBDD)

```text
[Móvil/PC] --fetch--> [Vercel: Next.js /api/*] --fetch+cache 15min--> [MITERD oficial]
   |                           |
   | Haversine en cliente      | Cache-Control: public, s-maxage=900,
   | (distancia línea recta)   | stale-while-revalidate=900 + caché en memoria
   |                           | Si MITERD cae: sirve última caché + aviso "hace X h"
```

- El navegador **nunca** llama al Ministerio (evita CORS y descargar 12.000 estaciones en cada móvil).
- `GET /api/estaciones?idProvincia=&idMunicipio=&idProducto=` → proxy + normalización.
- `GET /api/listas?tipo=ccaa|provincias|municipios|productos` → desplegables en cascada.
- `GET /api/estacion/[ideess]` → detalle.
- Geolocalización (`navigator.geolocation`) y Haversine solo en cliente. Nada se envía al servidor.

## Stack exacto

Next.js 14 (App Router) + React 18 + TypeScript strict + pnpm · Tailwind mobile-first ·
Leaflet + react-leaflet + OpenStreetMap (prohibido Google Maps por ser de pago) ·
ESLint + Prettier · Vercel.

## Funcionalidades MVP

1. Selector de carburante (de `Listados/ProductosPetroliferos`).
2. CCAA → Provincia → Municipio en cascada + “Usar mi ubicación” + radio 3/5/10/25/50 km.
3. Lista ordenable por precio/distancia (Rótulo, dirección, horario, precio grande, distancia).
4. Mapa responsive con pines, popup, centrado y la más barata destacada en verde.
5. Detalle por gasolinera (`/estacion/[ideess]`).
6. Estados de carga, error (caída MITERD), vacío y aviso si deniegan geolocalización.
7. Cabecera/footer con “Fuente: MITERD / datos.gob.es · Fecha: […]” + enlaces.
8. Extras: solo 24h, solo low-cost, ocultar sin precio, favoritas en localStorage,
   compartir por WhatsApp, modo oscuro/claro, PWA instalable mínima, teclado + lector de pantalla.

## Cómo ejecutar en local

```bash
pnpm install
cp .env.example .env.local   # opcional, ya funciona sin nada
pnpm dev                      # http://localhost:3000
```

Comprobaciones:

```bash
pnpm lint && pnpm typecheck && pnpm build
```

## Cómo desplegar en Vercel

1. Sube este repo a GitHub.
2. En Vercel: *Add New → Project → Import* del repo. Framework: Next.js (autodetectado).
3. Sin variables obligatorias (hay `.env.example`). Deploy y listo.
4. Opcional: dominio `gasocerca.vercel.app` (o el tuyo en *Settings → Domains*).

## Estructura de carpetas

```text
/app                    # App Router: page, layout, legal, estacion/[ideess], api/*, sitemap, robots, manifest
/components             # Header, Footer, HomeClient (buscador+lista), MapaGasolineras (lazy, ssr:false)
/lib                    # miteco.ts (fetch+normalización), geo.ts (Haversine), cache.ts, app.ts, api.ts
/types                  # EESSPrecio/Gasolinera y listados
/public                 # logo.svg, favicon.svg
/.github/workflows      # CI: lint + typecheck + build
```

## Caché y limitaciones

- Caché edge 15 min + `stale-while-revalidate` 15 min; en memoria se guarda la última
  respuesta buena por filtro para servirla con aviso si el Ministerio cae.
- Actualización **diaria** (no en tiempo real). La fecha visible es la del Ministerio.
- Precios con coma → número; `""` = no vende ese carburante.
- Distancia **en línea recta** (Haversine), no por carretera.
- Precios **orientativos** remitidos por las gasolineras; pueden variar en surtidor.
- Régimen fiscal distinto en Canarias / Ceuta / Melilla.
- Campos: Tipo Venta `P` = público; Margen `D/I`; Horario `L-D: 24H` = 24 h (filtrable).

## Privacidad

La geolocalización se procesa solo en tu móvil para calcular distancias: no se guarda ni
se envía al servidor (no hay BBDD). Favoritas y tema en tu `localStorage`. Sin cookies de
rastreo, sin registro. Más en [/legal](./app/legal/page.tsx).

## Roadmap (fuera del MVP, dejado preparado)

- [ ] Histórico de precios por estación.
- [ ] Puntos de recarga eléctrica.
- [ ] Apps móviles.
- [ ] Lighthouse móvil > 90 en CI.

## Licencia y atribución

MIT — ver [LICENSE](./LICENSE). Datos © MITERD / datos.gob.es (datos abiertos).
Si reutilizas, cita la fuente y la fecha de actualización.
