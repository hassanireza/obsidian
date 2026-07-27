import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import GameGrid from "../components/GameGrid";
import Reveal from "../components/Reveal";
import { GAMES } from "../data/games";
import { GENRE_LIST } from "../data/genres";
import { newReleases, searchGames, trendingGames } from "../lib/categories";
import "./catalog.css";

type SortKey = "relevance" | "rating" | "plays" | "newest";

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const genre = params.get("genre") ?? "";
  const filter = params.get("filter") ?? "";
  const q = params.get("q") ?? "";
  const [sort, setSort] = useState<SortKey>("relevance");

  const base = useMemo(() => {
    if (q) return searchGames(q);
    if (filter === "new") return newReleases();
    if (filter === "trending") return trendingGames();
    return GAMES;
  }, [q, filter]);

  const filtered = useMemo(() => {
    let list = genre ? base.filter((g) => g.genre === genre) : base;
    list = [...list];
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "plays") list.sort((a, b) => b.plays - a.plays);
    if (sort === "newest")
      list.sort(
        (a, b) =>
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      );
    return list;
  }, [base, genre, sort]);

  const setGenre = (slug: string) => {
    const next = new URLSearchParams(params);
    if (slug) next.set("genre", slug);
    else next.delete("genre");
    setParams(next);
  };

  const setFilter = (key: string) => {
    const next = new URLSearchParams(params);
    if (key) next.set("filter", key);
    else next.delete("filter");
    next.delete("q");
    setParams(next);
  };

  const heading = q
    ? `Results for "${q}"`
    : filter === "new"
    ? "New releases"
    : filter === "trending"
    ? "Trending now"
    : "Full catalog";

  return (
    <div className="catalog container">
      <Reveal as="div" className="catalog__header">
        <p className="label-caps">Catalog</p>
        <h1>{heading}</h1>
        <p className="catalog__count">
          {filtered.length} game{filtered.length === 1 ? "" : "s"}
        </p>
      </Reveal>

      <div className="catalog__search">
        <input
          value={q}
          onChange={(e) => {
            const next = new URLSearchParams(params);
            if (e.target.value) next.set("q", e.target.value);
            else next.delete("q");
            setParams(next);
          }}
          placeholder="Search all games"
          aria-label="Search games"
          autoFocus={params.get("focus") === "search"}
        />
      </div>

      <div className="catalog__controls">
        <div className="catalog__filters">
          <button
            className={`chip ${!filter ? "chip--active" : ""}`}
            onClick={() => setFilter("")}
          >
            All
          </button>
          <button
            className={`chip ${filter === "new" ? "chip--active" : ""}`}
            onClick={() => setFilter("new")}
          >
            New ({newReleases().length})
          </button>
          <button
            className={`chip ${filter === "trending" ? "chip--active" : ""}`}
            onClick={() => setFilter("trending")}
          >
            Trending
          </button>
        </div>

        <div className="catalog__genres">
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">All genres</option>
            {GENRE_LIST.map((g) => (
              <option key={g.slug} value={g.slug}>
                {g.name}
              </option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="relevance">Sort: Relevance</option>
            <option value="rating">Sort: Rating</option>
            <option value="plays">Sort: Most played</option>
            <option value="newest">Sort: Newest</option>
          </select>
        </div>
      </div>

      <div className="catalog__grid">
        <GameGrid games={filtered} />
      </div>
    </div>
  );
}
