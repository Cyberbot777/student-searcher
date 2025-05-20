import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Manage from "./pages/Manage";
import Stats from "./pages/Stats";

function App() {
  return (
    <Router>
      <div>
        <nav style={{ marginBottom: "20px" }}>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              gap: "20px",
              padding: 0,
            }}
          >
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
