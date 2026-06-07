import React, { useEffect, useState } from "react";

const BASE_URL = "http://tabby-shop-backend.onrender.com/api/sales";

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
    const token = localStorage.getItem("token");

    const res = await fetch(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

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

  const uniqueProducts = new Set(
  filteredSales.map((s) => s.productId)
).size;

const today = new Date().toISOString().split("T")[0];

const todayTransactions = filteredSales.filter(
  (s) => s.date === today
).length;

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
        <div style={styles.modernFilter}>

          <input
  type="date"
  style={styles.dateInput}
  value={fromDate}
  onChange={(e) => setFromDate(e.target.value)}
/>

<input
  type="date"
  style={styles.dateInput}
  value={toDate}
  onChange={(e) => setToDate(e.target.value)}
/>

<button
  style={styles.resetBtn}
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
  <div style={styles.statCard}>
    <h2>{formatKsh(totalSales)}</h2>
    <p>Total Sales</p>
  </div>

  <div style={styles.statCard}>
    <h2>{itemsSold}</h2>
    <p>Items Sold</p>
  </div>

  <div style={styles.statCard}>
    <h2>{todayTransactions}</h2>
    <p>Today's Transactions</p>
  </div>

  <div style={styles.statCard}>
    <h2>{uniqueProducts}</h2>
    <p>Products Sold</p>
  </div>

  {role === "admin" && (
    <div style={styles.statCard}>
      <h2 style={{ color: "#22c55e" }}>
        {formatKsh(totalProfit)}
      </h2>
      <p>Total Profit</p>
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
          Qty: {s.qty} | Total: {formatKsh(s.total)}
        </p>

        {role === "admin" && (
          <p style={{ color: "#22c55e" }}>
            Profit: {formatKsh(s.profit)}
          </p>
        )}

        <button
          style={styles.viewBtn}
          onClick={() =>
            setExpandedDate(
              expandedDate === (s._id || s.id)
                ? null
                : (s._id || s.id)
            )
          }
        >
          {expandedDate === (s._id || s.id)
            ? "Hide Details"
            : "View Details"}
        </button>

        {expandedDate === (s._id || s.id) && (
          <div style={styles.detailBox}>
            <p>
              <strong>Product:</strong> {s.name}
            </p>

            <p>
              <strong>Quantity:</strong> {s.qty}
            </p>

            <p>
              <strong>Total:</strong> {formatKsh(s.total)}
            </p>

            <p>
              <strong>Date:</strong> {s.date}
            </p>

            {role === "admin" && (
              <p style={{ color: "#22c55e" }}>
                <strong>Profit:</strong>{" "}
                {formatKsh(s.profit)}
              </p>
            )}
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
  modernFilter: {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  alignItems: "center",
},

dateInput: {
  padding: 10,
  borderRadius: 10,
  border: "1px solid #ddd",
},

resetBtn: {
  padding: "10px 16px",
  border: "none",
  borderRadius: 10,
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
},

statCard: {
  background: "#fff",
  borderRadius: 12,
  padding: 20,
  textAlign: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
},

viewBtn: {
  marginTop: 10,
  padding: "8px 14px",
  border: "none",
  borderRadius: 8,
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
},

detailBox: {
  marginTop: 10,
  padding: 12,
  background: "#f8fafc",
  borderRadius: 10,
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