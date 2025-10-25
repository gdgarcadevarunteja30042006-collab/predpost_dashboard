import { useState, useEffect } from 'react';
import { getSensorData } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const History = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const itemsPerPage = 20;

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getSensorData(currentPage, itemsPerPage);

      if (response.data && Array.isArray(response.data)) {
        setData(response.data);
        setTotalPages(Math.ceil(response.total / itemsPerPage) || 1);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedAndFilteredData = () => {
    let filteredData = [...data];

    if (filterStatus !== 'all') {
      const statusValue = filterStatus === 'normal' ? 0 : 1;
      filteredData = filteredData.filter(item => item.prediction === statusValue);
    }

    filteredData.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'timestamp') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filteredData;
  };

  const exportToCSV = () => {
    const csvData = getSortedAndFilteredData();
    const headers = [
      'Timestamp',
      'Machine ID',
      'Temperature',
      'Vibration',
      'RPM Deviation',
      'Current Delta',
      'Prediction',
      'Status',
    ];

    const csvContent = [
      headers.join(','),
      ...csvData.map(row =>
        [
          new Date(row.timestamp).toISOString(),
          row.machine_id,
          row.temperature,
          row.vibration,
          row.rpm_dev,
          row.current_delta,
          row.prediction,
          row.prediction === 1 ? 'Fault' : 'Normal',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensor-data-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return (
      <svg
        className={`w-4 h-4 inline ml-1 transition-transform ${
          sortDirection === 'desc' ? 'rotate-180' : ''
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    );
  };

  if (loading && data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const sortedFilteredData = getSortedAndFilteredData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Historical Data
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Browse and export sensor data records
          </p>
        </div>

        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="normal">Normal</option>
            <option value="fault">Fault</option>
          </select>

          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded">
          <p className="font-medium">Error loading data</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  onClick={() => handleSort('timestamp')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Timestamp <SortIcon field="timestamp" />
                </th>
                <th
                  onClick={() => handleSort('machine_id')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Machine <SortIcon field="machine_id" />
                </th>
                <th
                  onClick={() => handleSort('temperature')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Temp (°C) <SortIcon field="temperature" />
                </th>
                <th
                  onClick={() => handleSort('vibration')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Vibration <SortIcon field="vibration" />
                </th>
                <th
                  onClick={() => handleSort('rpm_dev')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  RPM Dev <SortIcon field="rpm_dev" />
                </th>
                <th
                  onClick={() => handleSort('current_delta')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Current Δ <SortIcon field="current_delta" />
                </th>
                <th
                  onClick={() => handleSort('prediction')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Status <SortIcon field="prediction" />
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedFilteredData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(row.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {row.machine_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {row.temperature?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {row.vibration?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {row.rpm_dev?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {row.current_delta?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        row.prediction === 1
                          ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      }`}
                    >
                      {row.prediction === 1 ? 'Fault' : 'Normal'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedFilteredData.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No data available
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default History;
