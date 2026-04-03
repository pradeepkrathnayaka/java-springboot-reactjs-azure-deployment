import { useNotification } from "../hooks/useNotification";

export default function Notification() {
  const notification = useNotification();

  if (!notification) return null;

  const bgColor =
    notification.type === "success" ? "var(--color-success)" : "var(--color-error)";

  return (
    <div className="notification" style={{ backgroundColor: bgColor }}>
      {notification.message}
    </div>
  );
}