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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const registerUser = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + localStorage.getItem("token"),
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
        <h2>📝 Create Staff</h2>

        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={registerUser}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        {message && (
          <p
            style={{
              color:
                message.type === "error"
                  ? "red"
                  : "lightgreen",
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  },
  card: {
    padding: 20,
    width: 300,
    border: "1px solid #ccc",
    borderRadius: 10,
  },
  input: {
    width: "100%",
    marginBottom: 10,
    padding: 10,
  },
  button: {
    width: "100%",
    padding: 10,
    background: "blue",
    color: "white",
    border: "none",
  },
};