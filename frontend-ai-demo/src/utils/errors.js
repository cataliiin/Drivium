export function getErrorMessage(error, fallbackMessage) {
  return String(error?.data?.detail || error?.message || fallbackMessage);
}
