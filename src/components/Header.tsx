import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { IconSearch, IconUser, IconClose } from "./icons";
import { useAuth } from "../lib/auth";
import "./header.css";

const NAV_LINKS = [
  { to: "/catalog", label: "Catalog" },
  { to: "/catalog?filter=new", label: "New" },
  { to: "/catalog?filter=trending", label: "Trending" },
  { to: "/genres", label: "Genres" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(query.trim())}`);
      setMenuOpen(false);
    }
  };

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="site-header__inner container">
        <Link to="/" className="site-header__logo" onClick={() => setMenuOpen(false)}>
          <Logo />
        </Link>

        <nav className="site-header__nav">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.label} to={link.to} className="site-header__link">
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <form className="site-header__search" onSubmit={submitSearch}>
            <IconSearch />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the store"
              aria-label="Search games"
            />
          </form>
          <Link to={user ? "/account" : "/login"} className="site-header__account">
            <IconUser />
            <span>{user ? user.name : "Sign in"}</span>
          </Link>
          <button
            className="site-header__search-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Search"
          >
            {menuOpen ? <IconClose /> : <IconSearch />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="site-header__mobile">
          <form className="site-header__search site-header__search--mobile" onSubmit={submitSearch}>
            <IconSearch />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the store"
              aria-label="Search games"
            />
          </form>
        </div>
      )}
    </header>
  );
}
