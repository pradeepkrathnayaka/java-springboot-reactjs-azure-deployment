import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchStats } from "../store/todoSlice";

export default function TodoStats() {
  const dispatch = useAppDispatch();
  const stats = useAppSelector((state) => state.todos.stats);
  const items = useAppSelector((state) => state.todos.items);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch, items]);

  if (!stats) return null;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-number">{stats.total}</span>
        <span className="stat-label">Total</span>
      </div>
      <div className="stat-card stat-completed">
        <span className="stat-number">{stats.completed}</span>
        <span className="stat-label">Completed</span>
      </div>
      <div className="stat-card stat-pending">
        <span className="stat-number">{stats.pending}</span>
        <span className="stat-label">Pending</span>
      </div>
      <div className="stat-card stat-high">
        <span className="stat-number">{stats.highPriority}</span>
        <span className="stat-label">High</span>
      </div>
      <div className="stat-card stat-medium">
        <span className="stat-number">{stats.mediumPriority}</span>
        <span className="stat-label">Medium</span>
      </div>
      <div className="stat-card stat-low">
        <span className="stat-number">{stats.lowPriority}</span>
        <span className="stat-label">Low</span>
      </div>
    </div>
  );
}