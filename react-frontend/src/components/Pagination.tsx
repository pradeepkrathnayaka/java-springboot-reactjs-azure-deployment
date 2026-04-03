import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setPage } from "../store/todoSlice";

export default function Pagination() {
  const dispatch = useAppDispatch();
  const { page, totalPages, totalElements } = useAppSelector(
    (state) => state.todos.pagination
  );

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="pagination">
      <button
        className="btn btn-small"
        disabled={page === 0}
        onClick={() => dispatch(setPage(page - 1))}
      >
        Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={`btn btn-small ${p === page ? "btn-primary" : ""}`}
          onClick={() => dispatch(setPage(p))}
        >
          {p + 1}
        </button>
      ))}

      <button
        className="btn btn-small"
        disabled={page === totalPages - 1}
        onClick={() => dispatch(setPage(page + 1))}
      >
        Next
      </button>

      <span className="page-info">{totalElements} total</span>
    </div>
  );
}