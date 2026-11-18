import styles from "./Panel.module.css";

// Contenedor común de cada zona del wireframe: título que describe la pregunta + subtítulo.
export default function Panel({ title, subtitle, area, children }) {
  return (
    <section className={styles.panel} style={{ gridArea: area }} aria-label={title}>
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      <div className={styles.body}>{children}</div>
    </section>
  );
}
