import React, { useState, useEffect } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [revenueData, setRevenueData] = useState([1200, 1900, 3000, 2500, 4000, 4500]);
  const [customerData, setCustomerData] = useState([45, 52, 48, 61, 55, 67]);
  const [forecastData, setForecastData] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRevenueData(prev => {
        const newValue = Math.floor(Math.random() * 5000) + 2000;
        return [...prev.slice(1), newValue];
      });
      
      setCustomerData(prev => {
        const newValue = Math.floor(Math.random() * 30) + 40;
        return [...prev.slice(1), newValue];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // AI-powered forecasting simulation
    const lastRevenue = revenueData[revenueData.length - 1];
    const trend = revenueData[revenueData.length - 1] - revenueData[revenueData.length - 2];
    const forecast = [];
    
    for (let i = 1; i <= 6; i++) {
      const prediction = lastRevenue + (trend * i) + (Math.random() * 500 - 250);
      forecast.push(Math.max(0, Math.round(prediction)));
    }
    
    setForecastData(forecast);
  }, [revenueData]);

  const revenueChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue ($)",
        data: revenueData,
        borderColor: "rgba(79, 70, 229, 1)",
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const customerChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Customers",
        data: customerData,
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
      },
    ],
  };

  const conversionData = {
    labels: ["Converted", "In Progress", "Lost"],
    datasets: [
      {
        data: [35, 45, 20],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const forecastChartData = {
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "AI Forecast ($)",
        data: forecastData,
        borderColor: "rgba(147, 51, 234, 1)",
        backgroundColor: "rgba(147, 51, 234, 0.1)",
        fill: true,
        tension: 0.4,
        borderDash: [5, 5],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <div>
      <h1>Analytics Dashboard</h1>
      
      <div className="cards">
        <div className="card">
          <h2>Total Revenue</h2>
          <p>${revenueData.reduce((a, b) => a + b, 0).toLocaleString()}</p>
        </div>
        <div className="card">
          <h2>Total Customers</h2>
          <p>{customerData.reduce((a, b) => a + b, 0)}</p>
        </div>
        <div className="card">
          <h2>Avg Deal Size</h2>
          <p>${Math.round(revenueData.reduce((a, b) => a + b, 0) / customerData.reduce((a, b) => a + b, 0)).toLocaleString()}</p>
        </div>
        <div className="card">
          <h2>Growth Rate</h2>
          <p>{((revenueData[revenueData.length - 1] / revenueData[0] - 1) * 100).toFixed(1)}%</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="chart-container">
          <h2 style={{ marginBottom: '1rem' }}>📈 Revenue Trend (Auto-updating)</h2>
          <Line data={revenueChartData} options={chartOptions} />
        </div>
        
        <div className="chart-container">
          <h2 style={{ marginBottom: '1rem' }}>🎯 Lead Conversion</h2>
          <Doughnut data={conversionData} options={doughnutOptions} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="chart-container">
          <h2 style={{ marginBottom: '1rem' }}>👥 Customer Acquisition</h2>
          <Bar data={customerChartData} options={chartOptions} />
        </div>
        
        <div className="chart-container">
          <h2 style={{ marginBottom: '1rem' }}>🔮 AI Revenue Forecast</h2>
          <Line data={forecastChartData} options={chartOptions} />
        </div>
      </div>

      <div className="forecast-panel">
        <h3>🤖 AI-Powered Insights</h3>
        <div className="forecast-value">
          ${forecastData.length > 0 ? forecastData[0].toLocaleString() : '0'}
        </div>
        <p>Predicted revenue for next month</p>
        <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '1rem' }}>
          Based on current trends and historical data analysis
        </p>
      </div>
    </div>
  );
}