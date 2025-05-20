import React from 'react';

const StudentList = ({ students }) => {
  const calculateAverage = (grades) => {
    return grades.length ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2) : 0;
  };

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Grades</th>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Average Grade</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student, index) => (
          <tr key={index}>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.name}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.grades.join(', ')}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{calculateAverage(student.grades)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentList;