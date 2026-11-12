import { Link } from "react-router-dom";

function PostCard({
  post,
  authorName,
  isOwner,
  commentCount,
  onEdit,
  onDelete,
}) {
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

      {isOwner && (
        <div className="row actions">
          <button
            type="button"
            className="btn ghost"
            onClick={() => onEdit(post.id)}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn danger"
            onClick={() => onDelete(post)}
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}

export default PostCard;