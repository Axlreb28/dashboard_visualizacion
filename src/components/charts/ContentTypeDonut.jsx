import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import ChartTooltip from "./ChartTooltip.jsx";
import { palette } from "../../theme/palette.js";
import { fmt, pct } from "../../utils/format.js";
import styles from "./ContentTypeDonut.module.css";

// Zona 5: gráfico circular (dona) películas vs. series, con el total al centro.
export default function ContentTypeDonut({ movies, series }) {
  const total = movies + series;
  const data = [
    { name: "Películas", value: movies, fill: palette.accent },
    { name: "Series", value: series, fill: palette.secondary },
  ];
  return (
    <div className={styles.wrap}>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="95%"
              startAngle={90} endAngle={-270} stroke={palette.surface} strokeWidth={3} isAnimationActive={false}>
              {data.map((d) => <Cell key={d.name} fill={d.fill} />)}
            </Pie>
            <Tooltip content={<ChartTooltip total={total} />} />
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.center}>
          <strong>{fmt(total)}</strong>
          <span>títulos</span>
        </div>
      </div>
      <ul className={styles.legend}>
        {data.map((d) => (
          <li key={d.name}><i style={{ background: d.fill }} />{d.name} {pct(d.value, total)}</li>
        ))}
      </ul>
    </div>
  );
}
