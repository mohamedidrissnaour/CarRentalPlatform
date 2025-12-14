import { createContext, useContext, useState } from 'react';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState({
    car: null,
    startDate: null,
    endDate: null,
    client: null,
  });

  const setCar = (car) => {
    setBookingData((prev) => ({ ...prev, car }));
  };

  const setDates = (startDate, endDate) => {
    setBookingData((prev) => ({ ...prev, startDate, endDate }));
  };

  const setClient = (client) => {
    setBookingData((prev) => ({ ...prev, client }));
  };

  const clearBooking = () => {
    setBookingData({
      car: null,
      startDate: null,
      endDate: null,
      client: null,
    });
  };

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        setCar,
        setDates,
        setClient,
        clearBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

