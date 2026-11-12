import { useEffect, useState } from "react";
import PostsContext from "./PostsContext";
import useAuth from "./useAuth";

const API = "https://jsonplaceholder.typicode.com";

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  return res.json();
}

function PostsProvider({ children }) {
  const { currentUser } = useAuth();

  const [posts, setPosts] = useState([]);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const apiPosts = await getJson(`${API}/posts`);

        const commentLists = await Promise.all(
          apiPosts.map((post) => getJson(`${API}/posts/${post.id}/comments`))
        );

        const grouped = {};
        apiPosts.forEach((post, index) => {
          grouped[post.id] = commentLists[index];
        });

        const normalized = apiPosts.map((p) => ({
          id: p.id,
          userId: p.userId,
          title: p.title,
          content: p.body,
        }));

        if (!ignore) {
          setPosts(normalized);
          setCommentsByPost(grouped);
          setStatus("success");
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Something went wrong.");
          setStatus("error");
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [attempt]);

  function retry() {
    setError("");
    setStatus("loading");
    setAttempt((n) => n + 1);
  }

  // ---------- NEW: create, edit, delete ----------

  function addPost({ title, content }) {
    if (!currentUser) {
      return { ok: false, error: "You must be signed in to create a post." };
    }

    const id = posts.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    const newPost = {
      id,
      userId: currentUser.id,
      title: title.trim(),
      content: content.trim(),
    };

    setPosts((prev) => [newPost, ...prev]);
    setCommentsByPost((prev) => ({ ...prev, [id]: [] }));
    return { ok: true, post: newPost };
  }

  function updatePost(id, { title, content }) {
    const post = posts.find((p) => p.id === id);
    if (!post) {
      return { ok: false, error: "Post not found." };
    }
    if (!currentUser || post.userId !== currentUser.id) {
      return { ok: false, error: "You can only edit your own posts." };
    }

    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, title: title.trim(), content: content.trim() } : p
      )
    );
    return { ok: true };
  }

  function deletePost(id) {
    const post = posts.find((p) => p.id === id);
    if (!post) {
      return { ok: false, error: "Post not found." };
    }
    if (!currentUser || post.userId !== currentUser.id) {
      return { ok: false, error: "You can only delete your own posts." };
    }

    setPosts((prev) => prev.filter((p) => p.id !== id));
    setCommentsByPost((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    return { ok: true };
  }

  const value = {
    posts,
    setPosts,
    commentsByPost,
    setCommentsByPost,
    status,
    error,
    retry,
    addPost,
    updatePost,
    deletePost,
  };

  return (
    <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
  );
}

export default PostsProvider;