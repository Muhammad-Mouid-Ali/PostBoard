import { Link, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import useAuth from "../context/useAuth";
import usePosts from "../context/usePosts";
import useDocumentTitle from "../context/useDocumentTitle";

function MyPostsPage() {
  const { currentUser } = useAuth();
  const { posts, commentsByPost, status, error, retry, deletePost } =
    usePosts();
  const navigate = useNavigate();

  useDocumentTitle("My posts · PostBoard");

  if (status === "loading") {
    return (
      <div className="state-box" role="status">
        <h2>Loading posts...</h2>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="card state-box" role="alert">
        <h2>Could not load posts</h2>
        <p className="muted">{error}</p>
        <button className="btn" onClick={retry}>
          Try again
        </button>
      </div>
    );
  }

  const myPosts = posts.filter((p) => p.userId === currentUser?.id);

  function handleDelete(post) {
    if (!window.confirm(`Delete "${post.title}"?`)) return;
    const result = deletePost(post.id);
    if (!result.ok) window.alert(result.error);
  }

  return (
    <div>
      <div className="page-head">
        <h1>My posts</h1>
        <p className="muted">
          {myPosts.length} {myPosts.length === 1 ? "post" : "posts"} written by
          you
        </p>
      </div>

      {myPosts.length === 0 ? (
        <div className="card state-box">
          <h2>You have not written a post yet</h2>
          <p className="muted">Share something from the posts page.</p>
          <Link to="/posts" className="btn">
            Go to posts
          </Link>
        </div>
      ) : (
        <div className="grid">
          {myPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              authorName={currentUser.name}
              isOwner
              commentCount={(commentsByPost[post.id] ?? []).length}
              onEdit={(id) => navigate(`/posts/${id}`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPostsPage;