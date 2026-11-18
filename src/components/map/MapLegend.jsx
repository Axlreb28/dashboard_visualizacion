import { palette } from "../../theme/palette.js";
import { fmt } from "../../utils/format.js";
import styles from "./CountryHeatMap.module.css";

const STEPS = 40;

// Leyenda de la escala secuencial (logarítmica) + muestra de "sin títulos".
export default function MapLegend({ max, color }) {
  const stops = Array.from({ length: STEPS + 1 }, (_, i) => color(Math.exp((i / STEPS) * Math.log(max))));
  return (
    <div className={styles.legend}>
      <div>
        <div className={styles.gradient} style={{ background: `linear-gradient(to right, ${stops.join(",")})` }} />
        <div className={styles.ticks}><span>1</span><span>{fmt(max)} títulos</span></div>
      </div>
      <div className={styles.noData}>
        <i style={{ background: palette.noData }} /> sin títulos / sin dato
      </div>
    </div>
  );
}
