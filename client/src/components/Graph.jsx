// src/components/Graph.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import NavBar from '../components/NavBar';

const Graph = ({ data }) => {
  return (
    <div>
<NavBar />
    <div className="user-chart">
      <h3>User Login Chart</h3>
      <Bar data={data} />
    </div>
    </div>
  );
};

export default Graph;
