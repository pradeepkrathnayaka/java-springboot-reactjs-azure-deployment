import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setFilters, deleteCompletedTodos } from "../store/todoSlice";
import { useState, type KeyboardEvent } from "react";
import type { Priority } from "../types";

export default function TodoFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.todos.filters);
  const [searchInput, setSearchInput] = useState(filters.search);

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      dispatch(setFilters({ search: searchInput }));
    }
  };

  const handleSearchClick = () => {
    dispatch(setFilters({ search: searchInput }));
  };

  return (
    <div className="filters">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search todos..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
        <button className="btn btn-small" onClick={handleSearchClick}>
          Search
        </button>
      </div>

      <div className="filter-row">
        <select
          value={filters.completed === null ? "ALL" : String(filters.completed)}
          onChange={(e) =>
            dispatch(
              setFilters({
                completed: e.target.value === "ALL" ? null : e.target.value === "true",
              })
            )
          }
        >
          <option value="ALL">All Status</option>
          <option value="false">Pending</option>
          <option value="true">Completed</option>
        </select>

        <select
          value={filters.priority ?? "ALL"}
          onChange={(e) =>
            dispatch(
              setFilters({
                priority: e.target.value === "ALL" ? null : e.target.value as Priority,
              })
            )
          }
        >
          <option value="ALL">All Priorities</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <select
          value={`${filters.sortBy}-${filters.direction}`}
          onChange={(e) => {
            const [sortBy, direction] = e.target.value.split("-");
            dispatch(setFilters({ sortBy, direction }));
          }}
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
          <option value="priority-desc">Priority High→Low</option>
          <option value="priority-asc">Priority Low→High</option>
        </select>

        <button
          className="btn btn-danger btn-small"
          onClick={() => dispatch(deleteCompletedTodos())}
        >
          Clear Completed
        </button>
      </div>
    </div>
  );
}