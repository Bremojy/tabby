import React, { useEffect, useState } from "react";
import { getData } from "../utils/storage";

export default function Summary() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    try {
      const data = getData("sales");
      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Summary load error:", err);
      setSales([]);
    }
  }, []);

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  // 🔥 SAFE DATE HANDLING
  const monthlySales = sales.filter((s) => {
    if (!s?.date) return false;

    const d = new Date(s.date);
    if (isNaN(d.getTime())) return false;

    return d.getMonth() === month && d.getFullYear() === year;
  });

  const totalSales = monthlySales.reduce(
    (sum, s) => sum + (Number(s.total) || 0),
    0
  );

  const totalProfit = monthlySales.reduce(
    (sum, s) => sum + (Number(s.profit) || 0),
    0
  );

  const itemsSold = monthlySales.reduce(
    (sum, s) => sum + (Number(s.qty) || 0),
    0
  );

  const formatKsh = (v) => `Ksh ${Number(v || 0).toLocaleString()}`;

  // 🔥 SAFE TOP PRODUCTS LOGIC
  const productMap = {};

  monthlySales.forEach((s) => {
    if (!s?.name) return;

    if (!productMap[s.name]) {
      productMap[s.name] = 0;
    }

    productMap[s.name] += Number(s.qty) || 0;
  });

  const topProducts = Object.entries(productMap)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return (
    <div className="summary-container">
      <h2 className="page-title">📊 Monthly Summary</h2>

      <p className="subtitle">
        {now.toLocaleString("default", { month: "long" })} {year}
      </p>

      {/* STATS */}
      <div className="summary-grid">
        <div className="summary-card sales">
          <div className="label">💰 Total Sales</div>
          <div className="value">{formatKsh(totalSales)}</div>
        </div>

        <div className="summary-card profit">
          <div className="label">📈 Total Profit</div>
          <div className="value">{formatKsh(totalProfit)}</div>
        </div>

        <div className="summary-card items">
          <div className="label">📦 Items Sold</div>
          <div className="value">{itemsSold}</div>
        </div>
      </div>

      {/* TOP PRODUCTS */}
      <div className="section">
        <h3>🏆 Top Products</h3>

        {topProducts.length === 0 ? (
          <p className="empty">No sales recorded this month</p>
        ) : (
          <div className="top-list">
            {topProducts.map((p, i) => (
              <div key={p.name} className="top-item">
                <span>
                  <b>#{i + 1}</b> {p.name}
                </span>
                <span className="qty">Qty: {p.qty}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}