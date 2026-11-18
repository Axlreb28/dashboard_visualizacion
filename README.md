# La economía del entretenimiento: Netflix y tendencias globales

**Equipo:** 🥃

**Integrantes:**
- Axel Rebolledo Cordova
- 🥃

**Dashboard en línea:** https://axlreb28.github.io/dashboard_visualizacion/

## Descripción

Dashboard **estratégico** desarrollado en **React** que analiza el catálogo de Netflix
(dataset *Netflix Movies and TV Shows* de Kaggle, 8,807 títulos, 2008 – septiembre 2021)
para comprender las tendencias de producción, los géneros más populares y la
distribución geográfica del contenido.

### Indicadores (KPIs)
- Total de títulos, películas vs. series, países productores y género #1 (tarjetas).
- Número de títulos por país (mapa de calor).
- Evolución de lanzamientos por año (gráfico de líneas).
- Top 5 géneros y Top 5 directores más productivos (barras + nube de palabras).

### Interactividad
- Filtros globales: tipo de contenido, rango de años (año de incorporación) y región.
- Filtro cruzado: clic en un país del mapa o en un género de la nube.
- Tooltips con valor exacto y porcentaje.

## Stack

| Capa | Tecnología |
|------|------------|
| Estructura | React 18 + Vite |
| Gráficos | Recharts |
| Mapa | Leaflet + React-Leaflet, geometrías Natural Earth (world-atlas) |
| Estilos | CSS Modules + variables CSS generadas desde `src/theme/palette.js` |
| Datos | `scripts/limpieza.py` (pandas) → `public/data/netflix.json`, cargado con `fetch` |
| Despliegue | GitHub Pages |

## Estructura

```
docs/                 Entregables de cada fase (PDF)
scripts/              perfilado.py (Fase 1) y limpieza.py (ETL que genera el JSON)
public/data/          netflix.json (catálogo limpio) y countries-50m.json (geometrías)
src/
  theme/palette.js    Paleta de la Fase 2: única fuente de colores
  styles/global.css   Tipografía, espaciado y estilos de Leaflet
  hooks/              useNetflixData: carga de datos
  utils/              aggregations (KPIs), colorScale (escala del mapa), format
  components/
    layout/           Header, FilterBar, ActiveFilters, Panel, Footer
    kpis/             KpiCard, KpiRow
    charts/           ContentTypeDonut, ReleasesLineChart, TopBarChart, GenreWordCloud, ChartTooltip
    map/              CountryHeatMap, MapLegend
  App.jsx             Estado de filtros y retícula de 12 columnas del wireframe
```

## Ejecutar localmente

```bash
npm install
npm run dev        # servidor de desarrollo
npm run deploy     # compila y publica en GitHub Pages (rama gh-pages)
```

Para regenerar los datos, descarga el CSV de
[Kaggle](https://www.kaggle.com/datasets/shivamb/netflix-shows) en `data/netflix_titles.csv` y ejecuta:

```bash
pip install pandas pycountry pycountry-convert
python scripts/limpieza.py data/netflix_titles.csv public/data/netflix.json
```

## Fases

- [x] **Fase 1 – Análisis:** audiencia, objetivos, preprocesamiento y tipo de dashboard ([PDF](docs/Fase1_Justificacion.pdf)).
- [x] **Fase 2 – Diseño:** wireframe, KPIs, visualizaciones y armonía estética ([PDF](docs/Fase2_Wireframe.pdf)).
- [x] **Fase 3 – Implementación en React** ([PDF](docs/Fase3_Implementacion.pdf)).
