import { useState, useEffect } from 'react';
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
  Filler,
} from 'chart.js';
import { getSensorData } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Visualize = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMachine, setSelectedMachine] = useState('all');
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getSensorData(1, 200);

      if (response.data && Array.isArray(response.data)) {
        const sortedData = response.data.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
        setData(sortedData);

        const uniqueMachines = [...new Set(sortedData.map(item => item.machine_id))];
        setMachines(uniqueMachines);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredData =
    selectedMachine === 'all'
      ? data
      : data.filter(item => item.machine_id === selectedMachine);

  const createChartData = (field, label, color) => {
    const labels = filteredData.map(item =>
      new Date(item.timestamp).toLocaleTimeString()
    );

    return {
      labels,
      datasets: [
        {
          label,
          data: filteredData.map(item => item[field]),
          borderColor: color,
          backgroundColor: `${color}20`,
          fill: true,
          tension: 0.4,
          pointRadius: filteredData.length > 50 ? 0 : 3,
          pointHoverRadius: 5,
        },
      ],
    };
  };

  const chartOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#374151',
        },
      },
      title: {
        display: true,
        text: title,
        color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
        },
      },
      y: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
        },
      },
    },
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Data Visualization
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Time series analysis of sensor readings
          </p>
        </div>

        <div className="flex items-center gap-4">
          <label
            htmlFor="machine-select"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Machine:
          </label>
          <select
            id="machine-select"
            value={selectedMachine}
            onChange={(e) => setSelectedMachine(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Machines</option>
            {machines.map((machineId) => (
              <option key={machineId} value={machineId}>
                Machine {machineId}
              </option>
            ))}
          </select>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded">
          <p className="font-medium">Error loading data</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {filteredData.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No data available for visualization
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="h-80">
              <Line
                data={createChartData('temperature', 'Temperature (°C)', '#ef4444')}
                options={chartOptions('Temperature Over Time')}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="h-80">
              <Line
                data={createChartData('vibration', 'Vibration (mm/s)', '#f59e0b')}
                options={chartOptions('Vibration Over Time')}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="h-80">
              <Line
                data={createChartData('rpm_dev', 'RPM Deviation', '#3b82f6')}
                options={chartOptions('RPM Deviation Over Time')}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="h-80">
              <Line
                data={createChartData('current_delta', 'Current Delta (A)', '#10b981')}
                options={chartOptions('Current Delta Over Time')}
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Prediction Timeline
        </h2>
        <div className="space-y-2">
          {filteredData.slice(-20).reverse().map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    item.prediction === 1 ? 'bg-red-500' : 'bg-green-500'
                  }`}
                ></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Machine {item.machine_id}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right text-xs text-gray-600 dark:text-gray-400">
                <p>Temp: {item.temperature}°C</p>
                <p>Vib: {item.vibration} mm/s</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Visualize;
