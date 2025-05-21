import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentList from '../components/StudentList';

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
      const response = await axios.get('https://student-searcher-backend.onrender.com/students');
      setStudents(response.data);
    } catch (err) {
      setError('Error fetching students.');
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
      await axios.post('https://student-searcher-backend.onrender.com/students', { name, grades: gradesArray });
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
      await axios.put(`https://student-searcher-backend.onrender.com/students/${editName}`, { grades: gradesArray });
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
        await axios.delete(`https://student-searcher-backend.onrender.com/students/${name}`);
        setMessage(`Removed ${name} successfully!`);
        fetchStudents();
      } catch (err) {
        setError('Error removing student.');
      }
    }
  };

  return (
    <div>
      <h2>Manage Students</h2>
      <h3>Add Student</h3>
      <form onSubmit={handleAdd}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Student name"
          required
        />
        <input
          type="text"
          value={grades}
          onChange={(e) => setGrades(e.target.value)}
          placeholder="Grades (e.g., 80,85,90)"
          required
        />
        <button type="submit">Add</button>
      </form>
      <h3>Edit Student Grades</h3>
      <form onSubmit={handleEdit}>
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder="Student name"
          required
        />
        <input
          type="text"
          value={editGrades}
          onChange={(e) => setEditGrades(e.target.value)}
          placeholder="New grades (e.g., 81,86,91)"
          required
        />
        <button type="submit">Update</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {students.length > 0 ? (
        <>
          <StudentList students={students} />
          {students.map((student) => (
            <button key={student.name} onClick={() => handleRemove(student.name)}>
              Remove {student.name}
            </button>
          ))}
        </>
      ) : (
        <p>No students found.</p>
      )}
    </div>
  );
};

export default Manage;