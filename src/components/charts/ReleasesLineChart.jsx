import {
  CartesianGrid, Legend, Line, LineChart, ReferenceArea, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import ChartTooltip from "./ChartTooltip.jsx";
import { palette } from "../../theme/palette.js";
import { YEAR_AXIS } from "../../utils/aggregations.js";
import { fmt } from "../../utils/format.js";

const axis = { stroke: palette.border, tick: { fill: palette.muted, fontSize: 12 } };

// Zona 6: líneas de año de estreno vs. año de incorporación; 2021 sombreado como año parcial.
export default function ReleasesLineChart({ data }) {
  const peak = data.reduce((a, b) => (b.added > a.added ? b : a), data[0]);
  // Eje Y en múltiplos redondos (500, 100…) según el valor máximo de los filtros actuales
  const max = Math.max(1, ...data.map((d) => Math.max(d.released, d.added)));
  const step = max > 1000 ? 500 : max > 200 ? 100 : max > 50 ? 20 : 5;
  const yTicks = Array.from({ length: Math.ceil(max / step) + 1 }, (_, i) => i * step);
  return (
    <ResponsiveContainer width="100%" height={270}>
      <LineChart data={data} margin={{ top: 24, right: 20, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke={palette.border} />
        <XAxis dataKey="year" type="number" domain={[YEAR_AXIS.from, YEAR_AXIS.to]}
          ticks={data.map((d) => d.year)} {...axis} />
        <YAxis tickFormatter={fmt} width={52} ticks={yTicks} domain={[0, yTicks.at(-1)]} axisLine={false} tickLine={false} tick={axis.tick} />
        <ReferenceArea x1={YEAR_AXIS.to - 0.5} x2={YEAR_AXIS.to} fill={palette.noData} fillOpacity={1}
          label={{ value: "parcial", position: "insideTop", fill: palette.muted, fontSize: 11 }} />
        <Tooltip content={<ChartTooltip labelPrefix="Año " />} />
        <Legend verticalAlign="top" align="left" height={28} iconType="plainline"
          wrapperStyle={{ fontSize: 12, color: palette.muted, top: -6 }} />
        <Line type="monotone" dataKey="released" name="Año de estreno" stroke={palette.accent}
          strokeWidth={3} dot={false} isAnimationActive={false} />
        <Line type="monotone" dataKey="added" name="Agregados a Netflix" stroke={palette.secondary}
          strokeWidth={3} dot={false} isAnimationActive={false} />
        {peak?.added > 0 && (
          <ReferenceDot x={peak.year} y={peak.added} r={5} fill={palette.secondary} stroke="none"
            label={{ value: `Pico: ${fmt(peak.added)} títulos agregados en ${peak.year}`, position: "left",
              fill: palette.text, fontSize: 12, offset: 10 }} />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
