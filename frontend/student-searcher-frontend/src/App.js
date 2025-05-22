// Main Application Component
// Sets up routing and navigation with styled Navbar.

import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Manage from "./pages/Manage";
import Stats from "./pages/Stats";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar expand="lg" className="navbar-custom mb-4">
        <Container>
          <Navbar.Brand href="/">Student Searcher</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavLink to="/" className="nav-link" activeClassName="active">Home</NavLink>
              <NavLink to="/search" className="nav-link" activeClassName="active">Search</NavLink>
              <NavLink to="/manage" className="nav-link" activeClassName="active">Manage</NavLink>
              <NavLink to="/stats" className="nav-link" activeClassName="active">Statistics</NavLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;