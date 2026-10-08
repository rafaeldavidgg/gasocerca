# Spec Delta

## MODIFIED Requirements

### Requirement: Lista con ganadora destacada

La lista SHALL ordenar por precio o distancia, marcar todas las estaciones empatadas al precio minimo como pegatina y mostrar rotulo, direccion, horario, distancia, precio y acciones detalle/guardar/compartir.

#### Scenario: Ganadora visible

- **WHEN** hay resultados con precio
- **THEN** todas las estaciones con precio igual al minimo llevan etiqueta `MAS BARATA`, anillo distintivo y precio tabular grande sin romper layout en 360px

#### Scenario: Empate de precio minimo

- **WHEN** dos o mas estaciones comparten el precio minimo de la lista filtrada
- **THEN** todas muestran la pegatina y el fondo destacado, y el resto no lleva marca

#### Scenario: Paginacion progresiva

- **WHEN** hay mas de 20 resultados
- **THEN** se muestran por paginas de 20 con boton Mostrar mas que indica restantes
