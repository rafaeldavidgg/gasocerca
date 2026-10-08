# Skill: oklch-skill (vendored)

name: oklch-skill
source: https://www.ui-skills.com/skills (jakubkrehel/oklch-skill)
license: MIT

Sistema de color OKLCH para GasoCerca. Reglas:
- Definir escala en OKLCH y exponer tokens semanticos.
- Mismo rol en light/dark, contraste AA (4.5:1 texto).
- Nunca hex arbitrario fuera de escala.

Instalacion completa: `npx ui-skills get oklch-skill`.
Tokens reales en `app/globals.css` (`--gc-*` en `oklch()`).
