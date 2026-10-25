import { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import Carousel from "../components/Carousel";
import Cover from "../components/Cover";
import GameCard from "../components/GameCard";
import SectionHeader from "../components/SectionHeader";
import {
  IconExternal,
  IconHeart,
  IconHeartFilled,
  IconPlay,
  IconShare,
  IconStar,
} from "../components/icons";
import { findGame, gameBadges, gamesByGenre, hasReviews } from "../lib/categories";
import { GAMES } from "../data/games";
import { GENRES } from "../data/genres";
import { useAuth } from "../lib/auth";
import "./gameDetail.css";

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

export default function GameDetail() {
  const { slug = "" } = useParams();
  const game = findGame(slug);
  const { user, toggleWishlist, toggleLibrary } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [shareNote, setShareNote] = useState("");

  const related = useMemo(() => {
    if (!game) return { title: "", games: [] };
    const mates = gamesByGenre(game.genre).filter((g) => g.slug !== game.slug);
    if (mates.length >= 3) {
      return { title: `More ${GENRES[game.genre].name}`, games: mates };
    }
    // Thin genre: top up with the best of the rest so the shelf never looks bare
    const extra = [...GAMES]
      .sort((a, b) => b.rating - a.rating)
      .filter((g) => g.slug !== game.slug && !mates.includes(g));
    return { title: "More to play", games: [...mates, ...extra].slice(0, 8) };
  }, [game]);

  if (!game) return <Navigate to="/catalog" replace />;

  const wished = user?.wishlist.includes(game.slug) ?? false;
  const owned = user?.library.includes(game.slug) ?? false;
  const badges = gameBadges(game);
  const genre = GENRES[game.genre];

  const onWish = () => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    toggleWishlist(game.slug);
  };

  const onShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: game.name, text: game.tagline, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareNote("Link copied");
      window.setTimeout(() => setShareNote(""), 2200);
    } catch {
      /* Share sheet dismissed, nothing to do */
    }
  };


  return (
    <article className="game-detail">
      <div className="game-detail__backdrop" aria-hidden="true">
        <Cover game={game} sizes="320px" decorative />
      </div>

      <div className="container game-detail__layout">
        <div className="game-detail__poster">
          <Cover game={game} priority sizes="(max-width: 900px) 70vw, 400px" />
        </div>

        <div className="game-detail__info">
          <nav className="game-detail__crumbs" aria-label="Breadcrumb">
            <Link to="/catalog">Catalog</Link>
            <span aria-hidden="true">/</span>
            <Link to={`/catalog?genre=${genre.slug}`}>{genre.name}</Link>
          </nav>

          {badges.length > 0 && (
            <p className="game-detail__badges">
              {badges.map((b) => (
                <span key={b} className={`badge ${b === "New" ? "badge--solid" : ""}`}>
                  {b}
                </span>
              ))}
            </p>
          )}

          <h1 className="game-detail__title">{game.name}</h1>
          <p className="game-detail__tagline">{game.tagline}</p>

          <div className="game-detail__actions">
            <a
              className="btn btn--primary game-detail__play"
              href={game.playUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => user && toggleLibrary(game.slug)}
            >
              <IconPlay /> Play now
            </a>
            <button
              type="button"
              className={`btn btn--ghost btn--icon ${wished ? "is-on" : ""}`}
              onClick={onWish}
              aria-pressed={wished}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              title={wished ? "In your wishlist" : "Add to wishlist"}
            >
              {wished ? <IconHeartFilled /> : <IconHeart />}
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--icon"
              onClick={onShare}
              aria-label="Share this game"
              title="Share"
            >
              <IconShare />
            </button>
          </div>
          <p className="game-detail__note" role="status">
            {shareNote || (owned ? "In your library" : "")}
          </p>

          <dl className="game-detail__stats">
            <div>
              <dt className="label-caps">Rating</dt>
              <dd>
                {hasReviews(game) ? (
                  <>
                    <IconStar /> {game.rating.toFixed(1)}
                    <small>{game.reviewCount.toLocaleString()} reviews</small>
                  </>
                ) : (
                  <>
                    New<small>No reviews yet</small>
                  </>
                )}
              </dd>
            </div>
            <div>
              <dt className="label-caps">Plays</dt>
              <dd>
                {game.plays > 0 ? game.plays.toLocaleString() : "\u2014"}
                <small>{game.plays > 0 ? "all time" : "Be the first"}</small>
              </dd>
            </div>
            <div>
              <dt className="label-caps">Released</dt>
              <dd>
                {formatDate(game.releaseDate)}
                <small>{genre.name}</small>
              </dd>
            </div>
            <div>
              <dt className="label-caps">Studio</dt>
              <dd>
                {game.developer}
                <small>
                  <a href={game.repoUrl} target="_blank" rel="noreferrer">
                    View source <IconExternal />
                  </a>
                </small>
              </dd>
            </div>
          </dl>

          <div className="game-detail__about">
            <h2 className="label-caps">About</h2>
            <p>{game.description}</p>
          </div>
        </div>
      </div>

      {related.games.length > 0 && (
        <section className="game-detail__related" aria-labelledby="related-title">
          <div className="container">
            <SectionHeader
              id="related-title"
              title={related.title}
              seeAllHref={`/catalog?genre=${game.genre}`}
            />
          </div>
          <Carousel label={related.title}>
            {related.games.map((g) => (
              <GameCard key={g.slug} game={g} />
            ))}
          </Carousel>
        </section>
      )}
    </article>
  );
}
