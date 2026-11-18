// Cálculo de KPIs y series a partir de la lista de títulos (equivale a las vistas SQL
// vw_* planeadas en la Fase 1). Todas son funciones puras: reciben títulos y devuelven datos.

export const YEAR_AXIS = { from: 2000, to: 2021 };

function countBy(titles, keysOf) {
  const counts = new Map();
  for (const t of titles) {
    for (const key of keysOf(t)) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

const ranked = (counts, n = Infinity) =>
  [...counts].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, n);

export function filterTitles(titles, filters, countries, yearExtent, { ignore = [] } = {}) {
  const { type, years, region, country, genre } = filters;
  const fullRange = years[0] === yearExtent[0] && years[1] === yearExtent[1];
  return titles.filter(
    (t) =>
      (type === "Todos" || t.tipo === type) &&
      // con el rango completo se incluyen los 10 títulos sin fecha de incorporación
      (fullRange || (t.anioAgregado !== null && t.anioAgregado >= years[0] && t.anioAgregado <= years[1])) &&
      (region === "Mundial" || t.paises.some((c) => countries[c].continente === region)) &&
      (ignore.includes("country") || !country || t.paises.includes(country)) &&
      (ignore.includes("genre") || !genre || t.generos.includes(genre))
  );
}

// KPI: películas vs. series
export function contentTypes(titles) {
  const counts = countBy(titles, (t) => [t.tipo]);
  return { movies: counts.get("Película") ?? 0, series: counts.get("Serie") ?? 0 };
}

// KPI: títulos por país (una coproducción cuenta para cada país)
export const titlesByCountry = (titles) => countBy(titles, (t) => t.paises);

// KPI: Top géneros (agrupados entre películas y series); "Otros" no es un género real
export const topGenres = (titles, n) =>
  ranked(countBy(titles, (t) => t.generos.filter((g) => g !== "Otros")), n);

// KPI: Top directores (los títulos sin director no participan)
export const topDirectors = (titles, n = 5) => ranked(countBy(titles, (t) => t.directores), n);

// KPI: lanzamientos por año (año de estreno y año de incorporación a Netflix)
export function releasesByYear(titles) {
  const released = countBy(titles, (t) => [t.anioEstreno]);
  const added = countBy(titles, (t) => (t.anioAgregado ? [t.anioAgregado] : []));
  const rows = [];
  for (let year = YEAR_AXIS.from; year <= YEAR_AXIS.to; year++) {
    rows.push({ year, released: released.get(year) ?? 0, added: added.get(year) ?? 0 });
  }
  return rows;
}

export const topCountry = (byCountry) => ranked(byCountry, 1)[0] ?? null;
