import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import StatusCard from '../components/StatusCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getSensorData } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMachines: 0,
    healthyMachines: 0,
    faultyMachines: 0,
    activeAlerts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentPredictions, setRecentPredictions] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getSensorData(1, 100);

      const machines = new Set();
      let faultyCount = 0;
      const recent = [];

      if (data.data && Array.isArray(data.data)) {
        data.data.forEach(item => {
          machines.add(item.machine_id);
          if (item.prediction === 1) {
            faultyCount++;
          }
        });

        recent.push(...data.data.slice(0, 5).map(item => ({
          ...item,
          status: item.prediction === 1 ? 'Fault' : 'Normal'
        })));
      }

      setStats({
        totalMachines: machines.size,
        healthyMachines: machines.size - Math.min(faultyCount, machines.size),
        faultyMachines: Math.min(faultyCount, machines.size),
        activeAlerts: faultyCount,
      });

      setRecentPredictions(recent);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ['Healthy', 'Faulty'],
    datasets: [
      {
        data: [stats.healthyMachines, stats.faultyMachines],
        backgroundColor: ['#10b981', '#ef4444'],
        borderColor: ['#059669', '#dc2626'],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#374151',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = stats.healthyMachines + stats.faultyMachines;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  if (loading && recentPredictions.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Real-time machine health monitoring overview
        </p>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded">
          <p className="font-medium">Error loading dashboard data</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard
          title="Total Machines"
          value={stats.totalMachines}
          subtitle="Monitored systems"
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          }
        />
        <StatusCard
          title="Healthy Machines"
          value={stats.healthyMachines}
          subtitle="Operating normally"
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatusCard
          title="Faulty Machines"
          value={stats.faultyMachines}
          subtitle="Require attention"
          color="red"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
        <StatusCard
          title="Active Alerts"
          value={stats.activeAlerts}
          subtitle="Total fault predictions"
          color="yellow"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Machine Health Overview
          </h2>
          <div className="h-64">
            {stats.totalMachines > 0 ? (
              <Pie data={chartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                No data available
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Predictions
          </h2>
          <div className="space-y-3">
            {recentPredictions.length > 0 ? (
              recentPredictions.map((pred, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Machine {pred.machine_id}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(pred.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      pred.status === 'Normal'
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                    }`}
                  >
                    {pred.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                No recent predictions
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
