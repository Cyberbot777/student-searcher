// Entry Point for Student Searcher Frontend
// This file initializes the React app, rendering the App component and setting up performance monitoring.

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Initialize root element
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render App in strict mode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance monitoring (optional, logs to console or analytics)
reportWebVitals();