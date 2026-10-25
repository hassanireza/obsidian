import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import GameGrid from "../components/GameGrid";
import Reveal from "../components/Reveal";
import { IconClose } from "../components/icons";
import { GAMES } from "../data/games";
import { GENRE_LIST } from "../data/genres";
import {
  editorsChoice,
  matchesQuery,
  newReleases,
  trendingGames,
} from "../lib/categories";
import type { Game } from "../types";
import "./catalog.css";

type SortKey = "featured" | "rating" | "plays" | "newest";

const SORTS: Array<{ key: SortKey; label: string }> = [
  { key: "featured", label: "Featured" },
  { key: "rating", label: "Top rated" },
  { key: "plays", label: "Most played" },
  { key: "newest", label: "Newest" },
];

const FILTERS = [
  { key: "", label: "All", title: "All games" },
  { key: "new", label: "New", title: "New releases" },
  { key: "trending", label: "Trending", title: "Trending now" },
  { key: "editors", label: "Editors\u2019 picks", title: "Editors\u2019 picks" },
] as const;

const poolFor = (filter: string): Game[] => {
  switch (filter) {
    case "new":
      return newReleases();
    case "trending":
      return trendingGames();
    case "editors":
      return editorsChoice();
    default:
      return GAMES;
  }
};

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const filter = params.get("filter") ?? "";
  const genre = params.get("genre") ?? "";
  const q = params.get("q") ?? "";
  const sortParam = params.get("sort") as SortKey | null;
  const sort: SortKey = SORTS.some((s) => s.key === sortParam) ? sortParam! : "featured";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const pool = useMemo(() => poolFor(filter), [filter]);

  const results = useMemo(() => {
    const list = pool.filter(
      (g) => (!genre || g.genre === genre) && matchesQuery(g, q)
    );
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "plays") list.sort((a, b) => b.plays - a.plays);
    if (sort === "newest")
      list.sort(
        (a, b) =>
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      );
    return list;
  }, [pool, genre, q, sort]);

  const filterTitle = FILTERS.find((f) => f.key === filter)?.title ?? "All games";
  const genreName = GENRE_LIST.find((g) => g.slug === genre)?.name;
  const heading = q
    ? `Results for \u201c${q}\u201d`
    : genreName && !filter
    ? genreName
    : filterTitle;

  const hasFilters = Boolean(filter || genre || q);

  return (
    <div className="catalog container">
      <Reveal as="header" className="catalog__header">
        <p className="label-caps">Catalog</p>
        <h1>{heading}</h1>
      </Reveal>

      <div className="catalog__filters" role="group" aria-label="Filters">
        <div className="chip-rail" role="group" aria-label="Collection">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className="chip"
              aria-pressed={filter === f.key}
              onClick={() => setParam("filter", f.key)}
            >
              {f.label}
              <span className="chip__count">{poolFor(f.key).length}</span>
            </button>
          ))}
        </div>

        <div className="chip-rail" role="group" aria-label="Genre">
          <button
            type="button"
            className="chip"
            aria-pressed={!genre}
            onClick={() => setParam("genre", "")}
          >
            All genres
          </button>
          {GENRE_LIST.map((g) => (
            <button
              key={g.slug}
              type="button"
              className="chip"
              aria-pressed={genre === g.slug}
              onClick={() => setParam("genre", g.slug)}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      <div className="catalog__toolbar">
        <p className="catalog__count" aria-live="polite">
          {results.length} game{results.length === 1 ? "" : "s"}
        </p>

        <div className="catalog__toolbar-end">
          {hasFilters && (
            <button
              type="button"
              className="catalog__clear"
              onClick={() => setParams({}, { replace: true })}
            >
              <IconClose /> Clear all
            </button>
          )}
          <label className="catalog__sort">
            <span className="sr-only">Sort by</span>
            <select
              className="select"
              value={sort}
              onChange={(e) => setParam("sort", e.target.value === "featured" ? "" : e.target.value)}
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {results.length > 0 ? (
        <GameGrid games={results} />
      ) : (
        <div className="catalog__empty">
          <h2>Nothing matches yet</h2>
          <p>Try a different genre, or clear the filters to see everything.</p>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setParams({}, { replace: true })}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
