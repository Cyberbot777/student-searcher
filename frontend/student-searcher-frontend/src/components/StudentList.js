// Student List Component
// This component renders a table displaying student names, grades, and average grades.

import React from "react";
import PropTypes from "prop-types";

// StudentList component for displaying student data
const StudentList = ({ students }) => {
  // Calculate average grade for a student
  const calculateAverage = (grades) => {
    return grades.length ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2) : 0;
  };

  return (
    <table className="student-table">
      <thead>
        <tr>
          <th className="student-table-cell">Name</th>
          <th className="student-table-cell">Grades</th>
          <th className="student-table-cell">Average Grade</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.name}>
            <td className="student-table-cell">{student.name}</td>
            <td className="student-table-cell">{student.grades.join(", ")}</td>
            <td className="student-table-cell">{calculateAverage(student.grades)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Prop type validation
StudentList.propTypes = {
  students: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      grades: PropTypes.arrayOf(PropTypes.number).isRequired,
    })
  ).isRequired,
};

export default StudentList;