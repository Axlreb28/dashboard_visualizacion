import { useEffect, useMemo } from "react";
import { GeoJSON, MapContainer, useMap } from "react-leaflet";
import L from "leaflet";
import MapLegend from "./MapLegend.jsx";
import { palette } from "../../theme/palette.js";
import { logColorScale } from "../../utils/colorScale.js";
import { countryName, pct, titles } from "../../utils/format.js";
import styles from "./CountryHeatMap.module.css";

const WORLD_BOUNDS = [[-58, -170], [80, 190]];

// Ajusta la vista a la región elegida en el filtro (o al mundo completo).
function FitToRegion({ bounds }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [10, 10] });
  }, [map, bounds]);
  return null;
}

// Zona 4: mapa coroplético de títulos por país con Leaflet. Las geometrías (Natural Earth vía
// world-atlas) se unen con los datos por el código ISO numérico de cada país.
export default function CountryHeatMap({ geo, countries, iso, counts, total, region, selected, onSelect }) {
  const byNumeric = useMemo(() => {
    const m = new Map();
    for (const [code, info] of Object.entries(countries)) m.set(info.num, code);
    return m;
  }, [countries]);

  const max = Math.max(1, ...counts.values());
  const color = logColorScale(max);

  const bounds = useMemo(() => {
    if (region === "Mundial") return WORLD_BOUNDS;
    const feats = geo.features.filter((f) => countries[byNumeric.get(f.id)]?.continente === region);
    const b = L.geoJSON({ type: "FeatureCollection", features: feats }).getBounds();
    return b.isValid() ? b : WORLD_BOUNDS;
  }, [region, geo, countries, byNumeric]);

  const style = (f) => {
    const code = byNumeric.get(f.id);
    const value = counts.get(code) ?? 0;
    const isSelected = code && code === selected;
    return {
      fillColor: value ? color(value) : palette.noData,
      fillOpacity: 1,
      color: isSelected ? palette.text : palette.bg,
      weight: isSelected ? 2 : 0.6,
    };
  };

  const onEachFeature = (f, layer) => {
    const code = byNumeric.get(f.id);
    const value = counts.get(code) ?? 0;
    const alpha2 = code ?? iso[f.id];
    const name = alpha2 ? countryName(alpha2) : f.properties.name;
    layer.bindTooltip(
      `<strong>${name}</strong><br/>${value ? `${titles(value)} · ${pct(value, total)}` : "Sin títulos"}`,
      { sticky: true, className: "map-tooltip" }
    );
    if (value) {
      layer.on({
        click: () => onSelect(code === selected ? null : code),
        mouseover: () => layer.setStyle({ weight: 2, color: palette.text }),
        mouseout: () => layer.setStyle(style(f)),
      });
    }
  };

  // GeoJSON de react-leaflet no se actualiza con nuevos estilos: la clave fuerza el redibujado
  const key = useMemo(() => `${selected}-${total}-${[...counts].join()}`, [selected, total, counts]);

  return (
    <div className={styles.wrap}>
      <MapContainer
        className={styles.map}
        bounds={WORLD_BOUNDS}
        zoomSnap={0.25}
        minZoom={1}
        maxZoom={6}
        maxBounds={[[-85, -240], [85, 240]]}
        scrollWheelZoom={false}
        attributionControl
      >
        <GeoJSON key={key} data={geo} style={style} onEachFeature={onEachFeature}
          attribution='Geometrías: <a href="https://www.naturalearthdata.com/">Natural Earth</a>' />
        <FitToRegion bounds={bounds} />
      </MapContainer>
      <MapLegend max={max} color={color} />
    </div>
  );
}
