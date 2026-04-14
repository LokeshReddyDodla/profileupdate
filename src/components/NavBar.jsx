export default function NavBar({ page, setPage, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">AiHealth</div>
      <div className="nav-links">
        <button
          className={`nav-link ${page === "chat" ? "active" : ""}`}
          onClick={() => setPage("chat")}
        >
          Chat
        </button>
        <button
          className={`nav-link ${page === "profile" ? "active" : ""}`}
          onClick={() => setPage("profile")}
        >
          Profile
        </button>
        <button className="nav-link logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
