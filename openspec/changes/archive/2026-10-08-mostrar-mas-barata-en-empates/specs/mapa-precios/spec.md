# Spec Delta

## MODIFIED Requirements

### Requirement: Pins de precio como senales

El mapa SHALL renderizar pins pildora con precio corto dentro, cada estacion empatada al precio minimo en verde energia con estrella y resto en estilo senial, con ancla centrada sin recorte.

#### Scenario: Ganadora distinguible

- **WHEN** hay una o varias estaciones en el precio minimo
- **THEN** cada pin empatado es mas grande, con halo y estrella, y tiene `zIndex` superior al resto

#### Scenario: Sin coordenadas

- **WHEN** una estacion no tiene lat/lng
- **THEN** no genera marker pero sigue apareciendo en la lista
