import React, { useState } from 'react';
import axios from 'axios';
import StudentList from '../components/StudentList';
import { Container, Form, Button } from 'react-bootstrap';

const Search = () => {
  const [searchType, setSearchType] = useState('exact');
  const [name, setName] = useState('');
  const [partialName, setPartialName] = useState('');
  const [minAvg, setMinAvg] = useState('');
  const [maxAvg, setMaxAvg] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let response;
      if (searchType === 'exact') {
        response = await axios.get(`https://student-searcher-backend.onrender.com/search/name/${name}`);
        setResults(response.data.error ? [] : [response.data]);
      } else if (searchType === 'partial') {
        response = await axios.get(`https://student-searcher-backend.onrender.com/search/partial/${partialName}`);
        setResults(response.data);
      } else {
        if (minAvg && maxAvg && Number(minAvg) > Number(maxAvg)) {
          setError('Minimum average cannot be greater than maximum.');
          return;
        }
        response = await axios.get(`https://student-searcher-backend.onrender.com/search/average?min_avg=${minAvg}&max_avg=${maxAvg}`);
        setResults(response.data);
      }
    } catch (err) {
      setError('Error fetching results.');
    }
  };

  return (
    <Container>
      <h2 className="my-4">Search Students</h2>
      <Form onSubmit={handleSearch}>
        <Form.Group className="mb-3">
          <Form.Select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
            <option value="exact">Exact Name</option>
            <option value="partial">Partial Name</option>
            <option value="average">Average Grade Range</option>
          </Form.Select>
        </Form.Group>
        {searchType === 'exact' && (
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter exact name"
              required
            />
          </Form.Group>
        )}
        {searchType === 'partial' && (
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              value={partialName}
              onChange={(e) => setPartialName(e.target.value)}
              placeholder="Enter partial name"
              required
            />
          </Form.Group>
        )}
        {searchType === 'average' && (
          <div className="d-flex gap-3 mb-3">
            <Form.Control
              type="number"
              value={minAvg}
              onChange={(e) => setMinAvg(e.target.value)}
              placeholder="Min average"
              min="0"
              max="100"
              required
            />
            <Form.Control
              type="number"
              value={maxAvg}
              onChange={(e) => setMaxAvg(e.target.value)}
              placeholder="Max average"
              min="0"
              max="100"
              required
            />
          </div>
        )}
        <Button type="submit" variant="primary">Search</Button>
      </Form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {results.length > 0 && <StudentList students={results} />}
    </Container>
  );
};

export default Search;