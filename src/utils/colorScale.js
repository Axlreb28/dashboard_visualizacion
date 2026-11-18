import { sequentialScale } from "../theme/palette.js";

const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

// Escala secuencial logarítmica (Fase 2: EE. UU. concentra el 42 % y con escala lineal
// el resto del mundo se vería del mismo color). Devuelve una función valor -> color.
export function logColorScale(max, stops = sequentialScale) {
  const rgb = stops.map(toRgb);
  const logMax = Math.log(Math.max(max, 2));
  return (value) => {
    const t = Math.min(1, Math.max(0, Math.log(Math.max(value, 1)) / logMax));
    const pos = t * (rgb.length - 1);
    const i = Math.min(Math.floor(pos), rgb.length - 2);
    const f = pos - i;
    const c = rgb[i].map((v, k) => Math.round(v + (rgb[i + 1][k] - v) * f));
    return `rgb(${c.join(",")})`;
  };
}
