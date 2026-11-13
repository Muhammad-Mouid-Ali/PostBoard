import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CommentForm from "../components/CommentForm";
import CommentItem from "../components/CommentItem";
import PostForm from "../components/PostForm";
import useAuth from "../context/useAuth";
import usePosts from "../context/usePosts";

function PostDetailPage() {
  const { id } = useParams();
  const postId = Number(id);
  const navigate = useNavigate();

  const { currentUser, isAuthenticated, getAuthorName } = useAuth();
  const {
    posts,
    commentsByPost,
    status,
    error,
    retry,
    updatePost,
    deletePost,
    addComment,
    updateComment,
    deleteComment,
  } = usePosts();

  const [isEditingPost, setIsEditingPost] = useState(false);

  if (status === "loading") {
    return (
      <div className="state-box" role="status">
        <h2>Loading post...</h2>
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

  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return (
      <div className="card state-box">
        <h2>Post not found</h2>
        <p className="muted">It may have been deleted.</p>
        <Link to="/posts" className="btn">
          Back to posts
        </Link>
      </div>
    );
  }

  const comments = commentsByPost[postId] ?? [];
  const isPostOwner = currentUser?.id === post.userId;

  function handleDeletePost() {
    if (!window.confirm(`Delete "${post.title}"?`)) return;

    const result = deletePost(post.id);
    if (!result.ok) {
      window.alert(result.error);
      return;
    }
    navigate("/posts");
  }

  return (
    <div className="detail">
      <Link to="/posts" className="back-link">
        Back to posts
      </Link>

      <article className="card">
        {isEditingPost && isPostOwner ? (
          <PostForm
            heading="Edit post"
            submitLabel="Save changes"
            initialValues={{ title: post.title, content: post.content }}
            onSubmit={(values) => {
              const result = updatePost(post.id, values);
              if (result.ok) setIsEditingPost(false);
              return result;
            }}
            onCancel={() => setIsEditingPost(false)}
          />
        ) : (
          <>
            <span className="tag">
              {isPostOwner ? "Your post" : getAuthorName(post.userId)}
            </span>
            <h1 className="detail-title">{post.title}</h1>
            <p className="detail-content">{post.content}</p>

            {isPostOwner && (
              <div className="row" style={{ marginTop: 20 }}>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setIsEditingPost(true)}
                >
                  Edit post
                </button>
                <button
                  type="button"
                  className="btn danger"
                  onClick={handleDeletePost}
                >
                  Delete post
                </button>
              </div>
            )}
          </>
        )}
      </article>

      <section className="card comments-card">
        <h2 className="form-heading">Comments ({comments.length})</h2>

        {isAuthenticated ? (
          <div className="comment-compose">
            <CommentForm
              onSubmit={(text) => addComment(postId, text)}
              clearOnSubmit
            />
          </div>
        ) : (
          <p className="muted comment-compose">
            <Link to="/auth">Sign in</Link> to join the discussion.
          </p>
        )}

        {comments.length === 0 ? (
          <p className="muted">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isOwner={
                currentUser !== null && comment.userId === currentUser.id
              }
              onUpdate={(commentId, text) =>
                updateComment(postId, commentId, text)
              }
              onDelete={(commentId) => deleteComment(postId, commentId)}
            />
          ))
        )}
      </section>
    </div>
  );
}

export default PostDetailPage;