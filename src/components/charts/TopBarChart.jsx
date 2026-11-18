import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartTooltip from "./ChartTooltip.jsx";
import { palette } from "../../theme/palette.js";
import { fmt } from "../../utils/format.js";

// Zonas 8 y 9: barras horizontales del Top 5. La intensidad baja del 1.º al 5.º lugar
// para reforzar el orden del ranking (Fase 2, sección 5.4).
export default function TopBarChart({ data, labelWidth = 118 }) {
  if (!data.length) return <p style={{ color: palette.muted, fontSize: 13 }}>Sin datos para los filtros actuales.</p>;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 44, bottom: 4, left: 0 }} barCategoryGap={12}>
        <XAxis type="number" hide domain={[0, "dataMax"]} />
        <YAxis type="category" dataKey="name" width={labelWidth} axisLine={false} tickLine={false}
          tick={{ fill: "#D0D0D0", fontSize: 12 }} />
        <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} content={<ChartTooltip />} />
        <Bar dataKey="value" name="Títulos" radius={[0, 4, 4, 0]} isAnimationActive={false}>
          {data.map((d, i) => <Cell key={d.name} fill={palette.accent} fillOpacity={1 - i * 0.13} />)}
          <LabelList dataKey="value" position="right" formatter={fmt} fill={palette.muted} fontSize={12} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
