// Manage Page Component
// Allows users to add, edit, and remove students.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentList from '../components/StudentList';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const Manage = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [grades, setGrades] = useState('');
  const [editName, setEditName] = useState('');
  const [editGrades, setEditGrades] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/students`);
      setStudents(response.data);
      console.log("Fetched students:", response.data); 
    } catch (err) {
      setError('Error fetching students.');
      console.error("Fetch students error:", err); 
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const gradesArray = grades.split(',').map(Number);
      if (gradesArray.some(g => g < 0 || g > 100 || isNaN(g))) {
        setError('Grades must be numbers between 0 and 100.');
        return;
      }
      await axios.post(`${process.env.REACT_APP_API_URL}/students`, { name, grades: gradesArray });
      setMessage('Student added successfully!');
      setName('');
      setGrades('');
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.error || 'Error adding student.');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const gradesArray = editGrades.split(',').map(Number);
      if (gradesArray.some(g => g < 0 || g > 100 || isNaN(g))) {
        setError('Grades must be numbers between 0 and 100.');
        return;
      }
      await axios.put(`${process.env.REACT_APP_API_URL}/students/${editName}`, { grades: gradesArray });
      setMessage('Grades updated successfully!');
      setEditName('');
      setEditGrades('');
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating grades.');
    }
  };

  const handleRemove = async (name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/students/${name}`);
        setMessage(`Removed ${name} successfully!`);
        setError(''); // Clear any previous errors
        console.log(`Deleted ${name}, refetching students...`); // Debug log
        await fetchStudents(); // Ensure the list is refreshed
      } catch (err) {
        setError(err.response?.data?.error || 'Error removing student.');
        console.error('Delete error:', err.response?.data?.error); // Debug log
      }
    }
  };

  return (
    <Container style={{ paddingBottom: '1.5rem' }}>
      <h2 className="my-4">Manage Students</h2>
      <h3>Add Student</h3>
      <Form onSubmit={handleAdd} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., First Last name"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            value={grades}
            onChange={(e) => setGrades(e.target.value)}
            placeholder="Grades (e.g., 80,85,90)"
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary">Add</Button>
      </Form>
      <h3>Edit Student Grades</h3>
      <Form onSubmit={handleEdit} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="e.g., First Last name"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            value={editGrades}
            onChange={(e) => setEditGrades(e.target.value)}
            placeholder="New grades (e.g., 81,86,91)"
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary">Update</Button>
      </Form>
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
      {students.length > 0 ? (
        <StudentList
          students={students}
          hasDelete={true}
          onDelete={handleRemove}
          columnWidths={{
            name: '150px',
            grades: '200px',
            averageGrade: '180px',
            delete: '100px',
          }}
        />
      ) : (
        <p>No students found.</p>
      )}
    </Container>
  );
};

export default Manage;