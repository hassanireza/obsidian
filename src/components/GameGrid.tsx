import type { Game } from "../types";
import GameCard from "./GameCard";
import "./gameGrid.css";

interface GameGridProps {
  games: Game[];
  emptyMessage?: string;
}

/** The one place a full, flat list is appropriate: the catalog and account. */
export default function GameGrid({ games, emptyMessage = "No games found." }: GameGridProps) {
  if (games.length === 0) {
    return <p className="game-grid__empty">{emptyMessage}</p>;
  }

  return (
    <div className="game-grid">
      {games.map((game) => (
        <GameCard
          key={game.slug}
          game={game}
          sizes="(max-width: 600px) 46vw, (max-width: 1100px) 28vw, 240px"
        />
      ))}
    </div>
  );
}
