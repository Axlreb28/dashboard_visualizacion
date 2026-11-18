import KpiCard from "./KpiCard.jsx";
import { countryName, fmt, pct } from "../../utils/format.js";

// Las cuatro tarjetas KPI definidas en la Fase 2 (tabla de la sección 2).
export default function KpiRow({ total, catalogSize, types, countryCount, topCountry, topGenre }) {
  const filtered = total !== catalogSize;
  return (
    <>
      <KpiCard
        label="Total de títulos"
        value={fmt(total)}
        detail={filtered ? `${pct(total, catalogSize)} del catálogo` : "catálogo completo"}
      />
      <KpiCard
        label="Películas / Series"
        value={`${fmt(types.movies)} / ${fmt(types.series)}`}
        detail={`${pct(types.movies, total)} películas`}
      />
      <KpiCard
        label="Países productores"
        value={fmt(countryCount)}
        detail={topCountry ? `Top: ${countryName(topCountry.name)}` : "—"}
      />
      <KpiCard
        label="Género #1"
        value={topGenre?.name ?? "—"}
        detail={topGenre ? `${fmt(topGenre.value)} títulos` : ""}
      />
    </>
  );
}
