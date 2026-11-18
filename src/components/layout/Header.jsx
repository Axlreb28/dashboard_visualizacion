import FilterBar from "./FilterBar.jsx";
import styles from "./Header.module.css";

const DOCS_URL = "https://github.com/Axlreb28/dashboard_visualizacion/tree/main/docs";

// Zonas 1 (título) y 2 (filtros globales) del wireframe.
export default function Header({ filters, onChange, regions, yearExtent, cutoff }) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>La economía del entretenimiento: Netflix y tendencias globales</h1>
        <p className={styles.subtitle}>Dashboard estratégico · catálogo 2008 – {cutoff}</p>
      </div>
      <div className={styles.actions}>
        <FilterBar filters={filters} onChange={onChange} regions={regions} yearExtent={yearExtent} />
        <a className={styles.docs} href={DOCS_URL} target="_blank" rel="noreferrer">
          Documentación
        </a>
      </div>
    </header>
  );
}
