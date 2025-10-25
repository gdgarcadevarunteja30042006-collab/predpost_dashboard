import { useState } from 'react';
import { predictMachineHealth } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Predict = () => {
  const [formData, setFormData] = useState({
    temperature: '',
    vibration: '',
    rpm_dev: '',
    current_delta: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.temperature) {
      newErrors.temperature = 'Temperature is required';
    } else if (isNaN(formData.temperature)) {
      newErrors.temperature = 'Temperature must be a number';
    }

    if (!formData.vibration) {
      newErrors.vibration = 'Vibration is required';
    } else if (isNaN(formData.vibration)) {
      newErrors.vibration = 'Vibration must be a number';
    }

    if (!formData.rpm_dev) {
      newErrors.rpm_dev = 'RPM Deviation is required';
    } else if (isNaN(formData.rpm_dev)) {
      newErrors.rpm_dev = 'RPM Deviation must be a number';
    }

    if (!formData.current_delta) {
      newErrors.current_delta = 'Current Delta is required';
    } else if (isNaN(formData.current_delta)) {
      newErrors.current_delta = 'Current Delta must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = {
        temperature: parseFloat(formData.temperature),
        vibration: parseFloat(formData.vibration),
        rpm_dev: parseFloat(formData.rpm_dev),
        current_delta: parseFloat(formData.current_delta),
      };

      const response = await predictMachineHealth(data);
      setResult(response);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      temperature: '',
      vibration: '',
      rpm_dev: '',
      current_delta: '',
    });
    setErrors({});
    setResult(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Machine Health Prediction
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Enter sensor data to predict machine health status
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="temperature"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Temperature (°C)
              </label>
              <input
                type="text"
                id="temperature"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                  errors.temperature
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="e.g., 75.5"
              />
              {errors.temperature && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.temperature}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="vibration"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Vibration (mm/s)
              </label>
              <input
                type="text"
                id="vibration"
                name="vibration"
                value={formData.vibration}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                  errors.vibration
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="e.g., 3.2"
              />
              {errors.vibration && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.vibration}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="rpm_dev"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                RPM Deviation
              </label>
              <input
                type="text"
                id="rpm_dev"
                name="rpm_dev"
                value={formData.rpm_dev}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                  errors.rpm_dev
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="e.g., 150"
              />
              {errors.rpm_dev && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.rpm_dev}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="current_delta"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Current Delta (A)
              </label>
              <input
                type="text"
                id="current_delta"
                name="current_delta"
                value={formData.current_delta}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                  errors.current_delta
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="e.g., 2.5"
              />
              {errors.current_delta && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.current_delta}
                </p>
              )}
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded">
              <p className="font-medium">Prediction Error</p>
              <p className="text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Predict'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Prediction Result
            </h2>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Machine Status
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {result.prediction === 1 ? 'FAULT DETECTED' : 'NORMAL'}
                  </p>
                </div>
                <div
                  className={`p-4 rounded-full ${
                    result.prediction === 1
                      ? 'bg-red-100 dark:bg-red-900'
                      : 'bg-green-100 dark:bg-green-900'
                  }`}
                >
                  {result.prediction === 1 ? (
                    <svg
                      className="w-12 h-12 text-red-600 dark:text-red-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-12 h-12 text-green-600 dark:text-green-300"
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
                  )}
                </div>
              </div>
              {result.confidence && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Confidence</span>
                    <span>{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        result.prediction === 1 ? 'bg-red-600' : 'bg-green-600'
                      }`}
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Predict;
