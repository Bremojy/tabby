import React, { useState } from "react";

export default function Signup() {
  const role = localStorage.getItem("auth_role");

  if (role !== "admin") {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2>⛔ Access Denied</h2>
          <p>Only admins can create staff accounts</p>
        </div>
      </div>
    );
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const registerUser = async () => {
    if (!username || !password || !confirmPassword) {
      setMessage({
        type: "error",
        text: "All fields are required",
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Passwords do not match",
      });
      return;
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
        setMessage({
          type: "error",
          text: data.error || "Signup failed",
        });
        setLoading(false);
        return;
      }

      setMessage({
        type: "success",
        text: "Staff created successfully 🎉",
      });

      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setLoading(false);
    } catch (err) {
      setMessage({
        type: "error",
        text: "Server error",
      });
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>👤 Create Staff Account</h2>

        <p style={styles.subtitle}>Register a new staff member</p>

        {/* ✅ PASSWORD RULE GUIDE ADDED HERE */}
        <div
          style={{
            padding: 12,
            marginBottom: 15,
            borderRadius: 10,
            background: "#fef3c7",
            border: "1px solid #f59e0b",
            fontSize: 14,
            color: "#92400e",
            textAlign: "left",
          }}
        >
          <strong>⚠️ Password Rule Guide:</strong>
          <br />
          When creating accounts, ensure passwords:
          <ul style={{ marginTop: 8 }}>
            <li>Start with a <b>CAPITAL letter</b></li>
            <li>Include <b>numbers</b> (0-9)</li>
            <li>Include a <b>special character</b> (!@#$%^&*)</li>
            <li>Be at least <b>8 characters long</b></li>
          </ul>

          <p style={{ marginTop: 8 }}>
            Example: <b>Admin@123</b> or <b>Karen#2024</b>
          </p>
        </div>

        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div style={styles.passwordBox}>
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
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Creating Account..." : "Create Staff"}
        </button>

        {message && (
          <p
            style={{
              marginTop: 12,
              fontWeight: "bold",
              color: message.type === "error" ? "#ef4444" : "#22c55e",
            }}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    height: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #111827, #1f2937)",
  },

  card: {
    width: 350,
    padding: 25,
    borderRadius: 18,
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
    fontSize: 13,
    opacity: 0.75,
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
    boxSizing: "border-box",
  },

  passwordBox: {
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
    width: "100%",
    padding: 12,
    border: "none",
    borderRadius: 10,
    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: 5,
  },
};