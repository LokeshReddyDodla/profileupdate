import { useState, useEffect } from "react";
import { isLoggedIn, clearToken } from "./api";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import NavBar from "./components/NavBar";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [page, setPage] = useState("chat");

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  function handleLogin() {
    setLoggedIn(true);
    setPage("chat");
  }

  function handleLogout() {
    clearToken();
    setLoggedIn(false);
    setPage("chat");
  }

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <NavBar page={page} setPage={setPage} onLogout={handleLogout} />
      <div className="app-content">
        {page === "chat" && <ChatPage />}
        {page === "profile" && <ProfilePage />}
      </div>
    </div>
  );
}
