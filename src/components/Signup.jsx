import React, { useState } from "react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // 🔐 STRONG PASSWORD RULE (UPDATED)
  const validatePassword = (pass) => {
    if (pass.length < 6)
      return "Password must be at least 6 characters";

    if (!/[A-Z]/.test(pass))
      return "Must contain at least 1 UPPERCASE letter";

    if (!/[0-9]/.test(pass))
      return "Must contain at least 1 number";

    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pass))
      return "Must contain at least 1 special character (!@#$...)";

    return null;
  };

  const handleSignup = () => {
    setLoading(true);
    setMessage(null);

    setTimeout(() => {
      if (!username.trim()) {
        setMessage({ type: "error", text: "Username is required" });
        setLoading(false);
        return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];

      const exists = users.find(
        (u) =>
          u.username.toLowerCase() === username.toLowerCase()
      );

      if (exists) {
        setMessage({ type: "error", text: "User already exists" });
        setLoading(false);
        return;
      }

      // 🔐 PASSWORD CHECK
      const validationError = validatePassword(password);
      if (validationError) {
        setMessage({ type: "error", text: validationError });
        setLoading(false);
        return;
      }

      // 🔁 CONFIRM PASSWORD CHECK
      if (password !== confirmPassword) {
        setMessage({ type: "error", text: "Passwords do not match" });
        setLoading(false);
        return;
      }

      users.push({
        username: username.trim(),
        password,
        role: "staff",
      });

      localStorage.setItem("users", JSON.stringify(users));

      setMessage({
        type: "success",
        text: "Account created successfully 🎉",
      });

      setLoading(false);

      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    }, 700);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>📝 Create Account</h2>
        <p style={styles.subtitle}>Join Tabby POS system</p>

        {/* USERNAME */}
        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* PASSWORD */}
        <div style={styles.box}>
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

        {/* CONFIRM PASSWORD */}
        <div style={styles.box}>
          <input
            style={styles.input}
            placeholder="Confirm Password"
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <span
            onClick={() => setShowConfirm(!showConfirm)}
            style={styles.eye}
          >
            {showConfirm ? "🙈" : "👁️"}
          </span>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSignup}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        {/* MESSAGE */}
        {message && (
          <p
            style={{
              marginTop: 10,
              color:
                message.type === "error" ? "#ef4444" : "#22c55e",
              fontWeight: "bold",
            }}
          >
            {message.text}
          </p>
        )}

        {/* PASSWORD RULES */}
        <div style={styles.rules}>
          <p>🔐 Password must include:</p>
          <ul>
            <li>✔ At least 6 characters</li>
            <li>✔ 1 uppercase letter</li>
            <li>✔ 1 number</li>
            <li>✔ 1 special character</li>
          </ul>
        </div>
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
    width: 340,
    padding: 25,
    borderRadius: 16,
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    color: "white",
    textAlign: "center",
  },

  title: { marginBottom: 5 },
  subtitle: { fontSize: 12, opacity: 0.7, marginBottom: 15 },

  input: {
    width: "100%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.2)",
    outline: "none",
    background: "rgba(255,255,255,0.05)",
    color: "white",
  },

  box: {
    position: "relative",
  },

  eye: {
    position: "absolute",
    right: 10,
    top: 12,
    cursor: "pointer",
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

  rules: {
    marginTop: 15,
    fontSize: 12,
    textAlign: "left",
    opacity: 0.8,
  },
};