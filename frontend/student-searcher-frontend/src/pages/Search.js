import React, { useState } from 'react';
import axios from 'axios';
import StudentList from '../components/StudentList';

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
        response = await axios.get(`http://localhost:5000/search/name/${name}`);
        setResults(response.data.error ? [] : [response.data]);
      } else if (searchType === 'partial') {
        response = await axios.get(`http://localhost:5000/search/partial/${partialName}`);
        setResults(response.data);
      } else {
        if (minAvg && maxAvg && Number(minAvg) > Number(maxAvg)) {
          setError('Minimum average cannot be greater than maximum.');
          return;
        }
        response = await axios.get(`http://localhost:5000/search/average?min_avg=${minAvg}&max_avg=${maxAvg}`);
        setResults(response.data);
      }
    } catch (err) {
      setError('Error fetching results.');
    }
  };

  return (
    <div>
      <h2>Search Students</h2>
      <form onSubmit={handleSearch}>
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="exact">Exact Name</option>
          <option value="partial">Partial Name</option>
          <option value="average">Average Grade Range</option>
        </select>
        {searchType === 'exact' && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter exact name"
            required
          />
        )}
        {searchType === 'partial' && (
          <input
            type="text"
            value={partialName}
            onChange={(e) => setPartialName(e.target.value)}
            placeholder="Enter partial name"
            required
          />
        )}
        {searchType === 'average' && (
          <>
            <input
              type="number"
              value={minAvg}
              onChange={(e) => setMinAvg(e.target.value)}
              placeholder="Min average"
              required
            />
            <input
              type="number"
              value={maxAvg}
              onChange={(e) => setMaxAvg(e.target.value)}
              placeholder="Max average"
              required
            />
          </>
        )}
        <button type="submit">Search</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {results.length > 0 && <StudentList students={results} />}
    </div>
  );
};

export default Search;