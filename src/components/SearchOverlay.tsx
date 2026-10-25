import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import Cover from "./Cover";
import { IconArrow, IconClose, IconSearch, IconStar } from "./icons";
import { GENRE_LIST, GENRES } from "../data/genres";
import { hasReviews, searchGames, trendingGames } from "../lib/categories";
import "./searchOverlay.css";

interface SearchOverlayProps {
  onClose: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Command-palette style search. Full screen sheet on phones, centred dialog
 * on desktop. Live results with arrow key navigation.
 */
export default function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const trimmed = query.trim();
  const results = useMemo(() => (trimmed ? searchGames(trimmed).slice(0, 6) : []), [trimmed]);
  const suggestions = useMemo(() => trendingGames().slice(0, 4), []);
  const list = trimmed ? results : suggestions;
  // With a query, the last row is "See all results"
  const rowCount = trimmed ? list.length + 1 : list.length;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, []);

  const go = (to: string) => {
    onClose();
    navigate(to);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === "Tab") {
      // Keep focus inside the dialog
      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      return;
    }
    if (e.target !== inputRef.current || rowCount === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % rowCount);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + rowCount) % rowCount);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed) return;
    const game = list[active];
    if (game && active < list.length) go(`/games/${game.slug}`);
    else go(`/catalog?q=${encodeURIComponent(trimmed)}`);
  };

  return createPortal(
    <div className="search-overlay" onKeyDown={onKeyDown}>
      <div className="search-overlay__backdrop" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        className="search-overlay__dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Search games"
      >
        <form className="search-overlay__bar" onSubmit={submit} role="search">
          <IconSearch />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Search games, genres, studios"
            aria-label="Search games"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="search"
          />
          <button type="button" className="search-overlay__close" onClick={onClose}>
            <span className="search-overlay__close-label">Cancel</span>
            <IconClose />
          </button>
        </form>

        <div className="search-overlay__body">
          {!trimmed && (
            <>
              <p className="label-caps search-overlay__heading">Browse by genre</p>
              <div className="search-overlay__chips">
                {GENRE_LIST.map((g) => (
                  <Link
                    key={g.slug}
                    to={`/catalog?genre=${g.slug}`}
                    className="chip"
                    onClick={onClose}
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
              <p className="label-caps search-overlay__heading">Trending now</p>
            </>
          )}

          {trimmed && results.length === 0 && (
            <p className="search-overlay__empty">
              No games match &ldquo;{trimmed}&rdquo;. Try a genre or studio name.
            </p>
          )}

          <ul className="search-overlay__list" aria-label="Results">
            {list.map((game, i) => (
              <li key={game.slug}>
                <Link
                  to={`/games/${game.slug}`}
                  className={`search-result ${i === active ? "is-active" : ""}`}
                  onClick={onClose}
                  onMouseEnter={() => setActive(i)}
                >
                  <span className="search-result__thumb">
                    <Cover game={game} sizes="56px" />
                  </span>
                  <span className="search-result__text">
                    <span className="search-result__name">{game.name}</span>
                    <span className="search-result__meta">
                      {GENRES[game.genre].name} · {game.developer}
                    </span>
                  </span>
                  {hasReviews(game) && (
                    <span className="search-result__rating">
                      <IconStar /> {game.rating.toFixed(1)}
                    </span>
                  )}
                </Link>
              </li>
            ))}

            {trimmed && (
              <li>
                <Link
                  to={`/catalog?q=${encodeURIComponent(trimmed)}`}
                  className={`search-result search-result--all ${
                    active === list.length ? "is-active" : ""
                  }`}
                  onClick={onClose}
                  onMouseEnter={() => setActive(list.length)}
                >
                  <span className="search-result__text">
                    <span className="search-result__name">
                      See all results for &ldquo;{trimmed}&rdquo;
                    </span>
                  </span>
                  <IconArrow />
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>,
    document.body
  );
}
