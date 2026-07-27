import { NavLink, useNavigate } from "react-router-dom";
import { IconHome, IconGrid, IconTag, IconSearch, IconUser } from "./icons";
import { useAuth } from "../lib/auth";
import "./mobileTabBar.css";

const TABS = [
  { to: "/", label: "Home", icon: IconHome, end: true },
  { to: "/catalog", label: "Catalog", icon: IconGrid, end: false },
  { to: "/genres", label: "Genres", icon: IconTag, end: false },
];

export default function MobileTabBar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="tab-bar" aria-label="Primary">
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `tab-bar__item ${isActive ? "is-active" : ""}`
          }
        >
          <Icon />
          <span>{label}</span>
        </NavLink>
      ))}
      <button
        type="button"
        className="tab-bar__item"
        onClick={() => navigate("/catalog?focus=search")}
      >
        <IconSearch />
        <span>Search</span>
      </button>
      <NavLink
        to={user ? "/account" : "/login"}
        className={({ isActive }) =>
          `tab-bar__item ${isActive ? "is-active" : ""}`
        }
      >
        <IconUser />
        <span>{user ? "Account" : "Sign in"}</span>
      </NavLink>
    </nav>
  );
}
