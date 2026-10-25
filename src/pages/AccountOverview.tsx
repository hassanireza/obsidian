import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function AccountOverview() {
  const { user } = useAuth();
  if (!user) return null;

  const joined = new Date(user.joined).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="account-overview">
      <dl className="account-stats">
        <Link to="/account/library" className="account-stat">
          <dt className="label-caps">Library</dt>
          <dd>{user.library.length}</dd>
          <span>game{user.library.length === 1 ? "" : "s"} you have played</span>
        </Link>
        <Link to="/account/wishlist" className="account-stat">
          <dt className="label-caps">Wishlist</dt>
          <dd>{user.wishlist.length}</dd>
          <span>saved for later</span>
        </Link>
        <div className="account-stat">
          <dt className="label-caps">Member since</dt>
          <dd>{joined}</dd>
          <span>stored in this browser</span>
        </div>
      </dl>
    </div>
  );
}
