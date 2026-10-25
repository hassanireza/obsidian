import { NavLink } from "react-router-dom";
import { IconHome, IconCompass, IconLayers, IconUser } from "./icons";
import { useAuth } from "../lib/auth";
import "./mobileTabBar.css";

export default function MobileTabBar() {
  const { user } = useAuth();

  const tabs = [
    { to: "/", label: "Home", icon: IconHome, end: true },
    { to: "/catalog", label: "Browse", icon: IconCompass, end: false },
    { to: "/genres", label: "Genres", icon: IconLayers, end: false },
    {
      to: user ? "/account" : "/login",
      label: user ? "Account" : "Sign in",
      icon: IconUser,
      end: false,
    },
  ];

  return (
    <nav className="tab-bar" aria-label="Primary">
      <ul className="tab-bar__list">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <li key={label}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `tab-bar__item ${isActive ? "is-active" : ""}`
              }
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
