import type { SyntheticEvent } from "react";

/**
 * Cover art is served as either .svg or .webp depending on the asset.
 * If the referenced extension 404s, retry once with the other extension
 * before giving up, so a mismatched path/format never renders broken.
 */
export function handleCoverError(e: SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  const triedFallback = img.dataset.coverFallback === "1";
  if (triedFallback) return;

  const swapped = img.src.endsWith(".svg")
    ? img.src.replace(/\.svg$/, ".webp")
    : img.src.endsWith(".webp")
    ? img.src.replace(/\.webp$/, ".svg")
    : null;

  if (!swapped) return;

  img.dataset.coverFallback = "1";
  img.src = swapped;
}
