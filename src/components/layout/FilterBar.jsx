import styles from "./FilterBar.module.css";

const TYPES = ["Todos", "Película", "Serie"];

// Filtros globales: tipo de contenido, rango de años (año de incorporación) y región.
export default function FilterBar({ filters, onChange, regions, yearExtent }) {
  const [from, to] = filters.years;
  const [min, max] = yearExtent;
  const setYears = (index) => (e) => {
    const years = [...filters.years];
    years[index] = Number(e.target.value);
    if (years[0] <= years[1]) onChange({ years });
  };
  const fillLeft = ((from - min) / (max - min)) * 100;
  const fillRight = ((to - min) / (max - min)) * 100;

  return (
    <div className={styles.bar}>
      <label className={styles.field}>
        <span>Tipo</span>
        <select value={filters.type} onChange={(e) => onChange({ type: e.target.value })}>
          {TYPES.map((t) => (
            <option key={t} value={t}>{t === "Todos" ? t : `${t}s`}</option>
          ))}
        </select>
      </label>

      <div className={`${styles.field} ${styles.years}`}>
        <span>Años</span>
        <b>{from}</b>
        <div
          className={styles.range}
          style={{ "--left": `${fillLeft}%`, "--right": `${100 - fillRight}%` }}
        >
          <input type="range" min={min} max={max} value={from} onChange={setYears(0)} aria-label="Año inicial" />
          <input type="range" min={min} max={max} value={to} onChange={setYears(1)} aria-label="Año final" />
        </div>
        <b>{to}</b>
      </div>

      <label className={styles.field}>
        <span>Región</span>
        <select value={filters.region} onChange={(e) => onChange({ region: e.target.value, country: null })}>
          {["Mundial", ...regions].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
