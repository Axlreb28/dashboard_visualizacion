"""Limpieza y transformación del dataset Netflix Titles (plan de la Fase 1).

Genera public/data/netflix.json, que el dashboard carga con fetch.
Uso: python scripts/limpieza.py data/netflix_titles.csv [public/data/netflix.json]
Requiere: pip install pandas pycountry pycountry-convert
"""
import json
import sys
from pathlib import Path

import pandas as pd
import pycountry
import pycountry_convert as pcc

# Agrupación de géneros equivalentes entre películas y series (columna genre_group)
GENRE_GROUP = {
    "International Movies": "Internacional", "International TV Shows": "Internacional",
    "Dramas": "Drama", "TV Dramas": "Drama",
    "Comedies": "Comedia", "TV Comedies": "Comedia",
    "Stand-Up Comedy": "Stand-up", "Stand-Up Comedy & Talk Shows": "Stand-up",
    "Documentaries": "Documental", "Docuseries": "Documental",
    "Action & Adventure": "Acción", "TV Action & Adventure": "Acción",
    "Independent Movies": "Independiente",
    "Children & Family Movies": "Infantil", "Kids' TV": "Infantil",
    "Romantic Movies": "Romance", "Romantic TV Shows": "Romance",
    "Thrillers": "Thriller", "TV Thrillers": "Thriller",
    "Crime TV Shows": "Crimen",
    "Horror Movies": "Terror", "TV Horror": "Terror",
    "Music & Musicals": "Musical",
    "Reality TV": "Reality",
    "British TV Shows": "Británico",
    "Anime Series": "Anime", "Anime Features": "Anime",
    "Sci-Fi & Fantasy": "Ciencia ficción", "TV Sci-Fi & Fantasy": "Ciencia ficción",
    "Spanish-Language TV Shows": "Habla hispana",
    "Korean TV Shows": "Coreano",
    "Sports Movies": "Deportes",
    "TV Mysteries": "Misterio",
    "Faith & Spirituality": "Espiritualidad",
    "Teen TV Shows": "Juvenil",
    "LGBTQ Movies": "LGBTQ+",
    "Cult Movies": "Culto",
    "Classic Movies": "Clásicos", "Classic & Cult TV": "Clásicos",
    "Science & Nature TV": "Ciencia y naturaleza",
    "Movies": "Otros", "TV Shows": "Otros",
}

# Nombres que pycountry no resuelve; los países históricos se asignan a su estado sucesor
COUNTRY_ALIAS = {
    "Russia": "RU", "South Korea": "KR", "Iran": "IR", "Syria": "SY", "Vietnam": "VN",
    "Taiwan": "TW", "Palestine": "PS", "Vatican City": "VA", "Czech Republic": "CZ",
    "Turkey": "TR", "Soviet Union": "RU", "West Germany": "DE", "East Germany": "DE",
}

CONTINENT = {"NA": "Norteamérica", "SA": "Sudamérica", "EU": "Europa", "AF": "África",
             "AS": "Asia", "OC": "Oceanía"}


def split(value):
    """Separa un campo multivalor ("A, B, C") en una lista sin vacíos ni duplicados."""
    if pd.isna(value):
        return []
    return list(dict.fromkeys(v.strip() for v in str(value).split(",") if v.strip()))


def country_info(name):
    alpha2 = COUNTRY_ALIAS.get(name) or pycountry.countries.lookup(name).alpha_2
    country = pycountry.countries.get(alpha_2=alpha2)
    continent = CONTINENT[pcc.country_alpha2_to_continent_code(alpha2)] if alpha2 != "VA" else "Europa"
    return alpha2, {"num": country.numeric, "continente": continent}


def main(src, dst):
    df = pd.read_csv(src, encoding="utf-8")
    total = len(df)

    # 1. Normalizar texto: trim en todas las columnas de texto
    for col in df.select_dtypes("object"):
        df[col] = df[col].str.strip()

    # 2. Corregir campos desplazados: duración escrita en rating
    moved = df.rating.str.contains("min", na=False)
    df.loc[moved, "duration"] = df.loc[moved, "rating"]
    df.loc[moved, "rating"] = "NR"

    # 3-6. Nulos: director y country se tratan como listas vacías (= "Desconocido"),
    # rating -> "NR"; date_added nulo se conserva
    df["rating"] = df.rating.fillna("NR")

    # 7. Conversión de fechas y columnas derivadas
    added = pd.to_datetime(df.date_added, format="%B %d, %Y", errors="coerce")
    df["year_added"] = added.dt.year.astype("Int64")
    df["month_added"] = added.dt.month.astype("Int64")

    # 9. Inconsistencia de fechas: se marca, no se elimina
    df["fecha_inconsistente"] = df.year_added < df.release_year

    # 8. Campos multivalor -> listas
    countries = {}
    records = []
    for row in df.itertuples():
        codes = []
        for name in split(row.country):
            code, info = country_info(name)
            countries[code] = info
            if code not in codes:
                codes.append(code)
        genres = list(dict.fromkeys(GENRE_GROUP[g] for g in split(row.listed_in)))
        records.append({
            "id": row.show_id,
            "tipo": "Película" if row.type == "Movie" else "Serie",
            "anioAgregado": None if pd.isna(row.year_added) else int(row.year_added),
            "anioEstreno": int(row.release_year),
            "paises": codes,
            "generos": genres,
            "directores": split(row.director),
        })

    out = {
        "fuente": "Kaggle - Netflix Movies and TV Shows (shivamb/netflix-shows)",
        "fechaCorte": added.max().strftime("%Y-%m-%d"),
        "paises": countries,
        # Código numérico -> alfa-2 de todos los países, para nombrar en español los que no tienen títulos
        "iso": {c.numeric: c.alpha_2 for c in pycountry.countries},
        "titulos": records,
    }
    Path(dst).parent.mkdir(parents=True, exist_ok=True)
    Path(dst).write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    # Validación de conteos
    assert len(records) == total, "se perdieron registros"
    print(f"Títulos: {len(records)} (sin pérdidas)")
    print(f"Países (ISO): {len(countries)}")
    print(f"Géneros agrupados: {len(set(g for r in records for g in r['generos']))}")
    print(f"Rating corregido: {int(moved.sum())} | fechas inconsistentes: {int(df.fecha_inconsistente.sum())}")
    print(f"Sin fecha de incorporación: {int(df.year_added.isna().sum())}")
    print(f"Archivo: {dst} ({Path(dst).stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "data/netflix_titles.csv",
         sys.argv[2] if len(sys.argv) > 2 else "public/data/netflix.json")
