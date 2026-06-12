import React, { useState } from "react";

export default function Signup() {
  const role = localStorage.getItem("auth_role");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  if (role !== "admin") {
    return (
      <div style={styles.center}>
        <div style={styles.deniedCard}>
          <h2>⛔ Access Denied</h2>
          <p>Only admins can create staff accounts</p>
        </div>
      </div>
    );
  }

  const registerUser = async () => {
    if (!username || !password || !confirmPassword) {
      return setMessage({ type: "error", text: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return setMessage({ type: "error", text: "Passwords do not match" });
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(
        "https://tabby-shop-backend.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            username,
            password,
            role: "staff",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Signup failed" });
        return setLoading(false);
      }

      setMessage({ type: "success", text: "Staff created successfully 🎉" });

      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage({ type: "error", text: "Server error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>👤 Create Staff Account</h2>
        <p style={styles.subtitle}>Register a new team member</p>

        {/* PASSWORD RULE BOX */}
        <div style={styles.guide}>
          <strong>⚠️ Password Rules</strong>
          <ul>
            <li>Start with CAPITAL letter</li>
            <li>Include numbers (0-9)</li>
            <li>Include special character (!@#$%)</li>
            <li>Minimum 8 characters</li>
          </ul>
          <p style={{ marginTop: 6 }}>
            Example: <b>Admin@123</b>
          </p>
        </div>

        {/* INPUTS */}
        <div style={styles.form}>
          <input
            style={styles.input}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div style={styles.passwordWrap}>
            <input
              style={styles.input}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              style={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <input
            style={styles.input}
            placeholder="Confirm Password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            onClick={registerUser}
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Creating..." : "Create Staff"}
          </button>

          {message && (
            <div
              style={{
                ...styles.message,
                background:
                  message.type === "error" ? "#fee2e2" : "#dcfce7",
                color: message.type === "error" ? "#b91c1c" : "#166534",
              }}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",
    padding: 20,
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "white",
  },

  deniedCard: {
    padding: 25,
    borderRadius: 12,
    background: "#1f2937",
    textAlign: "center",
  },

  card: {
    width: "100%",
    maxWidth: 420,
    padding: 28,
    borderRadius: 18,
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
    color: "white",
  },

  title: {
    marginBottom: 5,
    fontSize: 22,
  },

  subtitle: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 20,
  },

  guide: {
    background: "rgba(245, 158, 11, 0.15)",
    border: "1px solid #f59e0b",
    padding: 12,
    borderRadius: 12,
    fontSize: 13,
    marginBottom: 15,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    outline: "none",
  },

  passwordWrap: {
    position: "relative",
  },

  eye: {
    position: "absolute",
    right: 12,
    top: 12,
    cursor: "pointer",
    fontSize: 18,
  },

  button: {
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg, #6366f1, #a855f7)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.2s",
  },

  message: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    fontSize: 13,
    textAlign: "center",
  },
};