# Cómo contribuir a GasoCerca

¡Gracias por ayudar! Este proyecto es pequeño y sin ánimo de lucro.

## Formas de ayudar
- Probar en tu móvil y abrir *issues* con provincia/municipio donde falle.
- Mejorar accesibilidad, rendimiento o textos.
- Añadir tests o documentar.

## Flujo
1. Haz un *fork* y crea una rama: `git checkout -b feat/mi-mejora`.
2. `pnpm install && pnpm dev` para desarrollar.
3. Antes de abrir PR: `pnpm lint && pnpm typecheck && pnpm build`.
4. Abre la PR con qué cambia, cómo probarlo y capturas si hay UI.

## Normas
- Español (España), tono cercano.
- Sin dependencias de pago ni rastreo. Nada de Google Maps.
- Respeta el `CODE_OF_CONDUCT.md`.
