# Skill: taste-skill + baseline-ui (vendored)

names: taste-skill, baseline-ui
sources:
- https://github.com/leonxlnx/taste-skill
- ui-skills `ibelick/baseline-ui`
license: MIT

Anti-slop y ritmo para GasoCerca:
- baseline-ui: spacing 8px, jerarquia, radios concentricos, sin `p-[17px]`.
- taste-skill: variance de layout, tipografia con caracter, motion solo transform/opacity.

Instalacion completa: `npx ui-skills get taste-skill baseline-ui`.
Aplicado en `tailwind.config.ts` y componentes home/mapa/ficha.
