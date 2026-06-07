import React, { useState } from "react";

const BASE_URL = "https://tabby-shop-backend.onrender.com/api/auth/login";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const login = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({
          type: "error",
          text: data.message || data.error || "Login failed",
        });
        setLoading(false);
        return;
      }

      // SAVE LOGIN SESSION
      localStorage.setItem("loggedInUser", data.user.username);
localStorage.setItem("auth_role", data.user.role);
localStorage.setItem("token", data.token);
      

      setMessage({
        type: "success",
        text: "Login successful!",
      });

      setLoading(false);

      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      setMessage({
        type: "error",
        text: "Server error. Try again later.",
      });

      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Welcome Back</h2>
        <p style={styles.subtitle}>Login to your Tabby POS account</p>

        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
        />

        <div style={styles.passwordBox}>
          <input
            style={styles.input}
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            style={styles.eye}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

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

        {message && (
          <p
            style={{
              color:
                message.type === "error"
                  ? "#ef4444"
                  : "#22c55e",
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

/* STYLES (UNCHANGED) */
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

