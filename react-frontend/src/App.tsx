import { useState } from "react";
import "./App.css";
import TodoForm from "./components/TodoForm";
import TodoFilters from "./components/TodoFilters";
import TodoList from "./components/TodoList";
import TodoStats from "./components/TodoStats";
import Pagination from "./components/Pagination";
import Notification from "./components/Notification";
import type { Todo } from "./types";

export default function App() {
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleEdit = (todo: Todo) => setEditingTodo(todo);
  const handleCancelEdit = () => setEditingTodo(null);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📋 Todo App</h1>
        <p>Organize your tasks efficiently</p>
      </header>

      <Notification />
      <TodoStats />

      <TodoForm
        key={editingTodo?.id || "new"}
        editingTodo={editingTodo}
        onCancelEdit={handleCancelEdit}
      />

      <TodoFilters />
      <TodoList onEdit={handleEdit} />
      <Pagination />
    </div>
  );
}