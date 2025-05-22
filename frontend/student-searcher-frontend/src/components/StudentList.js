// Student List Component
// Renders a styled table of student data.

import React from 'react';
import { Table } from 'react-bootstrap';

const StudentList = ({ students }) => {
  const calculateAverage = (grades) => {
    return grades.length ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2) : 0;
  };

  return (
    <Table striped bordered hover responsive className="mt-3">
      <thead>
        <tr>
          <th>Name</th>
          <th>Grades</th>
          <th>Average Grade</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student, index) => (
          <tr key={index}>
            <td>{student.name}</td>
            <td>{student.grades.join(', ')}</td>
            <td>{calculateAverage(student.grades)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default StudentList;