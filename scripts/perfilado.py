"""Perfilado del dataset Netflix Titles (Fase 1).

Reporta nulos, inconsistencias, valores atípicos y un adelanto de los KPIs.
Uso: python scripts/perfilado.py data/netflix_titles.csv
"""
import sys

import pandas as pd


def separar(serie):
    """Separa un campo multivalor ("A, B, C") en una fila por valor."""
    valores = serie.dropna().str.split(",").explode().str.strip()
    return valores[valores != ""]


def atipicos_iqr(serie):
    q1, q3 = serie.quantile([0.25, 0.75])
    iqr = q3 - q1
    return serie[(serie < q1 - 1.5 * iqr) | (serie > q3 + 1.5 * iqr)]


def main(ruta):
    df = pd.read_csv(ruta, encoding="utf-8")
    print(f"Registros: {len(df)}  Columnas: {df.shape[1]}")

    print("\n== Valores nulos ==")
    nulos = df.isna().sum()
    print(pd.DataFrame({"nulos": nulos, "%": (nulos / len(df) * 100).round(1)}))

    print("\n== Duplicados ==")
    print("show_id:", df.show_id.duplicated().sum())
    print("title+type+release_year:", df.duplicated(["title", "type", "release_year"]).sum())

    print("\n== Inconsistencias ==")
    mal_rating = df[df.rating.str.contains("min", na=False)]
    print("rating con duración:", mal_rating[["title", "rating", "duration"]].to_dict("records"))
    print("date_added con espacios:", df.date_added.str.startswith(" ", na=False).sum())
    print("country con coma final:", df.country.str.strip().str.endswith(",", na=False).sum())
    fecha = pd.to_datetime(df.date_added.str.strip(), format="%B %d, %Y", errors="coerce")
    print("date_added rango:", fecha.min().date(), "->", fecha.max().date())
    print("agregado antes de su estreno:", (fecha.dt.year < df.release_year).sum())

    print("\n== Valores atípicos (IQR) ==")
    print("release_year:", len(atipicos_iqr(df.release_year)))
    minutos = df[df.type == "Movie"].duration.str.extract(r"(\d+) min")[0].astype(float).dropna()
    print("duración películas (min):", len(atipicos_iqr(minutos)),
          f"| min={minutos.min():.0f} max={minutos.max():.0f}")
    temporadas = df[df.type == "TV Show"].duration.str.extract(r"(\d+) Season")[0].astype(float)
    print("temporadas: max =", int(temporadas.max()))

    print("\n== Adelanto de KPIs ==")
    print("Tipo de contenido:", df.type.value_counts().to_dict())
    paises = separar(df.country)
    print(f"Países distintos: {paises.nunique()}")
    print("Top 10 países:", paises.value_counts().head(10).to_dict())
    print("Top 5 géneros:", separar(df.listed_in).value_counts().head(5).to_dict())
    print("Top 5 directores:", separar(df.director).value_counts().head(5).to_dict())
    print("Títulos agregados por año:", fecha.dt.year.dropna().astype(int).value_counts().sort_index().to_dict())


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "data/netflix_titles.csv")
