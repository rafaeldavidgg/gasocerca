# Tasks

## 1. Setup skills y sistema base

- [x] 1.1 Instalar skills `impeccable`, `shadcn`, `oklch-skill`, `taste-skill/baseline-ui` y verificar que quedan disponibles en `.opencode/skills/` o via `npx ui-skills` / `npx impeccable`
- [x] 1.2 Ejecutar `impeccable shape + init/document` para fijar direccion B y generar `PRODUCT.md/DESIGN.md`, verificar que existen y definen display/body/mono
- [x] 1.3 Definir tokens OKLCH, escala spacing 8px, radios, sombras y motion en `tailwind.config.ts` + `globals.css`, verificar contraste AA y dark coherente por inspeccion visual
- [x] 1.4 Crear `components/ui/*` (Button/Card/Empty/Alert/Field) con shadcn y verificar que `shadcn info` y build pasan sin regresion

## 2. Shell editorial

- [x] 2.1 Rediseniar `HeaderClient`, `layout.tsx` (skip-link, foco visible) y `Footer` con nueva marca, verificar navegacion por teclado y persistencia de tema en `localStorage`
- [x] 2.2 Redibujar `logo.svg`/`favicon.svg` y `manifest.ts`, verificar instalacion PWA y `themeColor` claro/oscuro
- [x] 2.3 Unificar `legal/page.tsx` y `not-found.tsx` al tono editorial, verificar que contenido legal/metodologia queda intacto y 404 enlaza a `/`

## 3. Home buscador

- [x] 3.1 Rediseniar hero editorial con fecha MITERD y aviso stale, verificar primera visita muestra empty y stale muestra horas
- [x] 3.2 Migrar filtros (carburante/provincia/municipio/radio/orden/flags) a componentes sistema con debounce, verificar cambio de territorio y modo cerca-de-mi actualizan lista y mapa
- [x] 3.3 Rediseniar lista con ganadora pegatina, precio tabular y acciones detalle/guardar/compartir + paginacion 20, verificar 360px sin solape y orden precio/distancia
- [x] 3.4 Implementar estados loading/error/sin-resultados con roles ARIA, verificar error MITERD muestra alerta con reintento

## 4. Mapa precios

- [x] 4.1 Redibujar `gc-pin/gc-pin-ganadora/gc-user` como senales con ancla centrada, verificar ganadora con halo/zIndex y sin recorte Leaflet
- [x] 4.2 Rehacer popup (rotulo/precio/distancia/direccion/enlace detalle), leyenda y boton centrar, verificar enlace a `/estacion/[ideess]` funciona
- [x] 4.3 Ajustar `fitBounds/flyTo` solo ante `ajustarKey` y respeto a `prefers-reduced-motion`, verificar mover a mano o paginar no reajusta

## 5. Ficha estacion

- [x] 5.1 Rediseniar `estacion/[ideess]` con cabecera, fecha MITERD y rejilla precios tabulares, verificar sin-prefijo redundante y caso sin precios
- [x] 5.2 Anadir acciones volver/como-llegar OSM, verificar pestana nueva y ocultacion sin coordenadas
- [x] 5.3 Unificar loading/error de ficha con `role=status/alert`, verificar IDEESS inexistente muestra error con Volver

## 6. QA integracion

- [x] 6.1 Pasar `impeccable audit` (a11y/perf/responsive) y corregir bloqueantes, verificar `pnpm lint typecheck build` en verde
- [x] 6.2 Pasar `impeccable critique + polish` desktop 1440px y movil 390px en claro/oscuro, verificar una sola pasada de fixes sin leftovers visuales

## 7. Ajuste verde dominante + mobile-first

- [x] 7.1 Eliminar amarillo (sol) y dejar verde dominante en tokens, componentes, mapa y shell, verificar `grep sol-` sin resultados y build en verde
- [x] 7.2 Pasada responsive mobile-first 360px (header compacto, hero y precios escalados, CTAs 44px full-width), verificar sin overflow horizontal ni solapes
