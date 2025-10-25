import { useState, useEffect } from 'react';
import { getSensorData } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAlert, setExpandedAlert] = useState(null);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await getSensorData(1, 100);

      if (response.data && Array.isArray(response.data)) {
        const faultData = response.data
          .filter(item => item.prediction === 1)
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setAlerts(faultData);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSeverity = (item) => {
    let score = 0;

    if (item.temperature > 80) score += 2;
    else if (item.temperature > 70) score += 1;

    if (item.vibration > 5) score += 2;
    else if (item.vibration > 3) score += 1;

    if (item.rpm_dev > 200) score += 2;
    else if (item.rpm_dev > 100) score += 1;

    if (item.current_delta > 3) score += 2;
    else if (item.current_delta > 2) score += 1;

    if (score >= 5) return 'critical';
    if (score >= 3) return 'high';
    if (score >= 1) return 'medium';
    return 'low';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-500';
      case 'high':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 border-orange-500';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-500';
      default:
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-500';
    }
  };

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  if (loading && alerts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Alerts & Notifications
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Recent fault predictions and system alerts
          </p>
        </div>
        <button
          onClick={fetchAlerts}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded">
          <p className="font-medium">Error loading alerts</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-100 dark:bg-red-900 rounded-lg p-4">
          <p className="text-sm text-red-600 dark:text-red-300 font-medium">
            Critical
          </p>
          <p className="text-2xl font-bold text-red-900 dark:text-red-100 mt-1">
            {alerts.filter(a => getSeverity(a) === 'critical').length}
          </p>
        </div>
        <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-4">
          <p className="text-sm text-orange-600 dark:text-orange-300 font-medium">
            High
          </p>
          <p className="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-1">
            {alerts.filter(a => getSeverity(a) === 'high').length}
          </p>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-900 rounded-lg p-4">
          <p className="text-sm text-yellow-600 dark:text-yellow-300 font-medium">
            Medium
          </p>
          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mt-1">
            {alerts.filter(a => getSeverity(a) === 'medium').length}
          </p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4">
          <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">
            Low
          </p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
            {alerts.filter(a => getSeverity(a) === 'low').length}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-green-500 dark:text-green-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              All Systems Operational
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              No active alerts at this time
            </p>
          </div>
        ) : (
          alerts.map((alert, idx) => {
            const severity = getSeverity(alert);
            const isExpanded = expandedAlert === idx;

            return (
              <div
                key={idx}
                className={`border-l-4 ${getSeverityColor(severity)} bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all`}
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedAlert(isExpanded ? null : idx)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          Machine {alert.machine_id} - Fault Detected
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(
                            severity
                          )}`}
                        >
                          {severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {getTimeAgo(alert.timestamp)} •{' '}
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <svg
                      className={`w-6 h-6 text-gray-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Sensor Readings
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Temperature
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {alert.temperature?.toFixed(1)}°C
                          </p>
                          {alert.temperature > 70 && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                              Above normal
                            </p>
                          )}
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Vibration
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {alert.vibration?.toFixed(2)}
                          </p>
                          {alert.vibration > 3 && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                              Above normal
                            </p>
                          )}
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            RPM Deviation
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {alert.rpm_dev?.toFixed(1)}
                          </p>
                          {alert.rpm_dev > 100 && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                              Above normal
                            </p>
                          )}
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Current Delta
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {alert.current_delta?.toFixed(2)}A
                          </p>
                          {alert.current_delta > 2 && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                              Above normal
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                          Recommended Actions
                        </h5>
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          <li>Schedule immediate maintenance inspection</li>
                          <li>Monitor machine continuously for further anomalies</li>
                          <li>Review operational logs for root cause analysis</li>
                          {severity === 'critical' && (
                            <li className="text-red-600 dark:text-red-400 font-medium">
                              Consider emergency shutdown if conditions worsen
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Alerts;
