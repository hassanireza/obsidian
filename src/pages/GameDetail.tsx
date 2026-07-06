import { Link, Navigate, useParams } from "react-router-dom";
import Reveal from "../components/Reveal";
import GameGrid from "../components/GameGrid";
import { IconExternal, IconHeart, IconHeartFilled, IconPlay, IconStar } from "../components/icons";
import { findGame, gamesByGenre } from "../lib/categories";
import { GENRES } from "../data/genres";
import { useAuth } from "../lib/auth";
import { handleCoverError } from "../lib/imageFallback";
import "./gameDetail.css";

export default function GameDetail() {
  const { slug = "" } = useParams();
  const game = findGame(slug);
  const { user, toggleWishlist, toggleLibrary } = useAuth();

  if (!game) return <Navigate to="/catalog" replace />;

  const wished = user?.wishlist.includes(game.slug) ?? false;
  const owned = user?.library.includes(game.slug) ?? false;
  const related = gamesByGenre(game.genre).filter((g) => g.slug !== game.slug);

  return (
    <article className="game-detail">
      <div className="game-detail__banner">
        <img src={game.thumbnail} alt={game.name} onError={handleCoverError} />
        <div className="game-detail__scrim" />
      </div>

      <div className="container game-detail__body">
        <Reveal as="div" className="game-detail__intro">
          <p className="label-caps">{GENRES[game.genre].name}</p>
          <h1>{game.name}</h1>
          <p className="game-detail__tagline">{game.tagline}</p>

          <div className="game-detail__stats">
            <span>
              <IconStar /> {game.rating.toFixed(1)} ({game.reviewCount} reviews)
            </span>
            <span>{game.plays.toLocaleString()} plays</span>
            <span>By {game.developer}</span>
          </div>

          <div className="hero__actions game-detail__actions">
            <a
              className="btn btn--primary"
              href={game.playUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => user && toggleLibrary(game.slug)}
            >
              <IconPlay /> Play now
            </a>
            <a
              className="btn btn--ghost"
              href={game.repoUrl}
              target="_blank"
              rel="noreferrer"
            >
              <IconExternal /> View source
            </a>
            {user && (
              <button
                className="btn btn--ghost"
                onClick={() => toggleWishlist(game.slug)}
              >
                {wished ? <IconHeartFilled /> : <IconHeart />}
                {wished ? "In wishlist" : "Add to wishlist"}
              </button>
            )}
          </div>

          {owned && <p className="game-detail__owned">In your library</p>}

          <p className="game-detail__description">{game.description}</p>
        </Reveal>
      </div>

      {related.length > 0 && (
        <div className="container game-detail__related">
          <p className="label-caps">More {GENRES[game.genre].name}</p>
          <div style={{ marginTop: "28px" }}>
            <GameGrid games={related} />
          </div>
        </div>
      )}

      <div className="container game-detail__back">
        <Link to="/catalog">Back to catalog</Link>
      </div>
    </article>
  );
}
