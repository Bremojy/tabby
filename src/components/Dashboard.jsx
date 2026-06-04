import React, { useEffect, useState } from "react";
import { getData } from "../utils/storage";

export default function Dashboard() {
  const [sales, setSales] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const username = localStorage.getItem("loggedInUser") || "User";
  const role = localStorage.getItem("auth_role") || "staff";

  useEffect(() => {
    const data = getData("sales");
    setSales(Array.isArray(data) ? data : []);
  }, []);

  const toTime = (date) => new Date(date).getTime();

  const filteredSales = sales.filter((s) => {
    if (!s?.date) return false;

    const saleTime = toTime(s.date);
    const from = fromDate ? toTime(fromDate) : null;
    const to = toDate ? toTime(toDate) : null;

    if (from && saleTime < from) return false;
    if (to && saleTime > to) return false;

    return true;
  });

  const totalSales = filteredSales.reduce(
    (a, b) => a + (Number(b?.total) || 0),
    0
  );

  const totalProfit = filteredSales.reduce(
    (a, b) => a + (Number(b?.profit) || 0),
    0
  );

  const itemsSold = filteredSales.reduce(
    (a, b) => a + (Number(b?.qty) || 0),
    0
  );

  const formatKsh = (v) => `Ksh ${Number(v || 0).toLocaleString()}`;

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>📊 Sales Dashboard</h2>

          <p style={styles.welcome}>
            Welcome, <b>{username}</b>{" "}
            <span
              style={{
                ...styles.badge,
                background: role === "admin" ? "#7c3aed" : "#16a34a",
              }}
            >
              {role.toUpperCase()}
            </span>
          </p>
        </div>

        {/* FILTER */}
        <div style={styles.filterBox}>
          <input
            style={styles.input}
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <input
            style={styles.input}
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          <button style={styles.resetBtn} onClick={() => {
            setFromDate("");
            setToDate("");
          }}>
            Reset
          </button>
        </div>
      </div>

      {/* STATS */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <p>Total Sales</p>
          <h3>{formatKsh(totalSales)}</h3>
        </div>

        <div style={styles.card}>
          <p>Items Sold</p>
          <h3>{itemsSold}</h3>
        </div>

        {role === "admin" && (
          <div style={{ ...styles.card, borderColor: "#22c55e" }}>
            <p>Profit</p>
            <h3 style={{ color: "#22c55e" }}>
              {formatKsh(totalProfit)}
            </h3>
          </div>
        )}
      </div>

      {/* TRANSACTIONS */}
      <div style={styles.listSection}>
        <h3>🧾 Transactions</h3>

        {filteredSales.length === 0 ? (
          <p style={{ color: "#888" }}>No sales found</p>
        ) : (
          filteredSales.map((s) => (
            <div key={s.id} style={styles.row}>
              <div>
                <b>{s?.name}</b>
                <div style={styles.subText}>
                  Qty: {s?.qty} | {s?.date}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <b>{formatKsh(s?.total)}</b>

                {role === "admin" && (
                  <div style={{ ...styles.subText, color: "#22c55e" }}>
                    Profit {formatKsh(s?.profit)}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ================= MODERN UI STYLES ================= */
const styles = {
  container: {
    padding: 20,
    minHeight: "80vh",
    fontFamily: "Arial",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 15,
    marginBottom: 20,
  },

  title: {
    marginBottom: 5,
  },

  welcome: {
    opacity: 0.8,
  },

  badge: {
    marginLeft: 10,
    padding: "3px 10px",
    borderRadius: 20,
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },

  filterBox: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
  },

  input: {
    padding: 8,
    borderRadius: 10,
    border: "1px solid #ddd",
    outline: "none",
  },

  resetBtn: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "none",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 15,
    marginBottom: 20,
  },

  card: {
    padding: 15,
    borderRadius: 14,
    border: "1px solid #ddd",
    background: "rgba(255,255,255,0.6)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
    transition: "0.3s",
  },

  listSection: {
    marginTop: 10,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    border: "1px solid #eee",
    marginBottom: 10,
    background: "rgba(255,255,255,0.4)",
  },

  subText: {
    fontSize: 12,
    color: "#666",
  },
};