# Design

## Context

Estado actual: Next 14 + Tailwind 3.4 sin sistema (`tailwind.config.ts` solo define `energia/sol`, `globals.css` define `gc-pin/gc-user` ad-hoc, no hay `components/ui/*` ni fuentes). Ver propuesta para motivacion. Superficies: `HomeClient`, `MapaGasolineras`, `estacion/[ideess]`, `HeaderClient`, `Footer`, `legal`, `not-found`.

## Goals / Non-Goals

**Goals:**
- Sistema unico OKLCH + typo display/body/mono + dark coherente reutilizable.
- Home, mapa, ficha y shell con la misma direccion B sin re-iteracion.
- Mantener rendimiento Leaflet, a11y AA y datos MITERD intactos.

**Non-Goals:**
- Cambiar APIs MITERD, calculo Haversine, cache 15min o logica de favoritos.
- Migracion a Tailwind v4 o cambio de mapa a Mapbox/Google.
- Ilustracion 3D pesada o shaders que penalicen movil.

## Decisions

- **impeccable como directora (`shape/bolder/typeset/layout/delight/audit/polish`) over solo frontend-design:** aporta vocabulario bolder/quieter y `PRODUCT.md/DESIGN.md` para fijar direccion B; frontend-design queda como fallback ligero.
- **shadcn como base de sistema over componentes ad-hoc:** `Button/Card/Empty/Alert/Field/Select` propios en `components/ui/*` evitan que loading/error/empty diverjan; alternativa ad-hoc descartada por deuda visual.
- **OKLCH semantico over hex directos:** `oklch-skill` deriva `energia/sol` a tokens con mismo rol en dark; conserva verde reconocible pero tunable y con contraste.
- **Tipografia con caracter over sistema:** display editorial + body + mono tabular; evita Inter generico y fija `tabular-nums` para `1,589 €/L`.
- **Pins como senales DOM over imagenes:** mantiene `L.divIcon` actual, redibuja `gc-pin` como senal carretera con borde grueso y punta; sin icon libs pesadas, respeta `prefers-reduced-motion`.
- **Orden de construccion sistema > shell > home/mapa > detalle > QA:** fija tokens antes de superficies para no rehacer.

## Risks / Trade-offs

- [Risk] Cambio tipografico rompe layout movil denso → Mitigacion: prueba 360px + `text-balance`, precios con truncate controlado.
- [Risk] Dark editorial pierde contraste en mapa OSM claro → Mitigacion: contenedor y leyenda con tokens dark, tiles sin filtro invasivo.
- [Risk] `shadcn init` introduce dependencias Radix innecesarias → Mitigacion: instalar solo primitivas usadas, resto custom ligero.
- [Risk] Motion mapa (`flyTo/fitBounds`) marea → Mitigacion: duracion corta, solo en `ajustarKey`, off con reduced-motion.

## Migration Plan

1. Instalar skills y fuentes, crear tokens y `components/ui/*` sin tocar UI vieja.
2. Aplicar shell (layout/header/footer/legal/404/logo).
3. Rediseniar home + mapa detras de flag visual o rama, verificar 360px/1440px + dark.
4. Rediseniar ficha, luego `audit/polish`, rollback revirtiendo rama si hay regresion visual grave.

## Open Questions

- Eleccion final de display (opciones: Space Grotesk-like descartado por comun, buscar serif condensada o grotesca de gasolinera) — se decide en `shape` sin cambiar specs.
