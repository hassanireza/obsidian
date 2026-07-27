import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import GameGrid from "../components/GameGrid";
import SectionHeader from "../components/SectionHeader";
import { GAMES } from "../data/games";
import { GENRE_LIST } from "../data/genres";
import {
  editorsChoice,
  featuredGames,
  newReleases,
  topRated,
  trendingGames,
  findGame,
} from "../lib/categories";
import "./home.css";

export default function Home() {
  const featured = featuredGames();
  const hero = featured[0] ?? findGame("aurum-maze")!;
  const fresh = newReleases();
  const trending = trendingGames();
  const choice = editorsChoice();
  const rated = topRated();
  const spotlight = findGame("arcana-night-city-tarot")!;

  return (
    <>
      {/* I. Arrival */}
      <section className="hero">
        <div className="hero__media">
          <img src={hero.thumbnail} alt="" />
          <div className="hero__scrim" />
        </div>
        <Reveal as="div" className="hero__content">
          <p className="label-caps hero__eyebrow">I — The Arrival</p>
          <h1 className="hero__title">{hero.name}</h1>
          <p className="hero__tagline">{hero.tagline}</p>
          <div className="hero__actions">
            <a
              className="btn btn--primary"
              href={hero.playUrl}
              target="_blank"
              rel="noreferrer"
            >
              Play now
            </a>
            <Link className="btn btn--ghost" to={`/games/${hero.slug}`}>
              Learn more
            </Link>
          </div>
        </Reveal>
        <div className="hero__scroll-cue">
          <span className="hero__scroll-line" />
          <span className="label-caps">Scroll</span>
        </div>
      </section>

      {/* Quick navigation, wayfinding for the whole library */}
      <nav className="quick-nav" aria-label="Browse the library">
        <div className="quick-nav__inner container">
          <div className="quick-nav__scroller">
            <a href="#all-games" className="quick-nav__pill quick-nav__pill--solid">
              All {GAMES.length} games
            </a>
            <a href="#new" className="quick-nav__pill">New</a>
            <a href="#trending" className="quick-nav__pill">Trending</a>
            <a href="#editors" className="quick-nav__pill">Editors&nbsp;picks</a>
            <span className="quick-nav__divider" />
            {GENRE_LIST.map((g) => (
              <Link
                key={g.slug}
                to={`/catalog?genre=${g.slug}`}
                className="quick-nav__pill"
              >
                {g.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* II. The full shelf, every game, one grid, no hunting */}
      <section id="all-games" className="home-section home-section--tight container">
        <SectionHeader
          numeral="II"
          label="The Shelf"
          title={`Every game in the store (${GAMES.length})`}
          seeAllHref="/catalog"
        />
        <GameGrid games={GAMES} />
      </section>

      {/* III. Initiation, new releases */}
      <section id="new" className="home-section container">
        <SectionHeader
          numeral="III"
          label="Initiation"
          title="New releases"
          seeAllHref="/catalog?filter=new"
        />
        <GameGrid games={fresh.length ? fresh : rated.slice(0, 4)} />
      </section>

      {/* IV. Communion, trending */}
      <section id="trending" className="home-section container">
        <SectionHeader
          numeral="IV"
          label="Communion"
          title="What the store is playing"
          seeAllHref="/catalog?filter=trending"
        />
        <GameGrid games={trending.slice(0, 8)} />
      </section>

      {/* V. Tithe, editors choice feature strip */}
      <section id="editors" className="home-section container">
        <Reveal>
          <p className="label-caps">V — The Tithe</p>
        </Reveal>
        <div className="feature-strip" style={{ marginTop: "36px" }}>
          <Reveal as="div" className="feature-strip__media">
            <img src={choice[0]?.thumbnail} alt={choice[0]?.name} />
          </Reveal>
          <Reveal as="div" className="feature-strip__copy" delay={1}>
            <p className="label-caps">Editors choice</p>
            <h3>{choice[0]?.name}</h3>
            <p>{choice[0]?.description}</p>
            <div className="hero__actions">
              <Link className="btn btn--ghost" to={`/games/${choice[0]?.slug}`}>
                View game
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* V. Procession, editors choice grid */}
      <section className="home-section container">
        <SectionHeader
          numeral="VI"
          label="Procession"
          title="Chosen by the editors"
        />
        <GameGrid games={choice} />
      </section>

      {/* VI. Shedding, genres */}
      <section className="home-section container">
        <SectionHeader numeral="VII" label="Shedding" title="Browse by genre" />
        <Reveal as="div" className="genre-row">
          {GENRE_LIST.map((genre) => (
            <Link
              key={genre.slug}
              to={`/catalog?genre=${genre.slug}`}
              className="genre-tile"
            >
              <p className="label-caps">Genre</p>
              <h4 className="genre-tile__name">{genre.name}</h4>
              <p className="genre-tile__desc">{genre.description}</p>
            </Link>
          ))}
        </Reveal>
      </section>

      {/* VII. Cathedral of water, mystical spotlight */}
      <section className="home-section container">
        <Reveal>
          <p className="label-caps">VIII — Cathedral of Water</p>
        </Reveal>
        <div className="feature-strip feature-strip--reverse" style={{ marginTop: "36px" }}>
          <Reveal as="div" className="feature-strip__media">
            <img src={spotlight.thumbnail} alt={spotlight.name} />
          </Reveal>
          <Reveal as="div" className="feature-strip__copy" delay={1}>
            <p className="label-caps">Mystical</p>
            <h3>{spotlight.name}</h3>
            <p>{spotlight.description}</p>
            <div className="hero__actions">
              <a
                className="btn btn--primary"
                href={spotlight.playUrl}
                target="_blank"
                rel="noreferrer"
              >
                Play now
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* VIII. Return */}
      <section className="home-section return-section container">
        <Reveal as="div" className="return-section__inner">
          <p className="label-caps">IX — The Return</p>
          <h2>Come back to the catalog whenever you need it.</h2>
          <p>
            Ten games, one shelf, no accounts required to play. Sign up only
            if you want a library and a wishlist that remember you.
          </p>
          <div className="hero__actions">
            <Link className="btn btn--primary" to="/catalog">
              Enter the catalog
            </Link>
            <Link className="btn btn--ghost" to="/signup">
              Create an account
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
