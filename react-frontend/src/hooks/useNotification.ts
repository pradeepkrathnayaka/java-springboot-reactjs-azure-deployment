import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearNotification } from "../store/todoSlice";
import type { AppNotification } from "../types";

export function useNotification(duration = 3000): AppNotification | null {
  const dispatch = useAppDispatch();
  const notification = useAppSelector((state) => state.todos.notification);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => dispatch(clearNotification()), duration);
      return () => clearTimeout(timer);
    }
  }, [notification, duration, dispatch]);

  return notification;
}