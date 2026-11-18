import styles from "./KpiCard.module.css";

// Tarjeta KPI (zona 3 del wireframe): etiqueta, valor grande y detalle en color de acento.
export default function KpiCard({ label, value, detail }) {
  return (
    <article className={styles.card}>
      <span className={styles.label}>{label}</span>
      <strong className={styles.value} title={String(value)}>{value}</strong>
      {detail && <span className={styles.detail}>{detail}</span>}
    </article>
  );
}
