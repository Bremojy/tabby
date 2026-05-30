import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const root = createRoot(document.getElementById("root"));

try {
  root.render(<App />);
} catch (err) {
  console.error(err);
  document.getElementById("root").innerHTML =
    "<h2 style='color:red'>App crashed. Check console.</h2>";
}