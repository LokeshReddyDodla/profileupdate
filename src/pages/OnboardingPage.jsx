import { useState, useEffect, useRef } from "react";
import { startOnboarding, chatWithOnboarding } from "../api";
import ChatMessage from "../components/ChatMessage";

export default function OnboardingPage({ onComplete }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(null);
  const [missingFields, setMissingFields] = useState([]);
  const [currentField, setCurrentField] = useState(null);
  const [draftChanges, setDraftChanges] = useState(null);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    initOnboarding();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!loading) inputRef.current?.focus();
  }, [loading]);

  async function initOnboarding() {
    setLoading(true);
    try {
      const res = await startOnboarding(false);
      const data = res.data;
      setState(data.state);
      setMissingFields(data.missing_required_fields || []);
      setCurrentField(data.current_question_field);
      setDraftChanges(data.draft_changes);

      if (data.state === "completed") {
        onComplete();
        return;
      }

      if (data.reply) {
        setMessages([{ role: "agent", content: data.reply }]);
      }
      setStarted(true);
    } catch (err) {
      setMessages([{ role: "agent", content: `Error starting onboarding: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend(e) {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await chatWithOnboarding(userMsg);
      const data = res.data;
      setMessages((prev) => [...prev, { role: "agent", content: data.reply }]);
      setState(data.state);
      setMissingFields(data.missing_required_fields || []);
      setCurrentField(data.current_question_field);
      setDraftChanges(data.draft_changes);

      if (data.state === "completed") {
        setTimeout(() => onComplete(), 2000);
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

  const progress = missingFields.length > 0
    ? Math.round(((16 - missingFields.length) / 16) * 100)
    : state === "completed" ? 100 : 0;

  return (
    <div className="onboarding-page">
      <div className="onboarding-header">
        <div className="onboarding-title">
          <h2>Welcome! Let's set up your profile</h2>
          <p>Answer a few questions so we can personalize your health experience.</p>
        </div>
        <div className="onboarding-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-text">{progress}% complete</span>
        </div>
      </div>

      <div className="onboarding-chat">
        <div className="messages">
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

        {state !== "completed" && (
          <div className="chat-input-wrapper">
            <form className="chat-input" onSubmit={handleSend}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer..."
                disabled={loading || !started}
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
        )}

        {state === "completed" && (
          <div className="onboarding-complete">
            Onboarding complete! Redirecting to your dashboard...
          </div>
        )}
      </div>
    </div>
  );
}
