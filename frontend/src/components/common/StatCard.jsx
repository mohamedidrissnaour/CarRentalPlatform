import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  className = '',
  iconColor = 'text-primary',
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' ? (
                <FiTrendingUp className="w-4 h-4 text-success" />
              ) : (
                <FiTrendingDown className="w-4 h-4 text-danger" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend === 'up' ? 'text-success' : 'text-danger'
                }`}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-full bg-gray-100 ${iconColor}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

