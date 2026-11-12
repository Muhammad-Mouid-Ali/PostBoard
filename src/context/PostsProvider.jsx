import { useEffect, useState } from "react";
import PostsContext from "./PostsContext";

const API = "https://jsonplaceholder.typicode.com";

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  return res.json();
}

function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
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

        // Build { postId: [comments] }
        const grouped = {};
        apiPosts.forEach((post, index) => {
          grouped[post.id] = commentLists[index];
        });

        // Rename the API's "body" to "content" to match the assignment wording
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

  const value = {
    posts,
    setPosts,
    commentsByPost,
    setCommentsByPost,
    status,
    error,
    retry,
  };

  return (
    <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
  );
}

export default PostsProvider;