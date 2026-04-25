# Futbol_Chapas

Juego tactico de futbol basado en blood bowl.

## Estructura del proyecto

- `index.html`: interfaz principal del juego.
- `src/mechanics.js`: logica principal de partido.
- `src/data.js`: datos de equipos, jugadores y eventos.
- `src/audio.js`: sistema de audio y efectos.
- `src/zoc.js`: reglas de Zona de Control (ZoC).
- `src/render.js`: render del campo y fichas.
- `.github/workflows/deploy-pages.yml`: deploy automatico a GitHub Pages.

## Desarrollo local (Vite)

1. Instala Node.js 20 o superior.
2. Ejecuta:
   - `npm install`
   - `npm run dev`

## Build

- `npm run build`
- Salida en `dist/`

## Deploy automatico a GitHub Pages

El workflow publica en cada push a `main`.

Para activarlo en GitHub:

1. Ve a `Settings > Pages`.
2. En `Build and deployment`, selecciona `GitHub Actions`.
