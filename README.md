# La economía del entretenimiento: Netflix y tendencias globales

**Equipo:** 🥃

**Integrantes:**
- Axel Rebolledo Cordova
- 🥃

## Descripción

Dashboard dinámico desarrollado en **React** que analiza el catálogo de Netflix
(dataset *Netflix Movies and TV Shows* de Kaggle, 8,807 títulos, 2008–2021) para
comprender las tendencias de producción, los géneros más populares y la
distribución geográfica del contenido.

Es un dashboard **estratégico**: ofrece una visión de largo plazo sobre cómo
evoluciona el catálogo y cómo varían los gustos por región y año.

### Indicadores (KPIs)
- Número de títulos por país.
- Evolución de lanzamientos por año.
- Top 5 géneros y Top 5 directores más productivos.
- Distribución por tipo de contenido (películas vs. series).

### Visualizaciones
- Mapa de calor (coroplético) de títulos por país.
- Gráfico temporal de estrenos por año.
- Nube de palabras de géneros.
- Gráfico circular por tipo de contenido.

**Demo:** https://axlreb28.github.io/dashboard_visualizacion/

## Ejecutar localmente

```bash
npm install
npm run dev      # servidor de desarrollo
npm run deploy   # compila y publica en GitHub Pages (rama gh-pages)
```

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React |
| Base de datos | PostgreSQL (Supabase) |
| Preprocesamiento | Python + pandas |
| Despliegue | Vercel / GitHub Pages |

## Estructura

```
docs/       Entregables (Fase 1: documento de justificación en PDF)
scripts/    Scripts de perfilado y limpieza de datos
src/        Aplicación React (vista previa con KPIs calculados del CSV)
public/     Archivos estáticos publicados con el sitio
```

## Datos

Fuente: [Kaggle – Netflix Movies and TV Shows](https://www.kaggle.com/datasets/shivamb/netflix-shows).
El CSV no se versiona en el repositorio; descárgalo de Kaggle y colócalo en `data/netflix_titles.csv`.

```bash
pip install pandas
python scripts/perfilado.py data/netflix_titles.csv
```

## Fases

- [x] **Fase 1 – Análisis:** audiencia, objetivos, plan de preprocesamiento y tipo de dashboard ([docs/Fase1_Justificacion.pdf](docs/Fase1_Justificacion.pdf)).
- [ ] Fase 2 – Limpieza y carga de datos en la base de datos.
- [ ] Fase 3 – Desarrollo del dashboard en React.
- [ ] Fase 4 – Despliegue.
