import React, { useState, useEffect } from "react";

const BASE_URL = "https://tabby-shop-backend.onrender.com/api/users";

export default function Accounts() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const role = localStorage.getItem("auth_role");
  const currentUserId = localStorage.getItem("user_id");

  useEffect(() => {
    if (role === "admin") fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) setUsers(data);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  if (role !== "admin") {
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <h2>⛔ Access Denied</h2>
          <p>Only admin can view accounts</p>
        </div>
      </div>
    );
  }

  const deleteUser = async (id) => {
    if (id === currentUserId) {
      alert("You cannot delete your own account!");
      return;
    }

    if (!window.confirm("Delete this user?")) return;

    const token = localStorage.getItem("token");

    await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchUsers();
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>👥 Staff Accounts</h2>

      {loading ? (
        <div style={styles.loading}>Loading users...</div>
      ) : users.length === 0 ? (
        <div style={styles.empty}>No accounts found</div>
      ) : (
        <div style={styles.grid}>
          {[...users]
            .sort((a, b) => a.username.localeCompare(b.username))
            .map((user) => {
              const isSelf = user._id === currentUserId;

              return (
                <div key={user._id} style={styles.cardHover}>
                  <div style={styles.header}>
                    <div style={styles.avatar}>
                      {user.username?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3 style={styles.username}>{user.username}</h3>
                      <span style={styles.role}>{user.role}</span>
                    </div>
                  </div>

                  <div style={styles.info}>
                    <p>🔒 Password hidden & secured</p>
                  </div>

                  {isSelf && (
                    <p style={styles.warning}>
                      ⚠️ This is your account
                    </p>
                  )}

                  <button
                    onClick={() => deleteUser(user._id)}
                    disabled={isSelf}
                    style={{
                      ...styles.button,
                      background: isSelf ? "#9ca3af" : "#ef4444",
                      cursor: isSelf ? "not-allowed" : "pointer",
                    }}
                  >
                    Delete Account
                  </button>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

/* ========== STYLES ========== */
const styles = {
  page: {
    padding: 25,
    background: "#f4f6fb",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },

  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 15,
  },

  cardHover: {
    background: "#fff",
    padding: 18,
    borderRadius: 14,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: "0.2s ease",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: "#2563eb",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  username: {
    margin: 0,
    fontSize: 16,
  },

  role: {
    fontSize: 12,
    padding: "3px 8px",
    background: "#e5e7eb",
    borderRadius: 8,
  },

  info: {
    fontSize: 13,
    color: "#555",
    marginBottom: 10,
  },

  warning: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },

  button: {
    width: "100%",
    padding: "8px",
    border: "none",
    borderRadius: 8,
    color: "white",
    fontWeight: "bold",
  },

  loading: {
    padding: 20,
  },

  empty: {
    padding: 20,
    color: "#666",
  },

  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  },

  card: {
    background: "#fff",
    padding: 30,
    borderRadius: 12,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
};