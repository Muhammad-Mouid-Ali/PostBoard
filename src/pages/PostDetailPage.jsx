import { useParams } from "react-router-dom";

function PostDetailPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Post #{id}</h1>
      <p className="muted">Post detail and comments come in Step 8.</p>
    </div>
  );
}

export default PostDetailPage;