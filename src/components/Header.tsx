import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import SearchOverlay from "./SearchOverlay";
import { IconSearch, IconUser } from "./icons";
import { useAuth } from "../lib/auth";
import "./header.css";

interface NavLinkDef {
  to: string;
  label: string;
  /** Matches /catalog?filter=<value>; "" means the unfiltered catalog. */
  filter?: string;
}

const NAV_LINKS: NavLinkDef[] = [
  { to: "/catalog", label: "Discover", filter: "" },
  { to: "/catalog?filter=new", label: "New", filter: "new" },
  { to: "/catalog?filter=trending", label: "Trending", filter: "trending" },
  { to: "/genres", label: "Genres" },
];

const isMac =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user } = useAuth();
  const { pathname, search } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cmd/Ctrl+K and "/" open search from anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing =
        e.target instanceof HTMLElement &&
        (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const currentFilter = new URLSearchParams(search).get("filter") ?? "";
  const isActive = (link: NavLinkDef) => {
    if (link.filter === undefined) return pathname.startsWith(link.to);
    return pathname === "/catalog" && currentFilter === link.filter;
  };

  const initial = user?.name?.trim().charAt(0).toUpperCase();

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="site-header__inner container">
        <Link to="/" className="site-header__logo" aria-label="Obsidian Game Store, home">
          <span className="site-header__logo-full">
            <Logo variant="full" />
          </span>
          <span className="site-header__logo-short">
            <Logo variant="short" />
          </span>
        </Link>

        <nav className="site-header__nav" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="site-header__link"
              aria-current={isActive(link) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="site-header__search"
          onClick={() => setSearchOpen(true)}
          aria-label="Search games"
          aria-haspopup="dialog"
        >
          <IconSearch />
          <span className="site-header__search-text">Search games</span>
          <kbd className="site-header__kbd" aria-hidden="true">
            {isMac ? "⌘K" : "Ctrl K"}
          </kbd>
        </button>

        <Link
          to={user ? "/account" : "/login"}
          className="site-header__account"
          aria-label={user ? "Your account" : "Sign in"}
        >
          {user ? (
            <span className="site-header__avatar">{initial}</span>
          ) : (
            <>
              <IconUser />
              <span>Sign in</span>
            </>
          )}
        </Link>
      </div>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </header>
  );
}
