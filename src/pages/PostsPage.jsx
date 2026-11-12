import usePosts from "../context/usePosts";

function PostsPage() {
  const { posts, commentsByPost, status, error, retry } = usePosts();

  if (status === "loading") {
    return (
      <div className="state-box" role="status">
        <h2>Loading posts...</h2>
        <p className="muted">Fetching posts and comments.</p>
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

  return (
    <div>
      <h1>All posts</h1>
      <p className="muted">
        TEMPORARY: {posts.length} posts loaded.
      </p>
      <ul>
        {posts.slice(0, 5).map((post) => (
          <li key={post.id}>
            #{post.id} (user {post.userId}): {post.title} [
            {commentsByPost[post.id].length} comments]
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostsPage;