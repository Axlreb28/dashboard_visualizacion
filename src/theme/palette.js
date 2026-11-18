// Paleta definida en la Fase 2 (sección 5.1). Es la única fuente de colores:
// main.jsx la publica como variables CSS (--color-*) y los gráficos la importan directamente.
export const palette = {
  bg: "#141414", // fondo general
  surface: "#1F1F1F", // tarjetas y paneles
  border: "#2E2E2E", // bordes y cuadrícula
  text: "#F5F5F5", // texto principal
  muted: "#A3A3A3", // texto secundario, ejes
  accent: "#E50914", // dato principal (películas, año de estreno, barras)
  secondary: "#8C9BAB", // dato de comparación (series, agregados a Netflix)
  noData: "#2A2A2A", // países sin títulos
};

// Escala secuencial del mapa: de menos a más títulos (los valores altos son los más claros)
export const sequentialScale = ["#3B1D1F", "#7A1016", "#B20710", "#E50914", "#FF8A90"];

export function applyPaletteToCss(root = document.documentElement) {
  for (const [name, value] of Object.entries(palette)) {
    root.style.setProperty(`--color-${name}`, value);
  }
}
