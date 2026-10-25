import { Link } from "react-router-dom";
import Cover from "../components/Cover";
import Reveal from "../components/Reveal";
import { IconArrow } from "../components/icons";
import { GENRE_LIST } from "../data/genres";
import { gamesByGenre } from "../lib/categories";
import "./genres.css";

export default function Genres() {
  return (
    <div className="genres-page container">
      <Reveal as="header">
        <p className="label-caps">Catalog</p>
        <h1>Genres</h1>
        <p className="genres-page__intro">
          Seven shelves, one tap each. Pick a mood and the catalog filters to it.
        </p>
      </Reveal>

      <div className="genre-grid">
        {GENRE_LIST.map((genre, i) => {
          const games = gamesByGenre(genre.slug).sort((a, b) => b.rating - a.rating);
          const lead = games[0];
          return (
            <Reveal
              as="div"
              key={genre.slug}
              delay={(i % 3) as 0 | 1 | 2}
              className="genre-grid__cell"
            >
              <Link to={`/catalog?genre=${genre.slug}`} className="genre-tile">
                {lead && (
                  <span className="genre-tile__art" aria-hidden="true">
                    <Cover game={lead} sizes="(max-width: 700px) 50vw, 33vw" decorative />
                  </span>
                )}
                <span className="genre-tile__body">
                  <span className="label-caps">
                    {games.length} title{games.length === 1 ? "" : "s"}
                  </span>
                  <span className="genre-tile__name">{genre.name}</span>
                  <span className="genre-tile__desc">{genre.description}</span>
                </span>
                <span className="genre-tile__go" aria-hidden="true">
                  <IconArrow />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
