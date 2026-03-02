import { useEffect } from "react";

const AUTO_HIDE_MS = 4000;

export default function StatusAlert({ message, variant = "danger", onClose }) {
  useEffect(() => {
    if (!message || !onClose) {
      return undefined;
    }

    const timer = setTimeout(() => {
      onClose();
    }, AUTO_HIDE_MS);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  return (
    <div className={`alert alert-${variant} py-2 mb-3`} role="alert">{message}</div>
  );
}
