/**
 * Cover art ships in three widths (480, 800 and the original). Given the
 * original path, build the srcset so phones never download the full poster.
 */
export function coverSrcSet(src: string): string | undefined {
  if (!src.endsWith(".webp")) return undefined;
  const stem = src.slice(0, -".webp".length);
  return `${stem}-480.webp 480w, ${stem}-800.webp 800w, ${src} 1024w`;
}
