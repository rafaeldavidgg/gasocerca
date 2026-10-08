# Proposal

## Why

Cuando varias gasolineras comparten el precio mínimo, solo la primera de la lista muestra el cartel de "Más barata". El resto, con idéntico precio, aparece como si fuera más cara, lo que confunde al usuario y es injusto en la comparación.

## What Changes

- Calcular el precio mínimo de la lista filtrada (tras filtros de precio, 24h, favoritas y radio) y marcar como más barata a **todas** las estaciones cuyo precio sea igual a ese mínimo, no solo a la primera.
- Aplicar la marca de empate en la lista (pegatina "Más barata" y fondo destacado) y en el mapa (pin verde con estrella, prefijo "★ Más barata" en popup y `zIndex` elevado).
- Definir el mínimo por valor numérico exacto del precio del carburante seleccionado (3 decimales MITERD); igualdad estricta `precio === precioMinimo`.
- Sin cambios en ordenación, paginación, filtros, ficha de estación ni fuentes de datos.

## Capabilities

### New Capabilities

- Ninguna.

### Modified Capabilities

- `home-buscador`: el requisito "Lista con ganadora destacada" pasa de marcar solo la primera a marcar todas las empatadas al precio mínimo.
- `mapa-precios`: el requisito "Pins de precio como señales" pasa de una única ganadora a múltiples pines ganadores en caso de empate.

## Impact

- `components/HomeClient.tsx`: cálculo de `masBarata` por identidad (`lista[0]`) → cálculo de `precioMinimo` y predicado por igualdad de precio; prop a mapa.
- `components/MapaGasolineras.tsx`: prop de ganadora única (`idBarata`) → conjunto o predicado por precio mínimo; icono, popup y `zIndex` para cada empatada.
- Sin cambios de API, tipos MITERD, rutas ni dependencias.
