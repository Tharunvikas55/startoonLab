// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// //import NavBar from '../components/NavBar';
// import Search from "../components/Search";
// import NavBar from '../components/NavBar';

// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get('http://localhost:3001/admin-dashboard', { withCredentials: true })
//       .then(res => {
//         if (res.data.valid) {
//           setUsers(res.data.users);
//         } else {
//           navigate('/login');
//         }
//       })
//       .catch(err => {
//         console.error('Error fetching users:', err);
//         navigate('/login');
//       })
//       .finally(() => setLoading(false));
//   }, [navigate]);

//   const formatDataForChart = () => {
//     const countsByDate = {};
//     users.forEach(user => {
//       const date = new Date(user.lastLoginDate).toLocaleDateString();
//       countsByDate[date] = (countsByDate[date] || 0) + 1;
//     });
//     return {
//       labels: Object.keys(countsByDate),
//       datasets: [{
//         label: 'User Login Count',
//         data: Object.values(countsByDate),
//         backgroundColor: 'rgba(75, 192, 192, 0.6)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1
//       }]
//     };
//   };



//   if (loading) {
//     return <div>Loading...</div>;
//   }

  
//   const handleLogout = async (e) => {
//       e.preventDefault();
//       try {
//         const res = await axios.post('http://localhost:3001/logout');
//         if (res.data.success) {
//           navigate('/login');
//         } else {
//           console.log("Logout failed:", res.data.message);
//         }
//       } catch (err) {
//         console.log("Error during logout:", err);
//       }
//     };


//   return (
//     <div className="container">
//        <div className="">
//     <NavBar/>
//   </div>
//       <div className="user-data">
//        <center> <h3>Registered Users</h3></center>
//         {users.length === 0 ? (
//           <p>No users found</p>
//         ) : (
//           <table className="table table-hover">
//             <thead>
//               <tr>
//                 <th>S.No</th>
//                 <th scope="col">Name</th>
//                 <th scope="col">Email</th>
//                 <th scope="col">Login Count</th>
//                 <th scope="col">Gender</th>
//                 <th scope="col">Last Login Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user, index) => (
//                 <tr key={user.email}>
//                   <th scope="row">{index + 1}</th>
//                   <td>{user.name}</td>
//                   <td>{user.email}</td>
//                   <td>{user.count}</td>
//                   <td>{user.gender}</td>
//                   <td>{new Date(user.lastLoginDate).toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Search from "../components/Search";
import NavBar from '../components/NavBar';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [totalUser,setTotalUser]=useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/admin-dashboard', { withCredentials: true })
      .then(res => {
        if (res.data.valid) {
          setUsers(res.data.users);
          setTotalUser(res.data.users.length);
        } else {
          navigate('/login');
        }
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        navigate('/login');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

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
    <div className="container">
      <NavBar users={users} formatDataForChart={formatDataForChart} totalUser={totalUser}/>
      <div className="user-data">
        <center><h3>Registered Users</h3></center>
        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>S.No</th>
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
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
