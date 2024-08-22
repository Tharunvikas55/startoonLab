import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//const baseURL = process.env.REACT_APP_API_URL;
const baseURL = 'https://startoonlab-server.onrender.com/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(baseURL+'/dashboard', { withCredentials: true })
      .then(res => {
        if (res.data.valid) {
          setUser(res.data.user);
        } else {
          navigate('/login');
        }
      })
      .catch(err => {
        console.error('Error fetching user details:', err);
        navigate('/login');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div></div>;
  }

  if (!user) {
    return null;
  }

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

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Welcome, {user.name}!</h2>
          <button className="btn btn-outline-info" onClick={handleLogout}>Logout</button>
        </div>
        <div className="card-body">
          <h5 className="card-title">Profile Details</h5>
          <ul className="list-group list-group-flush">
            <li className="list-group-item"><strong>Email:</strong> {user.email}</li>
            <li className="list-group-item"><strong>Gender:</strong> {user.gender}</li>
            <li className="list-group-item"><strong>Login Count:</strong> {user.count}</li>
            <li className="list-group-item"><strong>Last Login Date:</strong> {new Date(user.lastLoginDate).toLocaleString()}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
