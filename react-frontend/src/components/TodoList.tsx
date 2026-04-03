import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTodos } from "../store/todoSlice";
import TodoItem from "./TodoItem";
import type { Todo, TodoFetchParams } from "../types";

interface TodoListProps {
  onEdit: (todo: Todo) => void;
}

export default function TodoList({ onEdit }: TodoListProps) {
  const dispatch = useAppDispatch();
  const { items, loading, error, filters, pagination } = useAppSelector(
    (state) => state.todos
  );

  useEffect(() => {
    const params: TodoFetchParams = {
      page: pagination.page,
      size: pagination.size,
      sortBy: filters.sortBy,
      direction: filters.direction,
    };
    if (filters.completed !== null) params.completed = filters.completed;
    if (filters.priority !== null) params.priority = filters.priority;
    if (filters.search) params.search = filters.search;

    dispatch(fetchTodos(params));
  }, [dispatch, pagination.page, filters]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (items.length === 0) return <div className="empty">No todos found. Add one above!</div>;

  return (
    <div className="todo-list">
      {items.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onEdit={onEdit} />
      ))}
    </div>
  );
}