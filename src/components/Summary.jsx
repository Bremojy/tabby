import React, { useEffect, useState } from "react";
import { getData } from "../utils/storage";

export default function Summary() {
  const [summaries, setSummaries] = useState([]);

  const role = localStorage.getItem("auth_role") || "staff";

  useEffect(() => {
    const data = getData("dailySummary");
    setSummaries(Array.isArray(data) ? data : []);
  }, []);

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2>📊 Monthly Summary</h2>

        <span
          style={{
            ...styles.roleBadge,
            background: role === "admin" ? "#7c3aed" : "#16a34a",
          }}
        >
          {role.toUpperCase()}
        </span>
      </div>

      {/* EMPTY STATE */}
      {summaries.length === 0 && (
        <div style={styles.empty}>
          <p>📭 No summaries available yet.</p>
        </div>
      )}

      {/* SUMMARY GRID */}
      <div style={styles.grid}>
        {summaries.map((s, index) => (
          <div key={index} style={styles.card}>
            {/* DATE HEADER */}
            <div style={styles.dateRow}>
              <h3 style={{ margin: 0 }}>📅 {s.date}</h3>
            </div>

            {/* STATS */}
            <div style={styles.stats}>
              <div style={styles.statBox}>
                <p style={styles.label}>Items Sold</p>
                <h4>{s.itemsSold}</h4>
              </div>

              <div style={styles.statBox}>
                <p style={styles.label}>Total Sales</p>
                <h4>Ksh {s.totalSales}</h4>
              </div>

              {/* ADMIN ONLY PROFIT */}
              {role === "admin" && (
                <div style={{ ...styles.statBox, borderColor: "#22c55e" }}>
                  <p style={styles.label}>Profit</p>
                  <h4 style={{ color: "#22c55e" }}>
                    Ksh {s.totalProfit}
                  </h4>
                </div>
              )}
            </div>

            {/* STAFF INFO */}
            {role !== "admin" && (
              <p style={styles.note}>
                🔒 Profit hidden (admin only)
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= MODERN UI STYLES ================= */

const styles = {
  container: {
    padding: 20,
    fontFamily: "Arial",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  roleBadge: {
    padding: "4px 10px",
    borderRadius: 20,
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },

  empty: {
    padding: 20,
    border: "1px dashed #ccc",
    borderRadius: 12,
    textAlign: "center",
    color: "#777",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 15,
    marginTop: 10,
  },

  card: {
    padding: 15,
    borderRadius: 14,
    border: "1px solid #eee",
    background: "rgba(255,255,255,0.4)",
    boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
  },

  dateRow: {
    marginBottom: 10,
  },

  stats: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  statBox: {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #eee",
    background: "rgba(255,255,255,0.6)",
  },

  label: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },

  note: {
    marginTop: 10,
    fontSize: 12,
    color: "#888",
  },
};