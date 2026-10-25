import "./logo.css";

interface LogoProps {
  /** full: "Obsidian Game Store", short: "Obsidian", mark: symbol only */
  variant?: "full" | "short" | "mark";
}

export default function Logo({ variant = "full" }: LogoProps) {
  return (
    <span className="logo">
      <svg
        className="logo__mark"
        width="28"
        height="28"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect
          x="1"
          y="1"
          width="24"
          height="24"
          stroke="var(--color-bone)"
          strokeWidth="0.9"
        />
        <path
          d="M13 4L20 13L13 22L6 13L13 4Z"
          stroke="var(--color-bone)"
          strokeWidth="0.9"
        />
        <circle cx="13" cy="13" r="1.5" fill="var(--color-bone)" />
      </svg>
      {variant !== "mark" && (
        <span className="logo__word">
          {variant === "short" ? "Obsidian" : "Obsidian Game Store"}
        </span>
      )}
    </span>
  );
}
