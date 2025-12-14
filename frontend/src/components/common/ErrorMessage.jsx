import { FiAlertCircle } from 'react-icons/fi';

const ErrorMessage = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div
      className={`flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 ${className}`}
    >
      <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;

