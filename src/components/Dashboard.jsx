import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:5000/api/sales";

export default function Dashboard() {
  const [sales, setSales] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [expandedDate, setExpandedDate] = useState(null);

  const username = localStorage.getItem("loggedInUser") || "User";
  const role = localStorage.getItem("auth_role") || "staff";

  /* ================= LOAD ================= */
  useEffect(() => {
    fetchSales();
    const interval = setInterval(fetchSales, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSales = async () => {
    try {
      const res = await fetch(BASE_URL);
      const data = await res.json();

      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Dashboard error:", err);
      setSales([]);
    }
  };

  const toTime = (date) => new Date(date).getTime();

  /* ================= FILTER ================= */
  const filteredSales =
    fromDate || toDate
      ? sales.filter((s) => {
          if (!s?.date) return false;

          const saleTime = toTime(s.date);
          const from = fromDate ? toTime(fromDate) : null;
          const to = toDate ? toTime(toDate) : null;

          if (from && saleTime < from) return false;
          if (to && saleTime > to) return false;

          return true;
        })
      : sales;

  /* ================= TOTALS ================= */
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

  const formatKsh = (v) =>
    `Ksh ${Number(v || 0).toLocaleString()}`;

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h2>📊 Sales Dashboard</h2>

          <p>
            Welcome <b>{username}</b>{" "}
            <span
              style={{
                ...styles.badge,
                background:
                  role === "admin"
                    ? "#7c3aed"
                    : "#16a34a",
              }}
            >
              {role.toUpperCase()}
            </span>
          </p>
        </div>

        {/* FILTER */}
        <div style={styles.filterBox}>
          <input
            type="date"
            value={fromDate}
            onChange={(e) =>
              setFromDate(e.target.value)
            }
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) =>
              setToDate(e.target.value)
            }
          />

          <button
            onClick={() => {
              setFromDate("");
              setToDate("");
            }}
          >
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
          <div style={styles.card}>
            <p>Profit</p>
            <h3 style={{ color: "#22c55e" }}>
              {formatKsh(totalProfit)}
            </h3>
          </div>
        )}
      </div>

      {/* TRANSACTIONS */}
      <div>
        <h3>🧾 Transactions</h3>

        {filteredSales.length === 0 ? (
          <p>No transactions</p>
        ) : (
          filteredSales.map((s) => (
            <div key={s._id || s.id} style={styles.card}>
              <b>{s.name}</b>

              <p>
                Qty: {s.qty} | Total:{" "}
                {formatKsh(s.total)}
              </p>

              {role === "admin" && (
                <p style={{ color: "#22c55e" }}>
                  Profit: {formatKsh(s.profit)}
                </p>
              )}

              <button
                onClick={() =>
                  setExpandedDate(
                    expandedDate === s.date
                      ? null
                      : s.date
                  )
                }
              >
                {expandedDate === s.date
                  ? "Hide"
                  : "View"}
              </button>

              {expandedDate === s.date && (
                <div>
                  <small>Date: {s.date}</small>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* styles unchanged */
const styles = {
  container: { padding: 20, fontFamily: "Arial" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
  },
  badge: {
    padding: "3px 10px",
    borderRadius: 20,
    color: "white",
    fontSize: 12,
  },
  filterBox: { display: "flex", gap: 10 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 10,
  },
  card: {
    padding: 12,
    border: "1px solid #ddd",
    borderRadius: 10,
    marginBottom: 10,
  },
};