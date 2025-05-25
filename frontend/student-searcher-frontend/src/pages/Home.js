// Home Page Component
// Displays a list of students in a styled table.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentList from '../components/StudentList';
import { Container, Alert, Spinner } from 'react-bootstrap';

const Home = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchStudents = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/students`);
      setStudents(response.data);
    } catch (err) {
      setError('Error fetching students.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []); // Empty dependency array ensures fetch only on mount, acting as cache

  return (
    <Container>
      <h2 className="my-4">All Students</h2>
      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {error && <Alert variant="danger">{error}</Alert>}
          {students.length > 0 ? (
            <StudentList
              students={students}
              hasDelete={false}
              columnWidths={{
                name: '200px',
                grades: '250px',
                averageGrade: '200px',
              }}
            />
          ) : (
            <p>No students found.</p>
          )}
        </>
      )}
    </Container>
  );
};

export default Home;