import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Reveal from "../components/Reveal";
import { useAuth } from "../lib/auth";
import { useAfterAuth } from "../lib/useAfterAuth";
import "./auth.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const afterAuth = useAfterAuth();
  const location = useLocation();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || "guest@obsidian.store", name);
    afterAuth();
  };

  return (
    <div className="auth-page">
      <Reveal as="div" className="auth-card">
        <p className="label-caps">Create account</p>
        <h1>Join the store</h1>
        <p className="auth-card__note">
          Demo only. Your library and wishlist are stored in this browser and
          are not sent to a server.
        </p>
        <form className="auth-form" onSubmit={submit}>
          <div className="auth-field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Anything works"
            />
          </div>
          <button className="btn btn--primary btn--block" type="submit">
            Create account
          </button>
        </form>
        <p className="auth-switch">
          Already have one?{" "}
          <Link to="/login" state={location.state}>
            Sign in
          </Link>
        </p>
      </Reveal>
    </div>
  );
}
