// Search Students Page Component
// This component allows searching students by exact name, partial name, or average grade range.

import React, { useState } from "react";
import axios from "axios";
import StudentList from "../components/StudentList";

// Search page component
const Search = () => {
  const [searchType, setSearchType] = useState("exact");
  const [name, setName] = useState("");
  const [partialName, setPartialName] = useState("");
  const [minAvg, setMinAvg] = useState("");
  const [maxAvg, setMaxAvg] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Base API URL for local or deployed backend
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setResults([]);
    setLoading(true);
    try {
      let response;
      if (searchType === "exact") {
        response = await axios.get(`${API_URL}/search/name/${encodeURIComponent(name)}`);
        setResults(response.data.name ? [response.data] : []);
      } else if (searchType === "partial") {
        response = await axios.get(`${API_URL}/search/partial/${encodeURIComponent(partialName)}`);
        setResults(response.data);
      } else {
        if (minAvg && maxAvg && Number(minAvg) > Number(maxAvg)) {
          setError("Minimum average cannot be greater than maximum.");
          return;
        }
        response = await axios.get(`${API_URL}/search/average`, {
          params: { min_avg: minAvg, max_avg: maxAvg },
        });
        setResults(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Search Students</h2>
      {loading && <p>Loading...</p>}
      <form onSubmit={handleSearch}>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="exact">Exact Name</option>
          <option value="partial">Partial Name</option>
          <option value="average">Average Grade Range</option>
        </select>
        {searchType === "exact" && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter exact name"
            required
          />
        )}
        {searchType === "partial" && (
          <input
            type="text"
            value={partialName}
            onChange={(e) => setPartialName(e.target.value)}
            placeholder="Enter partial name"
            required
          />
        )}
        {searchType === "average" && (
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
        <button type="submit" disabled={loading}>
          Search
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {results.length > 0 && <StudentList students={results} />}
    </div>
  );
};

export default Search;