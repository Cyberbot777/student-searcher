// Manage Students Page Component
// This component provides functionality to add, edit, and remove students, interacting with the backend.

import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentList from "../components/StudentList";

// Manage page component
const Manage = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [grades, setGrades] = useState("");
  const [editName, setEditName] = useState("");
  const [editGrades, setEditGrades] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch students from backend
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://student-searcher-backend.onrender.com/students");
      setStudents(response.data);
      setError("");
    } catch (err) {
      setError("Error fetching students.");
    } finally {
      setLoading(false);
    }
  };

  // Load students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle adding a new student
  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const gradesArray = grades.split(",").map(Number);
      if (gradesArray.some((g) => g < 0 || g > 100 || isNaN(g))) {
        setError("Grades must be numbers between 0 and 100.");
        return;
      }
      await axios.post("https://student-searcher-backend.onrender.com/students", { name, grades: gradesArray });
      setMessage("Student added successfully!");
      setName("");
      setGrades("");
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.error || "Error adding student.");
    } finally {
      setLoading(false);
    }
  };

  // Handle editing a student's grades
  const handleEdit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const gradesArray = editGrades.split(",").map(Number);
      if (gradesArray.some((g) => g < 0 || g > 100 || isNaN(g))) {
        setError("Grades must be numbers between 0 and 100.");
        return;
      }
      await axios.put(`https://student-searcher-backend.onrender.com/students/${editName}`, {
        grades: gradesArray,
      });
      setMessage("Grades updated successfully!");
      setEditName("");
      setEditGrades("");
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.error || "Error updating grades.");
    } finally {
      setLoading(false);
    }
  };

  // Handle removing a student
  const handleRemove = async (name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      setError("");
      setMessage("");
      setLoading(true);
      try {
        await axios.delete(`https://student-searcher-backend.onrender.com/students/${name}`);
        setMessage(`Removed ${name} successfully!`);
        fetchStudents();
      } catch (err) {
        setError("Error removing student.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h2>Manage Students</h2>
      {loading && <p>Loading...</p>}
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
        <button type="submit" disabled={loading}>
          Add
        </button>
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
        <button type="submit" disabled={loading}>
          Update
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      {students.length > 0 ? (
        <>
          <StudentList students={students} />
          {students.map((student) => (
            <button
              key={student.name}
              onClick={() => handleRemove(student.name)}
              disabled={loading}
            >
              Remove {student.name}
            </button>
          ))}
        </>
      ) : (
        !loading && <p>No students found.</p>
      )}
    </div>
  );
};

export default Manage;