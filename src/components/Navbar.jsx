import { Link, NavLink } from "react-router-dom";
import useAuth from "../context/useAuth";

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Navbar() {
  const { currentUser, isAuthenticated, signOut } = useAuth();

  return (
    <header className="nav">
      <Link to="/posts" className="logo">
        PostBoard
      </Link>

      <nav className="row">
        <NavLink to="/posts">Posts</NavLink>

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
          <Link to="/auth" className="btn ghost">
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Navbar;