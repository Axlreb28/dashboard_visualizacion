import { fmt } from "../../utils/format.js";
import styles from "./Footer.module.css";

// Zona 10 del wireframe: fuente, fecha de corte y notas metodológicas.
export default function Footer({ source, cutoff, total }) {
  return (
    <footer className={styles.footer}>
      Fuente: {source} ({fmt(total)} títulos). Fecha de corte: {cutoff}. Géneros agrupados entre películas y
      series; las coproducciones cuentan para cada país; los países históricos (Alemania Occidental/Oriental,
      Unión Soviética) se asignan a su estado sucesor.
    </footer>
  );
}
