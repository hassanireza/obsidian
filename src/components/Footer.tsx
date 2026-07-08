import { Link } from "react-router-dom";
import Logo from "./Logo";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <Logo compact />
          <p className="site-footer__tag">
            A quiet catalog for small, well made games.
          </p>
        </div>

        <div className="site-footer__cols">
          <div>
            <p className="label-caps">Browse</p>
            <Link to="/catalog">Full catalog</Link>
            <Link to="/catalog?filter=new">New releases</Link>
            <Link to="/catalog?filter=trending">Trending</Link>
            <Link to="/genres">Genres</Link>
          </div>
          <div>
            <p className="label-caps">Account</p>
            <Link to="/login">Sign in</Link>
            <Link to="/signup">Create account</Link>
            <Link to="/account/library">Library</Link>
            <Link to="/account/wishlist">Wishlist</Link>
          </div>
          <div>
            <p className="label-caps">Studio</p>
            <a href="https://github.com/hassanireza" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://hassanireza.github.io" target="_blank" rel="noreferrer">
              Portfolio
            </a>
          </div>
        </div>
      </div>
      <div className="container site-footer__legal">
        <span>Obsidian Game Store</span>
        <span>Built by Reza Hassani</span>
      </div>
    </footer>
  );
}
