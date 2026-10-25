import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Game } from "../types";
import Cover from "./Cover";
import { GENRES } from "../data/genres";
import { gameBadges, hasReviews } from "../lib/categories";
import { useAuth } from "../lib/auth";
import { usePrefersReducedMotion } from "../hooks/useMediaQuery";
import {
  IconArrow,
  IconChevronLeft,
  IconChevronRight,
  IconPause,
  IconPlay,
  IconStar,
} from "./icons";
import "./heroCarousel.css";

const SLIDE_MS = 7000;

export default function HeroCarousel({ games }: { games: Game[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const reduceMotion = usePrefersReducedMotion();
  const { user, toggleLibrary } = useAuth();

  const autoplay = playing && !reduceMotion && games.length > 1;

  const slideLeft = useCallback((i: number) => {
    const track = trackRef.current;
    const slide = track?.children[i] as HTMLElement | undefined;
    if (!track || !slide) return 0;
    const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    return slide.offsetLeft - pad;
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const next = (i + games.length) % games.length;
      trackRef.current?.scrollTo({
        left: slideLeft(next),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    },
    [games.length, reduceMotion, slideLeft]
  );

  // Keep `index` in step with whatever the user (or autoplay) scrolled to.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        let best = 0;
        let bestDist = Infinity;
        for (let i = 0; i < track.children.length; i++) {
          const dist = Math.abs(slideLeft(i) - track.scrollLeft);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        }
        setIndex(best);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener("scroll", onScroll);
    };
  }, [slideLeft]);

  // Re-align after a resize or orientation change.
  useEffect(() => {
    const onResize = () =>
      trackRef.current?.scrollTo({ left: slideLeft(index), behavior: "auto" });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [index, slideLeft]);

  const manual = (i: number) => {
    setPlaying(false);
    goTo(i);
  };

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Featured games"
    >
      <div className="hero__stage">
        <div
          ref={trackRef}
          className="hero__track"
          onPointerDown={() => setPlaying(false)}
        >
          {games.map((game, i) => {
            const badges = gameBadges(game);
            return (
              <article
                key={game.slug}
                className="hero-slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${games.length}`}
              >
                <div className="hero-slide__ambient" aria-hidden="true">
                  <Cover game={game} sizes="240px" decorative />
                </div>

                <div className="hero-slide__poster">
                  <Cover
                    game={game}
                    priority={i === 0}
                    sizes="(max-width: 900px) 90vw, 460px"
                  />
                </div>

                <div className="hero-slide__copy">
                  <p className="hero-slide__eyebrow">
                    {badges.map((b) => (
                      <span
                        key={b}
                        className={`badge ${b === "New" ? "badge--solid" : ""}`}
                      >
                        {b}
                      </span>
                    ))}
                    <span className="label-caps">{GENRES[game.genre].name}</span>
                  </p>

                  <h2 className="hero-slide__title">{game.name}</h2>
                  <p className="hero-slide__tagline">{game.tagline}</p>

                  <p className="hero-slide__meta">
                    {hasReviews(game) && (
                      <span className="hero-slide__rating">
                        <IconStar /> {game.rating.toFixed(1)}
                      </span>
                    )}
                    <span>{game.developer}</span>
                  </p>

                  <div className="hero-slide__actions">
                    <a
                      className="btn btn--primary"
                      href={game.playUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => user && toggleLibrary(game.slug)}
                    >
                      <IconPlay /> Play now
                    </a>
                    <Link className="btn btn--ghost" to={`/games/${game.slug}`}>
                      Details <IconArrow />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

      </div>

      {games.length > 1 && (
        <div className="hero__controls container">
          <ol className="hero__dots">
            {games.map((game, i) => (
              <li key={game.slug}>
                <button
                  type="button"
                  className={`hero__dot ${i === index ? "is-active" : ""}`}
                  aria-label={`Show ${game.name}`}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => manual(i)}
                >
                  <span
                    key={i === index ? `run-${index}` : "idle"}
                    className={`hero__dot-fill ${
                      i === index && autoplay ? "is-running" : ""
                    }`}
                    style={{ ["--slide-ms" as string]: `${SLIDE_MS}ms` }}
                    onAnimationEnd={() => goTo(index + 1)}
                  />
                </button>
              </li>
            ))}
          </ol>

          <div className="hero__buttons">
            {!reduceMotion && (
              <button
                type="button"
                className="hero__btn"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause automatic rotation" : "Resume automatic rotation"}
              >
                {playing ? <IconPause /> : <IconPlay />}
              </button>
            )}
            <button
              type="button"
              className="hero__btn hero__btn--arrow"
              aria-label="Previous featured game"
              onClick={() => manual(index - 1)}
            >
              <IconChevronLeft />
            </button>
            <button
              type="button"
              className="hero__btn hero__btn--arrow"
              aria-label="Next featured game"
              onClick={() => manual(index + 1)}
            >
              <IconChevronRight />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
