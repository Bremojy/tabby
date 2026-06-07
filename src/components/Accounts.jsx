import React, { useState, useEffect } from "react";

const BASE_URL = "http://tabby-shop-backend.onrender.com/api/users";

export default function Accounts() {
  const [users, setUsers] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const role = localStorage.getItem("auth_role");

  /* ================= LOAD USERS ================= */
  useEffect(() => {
    if (role !== "admin") return;

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUsers(data);
      } else {
        console.log(data);
      }
    } catch (err) {
      console.log("Error loading users:", err);
    }
  };

  /* ================= ACCESS CONTROL ================= */
  if (role !== "admin") {
    return <h3>⛔ Access Denied</h3>;
  }

  /* ================= TOGGLE PASSWORD ================= */
  const togglePassword = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /* ================= DELETE USER ================= */
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      const token = localStorage.getItem("token");

      await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUsers();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>👥 Staff Accounts</h2>

      {users.length === 0 ? (
        <p>No accounts found</p>
      ) : (
        users.map((user) => (
          <div
            key={user._id}
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
              <strong>Username:</strong> {user.username}
            </p>

            <p>
              <strong>Password:</strong>{" "}
              {visiblePasswords[user._id]
                ? "Protected"
                : "••••••••"}
            </p>

            <p>
              <strong>Role:</strong> {user.role}
            </p>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 10,
              }}
            >
              <button
                onClick={() => togglePassword(user._id)}
                style={{
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: 6,
                  background: "#2563eb",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                {visiblePasswords[user._id]
                  ? "Hide Password"
                  : "Show Password"}
              </button>

              <button
                onClick={() => deleteUser(user._id)}
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