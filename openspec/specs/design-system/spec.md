# Design System Specification

## Purpose

Define el lenguaje visual unico de GasoCerca para que todas las superficies compartan tipografia, color, ritmo y motion sin parecer una plantilla generica.

## Requirements

### Requirement: Familias tipograficas editoriales

El sistema SHALL usar una familia display con caracter para titulares, una familia body legible para UI y una familia mono tabular para precios y distancias.

#### Scenario: Titular usa display

- **WHEN** se renderiza cualquier `h1` de la app
- **THEN** usa la familia display con tracking ajustado y sin fallback a fuente de sistema como idea visual principal

#### Scenario: Precio usa mono tabular

- **WHEN** se muestra un precio `€/L` o distancia en lista, mapa o ficha
- **THEN** usa mono con `tabular-nums` y coma decimal espanola sin solaparse en movil 360px

### Requirement: Paleta OKLCH semantica con dark coherente

El sistema SHALL exponer tokens semanticos (fondo, texto, acento energia, aviso naranja, error) derivados de OKLCH con contraste AA y el mismo significado en light y dark. El verde energia es el unico color de marca; no hay amarillo corporativo.

#### Scenario: Cambio de tema

- **WHEN** el usuario alterna claro/oscuro
- **THEN** todos los tokens cambian de valor pero mantienen rol semantico y contraste 4.5:1 en texto normal

#### Scenario: Sin color generico directo

- **WHEN** un componente necesita color
- **THEN** usa token semantico y nunca hex arbitrario fuera de la escala definida

### Requirement: Ritmo, radios y elevacion consistentes

El sistema SHALL aplicar una escala unica de espaciado 8px, radios y sombras, con radios concentricos en elementos anidados.

#### Scenario: Consistencia de tarjetas

- **WHEN** se inspeccionan hero, filtros, lista, mapa y ficha
- **THEN** comparten la misma escala de padding/gap y radios sin valores arbitrarios tipo `p-[17px]`

### Requirement: Motion utilitario y respetuoso

El sistema SHALL animar solo transform y opacidad con duraciones cortas, estados press con feedback y respeto a `prefers-reduced-motion`.

#### Scenario: Reduced motion

- **WHEN** el sistema operativo pide reducir movimiento
- **THEN** halo pulsante, flyTo y transiciones se desactivan o se vuelven instantaneos sin perder informacion
