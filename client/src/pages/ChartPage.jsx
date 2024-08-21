// // src/pages/ChartPage.jsx
// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import 'chart.js/auto';
// import { useLocation } from 'react-router-dom';
// import Search from "../components/Search";
// import NavBar from '../components/NavBar';

// const ChartPage = () => {
//   const location = useLocation();
//   const { chartData } = location.state || {};

  
//   if (!chartData) {
//     return <div>No data available</div>;
//   }



//   return (
//     <div className="container">
//        <NavBar/> 
//       <h2>User Login Chart</h2>
//       <figure className="figure"style={{width: '50%', height: '50%'}}>
//       <Bar data={chartData} />
// </figure>
//     </div>
//   );
// };

// export default ChartPage;



// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import 'chart.js/auto';
// import { useLocation } from 'react-router-dom';
// import NavBar from '../components/NavBar';

// const ChartPage = () => {
//   const location = useLocation();
//   const { chartData,totalUser } = location.state || {};

//   if (!chartData) {
//     return <div>No data available</div>;
//   }

//   return (
//     <div className="container">
//       <NavBar /> 
//       <h2>User Login Chart</h2>
//       <p>Total Users: {totalUser}</p> {/* Display totalUser */}
//       <figure className="figure" style={{ width: '50%', height: '50%' }}>
//         <Bar data={chartData} />
//       </figure>
//     </div>
//   );
// };

// export default ChartPage;


import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';

const ChartPage = () => {
  const location = useLocation();
  const { chartData, totalUser } = location.state || {};

  const [view, setView] = useState('daily'); // Default view

  // Prepare chart data based on view
  const formatDataForView = () => {
    const data = { ...chartData };
    
    if (view === 'yearly') {
      // Aggregate data by year
      const countsByYear = {};
      chartData.labels.forEach((date, index) => {
        const year = new Date(date).getFullYear();
        countsByYear[year] = (countsByYear[year] || 0) + chartData.datasets[0].data[index];
      });
      return {
        labels: Object.keys(countsByYear),
        datasets: [{
          label: 'User Login Count',
          data: Object.values(countsByYear),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      };
    } else if (view === 'quarterly') {
      // Aggregate data by quarter
      const countsByQuarter = {};
      chartData.labels.forEach((date, index) => {
        const dateObj = new Date(date);
        const year = dateObj.getFullYear();
        const quarter = Math.floor(dateObj.getMonth() / 3) + 1;
        const key = `${year}-Q${quarter}`;
        countsByQuarter[key] = (countsByQuarter[key] || 0) + chartData.datasets[0].data[index];
      });
      return {
        labels: Object.keys(countsByQuarter),
        datasets: [{
          label: 'User Login Count',
          data: Object.values(countsByQuarter),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      };
    } else {
      // Default to daily
      return chartData;
    }
  };

  const chartDataForView = formatDataForView();

  return (
    <div className="container">
      <NavBar />
      <h2>User Login Chart</h2>
      <p>Total Users: {totalUser}</p>
      <figure className="figure" style={{ width: '50%', height: '50%' }}>
        <Bar data={chartDataForView} />
      </figure>
      <div className="chart-controls">
        <button className='btn btn-warning m-1'  onClick={() => setView('daily')}>Daily</button>
        <button className='btn btn-success m-1' onClick={() => setView('quarterly')}>Quarterly</button>
        <button className='btn btn-info m-1' onClick={() => setView('yearly')}>Yearly</button>
      </div>
    </div>
  );
};

export default ChartPage;
