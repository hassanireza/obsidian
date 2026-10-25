import type { SyntheticEvent } from "react";
import type { Game } from "../types";
import { coverSrcSet } from "../lib/cover";
import { handleCoverError } from "../lib/imageFallback";

interface CoverProps {
  game: Game;
  /** Rendered width hint so the browser picks the smallest sufficient file. */
  sizes: string;
  /** Above-the-fold images load eagerly with high fetch priority. */
  priority?: boolean;
  /** Decorative copies (blurred backdrops) get empty alt text. */
  decorative?: boolean;
  className?: string;
}

export default function Cover({
  game,
  sizes,
  priority = false,
  decorative = false,
  className = "",
}: CoverProps) {
  const onError = (e: SyntheticEvent<HTMLImageElement>) => {
    // The fallback swaps `src`; a stale srcset would override it.
    e.currentTarget.removeAttribute("srcset");
    handleCoverError(e);
  };

  return (
    <img
      className={`cover ${className}`.trim()}
      src={game.thumbnail}
      srcSet={coverSrcSet(game.thumbnail)}
      sizes={sizes}
      alt={decorative ? "" : `${game.name} cover art`}
      width={1086}
      height={1449}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      draggable={false}
      onError={onError}
    />
  );
}
