import React, { useState, useEffect } from "react";

export default function Accounts() {
  const [users, setUsers] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  useEffect(() => {
    const savedUsers =
      JSON.parse(localStorage.getItem("users")) || [];

    setUsers(savedUsers);
  }, []);

  const role = localStorage.getItem("auth_role");

  if (role !== "admin") {
    return <h3>⛔ Access Denied</h3>;
  }

  const togglePassword = (index) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const deleteUser = (username) => {
    if (!window.confirm(`Delete ${username}?`)) return;

    const updatedUsers = users.filter(
      (u) => u.username !== username
    );

    setUsers(updatedUsers);
    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>👥 Staff Accounts</h2>

      {users.length === 0 ? (
        <p>No accounts found</p>
      ) : (
        users.map((user, index) => (
          <div
            key={index}
            style={{
              padding: 15,
              marginBottom: 12,
              border: "1px solid #ddd",
              borderRadius: 10,
              background: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <p>
              <strong>Username:</strong>{" "}
              {user.username}
            </p>

            <p>
              <strong>Password:</strong>{" "}
              {visiblePasswords[index]
                ? user.password
                : "••••••••"}
            </p>

            <p>
              <strong>Role:</strong>{" "}
              {user.role}
            </p>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 10,
              }}
            >
              <button
                onClick={() =>
                  togglePassword(index)
                }
                style={{
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: 6,
                  background: "#2563eb",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                {visiblePasswords[index]
                  ? "Hide Password"
                  : "Show Password"}
              </button>

              <button
                onClick={() =>
                  deleteUser(user.username)
                }
                style={{
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: 6,
                  background: "#ef4444",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}