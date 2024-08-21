// import React,{useEffect, useState} from 'react'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom'
// import NavBar from '../components/NavBar'

// const DashBoard = () => {
//   const [message,setMessage]=useState("")
//   const [userName, setUserName] = useState("")
//   const navigate=useNavigate()
//   axios.defaults.withCredentials=true;
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get('http://localhost:3001/dashboard');
//         if (res.data.valid) {
//           setMessage(res.data.message);
//           setUserName(res.data.user.name);
//         } else {
//           navigate('/login');
//         }
//       } catch (err) {
//         console.log(err);
//         navigate('/login');
//       }
//     };

//     fetchData();
//   }, [navigate]);
//   return (
//     <div>
//       <h2 className='center'>DashBoard </h2>
//       <div>
//         <NavBar  userName={userName}/>
//       </div>     
//     </div>
//   )
// }

// export default DashBoard

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/dashboard', { withCredentials: true })
      .then(res => {
        if (res.data.valid) {
          setUser(res.data.user);
        } else {
          // If the token is invalid, redirect to login
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
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Avoid rendering if user is not present
  }

  
    const handleLogout = async (e) => {
        e.preventDefault();
        try {
          const res = await axios.post('http://localhost:3001/api/logout');
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
    <div className="profile-container">
      <div className="btn btn-danger" onClick={handleLogout}>Logout</div>
      <h2>Welcome, {user.name}!</h2>
      <div className="profile-details">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Gender:</strong> {user.gender}</p>
        <p><strong>Login Count:</strong> {user.count}</p>
        <p><strong>Last Login Date:</strong> {new Date(user.lastLoginDate).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Profile;
