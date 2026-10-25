import { Navigate, NavLink, Outlet } from "react-router-dom";
import Reveal from "../components/Reveal";
import { useAuth } from "../lib/auth";
import "./account.css";

export default function Account() {
  const { user, logout } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="account-page container">
      <Reveal as="header" className="account-head">
        <span className="account-head__avatar" aria-hidden="true">
          {user.name.trim().charAt(0).toUpperCase()}
        </span>
        <div className="account-head__text">
          <p className="label-caps">Account</p>
          <h1>{user.name}</h1>
          <p className="account-page__meta">{user.email}</p>
        </div>
        <button type="button" className="btn btn--ghost account-head__out" onClick={logout}>
          Sign out
        </button>
      </Reveal>

      <nav className="account-nav" aria-label="Account sections">
        <NavLink to="/account" end>
          Overview
        </NavLink>
        <NavLink to="/account/library">
          Library <span>{user.library.length}</span>
        </NavLink>
        <NavLink to="/account/wishlist">
          Wishlist <span>{user.wishlist.length}</span>
        </NavLink>
      </nav>

      <div className="account-section">
        <Outlet />
      </div>
    </div>
  );
}
