import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/MovieNavbar.css';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";

const MovieNavbar = ({ loggedInUser, setLoggedInUser }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    setLoggedInUser(null);
    navigate('/'); // Redirect to home
  };

  return (
    <Navbar expand="lg" className="custom-navbar" sticky="top">
      <Container fluid>
        <Navbar.Brand href="#" className="brand-name">
          <span className="brand-red">movie</span><span className="brand-black">Meteor</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" className="custom-toggler" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="mx-auto nav-links">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/movies">Movies</Nav.Link>
            <Nav.Link as={Link} to="/top-rated">Top Rated</Nav.Link>
            <Nav.Link as={Link} to="/web-series">Web Series</Nav.Link>
            <Nav.Link as={Link} to="/tv-shows">TV Shows</Nav.Link>

            {!loggedInUser ? (
              <NavDropdown title="Login" id="login-dropdown">
                <NavDropdown.Item as={Link} to="/admin-login">Admin</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/user-login">User</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/account" className="d-flex align-items-center">
                  {loggedInUser.avatarUrl ? (
                    <img src={loggedInUser.avatarUrl} alt="Avatar" className="navbar-avatar rounded-circle me-2" style={{ width: '24px', height: '24px', objectFit: 'cover' }} />
                  ) : (
                    <img src="/images/default-avatar.png" alt="Avatar" className="navbar-avatar rounded-circle me-2" style={{ width: '24px', height: '24px', objectFit: 'cover' }} />
                  )}
                  {loggedInUser.name || 'User'}
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>🚪 Logout</Nav.Link>
              </>
            )}
          </Nav>

          <Form className="d-flex search-bar" onSubmit={(e) => {
            e.preventDefault();
            navigate(`/search?query=${searchTerm}`);
          }}>
            <input
              type="search"
              placeholder="Search movies, series..."
              aria-label="Search"
              id="navbar-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: '20px',
                padding: '6px 12px',
                width: '170px',
                backgroundColor: 'white',
                border: '1px solid #ced4da',
                color: '#333',
                marginRight: '10px',
                boxSizing: 'border-box',
                outline: 'none',
                flexShrink: 0,
              }}
            />
            <button
              id="navbar-search-button"
              style={{
                borderRadius: '20px',
                padding: '6px 20px',
                fontWeight: 'bold',
                backgroundColor: 'red',
                border: 'none',
                color: 'white',
                marginLeft: '0px',
                boxSizing: 'border-box',
                outline: 'none',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >Search</button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MovieNavbar;
