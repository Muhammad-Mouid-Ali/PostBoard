import { useState } from "react";
import CommentForm from "./CommentForm";
import getInitials from "../context/getInitials";

function CommentItem({ comment, isOwner, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  function handleDelete() {
    if (window.confirm("Delete this comment?")) {
      onDelete(comment.id);
    }
  }

  return (
    <div className="comment">
      <div className="avatar">{getInitials(comment.authorName)}</div>

      <div className="comment-main">
        <p className="comment-author">
          {comment.authorName}
          {isOwner && " (you)"}
        </p>

        {isEditing ? (
          <div className="comment-edit">
            <CommentForm
              label="Edit comment"
              submitLabel="Save"
              initialValue={comment.content}
              onSubmit={(text) => {
                const result = onUpdate(comment.id, text);
                if (result.ok) setIsEditing(false);
                return result;
              }}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <>
            <p className="comment-text">{comment.content}</p>
            {isOwner && (
              <div className="comment-actions">
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CommentItem;