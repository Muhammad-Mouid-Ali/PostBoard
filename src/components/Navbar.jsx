import { Link, NavLink, useLocation } from "react-router-dom";
import useAuth from "../context/useAuth";
import getInitials from "../context/getInitials";

function Navbar() {
  const { currentUser, isAuthenticated, signOut } = useAuth();
  const location = useLocation();

  return (
    <header className="nav">
      <Link to="/posts" className="logo">
        PostBoard
      </Link>

      <nav className="row">
        <NavLink to="/posts" end>
          Posts
        </NavLink>
        {isAuthenticated && <NavLink to="/my-posts">My posts</NavLink>}

        {isAuthenticated ? (
          <>
            <div className="avatar" title={currentUser.name}>
              {getInitials(currentUser.name)}
            </div>
            <button className="btn ghost" onClick={signOut}>
              Log out
            </button>
          </>
        ) : (
          <Link to="/auth" state={{ from: location }} className="btn ghost">
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Navbar;