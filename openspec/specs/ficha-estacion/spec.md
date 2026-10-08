# Ficha Estacion Specification

## Purpose

Ofrece una ficha de estacion clara y compartible que presenta todos los precios MITERD y metadatos necesarios para decidir y llegar sin ruido visual.

## Requirements

### Requirement: Cabecera y precios tabulares

La ficha SHALL mostrar rotulo, direccion completa, horario, tipo de venta, margen, fecha MITERD y rejilla de precios con valor tabular destacado.

#### Scenario: Carga correcta

- **WHEN** se abre `/estacion/[ideess]` con provincia valida
- **THEN** se ven cabecera, fecha oficial y cada precio con nombre limpio sin prefijo redundante

#### Scenario: Sin precios

- **WHEN** la estacion no publica precios
- **THEN** aparece mensaje Sin precios publicados en vez de rejilla vacia

### Requirement: Acciones llegar y volver

La ficha SHALL ofrecer volver al buscador, abrir Como llegar en OSM en pestana nueva y mantener enlace WhatsApp coherente con la lista.

#### Scenario: Sin coordenadas

- **WHEN** faltan lat/lng
- **THEN** no se muestra el boton Como llegar pero el resto de la ficha sigue funcional

### Requirement: Estados de ficha

La ficha SHALL usar loading con `role=status` y error con `role=alert` y enlace de retorno.

#### Scenario: IDEESS inexistente

- **WHEN** la API devuelve 404 o el Ministerio no responde
- **THEN** se muestra error con accion Volver sin pantalla en blanco
