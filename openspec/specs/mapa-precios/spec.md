# Mapa Precios Specification

## Purpose

Hace del mapa OSM el protagonista utilitario que comunica precio y distancia de un vistazo mediante pins-senial legibles en movil y escritorio.

## Requirements

### Requirement: Pins de precio como senales

El mapa SHALL renderizar pins pildora con precio corto dentro, ganadora en verde energia con estrella y resto en estilo senial, con ancla centrada sin recorte.

#### Scenario: Ganadora distinguible

- **WHEN** hay una estacion mas barata
- **THEN** su pin es mas grande, con halo y estrella, y tiene `zIndex` superior al resto

#### Scenario: Sin coordenadas

- **WHEN** una estacion no tiene lat/lng
- **THEN** no genera marker pero sigue apareciendo en la lista

### Requirement: Punto usuario distinto

El mapa SHALL mostrar la ubicacion del usuario como punto azul pulsante totalmente distinto de los pins de precio.

#### Scenario: Ubicacion activa

- **WHEN** se concede geolocalizacion
- **THEN** el punto azul aparece con halo animado y popup Estas aqui sin confundirse con gasolineras

### Requirement: Encuadre inteligente y popup util

El mapa SHALL ajustar vista solo ante busqueda nueva, ofrecer popup con rotulo, precio, distancia, direccion y enlace a detalle, mas leyenda y boton centrar.

#### Scenario: Nueva busqueda

- **WHEN** cambia `ajustarKey` por datos o ubicacion nuevos
- **THEN** hace `fitBounds` o `flyTo` una vez sin reajustar al mover a mano ni al paginar

#### Scenario: Popup a detalle

- **WHEN** el usuario abre un popup
- **THEN** puede ir a `/estacion/[ideess]` y ver leyenda de los tres simbolos bajo el mapa
