import type { MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { Game } from "../types";
import { useAuth } from "../lib/auth";
import { IconHeart, IconHeartFilled, IconStar } from "./icons";
import Cover from "./Cover";
import { GENRES } from "../data/genres";
import { gameBadges, hasReviews } from "../lib/categories";
import "./gameCard.css";

interface GameCardProps {
  game: Game;
  /** `sizes` hint for the cover; defaults suit rails and grids. */
  sizes?: string;
}

export default function GameCard({
  game,
  sizes = "(max-width: 900px) 46vw, 244px",
}: GameCardProps) {
  const { user, toggleWishlist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const wished = user?.wishlist.includes(game.slug) ?? false;
  const badge = gameBadges(game)[0];

  const onWish = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      // Signed out: send them to sign in and bring them straight back.
      navigate("/login", { state: { from: location.pathname + location.search } });
      return;
    }
    toggleWishlist(game.slug);
  };

  return (
    <article className="game-card">
      <div className="game-card__media">
        <Cover game={game} sizes={sizes} />
        <div className="game-card__shade" aria-hidden="true" />
        {badge && (
          <span
            className={`badge game-card__badge ${badge === "New" ? "badge--solid" : ""}`}
          >
            {badge}
          </span>
        )}
        <button
          type="button"
          className="game-card__wish"
          aria-label={wished ? `Remove ${game.name} from wishlist` : `Add ${game.name} to wishlist`}
          aria-pressed={wished}
          onClick={onWish}
        >
          {wished ? <IconHeartFilled /> : <IconHeart />}
        </button>
      </div>

      <div className="game-card__body">
        <h3 className="game-card__title">
          <Link to={`/games/${game.slug}`} className="game-card__link">
            {game.name}
          </Link>
        </h3>
        <p className="game-card__meta">
          <span>{GENRES[game.genre].name}</span>
          <span className="game-card__dot" aria-hidden="true">·</span>
          {hasReviews(game) ? (
            <span className="game-card__rating">
              <IconStar /> {game.rating.toFixed(1)}
            </span>
          ) : (
            <span>Just released</span>
          )}
        </p>
      </div>
    </article>
  );
}
