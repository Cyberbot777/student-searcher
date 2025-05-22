// Main Application Component
// This file sets up the React frontend with routing for the student-searcher app using react-router-dom.

import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Manage from "./pages/Manage";
import Stats from "./pages/Stats";
import "./App.css";

// Main App component with navigation and routes
function App() {
  return (
    <Router>
      <div>
        {/* Navigation bar */}
        <nav className="nav">
          <ul className="nav-list">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/search">Search</Link>
            </li>
            <li>
              <Link to="/manage">Manage</Link>
            </li>
            <li>
              <Link to="/stats">Statistics</Link>
            </li>
          </ul>
        </nav>
        {/* Route definitions */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;