export default function ChatMessage({ role, content }) {
  return (
    <div className={`chat-msg ${role}`}>
      <div className="msg-bubble">
        <div className="msg-role">{role === "user" ? "You" : "Agent"}</div>
        <div className="msg-content">{content}</div>
      </div>
    </div>
  );
}
