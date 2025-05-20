import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentList from '../components/StudentList';

const Home = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/students');
      setStudents(response.data);
    } catch (err) {
      setError('Error fetching students.');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div>
      <h2>All Students</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {students.length > 0 ? <StudentList students={students} /> : <p>No students found.</p>}
    </div>
  );
};

export default Home;