import useAuth from "../context/useAuth";

function PostsPage() {
  const { currentUser, signIn, signUp } = useAuth();

  return (
    <div>
      <h1>All posts</h1>
      <p className="muted">TEMPORARY auth test buttons</p>

      <div className="row" style={{ margin: "16px 0", flexWrap: "wrap" }}>
        <button
          className="btn"
          onClick={() =>
            console.log(signIn({ email: "demo@example.com", password: "demo123" }))
          }
        >
          Sign in as demo
        </button>
        <button
          className="btn ghost"
          onClick={() =>
            console.log(signIn({ email: "demo@example.com", password: "wrong" }))
          }
        >
          Sign in wrong password
        </button>
        <button
          className="btn ghost"
          onClick={() =>
            console.log(
              signUp({ name: "Test User", email: "test@example.com", password: "123456" })
            )
          }
        >
          Sign up Test User
        </button>
      </div>

      <pre>{JSON.stringify(currentUser, null, 2)}</pre>
    </div>
  );
}

export default PostsPage;