import { Link } from "react-router-dom";
import GameGrid from "../components/GameGrid";
import { GAMES } from "../data/games";
import { useAuth } from "../lib/auth";

export default function AccountWishlist() {
  const { user } = useAuth();
  const games = GAMES.filter((g) => user?.wishlist.includes(g.slug));

  if (games.length === 0) {
    return (
      <div className="account-empty">
        <h2>Nothing saved yet</h2>
        <p>Tap the heart on any game to keep it here.</p>
        <Link className="btn btn--primary" to="/catalog">
          Browse games
        </Link>
      </div>
    );
  }

  return <GameGrid games={games} />;
}
