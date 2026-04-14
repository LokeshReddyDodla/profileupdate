import { useState } from "react";
import { sendOtp, verifyOtp } from "../api";

export default function LoginPage({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function handleSendOtp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await sendOtp(phone);
      setOtpSent(true);
      setInfo(res.message || "OTP sent");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyOtp(phone, otp);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Profile Update Agent</h1>
        <p className="subtitle">Sign in to manage your health profile</p>

        {!otpSent ? (
          <form onSubmit={handleSendOtp}>
            <label>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <label>Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="0512"
              maxLength={6}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setOtpSent(false);
                setOtp("");
                setInfo("");
              }}
            >
              Change number
            </button>
          </form>
        )}

        {info && <p className="info">{info}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
