import { useMemo, useState } from "react";
import Header from "./components/layout/Header.jsx";
import ActiveFilters from "./components/layout/ActiveFilters.jsx";
import Panel from "./components/layout/Panel.jsx";
import Footer from "./components/layout/Footer.jsx";
import KpiRow from "./components/kpis/KpiRow.jsx";
import CountryHeatMap from "./components/map/CountryHeatMap.jsx";
import ContentTypeDonut from "./components/charts/ContentTypeDonut.jsx";
import ReleasesLineChart from "./components/charts/ReleasesLineChart.jsx";
import GenreWordCloud from "./components/charts/GenreWordCloud.jsx";
import TopBarChart from "./components/charts/TopBarChart.jsx";
import { useNetflixData } from "./hooks/useNetflixData.js";
import {
  contentTypes, filterTitles, releasesByYear, titlesByCountry, topCountry, topDirectors, topGenres,
} from "./utils/aggregations.js";
import styles from "./App.module.css";

const REGIONS = ["Norteamérica", "Sudamérica", "Europa", "Asia", "África", "Oceanía"];

const formatCutoff = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });

export default function App() {
  const { data, geo, error } = useNetflixData();

  if (error) return <p className={styles.status}>No se pudieron cargar los datos: {String(error)}</p>;
  if (!data) return <p className={styles.status}>Cargando catálogo…</p>;
  return <Dashboard data={data} geo={geo} />;
}

function Dashboard({ data, geo }) {
  const [filters, setFilters] = useState({
    type: "Todos", years: data.yearExtent, region: "Mundial", country: null, genre: null,
  });
  const update = (patch) => setFilters((f) => ({ ...f, ...patch }));

  const view = useMemo(() => {
    const args = [data.titulos, filters, data.paises, data.yearExtent];
    const titles = filterTitles(...args);
    // El mapa y la nube ignoran su propio filtro cruzado para seguir mostrando el contexto completo
    const forMap = filterTitles(...args, { ignore: ["country"] });
    const forCloud = filterTitles(...args, { ignore: ["genre"] });
    const byCountry = titlesByCountry(titles);
    return {
      titles,
      types: contentTypes(titles),
      byCountry,
      mapCounts: titlesByCountry(forMap),
      mapTotal: forMap.length,
      years: releasesByYear(titles),
      cloud: topGenres(forCloud, 22),
      genres: topGenres(titles, 5),
      directors: topDirectors(titles, 5),
    };
  }, [data, filters]);

  const cutoff = formatCutoff(data.fechaCorte);

  return (
    <div className={styles.page}>
      <Header filters={filters} onChange={update} regions={REGIONS} yearExtent={data.yearExtent}
        cutoff={cutoff.replace(/^\d+ de /, "")} />
      <ActiveFilters filters={filters} onChange={update} />

      <main className={styles.grid}>
        <div className={styles.kpis}>
          <KpiRow total={view.titles.length} catalogSize={data.titulos.length} types={view.types}
            countryCount={view.byCountry.size} topCountry={topCountry(view.byCountry)} topGenre={view.genres[0]} />
        </div>

        <Panel area="map" title="Mapa de calor — títulos por país"
          subtitle="Escala logarítmica · clic en un país para filtrar el dashboard">
          <CountryHeatMap geo={geo} countries={data.paises} iso={data.iso} counts={view.mapCounts} total={view.mapTotal}
            region={filters.region} selected={filters.country} onSelect={(country) => update({ country })} />
        </Panel>

        <Panel area="donut" title="Tipo de contenido" subtitle="Proporción de películas y series">
          <ContentTypeDonut movies={view.types.movies} series={view.types.series} />
        </Panel>

        <Panel area="line" title="Evolución de lanzamientos por año"
          subtitle="Año de estreno original vs. año de incorporación a Netflix">
          <ReleasesLineChart data={view.years} />
        </Panel>

        <Panel area="cloud" title="Nube de palabras — géneros"
          subtitle="Tamaño proporcional al número de títulos · clic para filtrar">
          <GenreWordCloud genres={view.cloud} selected={filters.genre} onSelect={(genre) => update({ genre })} />
        </Panel>

        <Panel area="genres" title="Top 5 géneros" subtitle="Número de títulos">
          <TopBarChart data={view.genres} />
        </Panel>

        <Panel area="directors" title="Top 5 directores" subtitle="Número de títulos (excluye títulos sin director)">
          <TopBarChart data={view.directors} />
        </Panel>
      </main>

      <Footer source={data.fuente} cutoff={cutoff} total={data.titulos.length} />
    </div>
  );
}
