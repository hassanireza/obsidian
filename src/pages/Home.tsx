import { useMemo } from "react";
import { Link } from "react-router-dom";
import HeroCarousel from "../components/HeroCarousel";
import Carousel from "../components/Carousel";
import GameCard from "../components/GameCard";
import SectionHeader from "../components/SectionHeader";
import Reveal from "../components/Reveal";
import { GAMES } from "../data/games";
import { GENRE_LIST } from "../data/genres";
import { heroGames, homeRails } from "../lib/categories";
import { toRoman } from "../lib/roman";
import { useAuth } from "../lib/auth";
import "./home.css";

export default function Home() {
  const { user } = useAuth();
  const hero = useMemo(() => heroGames(5), []);
  const rails = useMemo(() => homeRails(hero), [hero]);

  return (
    <>
      <h1 className="sr-only">Obsidian Game Store</h1>

      <HeroCarousel games={hero} />

      {/* One wayfinding row replaces the old sticky nav and repeated lists */}
      <nav className="home-browse container" aria-label="Browse the library">
        <div className="chip-rail">
          <Link to="/catalog" className="chip chip--active">
            All games <span className="chip__count">{GAMES.length}</span>
          </Link>
          <Link to="/catalog?filter=new" className="chip">New</Link>
          <Link to="/catalog?filter=trending" className="chip">Trending</Link>
          <Link to="/catalog?filter=editors" className="chip">Editors&rsquo; picks</Link>
          <span className="chip-rail__divider" aria-hidden="true" />
          {GENRE_LIST.map((g) => (
            <Link key={g.slug} to={`/catalog?genre=${g.slug}`} className="chip">
              {g.name}
            </Link>
          ))}
        </div>
      </nav>

      {rails.map((rail, i) => (
        <Reveal
          as="section"
          key={rail.key}
          className="home-section"
          aria-labelledby={`rail-${rail.key}`}
        >
          <div className="container">
            <SectionHeader
              id={`rail-${rail.key}`}
              numeral={toRoman(i + 1)}
              title={rail.title}
              seeAllHref={rail.href}
            />
          </div>
          <Carousel label={rail.title}>
            {rail.games.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </Carousel>
        </Reveal>
      ))}

      <Reveal as="section" className="home-section container">
        <div className="home-cta">
          <p className="label-caps">{toRoman(rails.length + 1)}</p>
          <h2>Every game, one shelf.</h2>
          <p className="home-cta__copy">
            {GAMES.length} small, well made games. No account needed to play;
            sign up only if you want a library and wishlist that remember you.
          </p>
          <div className="home-cta__actions">
            <Link className="btn btn--primary" to="/catalog">
              Browse all games
            </Link>
            {!user && (
              <Link className="btn btn--ghost" to="/signup">
                Create an account
              </Link>
            )}
          </div>
        </div>
      </Reveal>
    </>
  );
}
