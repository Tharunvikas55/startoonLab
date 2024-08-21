import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Search from "./Search";

const baseURL = process.env.REACT_APP_API_URL;
const NavBar = ({ formatDataForChart, totalUser,totalClickCount }) => {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(baseURL+'/logout');
      if (res.data.success) {
        navigate('/login');
      } else {
        console.log("Logout failed:", res.data.message);
      }
    } catch (err) {
      console.log("Error during logout:", err);
    }
  };

  const handleViewChart = () => {
    const chartData = formatDataForChart();
    navigate('/chart', { state: { chartData, totalUser,totalClickCount } });
  };

  return (
     <nav className="navbar navbar-expand-lg navbar-light bg-prmary shadow-sm ">
      <div className="container-fluid">
        <Link 
          className="navbar-brand m-1" 
          to="/admin-dashboard"
          data-bs-toggle="tooltip" 
          data-bs-placement="bottom" 
          title="Go to Home Page"
        >
          <i className="bi bi-house-door"></i> Startoon Labs
        </Link>
        <button 
          className="navbar-toggler m-1" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse m-1" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button 
                className="btn me-2" 
                onClick={handleViewChart} 
                data-bs-toggle="tooltip" 
                data-bs-placement="bottom" 
                title="View User Login Graph"
              >
               User Login Chart
              </button>
            </li><br />
            <li className="nav-item">
              <Search />
            </li><br />
            <li className="nav-item mx-2">
              <button 
                className="btn btn-outline-dark" 
                type="button" 
                onClick={handleLogout}
                data-bs-toggle="tooltip" 
                data-bs-placement="bottom" 
                title="Logout"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
