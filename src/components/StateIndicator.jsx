const STATE_COLORS = {
  collecting: "#3b82f6",
  reviewing: "#f59e0b",
  applying: "#8b5cf6",
  completed: "#10b981",
  cancelled: "#ef4444",
};

export default function StateIndicator({ state }) {
  if (!state) return null;
  return (
    <span
      className="state-badge"
      style={{ backgroundColor: STATE_COLORS[state] || "#6b7280" }}
    >
      {state}
    </span>
  );
}
