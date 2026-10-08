# Tasks

## 1. Marca de empate en lista (HomeClient)

- [x] 1.1 Calcular `precioMinimo` sobre la lista filtrada en `components/HomeClient.tsx` (min de `precio != null`, `null` si vacía) y exponer el predicado `esBarata = precio != null && precio === precioMinimo`, verificable con `pnpm typecheck` y `pnpm lint` sin errores
- [x] 1.2 Aplicar el predicado a la pegatina "Más barata" y al fondo destacado de cada fila y verificar con datos con empate (2+ estaciones al mismo precio mínimo) que todas muestran pegatina y fondo y el resto no

## 2. Pines de empate en mapa (MapaGasolineras)

- [x] 2.1 Sustituir la prop `idBarata: string` por `precioMinimo: number | null` en `components/MapaGasolineras.tsx` y su llamada en `HomeClient.tsx`, verificable con `pnpm typecheck` y `pnpm lint` sin errores
- [x] 2.2 Aplicar el predicado de empate a icono verde con estrella, prefijo "★ Más barata" del popup y `zIndexOffset` elevado en cada pin empatado, y verificar en el mapa que todos los empatados se ven verdes con estrella y el resto en estilo señal

## 3. Verificación integrada

- [x] 3.1 Verificar lista + mapa con el mismo juego de datos con empate (incluido `orden === "distancia"`, donde la marca sigue al precio mínimo y no al primero) y comprobar que `pnpm build` termina sin errores
- [x] 3.2 Verificar casos borde — lista vacía, todo sin precio y estación sin coordenadas — comprobando que no hay marca cuando `precioMinimo` es `null` y que la estación sin lat/lng sigue en lista sin marker
