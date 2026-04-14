import { useState, useEffect } from "react";
import { isLoggedIn, clearToken, startOnboarding } from "./api";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import NavBar from "./components/NavBar";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [page, setPage] = useState("chat");
  const [needsOnboarding, setNeedsOnboarding] = useState(null); // null = checking, true/false
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  useEffect(() => {
    if (loggedIn) {
      checkOnboarding();
    }
  }, [loggedIn]);

  async function checkOnboarding() {
    setChecking(true);
    try {
      const res = await startOnboarding(false);
      const state = res.data?.state;
      // If completed, no onboarding needed → go to dashboard
      // If collecting/reviewing, onboarding is in progress
      setNeedsOnboarding(state !== "completed");
    } catch {
      // If error (e.g., 401), assume no onboarding needed
      setNeedsOnboarding(false);
    } finally {
      setChecking(false);
    }
  }

  function handleLogin() {
    setLoggedIn(true);
    setNeedsOnboarding(null); // will trigger checkOnboarding via useEffect
  }

  function handleLogout() {
    clearToken();
    setLoggedIn(false);
    setNeedsOnboarding(null);
    setPage("chat");
  }

  function handleOnboardingComplete() {
    setNeedsOnboarding(false);
    setPage("profile");
  }

  // Not logged in → show login
  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Checking onboarding status
  if (checking || needsOnboarding === null) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  // Needs onboarding → show onboarding chat
  if (needsOnboarding) {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  // Dashboard
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
