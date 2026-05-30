import React, { useEffect, useState } from "react";
import { getData } from "../utils/storage";

export default function Dashboard() {
  const [sales, setSales] = useState([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const data = getData("sales") || [];
    setSales(data);
  }, []);

  // ✅ safer date handling
  const toTime = (date) => new Date(date).getTime();

  const from = fromDate ? toTime(fromDate) : null;
  const to = toDate ? toTime(toDate) : null;

  const filteredSales = sales.filter((s) => {
    if (!s.date) return false;

    const saleTime = toTime(s.date);

    if (from && saleTime < from) return false;
    if (to && saleTime > to) return false;

    return true;
  });

  const totalSales = filteredSales.reduce((a, b) => a + (b.total || 0), 0);
  const totalProfit = filteredSales.reduce((a, b) => a + (b.profit || 0), 0);
  const itemsSold = filteredSales.reduce((a, b) => a + (b.qty || 0), 0);

  const formatKsh = (v) => `Ksh ${v.toLocaleString()}`;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>📊 Sales Dashboard</h2>

        {/* 📅 CALENDAR FILTER BOX */}
        <div style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          marginTop: "10px",
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          width: "fit-content"
        }}>
          <div>
            <label>From 📅</label><br />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div>
            <label>To 📅</label><br />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              setFromDate("");
              setToDate("");
            }}
            style={{
              height: "40px",
              padding: "0 10px",
              cursor: "pointer"
            }}
          >
            Reset
          </button>
        </div>
      </header>

      {/* KPI */}
      <div className="dashboard-grid">
        <div className="stat-card">💰 {formatKsh(totalSales)}</div>
        <div className="stat-card">📈 {formatKsh(totalProfit)}</div>
        <div className="stat-card">📦 {itemsSold}</div>
      </div>

      {/* LIST */}
      <section>
        <h3>🧾 Filtered Sales</h3>

        {filteredSales.length === 0 ? (
          <p>No sales found</p>
        ) : (
          filteredSales.map((s) => (
            <div key={s.id}>
              <b>{s.name}</b> | Qty {s.qty} | {formatKsh(s.total)}
            </div>
          ))
        )}
      </section>
    </div>
  );
}