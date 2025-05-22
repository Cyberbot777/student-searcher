import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Alert } from 'react-bootstrap';

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

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!stats) return <p>Loading...</p>;

  return (
    <Container>
      <h2 className="my-4">Class Statistics</h2>
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Class Metrics</Card.Title>
          <p>Class Average: {stats.class_average.toFixed(2)}</p>
          <p>Highest Average: {stats.highest_average.toFixed(2)} (Student: {stats.highest_student})</p>
          <p>Lowest Average: {stats.lowest_average.toFixed(2)} (Student: {stats.lowest_student})</p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Stats;