import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';

const baseURL = process.env.REACT_APP_API_URL;

const ChartPage = () => {
  const location = useLocation();
  const { chartData, totalUser, totalClickCount } = location.state || {};

  const [view, setView] = useState('daily'); // Default view
  const [selectedMonth, setSelectedMonth] = useState(''); // State for selected month

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  const formatDataForView = () => {
    const data = { ...chartData };

    if (view === 'yearly') {
      const countsByMonth = {};
      chartData.labels.forEach((date, index) => {
        const dateObj = new Date(date);
        const month = monthNames[dateObj.getMonth()];
        countsByMonth[month] = (countsByMonth[month] || 0) + chartData.datasets[0].data[index];
      });
      return {
        labels: monthNames,
        datasets: [{
          label: 'User Login Count by Month',
          data: monthNames.map(month => countsByMonth[month] || 0),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      };
    } else if (view === 'quarterly') {
      const countsByQuarter = {};
      chartData.labels.forEach((date, index) => {
        const dateObj = new Date(date);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth();
        const quarter = Math.floor(month / 3) + 1; 
        const key = `${year}-Q${quarter}`;
        countsByQuarter[key] = (countsByQuarter[key] || 0) + chartData.datasets[0].data[index];
      });
      return {
        labels: Object.keys(countsByQuarter),
        datasets: [{
          label: 'User Login Count by Quarter',
          data: Object.values(countsByQuarter),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      };
    } else if (view === 'daily') {
      if (selectedMonth) {
        const countsByDay = {};
        chartData.labels.forEach((date, index) => {
          const dateObj = new Date(date);
          const month = monthNames[dateObj.getMonth()];
          if (month === selectedMonth) {
            const day = dateObj.getDate();
            countsByDay[day] = (countsByDay[day] || 0) + chartData.datasets[0].data[index];
          }
        });
        return {
          labels: Object.keys(countsByDay),
          datasets: [{
            label: `User Login Count in ${selectedMonth}`,
            data: Object.values(countsByDay),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        };
      } else {
        return data;
      }
    } else {
      return data;
    }
  };

  const chartDataForView = formatDataForView();

  return (
    <div className="container mt-4">
      <NavBar />
      <div className="text-center mb-4">
        <h2>User Login Chart</h2>
        <p>Total Users: <strong>{totalUser}</strong></p>
        <p>Total Clicks: <strong>{totalClickCount}</strong></p>
        <div className="d-flex justify-content-center mb-4">
        <figure className="figure" style={{ width: '80%', maxHeight: '500px' }}>
          <Bar data={chartDataForView} options={{ responsive: true, maintainAspectRatio: false }} />
        </figure>
      </div>
        <div className="btn-group" role="group" aria-label="Chart view options">
          <button className='btn btn-warning m-2' onClick={() => setView('daily')}>Daily</button>
          <button className='btn btn-success m-2' onClick={() => setView('quarterly')}>Quarterly</button>
          <button className='btn btn-info m-2' onClick={() => setView('yearly')}>Yearly</button>
        </div>
        {view === 'daily' && (
          <div className="dropdown text-center mb-4">
            <button 
              className="btn btn-secondary dropdown-toggle" 
              type="button" 
              id="monthDropdown" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
            >
              {selectedMonth || 'Select Month'}
            </button>
            <ul className="dropdown-menu" aria-labelledby="monthDropdown">
              <li>
                <button 
                  className="dropdown-item" 
                  onClick={() => setSelectedMonth('')}
                >
                  All Months
                </button>
              </li>
              {monthNames.map((month, index) => (
                <li key={index}>
                  <button 
                    className="dropdown-item" 
                    onClick={() => setSelectedMonth(month)}
                  >
                    {month}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default ChartPage;