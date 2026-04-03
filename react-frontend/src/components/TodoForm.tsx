import { useState, type FormEvent, type ChangeEvent } from "react";
import { useAppDispatch } from "../store/hooks";
import { createTodo, updateTodo } from "../store/todoSlice";
import type { Todo, Priority } from "../types";

interface TodoFormProps {
  editingTodo: Todo | null;
  onCancelEdit: () => void;
}

interface FormData {
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
}

const EMPTY_FORM: FormData = {
  title: "",
  description: "",
  priority: "MEDIUM",
  completed: false,
};

export default function TodoForm({ editingTodo, onCancelEdit }: TodoFormProps) {
  const dispatch = useAppDispatch();
  const isEditing = Boolean(editingTodo);

  const [form, setForm] = useState<FormData>(
    editingTodo
      ? {
          title: editingTodo.title,
          description: editingTodo.description || "",
          priority: editingTodo.priority,
          completed: editingTodo.completed,
        }
      : { ...EMPTY_FORM }
  );

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (form.title.length > 200) newErrors.title = "Title too long (max 200)";
    if (form.description.length > 1000)
      newErrors.description = "Description too long (max 1000)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = { ...form, title: form.title.trim(), description: form.description.trim() };

    if (isEditing && editingTodo) {
      dispatch(updateTodo({ id: editingTodo.id, data: payload }));
      onCancelEdit();
    } else {
      dispatch(createTodo(payload));
      setForm({ ...EMPTY_FORM });
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const name = target.name as keyof FormData;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name in errors) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? "Edit Todo" : "Add New Todo"}</h2>

      <div className="form-group">
        <input
          type="text"
          name="title"
          placeholder="What needs to be done?"
          value={form.title}
          onChange={handleChange}
          className={errors.title ? "input-error" : ""}
          autoFocus
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className={errors.description ? "input-error" : ""}
        />
        {errors.description && <span className="error-text">{errors.description}</span>}
      </div>

      <div className="form-row">
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="LOW">Low Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="HIGH">High Priority</option>
        </select>

        {isEditing && (
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="completed"
              checked={form.completed}
              onChange={handleChange}
            />
            Completed
          </label>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isEditing ? "Update" : "Add Todo"}
        </button>
        {isEditing && (
          <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}