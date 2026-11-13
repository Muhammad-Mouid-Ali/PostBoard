import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import MyPostsPage from "./pages/MyPostsPage";
import NotFoundPage from "./pages/NotFoundPage";
import PostDetailPage from "./pages/PostDetailPage";
import PostsPage from "./pages/PostsPage";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/posts" replace />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route
          path="/my-posts"
          element={
            <ProtectedRoute>
              <MyPostsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;