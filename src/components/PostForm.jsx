import { useId, useState } from "react";

const EMPTY = { title: "", content: "" };

function validate(values) {
  const errors = {};

  if (values.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters.";
  }
  if (values.content.trim().length < 10) {
    errors.content = "Content must be at least 10 characters.";
  }

  return errors;
}

function PostForm({
  heading,
  submitLabel,
  onSubmit,
  onCancel,
  initialValues = EMPTY,
  clearOnSubmit = false,
}) {
  const uid = useId();
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormError("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const result = onSubmit(form);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    if (clearOnSubmit) {
      setForm(EMPTY);
      setErrors({});
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {heading && <h2 className="form-heading">{heading}</h2>}

      {formError && (
        <div className="form-error" role="alert">
          {formError}
        </div>
      )}

      <div className="field">
        <label htmlFor={`${uid}-title`}>Title</label>
        <input
          id={`${uid}-title`}
          name="title"
          className={errors.title ? "input invalid" : "input"}
          value={form.title}
          onChange={handleChange}
          placeholder="Give your post a title"
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && <p className="error">{errors.title}</p>}
      </div>

      <div className="field">
        <label htmlFor={`${uid}-content`}>Content</label>
        <textarea
          id={`${uid}-content`}
          name="content"
          rows={4}
          className={errors.content ? "input invalid" : "input"}
          value={form.content}
          onChange={handleChange}
          placeholder="What do you want to say?"
          aria-invalid={Boolean(errors.content)}
        />
        {errors.content && <p className="error">{errors.content}</p>}
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

export default PostForm;