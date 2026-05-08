import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = ({ booksByCategory }) => {
  // If data is unavailable, use fallbacks
  const labels = booksByCategory?.length > 0 
    ? booksByCategory.map(item => item._id || 'Uncategorized')
    : ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Mystery', 'Romance'];

  const dataValues = booksByCategory?.length > 0
    ? booksByCategory.map(item => item.count)
    : [12, 19, 3, 5, 2];

  const data = {
    labels,
    datasets: [
      {
        label: 'Books',
        data: dataValues,
        backgroundColor: [
          'rgba(56, 189, 248, 0.8)',   // sky-400
          'rgba(168, 85, 247, 0.8)',  // purple-500
          'rgba(251, 146, 60, 0.8)',  // orange-400
          'rgba(74, 222, 128, 0.8)',  // green-400
          'rgba(244, 114, 182, 0.8)', // pink-400
          'rgba(99, 102, 241, 0.8)',  // indigo-500
        ],
        borderColor: [
          '#0f172a', // Match the dashboard background
        ],
        borderWidth: 4,
        hoverOffset: 4
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%', // Creates the sleek ring effect
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#94a3b8',
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        boxPadding: 4,
      },
    },
  };

  return (
    <div className="w-full h-72 flex items-center justify-center">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default CategoryChart;
