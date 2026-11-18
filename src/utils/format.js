const number = new Intl.NumberFormat("es-MX");
const regionNames = new Intl.DisplayNames(["es"], { type: "region" });

export const fmt = (n) => number.format(n);

export const titles = (n) => `${number.format(n)} título${n === 1 ? "" : "s"}`;

export const pct =(part, total, digits = 1) =>
  total ? `${((part / total) * 100).toFixed(digits)} %` : "0 %";

// Nombre en español a partir del código ISO alfa-2 ("US" -> "Estados Unidos")
export const countryName = (code) => regionNames.of(code) ?? code;
