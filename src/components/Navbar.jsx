import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="nav">
      <Link to="/posts" className="logo">
        PostBoard
      </Link>

      <nav className="row">
        <NavLink to="/posts">Posts</NavLink>
        <Link to="/auth" className="btn ghost">
          Sign in
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;