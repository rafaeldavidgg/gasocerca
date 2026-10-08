# DESIGN.md — GasoCerca (direccion B)

## Lenguaje

Ticket de surtidor sobre asfalto. Fondos papel calido en claro y asfalto en oscuro, bordes tinta de 2px, sombras duras tipo pegatina (`2px 2px 0 tinta`), separadores discontinuos como ticket.

## Tipografia

- Display `Anton`, uppercase, tracking tight, `text-balance` en heroes.
- Body `Archivo` para UI.
- Mono `JetBrains Mono` con `tabular-nums` para precios/distancias/pins.

Cargadas con `next/font/google` en `app/layout.tsx` (`display=swap`).

## Color (OKLCH semantico, verde dominante)

Tokens en `app/globals.css` (`:root` y `.dark`) en `oklch()`:

- `--gc-paper`, `--gc-ink`, `--gc-accent` (energia), `--gc-success`,
  `--gc-warning` (naranja, solo semantico), `--gc-danger`, `--gc-line`, `--gc-muted`.
- Tailwind expone `tinta/papel/energia`. Sin amarillo corporativo: la estrella
  ganadora y los detalles usan blanco o verde claro sobre verde.
- Contraste AA: texto normal 4.5:1 minimo en ambos temas.

## Ritmo y forma

- Escala 8px, sin valores arbitrarios. Radios: ticket 10-14px, pills solo para acciones pequenas y radios km.
- Radios concentricos en anidados. Divisores ticket con `border-dashed`.

## Motion

- Solo `transform`/`opacity`, 150-250ms. Press `scale(.97)`.
- Halo usuario y `flyTo/fitBounds` desactivados con `prefers-reduced-motion`.
- `scrollWheelZoom={false}` en Leaflet, encuadre solo ante `ajustarKey`.

## Componentes (`components/ui/*`, estilo shadcn)

- Button (variantes primary/dark/ghost), Card (ticket), Alert (info/success/warning/danger), Empty, Field (label + control).
- Helper `cn()` en `lib/cn.ts`.

## Mapa

- `gc-pin` senal blanca borde tinta, precio mono dentro; `gc-pin-ganadora` verde con estrella sol y halo; `gc-user` punto azul distinto.
- Popup con rotulo, precio, distancia, direccion y enlace a detalle. Leyenda de 3 simbolos.
