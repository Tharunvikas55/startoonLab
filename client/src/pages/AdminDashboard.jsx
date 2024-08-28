import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Cookies from 'js-cookie';

const baseURL = process.env.REACT_APP_API_URL;
//const baseURL = 'https://startoonlab-server.onrender.com';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [totalUser, setTotalUser] = useState(0);
  const [totalClickCount, setTotalClickCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();  // Removed setSearchParams as it's unused
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = Cookies.get('accessToken'); // Retrieve the accessToken from cookies
        const query = searchParams.toString() ? '?' + searchParams.toString() : '';
        
        if (!token) {
          console.error('Access token is missing!');
          navigate('/login');
          return;
        }

        const res = await axios.get(`${baseURL}/admin-dashboard${query}`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.data.valid) {
          setUsers(res.data.users);
          setTotalUser(res.data.users.length);
          const totalClicks = res.data.users.reduce((total, user) => total + user.count, 0);
          setTotalClickCount(totalClicks);
        } else {
          console.error('Invalid response:', res.data);
          navigate('/login');
        }
      } catch (err) {
        // Log more detailed error information
        if (err.response) {
          console.error('Error response:', err.response.data);
          console.error('Error status:', err.response.status);
          console.error('Error headers:', err.response.headers);
        } else if (err.request) {
          console.error('Error request:', err.request);
        } else {
          console.error('Error message:', err.message);
        }
        console.error('Error config:', err.config);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, [navigate, searchParams]);

  const formatDataForChart = () => {
    const countsByDate = {};
    users.forEach(user => {
      const date = new Date(user.lastLoginDate).toLocaleDateString();
      countsByDate[date] = (countsByDate[date] || 0) + 1;
    });
    return {
      labels: Object.keys(countsByDate),
      datasets: [{
        label: 'User Login Count',
        data: Object.values(countsByDate),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      {/* NavBar component */}
      <NavBar users={users} formatDataForChart={formatDataForChart} totalUser={totalUser} totalClickCount={totalClickCount} />

      {/* Registered Users Table */}
      <div className="user-data mt-4">
        <center><h3>Registered Users</h3></center>
        {users.length === 0 ? (
          <p className="text-center">No users found</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-striped">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">S.No</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Login Count</th>
                  <th scope="col">Gender</th>
                  <th scope="col">Last Login Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.email}>
                    <th scope="row">{index + 1}</th>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.count}</td>
                    <td>{user.gender}</td>
                    <td>{new Date(user.lastLoginDate).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
