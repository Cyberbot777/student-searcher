import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('https://student-searcher-backend.onrender.com/statistics');
        setStats(response.data);
      } catch (err) {
        setError('Error fetching statistics.');
      }
    };
    fetchStats();
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h2>Class Statistics</h2>
      <p>Class Average: {stats.class_average.toFixed(2)}</p>
      <p>Highest Average: {stats.highest_average.toFixed(2)} (Student: {stats.highest_student})</p>
      <p>Lowest Average: {stats.lowest_average.toFixed(2)} (Student: {stats.lowest_student})</p>
    </div>
  );
};

export default Stats;