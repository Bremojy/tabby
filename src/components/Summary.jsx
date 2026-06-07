import React, { useState, useEffect } from "react";
import { getData } from "../utils/storage";

export default function Summary() {

  const [summaries, setSummaries] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [expandedDate, setExpandedDate] = useState(null);

  const role =
  (localStorage.getItem("auth_role") || "staff")
    .toLowerCase();

  useEffect(() => {
    const data = getData("dailySummary") || [];
    setSummaries(data);
  }, []);

  const groupedMonths = summaries.reduce((acc, item) => {
    const month = item.date.slice(0, 7);

    if (!acc[month]) {
      acc[month] = {
        sales: 0,
        profit: 0,
        items: 0,
        days: [],
      };
    }

    acc[month].sales += item.totalSales || 0;
    acc[month].profit += item.totalProfit || 0;
    acc[month].items += item.itemsSold || 0;

    acc[month].days.push(item);

    return acc;
  }, {});

  return (
    <div style={styles.container}>
      <div style={styles.header}>
  <div>
    <h2>📊 Monthly Transactions</h2>
    <p style={styles.subtitle}>
      View monthly sales performance
    </p>
  </div>
</div>

{Object.keys(groupedMonths).length === 0 && (
  <div
    style={{
      background: "white",
      padding: 30,
      borderRadius: 16,
      textAlign: "center",
      color: "#64748b",
    }}
  >
    No monthly summaries available
  </div>
)}

<div style={styles.monthGrid}>
  {Object.entries(groupedMonths).map(([month, data]) => (
    <div key={month} style={styles.monthCard}>
      <h3>{month}</h3>

      <div style={styles.stat}>
        <span>Total Sales</span>
        <b>Ksh {data.sales.toLocaleString()}</b>
      </div>

      <div style={styles.stat}>
        <span>Items Sold</span>
        <b>{data.items}</b>
      </div>

      {role === "admin" && (
        <div style={styles.stat}>
          <span>Profit</span>
          <b style={{ color: "#22c55e" }}>
            Ksh {data.profit.toLocaleString()}
          </b>
        </div>
      )}

      <button
        style={styles.viewBtn}
        onClick={() =>
          setSelectedMonth(
            selectedMonth === month ? "" : month
          )
        }
      >
        {selectedMonth === month
          ? "Hide Details"
          : "View Details"}
      </button>

      {selectedMonth === month && (
        <div style={styles.details}>
          {data.days.map((day) => (
            <div
              key={day.date}
              style={styles.dayCard}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <b>{day.date}</b>

                <button
                  style={styles.smallBtn}
                  onClick={() =>
                    setExpandedDate(
                      expandedDate === day.date
                        ? null
                        : day.date
                    )
                  }
                >
                  {expandedDate === day.date
                    ? "Hide"
                    : "View Items"}
                </button>
              </div>

              {expandedDate === day.date &&
                day.salesData?.map((sale) => (
                  <div
                    key={sale.id}
                    style={styles.saleRow}
                  >
                    <span>{sale.name}</span>
                    <span>
                      {sale.qty} × Ksh {sale.total}
                    </span>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  ))}
</div>

    </div>
  );
}



const styles = {

container: {
padding: 20,
background: "#f8fafc",
minHeight: "100vh",
},

header: {
marginBottom: 20,
},

subtitle: {
color: "#64748b",
},

monthGrid: {
display: "grid",
gridTemplateColumns:
"repeat(auto-fit,minmax(320px,1fr))",
gap: 20,
},

monthCard: {
background: "#fff",
borderRadius: 18,
padding: 20,
boxShadow: "0 10px 30px rgba(0,0,0,.08)",
},

stat: {
display: "flex",
justifyContent: "space-between",
marginTop: 10,
},

viewBtn: {
width: "100%",
marginTop: 15,
padding: 12,
border: "none",
borderRadius: 10,
background: "#2563eb",
color: "#fff",
cursor: "pointer",
},

details: {
marginTop: 15,
},

dayCard: {
padding: 12,
marginTop: 10,
borderRadius: 10,
background: "#f1f5f9",
},

smallBtn: {
border: "none",
padding: "6px 10px",
borderRadius: 8,
background: "#0f172a",
color: "#fff",
cursor: "pointer",
},

saleRow: {
display: "flex",
justifyContent: "space-between",
padding: "8px 0",
borderBottom: "1px solid #e2e8f0",
},

}
