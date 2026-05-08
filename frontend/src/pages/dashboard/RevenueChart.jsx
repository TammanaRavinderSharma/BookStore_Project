import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const RevenueChart = ({ monthlySales }) => {
  
  // Format data from backend or use fallback
  const labels = monthlySales?.length > 0 
    ? monthlySales.map(item => {
        // item._id is "YYYY-MM"
        const [year, month] = item._id.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleString('default', { month: 'short' });
      })
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const revenueData = monthlySales?.length > 0
    ? monthlySales.map(item => item.totalSales)
    : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  const data = {
    labels,
    datasets: [
      {
        label: 'Revenue (₹)',
        data: revenueData,
        borderColor: '#38bdf8', // sky-400
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
          gradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
          return gradient;
        },
        borderWidth: 3,
        pointBackgroundColor: '#0f172a',
        pointBorderColor: '#38bdf8',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4, // Smooth curve
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend for cleaner look
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
                label += ': ';
            }
            if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          callback: function(value) {
            return '₹' + value;
          }
        }
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="w-full h-72">
      <Line data={data} options={options} />
    </div>
  );
};

export default RevenueChart;