import { Link } from "react-router-dom";

function PostCard({ post, authorName, isOwner, commentCount }) {
  return (
    <article className="card post-card">
      <span className="tag">{isOwner ? "Your post" : authorName}</span>

      <h3>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>

      <p className="muted clamp">{post.content}</p>

      <div className="row post-footer">
        <span className="muted">
          {commentCount} {commentCount === 1 ? "comment" : "comments"}
        </span>
        <Link to={`/posts/${post.id}`} className="read-more">
          Read more
        </Link>
      </div>
    </article>
  );
}

export default PostCard;