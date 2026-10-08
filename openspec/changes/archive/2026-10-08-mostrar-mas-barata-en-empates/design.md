# Design

## Context

Ver `proposal.md` para la motivación. Estado actual (observado en `components/HomeClient.tsx:158,399,411` y `components/MapaGasolineras.tsx:101-167`):

- `HomeClient` calcula `masBarata = lista[0]` tras ordenar por `orden` (`precio` o `distancia`) y marca con `esBarata = masBarata?.g.ideess === g.ideess`.
- Pasa `idBarata={masBarata?.g.ideess}` a `MapaGasolineras`, que compara `g.ideess === idBarata` para pin verde, prefijo de popup y `zIndex`.
- Resultado: solo un `ideess` gana, aunque haya empate; y con `orden === "distancia"`, la ganadora es la más cercana, no la más barata.

Restricciones: sin cambios de API MITERD, tipos, rutas ni dependencias; respetar estilos `gc-pin`, `gc-sticker` y layout 360px existentes.

## Goals / Non-Goals

**Goals:**

- Marcar todas las empatadas al precio mínimo en lista y mapa con los mismos estilos actuales.
- Definir el mínimo de forma independiente al orden activo.
- Mantener el cambio en dos componentes sin tocar API ni ficha de estación.

**Non-Goals:**

- Cambiar ordenación, paginación, filtros, radio o fuentes de precio (`precioDe`).
- Introducir tolerancia de precios, redondeo distinto o desempate por distancia.
- Añadir leyenda de "empate" o contador de ganadoras.

## Decisions

### D1: Mínimo sobre la lista filtrada completa, ignorando el orden

Calcular `precioMinimo = min(lista.map(x => x.precio))` sobre la lista ya filtrada (sin-precio, 24h, favoritas, radio) y con `precio != null`. El predicado es `precio != null && precio === precioMinimo`.

- Alternativa descartada: `lista[0]` cuando `orden === "precio"` y `min` en otro caso. Se rechaza por inconsistente y por perpetuar el bug de badge-a-la-más-cercana con `orden === "distancia"`.
- El orden sigue mandando solo en la posición; la marca manda por precio.

### D2: Igualdad estricta sobre el número MITERD

Comparar con `===` sobre el valor ya resuelto por `precioDe` (3 decimales). Sin épsilon ni redondeo a 2 decimales para mostrar.

- Alternativa descartada: tolerancia (p. ej. ±0,005 €). Se rechaza porque los precios vienen de la misma fuente y el usuario espera que "mismo precio" sea el mismo número que ve en la UI.

### D3: Prop `precioMinimo` en lugar de `idBarata` o conjunto de ids

`HomeClient` pasa `precioMinimo: number | null` al mapa; el mapa aplica el mismo predicado `p.precio === precioMinimo` para icono, popup y `zIndexOffset`.

- Alternativa descartada: `Set<string>` de `ideess` ganadores. Más explícito pero obliga a construir y memoizar el conjunto en cada filtro y duplica la fuente de verdad (ids vs precios).
- Con `precioMinimo`, lista y mapa comparten una sola definición y el subconjunto del mapa (`lista.slice(0, 200)`) hereda el mínimo global sin recalcular.

### D4: Sin ganadora cuando no hay precios

Si `lista` está vacía o todos los precios son `null`, `precioMinimo` es `null` y ningún elemento ni pin se marca. No hay fallback a `lista[0]`.

## Risks / Trade-offs

- [Cambio visible con `orden === "distancia"`] La pegatina pasará de la más cercana a la(s) más barata(s) → Mitigación: es la corrección intencionada; el orden por distancia sigue ordenando por cercanía, solo la marca cambia de criterio.
- [Empates grandes] Si 20 estaciones empatan, habrá 20 pegatinas/pines verdes y el destaque pierde fuerza → Mitigación: aceptado; es lo pedido y refleja la realidad del mercado. No se limita el número de marcas.
- [Comparación flotante] `===` sobre floats podría fallar si dos fuentes diesen `1.589` vs `1.5890001` → Mitigación: ambas ramas usan el mismo `precioDe` ya resuelto, mismo array de objetos; sin conversión intermedia.
- [Mapa recortado a 200 puntos] El mínimo se calcula sobre la lista completa, el mapa solo pinta 200 → Mitigación: con `orden === "precio"` los 200 primeros incluyen el mínimo; con `orden === "distancia"` los pines visibles empatados se marcan igual, sin recalcular mínimo local.

## Migration Plan

- Cambio solo frontend, sin migración de datos.
- Despliegue normal; rollback revertiendo los dos componentes.
- Sin flags ni pasos intermedios.

## Open Questions

Ninguna que bloquee specs o tareas.
