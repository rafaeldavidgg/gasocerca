# Spec Delta

## Purpose

Unifica header, footer, layout y paginas auxiliares para que el redisenio editorial se perciba como un solo producto coherente en claro, oscuro y movil.

## ADDED Requirements

### Requirement: Shell coherente con marca

El shell SHALL mantener header sticky con logo y toggle de tema, footer con atribucion MITERD/datos.gob.es y metodologia, y layout con skip-link y foco visible AA.

#### Scenario: Navegacion por teclado

- **WHEN** se tabula desde el inicio
- **THEN** aparece Saltar al contenido, el foco tiene anillo visible y el orden es logico

#### Scenario: Persistencia de tema

- **WHEN** el usuario elige claro u oscuro
- **THEN** se guarda en `localStorage` y respeta `prefers-color-scheme` en la primera visita

### Requirement: Paginas auxiliares con caracter

Legal y 404 SHALL compartir tipografia, tokens y tono editorial sin parecer de otra app, manteniendo contenido legal y metodologia intactos.

#### Scenario: Ruta inexistente

- **WHEN** se visita una URL no existente
- **THEN** 404 muestra ilustracion o glifo propio, mensaje Sin carburante por aqui y retorno al buscador

### Requirement: Iconos y PWA

El shell SHALL proveer logo y favicon redibujados en el nuevo lenguaje y manifest con colores de tema coherentes.

#### Scenario: Instalacion movil

- **WHEN** se anade a pantalla de inicio
- **THEN** usa nombre, iconos y `themeColor` del nuevo sistema en claro y oscuro
