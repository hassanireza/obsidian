import { Link } from "react-router-dom";
import GameGrid from "../components/GameGrid";
import { GAMES } from "../data/games";
import { useAuth } from "../lib/auth";

export default function AccountLibrary() {
  const { user } = useAuth();
  const games = GAMES.filter((g) => user?.library.includes(g.slug));

  if (games.length === 0) {
    return (
      <div className="account-empty">
        <h2>Your library is empty</h2>
        <p>Play a game and it lands here.</p>
        <Link className="btn btn--primary" to="/catalog">
          Browse games
        </Link>
      </div>
    );
  }

  return <GameGrid games={games} />;
}
