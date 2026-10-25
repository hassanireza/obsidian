import type { Game } from "../types";
import { GAMES } from "../data/games";
import { GENRES } from "../data/genres";

const DAY_MS = 86_400_000;
const toTime = (dateStr: string) => new Date(`${dateStr}T00:00:00Z`).getTime();

// "New" is measured against the newest release in the catalog rather than a
// hard coded date, so the New shelf never silently empties as time passes.
const ANCHOR = Math.max(...GAMES.map((g) => toTime(g.releaseDate)));
const NEW_WINDOW_DAYS = 60;

const daysSince = (dateStr: string) => (ANCHOR - toTime(dateStr)) / DAY_MS;

export const isNewRelease = (game: Game) =>
  daysSince(game.releaseDate) <= NEW_WINDOW_DAYS;

// A composite score built from real fields rather than a boolean toggle.
// Rewards weight of engagement (plays), quality (rating x review volume),
// and recency, so trending is not just "everything".
const trendScore = (game: Game) => {
  const recency = Math.max(0, 1 - daysSince(game.releaseDate) / 365);
  const engagement = Math.log10(game.plays + 1);
  const quality = (game.rating / 5) * Math.log10(game.reviewCount + 1);
  return engagement * 0.5 + quality * 0.35 + recency * 0.15;
};

export const trendingGames = (): Game[] => {
  const ranked = [...GAMES].sort((a, b) => trendScore(b) - trendScore(a));
  const cutoff = Math.max(3, Math.ceil(GAMES.length * 0.4));
  return ranked.slice(0, cutoff);
};

export const newReleases = (): Game[] =>
  [...GAMES]
    .filter(isNewRelease)
    .sort((a, b) => toTime(b.releaseDate) - toTime(a.releaseDate));

const featuredScore = (game: Game) =>
  game.rating * 0.6 + Math.log10(game.reviewCount + 1) * 0.4;

export const featuredGames = (): Game[] => {
  const eligible = GAMES.filter((g) => g.isEditorsChoice || g.rating >= 4.6);
  return eligible
    .sort((a, b) => featuredScore(b) - featuredScore(a))
    .slice(0, 6);
};

export const editorsChoice = (): Game[] =>
  GAMES.filter((g) => g.isEditorsChoice).sort((a, b) => b.rating - a.rating);

export const topRated = (): Game[] =>
  [...GAMES].sort((a, b) => b.rating - a.rating).slice(0, 6);

export const gamesByGenre = (slug: string): Game[] =>
  GAMES.filter((g) => g.genre === slug);

export const findGame = (slug: string): Game | undefined =>
  GAMES.find((g) => g.slug === slug);

/** Free text match on name, tagline, developer and genre name. */
export const matchesQuery = (game: Game, query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    game.name.toLowerCase().includes(q) ||
    game.tagline.toLowerCase().includes(q) ||
    game.developer.toLowerCase().includes(q) ||
    game.description.toLowerCase().includes(q) ||
    GENRES[game.genre].name.toLowerCase().includes(q)
  );
};

export const searchGames = (query: string): Game[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits = GAMES.filter((g) => matchesQuery(g, q));
  // Title matches first, then everything else in catalog order.
  return hits.sort(
    (a, b) =>
      Number(b.name.toLowerCase().includes(q)) -
      Number(a.name.toLowerCase().includes(q))
  );
};

/** Short status labels shown on covers. Kept to one so cards stay quiet. */
export const gameBadges = (game: Game): string[] => {
  const badges: string[] = [];
  if (isNewRelease(game)) badges.push("New");
  if (game.isEditorsChoice) badges.push("Editor's pick");
  return badges;
};

export const hasReviews = (game: Game) => game.reviewCount > 0;

/** Home hero: newest releases first, then the strongest featured titles. */
export const heroGames = (limit = 5): Game[] => {
  const out: Game[] = [];
  const add = (g: Game) => {
    if (out.length < limit && !out.includes(g)) out.push(g);
  };
  newReleases().forEach(add);
  featuredGames().forEach(add);
  return out;
};

export interface Rail {
  key: string;
  title: string;
  href: string;
  games: Game[];
}

/**
 * Home shelves. Every game appears once across the hero and all shelves, so
 * nothing is listed twice on the page. A shelf with fewer than two unseen
 * games is skipped and its titles fall through to the next one.
 */
export const homeRails = (hero: Game[]): Rail[] => {
  const seen = new Set(hero.map((g) => g.slug));
  const rails: Rail[] = [];

  const byRating = [...GAMES].sort((a, b) => b.rating - a.rating);
  const defs: Array<Omit<Rail, "games"> & { pool: Game[]; max: number }> = [
    {
      // Trending titles first, topped up with the best of the rest so one
      // full shelf carries everything not already in the hero.
      key: "popular",
      title: "Popular now",
      href: "/catalog?filter=trending",
      pool: [...trendingGames(), ...byRating],
      max: 12,
    },
  ];

  for (const { pool, max, ...meta } of defs) {
    const games = pool.filter((g) => !seen.has(g.slug)).slice(0, max);
    if (games.length < 2) continue;
    games.forEach((g) => seen.add(g.slug));
    rails.push({ ...meta, games });
  }
  return rails;
};
