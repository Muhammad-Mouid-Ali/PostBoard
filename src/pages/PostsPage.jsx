import { useState } from "react";
import PostCard from "../components/PostCard";
import useAuth from "../context/useAuth";
import usePosts from "../context/usePosts";

const PAGE_SIZE = 12;

function PostsPage() {
  const { currentUser, getAuthorName } = useAuth();
  const { posts, commentsByPost, status, error, retry } = usePosts();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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

  if (posts.length === 0) {
    return (
      <div className="card state-box">
        <h2>No posts yet</h2>
        <p className="muted">Be the first to share something.</p>
      </div>
    );
  }

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  return (
    <div>
      <div className="page-head">
        <h1>All posts</h1>
        <p className="muted">
          Showing {visiblePosts.length} of {posts.length} posts
        </p>
      </div>

      <div className="grid">
        {visiblePosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            authorName={getAuthorName(post.userId)}
            isOwner={currentUser?.id === post.userId}
            commentCount={(commentsByPost[post.id] ?? []).length}
          />
        ))}
      </div>

      {hasMore && (
        <div className="more-row">
          <button
            className="btn ghost"
            onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
}

export default PostsPage;