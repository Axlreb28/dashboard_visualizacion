import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import kpis from "./data/kpis.json";

const fmt = (n) => n.toLocaleString("es-MX");
const COLORES = ["#E50914", "#5B6B7F"];

function Tarjeta({ titulo, valor, detalle }) {
  return (
    <div className="tarjeta">
      <span className="tarjeta-titulo">{titulo}</span>
      <strong>{valor}</strong>
      {detalle && <span className="tarjeta-detalle">{detalle}</span>}
    </div>
  );
}

function Panel({ titulo, children, ancho }) {
  return (
    <section className={`panel ${ancho ? "panel-ancho" : ""}`}>
      <h2>{titulo}</h2>
      {children}
    </section>
  );
}

function Barras({ datos, campo }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={datos} layout="vertical" margin={{ left: 20, right: 20 }}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey={campo} width={150} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v) => fmt(v)} />
        <Bar isAnimationActive={false} dataKey="titulos" name="Títulos" fill="#E50914" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function App() {
  const tipo = [
    { name: "Películas", value: kpis.tipo.Movie },
    { name: "Series", value: kpis.tipo["TV Show"] },
  ];
  const base = import.meta.env.BASE_URL;

  return (
    <div className="app">
      <header>
        <div>
          <h1>La economía del entretenimiento: Netflix y tendencias globales</h1>
          <p>Equipo 🥃 · Axel Rebolledo Cordova · Dashboard estratégico</p>
        </div>
        <a className="boton" href={`${base}Fase1_Justificacion.pdf`} target="_blank" rel="noreferrer">
          Documento Fase 1 (PDF)
        </a>
      </header>

      <p className="aviso">
        Vista previa (Fase 1): datos sin limpiar calculados del CSV de Kaggle. En la Fase 2 se
        conectará a PostgreSQL (Supabase) con los datos depurados.
      </p>

      <div className="tarjetas">
        <Tarjeta titulo="Títulos en catálogo" valor={fmt(kpis.total)} />
        <Tarjeta titulo="Películas" valor={fmt(kpis.tipo.Movie)}
          detalle={`${((kpis.tipo.Movie / kpis.total) * 100).toFixed(1)} %`} />
        <Tarjeta titulo="Series" valor={fmt(kpis.tipo["TV Show"])}
          detalle={`${((kpis.tipo["TV Show"] / kpis.total) * 100).toFixed(1)} %`} />
        <Tarjeta titulo="Países productores" valor={kpis.paises} />
      </div>

      <div className="rejilla">
        <Panel titulo="Evolución por año (2000–2021)" ancho>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={kpis.porAnio}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="anio" />
              <YAxis />
              <Tooltip formatter={(v) => fmt(v)} />
              <Legend />
              <Line isAnimationActive={false} type="monotone" dataKey="estrenos" name="Año de estreno" stroke="#E50914" strokeWidth={2} dot={false} />
              <Line isAnimationActive={false} type="monotone" dataKey="agregados" name="Agregados a Netflix" stroke="#9AA5B1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <small>2021 es un año parcial (datos hasta el 25 de septiembre).</small>
        </Panel>

        <Panel titulo="Tipo de contenido">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie isAnimationActive={false} data={tipo} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} label={(e) => e.name}>
                {tipo.map((_, i) => <Cell key={i} fill={COLORES[i]} />)}
              </Pie>
              <Tooltip formatter={(v) => fmt(v)} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel titulo="Top 10 países por número de títulos">
          <Barras datos={kpis.topPaises} campo="pais" />
        </Panel>

        <Panel titulo="Top 5 géneros">
          <Barras datos={kpis.topGeneros} campo="genero" />
        </Panel>

        <Panel titulo="Top 5 directores más productivos">
          <Barras datos={kpis.topDirectores} campo="director" />
        </Panel>
      </div>

      <footer>
        Fuente: Kaggle – Netflix Movies and TV Shows (8,807 títulos). Próximas fases: mapa de calor
        por país y nube de palabras de géneros.
      </footer>
    </div>
  );
}
