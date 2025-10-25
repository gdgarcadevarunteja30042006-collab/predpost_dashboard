const StatusCard = ({ title, value, subtitle, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
    green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300',
    red: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300',
    yellow: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusCard;
