import { useAppDispatch } from "../store/hooks";
import { toggleTodo, deleteTodo } from "../store/todoSlice";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import type { Todo, Priority } from "../types";

const PRIORITY_COLORS: Record<Priority, string> = {
  HIGH: "#ef4444",
  MEDIUM: "#f59e0b",
  LOW: "#22c55e",
};

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

export default function TodoItem({ todo, onEdit }: TodoItemProps) {
  const dispatch = useAppDispatch();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    dispatch(deleteTodo(todo.id));
    setShowConfirm(false);
  };

  return (
    <>
      <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
        <div className="todo-left">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => dispatch(toggleTodo(todo.id))}
            className="todo-checkbox"
          />
          <div className="todo-content">
            <h3 className={todo.completed ? "line-through" : ""}>
              {todo.title}
            </h3>
            {todo.description && <p className="todo-desc">{todo.description}</p>}
            <div className="todo-meta">
              <span
                className="priority-badge"
                style={{ backgroundColor: PRIORITY_COLORS[todo.priority] }}
              >
                {todo.priority}
              </span>
              <span className="todo-date">
                {new Date(todo.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="todo-actions">
          <button className="btn btn-small btn-edit" onClick={() => onEdit(todo)}>
            Edit
          </button>
          <button
            className="btn btn-small btn-danger"
            onClick={() => setShowConfirm(true)}
          >
            Delete
          </button>
        </div>
      </div>

      {showConfirm && (
        <ConfirmDialog
          message={`Delete "${todo.title}"?`}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}