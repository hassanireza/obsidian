import { Children, useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { IconChevronLeft, IconChevronRight } from "./icons";
import { usePrefersReducedMotion } from "../hooks/useMediaQuery";
import "./carousel.css";

interface CarouselProps {
  /** Accessible name, e.g. "Trending now". */
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * Native scroll-snap rail. Touch users get real momentum scrolling, desktop
 * users get arrow buttons, keyboard users get arrow keys, and a slim progress
 * bar shows how far along the shelf they are.
 */
export default function Carousel({ label, children, className = "" }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLSpanElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [overflowing, setOverflowing] = useState(true);
  const reduceMotion = usePrefersReducedMotion();

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setOverflowing(max > 4);
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= max - 2);

    // Progress is written straight to the DOM so scrolling never re-renders.
    const thumb = thumbRef.current;
    if (thumb) {
      const ratio = Math.min(1, el.clientWidth / el.scrollWidth);
      const pos = max > 0 ? el.scrollLeft / max : 0;
      thumb.style.width = `${ratio * 100}%`;
      thumb.style.transform = `translateX(${pos * (1 / ratio - 1) * 100}%)`;
    }
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  const page = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir * el.clientWidth * 0.85,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      page(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      page(-1);
    }
  };

  return (
    <div
      className={`rail ${className}`.trim()}
      data-start={atStart}
      data-end={atEnd}
      data-overflowing={overflowing}
    >
      <div
        ref={trackRef}
        className="rail__track"
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {Children.map(children, (child) => (
          <div className="rail__item">{child}</div>
        ))}
      </div>

      <button
        type="button"
        className="rail__nav rail__nav--prev"
        aria-label={`Scroll ${label} back`}
        onClick={() => page(-1)}
        disabled={atStart}
        tabIndex={-1}
      >
        <IconChevronLeft />
      </button>
      <button
        type="button"
        className="rail__nav rail__nav--next"
        aria-label={`Scroll ${label} forward`}
        onClick={() => page(1)}
        disabled={atEnd}
        tabIndex={-1}
      >
        <IconChevronRight />
      </button>

      <div className="rail__progress" aria-hidden="true">
        <span ref={thumbRef} />
      </div>
    </div>
  );
}
