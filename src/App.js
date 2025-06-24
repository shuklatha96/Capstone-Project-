import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieNavbar from './Components/MovieNavbar';
import Home from './Components/Home';
import AdminLogin from './AdminComponents/AdminLogin';
import UserLogin from './UserComponents/UserLogin';
import AdminDashboard from './AdminComponents/AdminDashboard';
import UserHome from './UserComponents/UserDashboard';
import Footer from './Components/Footer';
import AccountDetails from './UserComponents/AccountDetails';
import React, { useState, useEffect } from "react";
import ProtectedRoute from './utils/ProtectedRoute'; // ✅
import MoviesPage from './Components/MoviesPage';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    // Check localStorage for user data on initial load
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setLoggedInUser(parsedUser);
        console.log("App.js useEffect: User loaded from localStorage:", parsedUser);
      } catch (e) {
        console.error("App.js useEffect: Failed to parse user from localStorage", e);
        // Clear invalid data if parsing fails
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    } else {
      console.log("App.js useEffect: No user found in localStorage or token missing.");
    }
  }, []); // Empty dependency array means this runs once on mount

  console.log("App.js render: loggedInUser state is:", loggedInUser);

  return (
    <Router>
      <div className="App">
        {/* Removed <MovieReviews /> */}
      </div>
      <div>
        <MovieNavbar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home user={loggedInUser} />} />
          <Route path="/search" element={<Home user={loggedInUser} />} />
          <Route path="/movies" element={<MoviesPage user={loggedInUser} />} />
          <Route path="/top-rated" element={<Home showSection="Top Rated" user={loggedInUser} />} />
          <Route path="/web-series" element={<Home showSection="Web Series" user={loggedInUser} />} />
          <Route path="/tv-shows" element={<Home showSection="TV Shows" user={loggedInUser} />} />
          <Route path="/admin-login" element={<AdminLogin setLoggedInUser={setLoggedInUser} />} />
          <Route path="/user-login" element={<UserLogin setLoggedInUser={setLoggedInUser} />} />

          {/* Protected Admin Dashboard */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute user={loggedInUser} requiredRole="admin">
                <AdminDashboard user={loggedInUser} setLoggedInUser={setLoggedInUser} />
              </ProtectedRoute>
            }
          />

          {/* Protected User Dashboard */}
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute user={loggedInUser} requiredRole={['user', 'admin']}>
                <UserHome user={loggedInUser} setLoggedInUser={setLoggedInUser} />
              </ProtectedRoute>
            }
          />

          {/* Protected Account Route for both user/admin */}
          <Route
            path="/account"
            element={
              <ProtectedRoute user={loggedInUser}>
                <AccountDetails user={loggedInUser} setLoggedInUser={setLoggedInUser} />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
