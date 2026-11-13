import { useId, useState } from "react";

function CommentForm({
  label = "Add a comment",
  submitLabel = "Post comment",
  initialValue = "",
  onSubmit,
  onCancel,
  clearOnSubmit = false,
}) {
  const uid = useId();
  const [text, setText] = useState(initialValue);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (text.trim().length < 2) {
      setError("Comment must be at least 2 characters.");
      return;
    }

    const result = onSubmit(text);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    if (clearOnSubmit) setText("");
    setError("");
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor={uid}>{label}</label>
        <textarea
          id={uid}
          rows={3}
          className={error ? "input invalid" : "input"}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError("");
          }}
          placeholder="Share your thoughts"
          aria-invalid={Boolean(error)}
        />
        {error && <p className="error">{error}</p>}
      </div>

      <div className="row">
        <button type="submit" className="btn">
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default CommentForm;