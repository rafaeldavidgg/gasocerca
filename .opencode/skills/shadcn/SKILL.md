# Skill: shadcn (vendored)

name: shadcn
source: https://ui.shadcn.com/docs/skills
license: MIT

Sistema de componentes para GasoCerca. Patrones aplicados:
- `components/ui/*` propios (Button, Card, Alert, Empty, Field) estilo shadcn.
- Tokens en `globals.css`, variantes con `cn()` en `lib/cn.ts`.
- Formularios con FieldGroup + Field, no divs sueltos.

Instalacion completa (con red): `pnpm dlx shadcn@latest init` y `pnpm dlx shadcn@latest add button card alert`.
Este change implementa los componentes a mano para evitar dependencias Radix innecesarias.
