import { fmt, pct } from "../../utils/format.js";
import styles from "./ChartTooltip.module.css";

// Tooltip común para los gráficos de Recharts: valor exacto y, si hay total, porcentaje.
export default function ChartTooltip({ active, payload, label, total, labelPrefix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      {label !== undefined && <strong>{labelPrefix}{label}</strong>}
      {payload.map((p) => (
        <div key={p.dataKey ?? p.name}>
          <i style={{ background: p.payload?.fill ?? p.color }} />
          {p.name}: {fmt(p.value)}
          {total ? ` · ${pct(p.value, total)}` : ""}
        </div>
      ))}
    </div>
  );
}
