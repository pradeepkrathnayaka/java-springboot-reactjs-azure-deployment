import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import todoApi from "../api/todoApi";
import type {
  Todo,
  TodoRequest,
  TodoStats,
  TodoFetchParams,
  PagedResponse,
  DeleteCompletedResponse,
  AppNotification,
  Priority,
} from "../types";

// ─── Helper ──────────────────────────────────────────────────

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred";
}

// ─── Async Thunks ────────────────────────────────────────────

export const fetchTodos = createAsyncThunk<
  PagedResponse<Todo>,
  TodoFetchParams,
  { rejectValue: string }
>("todos/fetchTodos", async (params, { rejectWithValue }) => {
  try {
    const response = await todoApi.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchStats = createAsyncThunk<
  TodoStats,
  void,
  { rejectValue: string }
>("todos/fetchStats", async (_, { rejectWithValue }) => {
  try {
    const response = await todoApi.getStats();
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const createTodo = createAsyncThunk<
  Todo,
  TodoRequest,
  { rejectValue: string }
>("todos/createTodo", async (data, { rejectWithValue }) => {
  try {
    const response = await todoApi.create(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateTodo = createAsyncThunk<
  Todo,
  { id: number; data: TodoRequest },
  { rejectValue: string }
>("todos/updateTodo", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await todoApi.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const toggleTodo = createAsyncThunk<
  Todo,
  number,
  { rejectValue: string }
>("todos/toggleTodo", async (id, { rejectWithValue }) => {
  try {
    const response = await todoApi.toggleComplete(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const deleteTodo = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("todos/deleteTodo", async (id, { rejectWithValue }) => {
  try {
    await todoApi.delete(id);
    return id;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const deleteCompletedTodos = createAsyncThunk<
  DeleteCompletedResponse,
  void,
  { rejectValue: string }
>("todos/deleteCompleted", async (_, { rejectWithValue }) => {
  try {
    const response = await todoApi.deleteCompleted();
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// ─── State Interface ─────────────────────────────────────────

interface TodoState {
  items: Todo[];
  stats: TodoStats | null;
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
  };
  filters: {
    completed: boolean | null;
    priority: Priority | null;
    search: string;
    sortBy: string;
    direction: string;
  };
  loading: boolean;
  error: string | null;
  notification: AppNotification | null;
}

const initialState: TodoState = {
  items: [],
  stats: null,
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    last: true,
  },
  filters: {
    completed: null,
    priority: null,
    search: "",
    sortBy: "createdAt",
    direction: "desc",
  },
  loading: false,
  error: null,
  notification: null,
};

// ─── Slice ───────────────────────────────────────────────────

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<TodoState["filters"]>>) {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 0;
    },
    setPage(state, action: PayloadAction<number>) {
      state.pagination.page = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    clearNotification(state) {
      state.notification = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch Todos ──
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content;
        state.pagination = {
          page: action.payload.page,
          size: action.payload.size,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          last: action.payload.last,
        };
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })

      // ── Fetch Stats ──
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })

      // ── Create ──
      .addCase(createTodo.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.notification = { type: "success", message: "Todo created!" };
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.error = action.payload ?? null;
        state.notification = {
          type: "error",
          message: action.payload ?? "Failed to create todo",
        };
      })

      // ── Update ──
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        state.notification = { type: "success", message: "Todo updated!" };
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.notification = {
          type: "error",
          message: action.payload ?? "Failed to update todo",
        };
      })

      // ── Toggle ──
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })

      // ── Delete ──
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
        state.notification = { type: "success", message: "Todo deleted!" };
      })

      // ── Delete Completed ──
      .addCase(deleteCompletedTodos.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => !t.completed);
        state.notification = {
          type: "success",
          message: `Deleted ${action.payload.deletedCount} completed todos`,
        };
      });
  },
});

export const { setFilters, setPage, clearError, clearNotification } =
  todoSlice.actions;

export default todoSlice.reducer;