# Home Buscador Specification

## Purpose

Convierte la home en una experiencia editorial memorable que permite encontrar la gasolina mas barata en segundos desde provincia, municipio o ubicacion sin friccion visual.

## Requirements

### Requirement: Hero editorial con propuesta de valor

La home SHALL mostrar un hero con titular distintivo, subtitulo de precios oficiales MITERD y fecha de actualizacion visible junto a cada busqueda.

#### Scenario: Primera visita

- **WHEN** un usuario abre `/` sin datos cargados
- **THEN** ve hero editorial, estado empty que invita a buscar y nunca una lista vacia sin contexto

#### Scenario: Aviso de datos stale

- **WHEN** el Ministerio falla y se sirve cache
- **THEN** se muestra aviso con antiguedad en horas junto a la fecha oficial

### Requirement: Filtros claros y rapidos

Los filtros SHALL permitir elegir carburante, provincia, municipio, radio, orden y banderas 24h/sin-precio/favoritas con busqueda debounced y accion Buscar explicita.

#### Scenario: Cambio de territorio

- **WHEN** el usuario cambia provincia o pulsa usar ubicacion
- **THEN** la lista y el mapa se actualizan, el radio filtra por distancia y el modo cerca-de-mi limpia territorio

### Requirement: Lista con ganadora destacada

La lista SHALL ordenar por precio o distancia, marcar la mas barata como pegatina y mostrar rotulo, direccion, horario, distancia, precio y acciones detalle/guardar/compartir.

#### Scenario: Ganadora visible

- **WHEN** hay resultados con precio
- **THEN** solo la primera lleva etiqueta `MAS BARATA`, anillo distintivo y precio tabular grande sin romper layout en 360px

#### Scenario: Paginacion progresiva

- **WHEN** hay mas de 20 resultados
- **THEN** se muestran por paginas de 20 con boton Mostrar mas que indica restantes

### Requirement: Estados accesibles

La home SHALL exponer loading, error de MITERD, sin-resultados y sin-datos con roles ARIA y foco visible.

#### Scenario: Error de red

- **WHEN** falla `/api/estaciones`
- **THEN** aparece alerta con mensaje y reintento sin dejar spinner infinito
