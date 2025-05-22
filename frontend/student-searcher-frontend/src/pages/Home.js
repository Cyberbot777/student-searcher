// Home Page Component
// This component fetches and displays a list of students from the deployed backend.

import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentList from "../components/StudentList";

// Home page component
const Home = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch students from deployed backend
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

  return (
    <div>
      <h2>All Students</h2>
      {loading && <p>Loading students...</p>}
      {error && <p className="error">{error}</p>}
      {students.length > 0 ? (
        <StudentList students={students} />
      ) : (
        !loading && <p>No students found.</p>
      )}
    </div>
  );
};

export default Home;