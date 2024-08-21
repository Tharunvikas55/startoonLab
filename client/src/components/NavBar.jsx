// import React from 'react'
// import { Link,useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Search from "./Search";

// const NavBar = ({userName}) => {
//     const navigate=useNavigate();
//     const handleLogout = async (e) => {
//         e.preventDefault();
//         try {
//           const res = await axios.post('http://localhost:3001/logout');
//           if (res.data.success) {
//             navigate('/login');
//           } else {
//             console.log("Logout failed:", res.data.message);
//           }
//         } catch (err) {
//           console.log("Error during logout:", err);
//         }
//       };

//         const handleViewChart = () => {
//     navigate('/chart', { state: { chartData: formatDataForChart() } });
//   };

//     const formatDataForChart = () => {
//       const countsByDate = {};
//       users.forEach(user => {
//         const date = new Date(user.lastLoginDate).toLocaleDateString();
//         countsByDate[date] = (countsByDate[date] || 0) + 1;
//       });
//       return {
//         labels: Object.keys(countsByDate),
//         datasets: [{
//           label: 'User Login Count',
//           data: Object.values(countsByDate),
//           backgroundColor: 'rgba(75, 192, 192, 0.6)',
//           borderColor: 'rgba(75, 192, 192, 1)',
//           borderWidth: 1
//         }]
//       };
//     };
//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-light">
  
//   <Link className="navbar-brand" to={'/admin-dashboard'}>Home</Link>
//   <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
//     <span className="navbar-toggler-icon"></span>
//   </button>
//   <div className="collapse navbar-collapse" id="navbarNav">
//     <ul className="navbar-nav">
//       <li className="nav-item">
//         <a className="btn" onClick={handleViewChart}>Graph</a>
//       </li>
//       <li className="nav-item ">
//       <Search/>
//       </li>
//       <div className="float-end">
//       <li className='d-flex btn btn-outline-danger ' type="button" onClick={handleLogout}>Logout</li></div>
//     </ul>

// </div>
// </nav>
//   )
// }

// export default NavBar



import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Search from "./Search";

const NavBar = ({  formatDataForChart,totalUser }) => {
  const navigate = useNavigate();

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

  const handleViewChart = () => {
    const chartData = formatDataForChart();
    navigate('/chart', { state: { chartData,totalUser } });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" data-bs-toggle="tooltip" data-bs-placement="buttom" title="Click to go Home Page" to={'/admin-dashboard'}>Home</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item" data-bs-toggle="tooltip" data-bs-placement="buttom" title="Click to view User Login">
            <a className="btn" onClick={handleViewChart}>Graph</a>
          </li>
          <li className="nav-item">
            <Search />
          </li>
          <div className="float-end mx-2">
            <li className='d-flex btn btn-outline-danger ' type="button" onClick={handleLogout}>Logout</li>
          </div>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
