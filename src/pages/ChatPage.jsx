import { useState, useEffect, useRef } from "react";
import { chatWithAgent, getDraft } from "../api";
import ChatMessage from "../components/ChatMessage";
import DraftPanel from "../components/DraftPanel";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(null);
  const [draftChanges, setDraftChanges] = useState(null);
  const [appliedChanges, setAppliedChanges] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadDraft();
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Re-focus input after loading finishes
  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  async function loadDraft() {
    try {
      const res = await getDraft();
      if (res.data) {
        setState(res.data.state);
        setDraftChanges(res.data.draft_changes);
      }
    } catch {
      // No active draft
    }
  }

  async function handleSend(e) {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    setAppliedChanges(null);

    try {
      const res = await chatWithAgent(userMsg);
      const data = res.data;
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: data.reply },
      ]);
      setState(data.state);
      setDraftChanges(data.draft_changes);
      if (data.applied_changes) {
        setAppliedChanges(data.applied_changes);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: `Error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-area">
        <div className="messages">
          {messages.length === 0 && (
            <div className="empty-chat">
              <div className="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h2>Profile Update Agent</h2>
              <p>Tell me what you'd like to update in your profile.</p>
              <div className="suggestions">
                {["Change my height to 175 cm", "Update my weight to 80 kg", "Set my activity level to moderate"].map((s) => (
                  <button
                    key={s}
                    className="suggestion-chip"
                    onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ))}
          {loading && (
            <div className="chat-msg agent">
              <div className="msg-bubble typing">
                <span className="dot-pulse"></span>
                Thinking...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-wrapper">
          <form className="chat-input" onSubmit={handleSend}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message and press Enter..."
              disabled={loading}
              maxLength={2000}
              autoFocus
            />
            <button type="submit" disabled={loading || !input.trim()} title="Send (Enter)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
          <span className="input-hint">Press Enter to send</span>
        </div>
      </div>

      <DraftPanel
        state={state}
        draftChanges={draftChanges}
        appliedChanges={appliedChanges}
      />
    </div>
  );
}
