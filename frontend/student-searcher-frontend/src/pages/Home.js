import React from 'react';
import StudentList from '../components/StudentList';

const Home = () => {
  // Mock data to test the table
  const mockStudents = [
    { name: "Richard", grades: [85, 90, 95, 88] },
    { name: "Alice", grades: [90, 85, 92, 84] },
    { name: "Mike", grades: [99, 86, 90] }
  ];

  return (
    <div>
      <h2>All Students</h2>
      {mockStudents.length > 0 ? <StudentList students={mockStudents} /> : <p>No students found.</p>}
    </div>
  );
};

export default Home;