# Proposal

## Why

GasoCerca funciona bien pero parece una plantilla generica de IA (tipografia de sistema, verdes planos, `rounded-full` por todas partes, cards identicas). Para una app de uso repetido con mapa y precios, eso reduce confianza y memorabilidad. Hay que pasar a una direccion editorial B con caracter propio sin romper rendimiento, accesibilidad ni datos MITERD.

## What Changes

- Introduce direccion editorial memorable (surtidor/ticket + carretera): display con caracter, body legible, mono tabular para precios.
- Define sistema visual unico (tokens OKLCH, ritmo, radios, sombras, motion, dark mode) y componentes base reutilizables.
- Redisenia home completa: hero editorial, filtros, lista de precios con `MAS BARATA` como pegatina, estados loading/error/empty.
- Redisenia mapa Leaflet: pins de precio como senales, popup, leyenda, boton centrar, `flyTo/fitBounds` con motion coherente.
- Redisenia ficha `estacion/[ideess]`: precio tabular grande, metadatos, como-llegar, compartir.
- Unifica shell: Header, Footer, layout, `legal`, `not-found`, logo/favicon, manifest, focus visible y contraste.
- Instala y deja configuradas las UI skills: `impeccable` como directora (`shape/bolder/typeset/layout/delight/audit/polish`), `shadcn` para sistema, `oklch-skill + taste-skill/baseline-ui` para color y ritmo.

## Capabilities

### New Capabilities

- `design-system`: tokens, tipografias, color OKLCH semantico + dark, espaciado, radios, sombras, motion y componentes base.
- `home-buscador`: hero editorial, filtros territorio/carburante, lista resultados y estados.
- `mapa-precios`: mapa OSM, pins precio/ganadora/usuario, popup, leyenda y centrado.
- `ficha-estacion`: detalle por IDEESS con precios, metadatos y acciones.
- `app-shell`: header/footer/layout, legal, 404, logo/favicon/manifest, a11y global.

### Modified Capabilities

- Ninguna (no hay specs previas).

## Impact

- Afecta `app/globals.css`, `tailwind.config.ts`, `app/layout.tsx`, `components/HeaderClient.tsx`, `components/Footer.tsx`, `components/HomeClient.tsx`, `components/MapaGasolineras.tsx`, `app/estacion/[ideess]/page.tsx`, `app/legal/page.tsx`, `app/not-found.tsx`, `public/logo.svg`, `public/favicon.svg`.
- Nuevas dependencias: fuentes, `shadcn` (`components/ui/*`, `components.json`), skills (`impeccable`, `shadcn`, `oklch-skill`, `taste-skill/baseline-ui`). Sin cambios de API MITERD ni de calculo Haversine.
