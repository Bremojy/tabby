import React, { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const login = () => {
    setLoading(true);
    setMessage(null);

    setTimeout(() => {
      const ADMIN_USERNAME = "Admin";
      const ADMIN_PASSWORD = "Nimda#";

      // ADMIN LOGIN
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem("loggedInUser", username);
        localStorage.setItem("auth_role", "admin");

        setMessage({ type: "success", text: "Welcome Admin Mode 🔐" });
        setTimeout(() => window.location.reload(), 800);
        return;
      }

      // NORMAL USERS
      const users = JSON.parse(localStorage.getItem("users")) || [];

      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (!user) {
        setMessage({ type: "error", text: "Invalid username or password" });
        setLoading(false);
        return;
      }

      localStorage.setItem("loggedInUser", user.username);
      localStorage.setItem("auth_role", user.role || "staff");

      setMessage({ type: "success", text: "Login successful!" });

      setTimeout(() => window.location.reload(), 800);
    }, 700);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Welcome Back</h2>
        <p style={styles.subtitle}>Login to your Tabby POS account</p>

        {/* USERNAME */}
        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* PASSWORD */}
        <div style={styles.passwordBox}>
          <input
            style={styles.input}
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            style={styles.eye}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* BUTTON */}
        <button
          onClick={login}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* MESSAGE */}
        {message && (
          <p
            style={{
              color: message.type === "error" ? "#ef4444" : "#22c55e",
              marginTop: 10,
              fontWeight: "bold",
            }}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  wrapper: {
    height: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #111827, #1f2937)",
  },

  card: {
    width: 320,
    padding: 25,
    borderRadius: 16,
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    color: "white",
    textAlign: "center",
  },

  title: {
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 20,
  },

  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.2)",
    outline: "none",
    background: "rgba(255,255,255,0.05)",
    color: "white",
  },

  passwordBox: {
    position: "relative",
  },

  eye: {
    position: "absolute",
    right: 10,
    top: 12,
    cursor: "pointer",
    fontSize: 18,
  },

  button: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
    color: "white",
    fontWeight: "bold",
    marginTop: 5,
  },
};