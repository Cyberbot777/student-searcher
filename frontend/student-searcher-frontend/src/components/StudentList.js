import React from 'react';
import { Table } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';

const StudentList = ({ students, onDelete, hasDelete = false, columnWidths = {} }) => {
  const calculateAverage = (grades) => {
    return grades.length ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2) : 0;
  };

  // Default widths if not provided
  const defaultWidths = {
    name: hasDelete ? '150px' : '200px',
    grades: hasDelete ? '200px' : '250px',
    averageGrade: hasDelete ? '100px' : '120px',
    delete: '150px',
  };

  // Merge provided widths with defaults
  const widths = { ...defaultWidths, ...columnWidths };

  return (
    <Table striped bordered hover responsive className="mt-3">
      <thead>
        <tr>
          <th style={{ width: widths.name }}>Name</th>
          <th style={{ width: widths.grades }}>Grades</th>
          <th style={{ width: widths.averageGrade }}>Average Grade</th>
          {hasDelete && <th style={{ width: widths.delete }}>Delete</th>}
        </tr>
      </thead>
      <tbody>
        {students.map((student, index) => (
          <tr key={index}>
            <td style={{ width: widths.name }}>{student.name}</td>
            <td style={{ width: widths.grades }}>{student.grades.join(', ')}</td>
            <td style={{ width: widths.averageGrade }}>{calculateAverage(student.grades)}</td>
            {hasDelete && <td style={{ width: widths.delete, textAlign: 'left' }}>
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