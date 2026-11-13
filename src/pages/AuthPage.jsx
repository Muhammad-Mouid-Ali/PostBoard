import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const EMPTY_FORM = { name: "", email: "", password: "" };

function validate(values, mode) {
  const errors = {};

  if (mode === "signup" && values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (mode === "signup" && values.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  } else if (values.password.length === 0) {
    errors.password = "Password is required.";
  }

  return errors;
}

function AuthPage() {
  const { isAuthenticated, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const redirectTo = location.state?.from?.pathname ?? "/posts";

  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const isSignUp = mode === "signup";

  function switchMode(nextMode) {
    setMode(nextMode);
    setForm(EMPTY_FORM);
    setErrors({});
    setFormError("");
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined })); // clear that field's error
    setFormError("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    const found = validate(form, mode);
    setErrors(found);
    if (Object.keys(found).length > 0) return; // stop: there are problems

    const result = isSignUp
      ? signUp({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        })
      : signIn({ email: form.email.trim(), password: form.password });

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="auth">
      <section className="auth-brand">
        <span className="logo" style={{ color: "#fff" }}>
          PostBoard
        </span>
        <h1>Share what you are learning.</h1>
        <p>
          Write posts, join the discussion and keep every conversation in one
          place.
        </p>
      </section>

      <section className="auth-panel">
        <div className="card auth-card">
          <div className="row tabs">
            <button
              type="button"
              className={isSignUp ? "btn ghost" : "btn"}
              onClick={() => switchMode("signin")}
            >
              Sign in
            </button>
            <button
              type="button"
              className={isSignUp ? "btn" : "btn ghost"}
              onClick={() => switchMode("signup")}
            >
              Sign up
            </button>
          </div>

          <h2 style={{ fontSize: 24, marginBottom: 4 }}>
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className="muted" style={{ marginBottom: 24 }}>
            {isSignUp
              ? "It only takes a minute."
              : "Demo login: demo@example.com / demo123"}
          </p>

          {formError && (
            <div className="form-error" role="alert">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {isSignUp && (
              <div className="field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  className={errors.name ? "input invalid" : "input"}
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Muhammad Ali"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <p className="error">{errors.name}</p>}
              </div>
            )}

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className={errors.email ? "input invalid" : "input"}
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className={errors.password ? "input invalid" : "input"}
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                aria-invalid={Boolean(errors.password)}
              />
              {errors.password && <p className="error">{errors.password}</p>}
            </div>

            <button type="submit" className="btn" style={{ width: "100%" }}>
              {isSignUp ? "Create account" : "Sign in"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default AuthPage;