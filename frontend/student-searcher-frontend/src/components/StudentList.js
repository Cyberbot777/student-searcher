import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';

const StudentList = ({ students, onDelete, hasDelete = false, columnWidths = {} }) => {
  const [nameSortOrder, setNameSortOrder] = useState('none'); // Track name sort order
  const [avgSortOrder, setAvgSortOrder] = useState('descending'); // Track average grade sort order

  const calculateAverage = (grades) => {
    return grades.length ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2) : 0;
  };

  // Toggle sort order for name
  const handleSortByName = () => {
    setAvgSortOrder('none'); // Reset average grade sort
    if (nameSortOrder === 'none' || nameSortOrder === 'descending') {
      setNameSortOrder('ascending');
    } else {
      setNameSortOrder('descending');
    }
  };

  // Toggle sort order for average grade
  const handleSortByAverage = () => {
    setNameSortOrder('none'); // Reset name sort
    if (avgSortOrder === 'none' || avgSortOrder === 'descending') {
      setAvgSortOrder('ascending');
    } else {
      setAvgSortOrder('descending');
    }
  };

  // Sort students based on sort orders
  let sortedStudents = [...students];
  if (nameSortOrder !== 'none') {
    // Sort by name
    sortedStudents.sort((a, b) => {
      if (nameSortOrder === 'ascending') {
        return a.name.localeCompare(b.name); // A-Z
      } else {
        return b.name.localeCompare(a.name); // Z-A
      }
    });
  } else if (avgSortOrder !== 'none') {
    // Sort by average grade
    sortedStudents.sort((a, b) => {
      const avgA = parseFloat(calculateAverage(a.grades));
      const avgB = parseFloat(calculateAverage(b.grades));
      return avgSortOrder === 'ascending' ? avgA - avgB : avgB - avgA;
    });
  }

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
          <th
            style={{ width: widths.name, cursor: 'pointer' }}
            onClick={handleSortByName}
            title="Click to sort by name"
          >
            Name {nameSortOrder === 'ascending' ? '↑' : nameSortOrder === 'descending' ? '↓' : ''}
          </th>
          <th style={{ width: widths.grades }}>Grades</th>
          <th
            style={{ width: widths.averageGrade, cursor: 'pointer' }}
            onClick={handleSortByAverage}
            title="Click to sort by average grade"
          >
            Average Grade {avgSortOrder === 'ascending' ? '↑' : avgSortOrder === 'descending' ? '↓' : ''}
          </th>
          {hasDelete && <th style={{ width: widths.delete }}>Delete</th>}
        </tr>
      </thead>
      <tbody>
        {sortedStudents.map((student, index) => (
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