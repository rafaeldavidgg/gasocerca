# Changelog

Todos los cambios notables se documentan aquí. Formato basado en *Keep a Changelog*.

## [0.1.0] - 2026-09-13
### Añadido
- Buscador por carburante, provincia y municipio con datos reales del MITERD.
- Geolocalización en cliente + distancia Haversine + radio 3/5/10/25/50 km.
- Lista ordenable por precio/distancia, paginada, con la más barata destacada.
- Mapa OpenStreetMap con Leaflet (lazy, sin SSR), auto-zoom a los resultados y botón de centrado.
- Vista detalle por estación, favoritos en localStorage, compartir por WhatsApp.
- Filtros 24h / ocultar sin precio / solo favoritas.
- Modo oscuro, PWA mínima, SEO (OG, sitemap, robots, 404, canonical), página /legal.
- Proxy /api con caché edge 15 min + fallback a última caché buena si el MITERD cae.
