import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import "./notFound.css";

export default function NotFound() {
  return (
    <div className="not-found container">
      <Reveal as="div">
        <p className="label-caps">404</p>
        <h1>Nothing here</h1>
        <p className="not-found__copy">
          The page you are looking for does not exist, or has moved.
        </p>
        <div className="not-found__actions">
          <Link to="/" className="btn btn--primary">
            Return home
          </Link>
          <Link to="/catalog" className="btn btn--ghost">
            Browse games
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
