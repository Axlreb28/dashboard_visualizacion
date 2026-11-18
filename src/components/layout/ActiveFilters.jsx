import { countryName } from "../../utils/format.js";
import styles from "./ActiveFilters.module.css";

// Chips de los filtros cruzados (clic en el mapa o en la nube); cada uno se quita con ×.
export default function ActiveFilters({ filters, onChange }) {
  const chips = [
    filters.country && { label: `País: ${countryName(filters.country)}`, clear: { country: null } },
    filters.genre && { label: `Género: ${filters.genre}`, clear: { genre: null } },
  ].filter(Boolean);

  if (!chips.length) {
    return <p className={styles.hint}>Sugerencia: haz clic en un país del mapa o en un género de la nube para filtrar todo el dashboard.</p>;
  }
  return (
    <div className={styles.row}>
      {chips.map((c) => (
        <button key={c.label} className={styles.chip} onClick={() => onChange(c.clear)}>
          {c.label} <span aria-hidden>×</span>
        </button>
      ))}
    </div>
  );
}
