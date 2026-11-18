import { palette } from "../../theme/palette.js";
import { fmt } from "../../utils/format.js";
import styles from "./GenreWordCloud.module.css";

const MIN_FONT = 13;
const MAX_FONT = 52;
// Orden fijo de colocación para que los géneros grandes queden al centro y la nube no cambie al recargar
const ORDER = [9, 3, 14, 1, 6, 17, 0, 11, 4, 19, 2, 8, 15, 5, 12, 20, 7, 16, 10, 21, 13, 18];

// Zona 7: nube de palabras de géneros. Tamaño proporcional a la raíz del número de títulos
// (así el área de la palabra crece con el valor). Clic en un género = filtro cruzado.
export default function GenreWordCloud({ genres, selected, onSelect }) {
  if (!genres.length) return <p className={styles.empty}>Sin datos para los filtros actuales.</p>;
  const values = genres.map((g) => g.value);
  const [min, max] = [Math.min(...values), Math.max(...values)];
  const t = (v) => (max === min ? 1 : (Math.sqrt(v) - Math.sqrt(min)) / (Math.sqrt(max) - Math.sqrt(min)));
  const order = ORDER.filter((i) => i < genres.length);

  return (
    <div className={styles.cloud}>
      {order.map((i) => {
        const g = genres[i];
        const color = i < 3 ? palette.accent : i % 2 ? palette.text : palette.secondary;
        const isSelected = selected === g.name;
        return (
          <button
            key={g.name}
            className={`${styles.word} ${isSelected ? styles.selected : ""}`}
            style={{
              fontSize: MIN_FONT + t(g.value) * (MAX_FONT - MIN_FONT),
              color,
              opacity: selected && !isSelected ? 0.35 : 0.55 + t(g.value) * 0.45,
              fontWeight: t(g.value) > 0.5 ? 700 : 600,
            }}
            title={`${g.name}: ${fmt(g.value)} títulos`}
            onClick={() => onSelect(isSelected ? null : g.name)}
          >
            {g.name}
          </button>
        );
      })}
    </div>
  );
}
