import { useContext } from "react";
import PostsContext from "./PostsContext";

function usePosts() {
  const context = useContext(PostsContext);
  if (context === null) {
    throw new Error("usePosts must be used inside <PostsProvider>");
  }
  return context;
}

export default usePosts;