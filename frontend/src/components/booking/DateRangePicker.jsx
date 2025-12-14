import { useState } from 'react';
import { format } from 'date-fns';
import { FiCalendar } from 'react-icons/fi';

const DateRangePicker = ({ onDateChange, startDate, endDate, className = '' }) => {
  const [localStartDate, setLocalStartDate] = useState(
    startDate || format(new Date(), 'yyyy-MM-dd')
  );
  const [localEndDate, setLocalEndDate] = useState(
    endDate || format(new Date(Date.now() + 86400000), 'yyyy-MM-dd')
  );

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setLocalStartDate(newStartDate);
    if (onDateChange) {
      onDateChange(newStartDate, localEndDate);
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setLocalEndDate(newEndDate);
    if (onDateChange) {
      onDateChange(localStartDate, newEndDate);
    }
  };

  const minDate = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date de début
        </label>
        <div className="relative">
          <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="date"
            value={localStartDate}
            onChange={handleStartDateChange}
            min={minDate}
            className="input-field pl-10"
          />
        </div>
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date de fin
        </label>
        <div className="relative">
          <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="date"
            value={localEndDate}
            onChange={handleEndDateChange}
            min={localStartDate || minDate}
            className="input-field pl-10"
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;

