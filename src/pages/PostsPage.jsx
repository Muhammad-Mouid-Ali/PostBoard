import { useState } from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import useAuth from "../context/useAuth";
import usePosts from "../context/usePosts";

const PAGE_SIZE = 12;

function PostsPage() {
  const { currentUser, isAuthenticated, getAuthorName } = useAuth();
  const {
    posts,
    commentsByPost,
    status,
    error,
    retry,
    addPost,
    updatePost,
    deletePost,
  } = usePosts();

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [editingId, setEditingId] = useState(null);

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

  function handleDelete(post) {
    const confirmed = window.confirm(`Delete "${post.title}"?`);
    if (!confirmed) return;

    const result = deletePost(post.id);
    if (!result.ok) {
      window.alert(result.error);
      return;
    }
    if (editingId === post.id) setEditingId(null);
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

      <div className="card create-card">
        {isAuthenticated ? (
          <PostForm
            heading="Create a post"
            submitLabel="Publish post"
            onSubmit={addPost}
            clearOnSubmit
          />
        ) : (
          <div>
            <h2 className="form-heading">Create a post</h2>
            <p className="muted" style={{ marginBottom: 16 }}>
              Sign in to share your own post.
            </p>
            <Link to="/auth" className="btn">
              Sign in
            </Link>
          </div>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="card state-box">
          <h2>No posts yet</h2>
          <p className="muted">Be the first to share something.</p>
        </div>
      ) : (
        <div className="grid">
          {visiblePosts.map((post) => {
            const isOwner = currentUser?.id === post.userId;

            if (isOwner && editingId === post.id) {
              return (
                <div key={post.id} className="card">
                  <PostForm
                    heading="Edit post"
                    submitLabel="Save changes"
                    initialValues={{ title: post.title, content: post.content }}
                    onSubmit={(values) => {
                      const result = updatePost(post.id, values);
                      if (result.ok) setEditingId(null);
                      return result;
                    }}
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              );
            }

            return (
              <PostCard
                key={post.id}
                post={post}
                authorName={getAuthorName(post.userId)}
                isOwner={isOwner}
                commentCount={(commentsByPost[post.id] ?? []).length}
                onEdit={setEditingId}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      )}

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