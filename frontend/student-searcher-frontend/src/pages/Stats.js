// Class Statistics Page Component
// This component fetches and displays class-wide statistics from the backend.

import React, { useState, useEffect } from "react";
import axios from "axios";

// Stats page component
const Stats = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch statistics from backend
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://student-searcher-backend.onrender.com/statistics");
        setStats(response.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching statistics.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Render loading, error, or statistics
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!stats) return <p>No statistics available.</p>;

  return (
    <div>
      <h2>Class Statistics</h2>
      <p>Class Average: {stats.class_average.toFixed(2)}</p>
      <p>
        Highest Average: {stats.highest_average.toFixed(2)} (Student:{" "}
        {stats.highest_student})
      </p>
      <p>
        Lowest Average: {stats.lowest_average.toFixed(2)} (Student:{" "}
        {stats.lowest_student})
      </p>
    </div>
  );
};

export default Stats;