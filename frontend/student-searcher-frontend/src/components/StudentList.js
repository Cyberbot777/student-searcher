import React from 'react';
import { Table } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';

const StudentList = ({ students, onDelete, hasDelete = false }) => {
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
          {hasDelete && <th style={{ width: '150px' }}>Delete</th>}
        </tr>
      </thead>
      <tbody>
        {students.map((student, index) => (
          <tr key={index}>
            <td>{student.name}</td>
            <td>{student.grades.join(', ')}</td>
            <td>{calculateAverage(student.grades)}</td>
            {hasDelete && <td style={{ width: '150px', textAlign: 'left' }}>
              <span
                onClick={() => onDelete(student.name)}
                style={{ cursor: 'pointer' }}
                title={`Remove ${student.name}`}
              >
                <Trash color="red" size={20} />
              </span>
            </td>}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default StudentList;