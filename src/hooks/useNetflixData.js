import { useEffect, useState } from "react";
import { feature } from "topojson-client";

const base = import.meta.env.BASE_URL;

// Polígonos que cruzan el antimeridiano (Rusia, Fiyi, Alaska) saltan de 180° a -180° y Leaflet
// los dibuja como una franja que atraviesa el mapa; se desplazan las longitudes negativas +360°.
function unwrapAntimeridian(geometry) {
  const fixRing = (ring) =>
    ring.some((p, i) => i && Math.abs(p[0] - ring[i - 1][0]) > 180)
      ? ring.map(([lon, lat]) => [lon < 0 ? lon + 360 : lon, lat])
      : ring;
  if (geometry.type === "Polygon") geometry.coordinates = geometry.coordinates.map(fixRing);
  if (geometry.type === "MultiPolygon") geometry.coordinates = geometry.coordinates.map((p) => p.map(fixRing));
}

// Carga en paralelo el catálogo limpio (generado por scripts/limpieza.py) y la geometría del mapa.
export function useNetflixData() {
  const [state, setState] = useState({ data: null, geo: null, error: null });

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(`${base}data/netflix.json`).then((r) => r.json()),
      fetch(`${base}data/countries-50m.json`).then((r) => r.json()),
    ])
      .then(([data, topo]) => {
        if (cancelled) return;
        const geo = feature(topo, topo.objects.countries);
        geo.features = geo.features.filter((f) => f.properties.name !== "Antarctica");
        geo.features.forEach((f) => f.geometry && unwrapAntimeridian(f.geometry));
        const years = data.titulos.map((t) => t.anioAgregado).filter(Boolean);
        data.yearExtent = [Math.min(...years), Math.max(...years)];
        setState({ data, geo, error: null });
      })
      .catch((error) => !cancelled && setState({ data: null, geo: null, error }));
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
