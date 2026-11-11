import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="wrap">
      <div className="card">
        <h1>Page not found</h1>
        <p className="muted" style={{ margin: "8px 0 16px" }}>
          That address does not exist.
        </p>
        <Link to="/posts" className="btn">Back to posts</Link>
      </div>
    </div>
  );
}

export default NotFoundPage;