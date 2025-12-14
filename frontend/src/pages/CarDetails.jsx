import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format, differenceInDays } from 'date-fns';
import { carService } from '../services/carService';
import { rentalService } from '../services/rentalService';
import { useBooking } from '../context/BookingContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import DateRangePicker from '../components/booking/DateRangePicker';
import Badge from '../components/common/Badge';
import { FiTruck, FiCalendar, FiUsers, FiDollarSign, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setCar, setDates } = useBooking();
  const [selectedDates, setSelectedDates] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
  });
  const [isAvailable, setIsAvailable] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const { data: car, isLoading, error } = useQuery({
    queryKey: ['car', id],
    queryFn: () => carService.getCarById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (car && selectedDates.startDate && selectedDates.endDate) {
      checkAvailability();
    }
  }, [car, selectedDates]);

  const checkAvailability = async () => {
    if (!car || !selectedDates.startDate || !selectedDates.endDate) return;
    
    setCheckingAvailability(true);
    try {
      const result = await rentalService.checkAvailability(
        car.id,
        selectedDates.startDate,
        selectedDates.endDate
      );
      setIsAvailable(result.disponible || false);
    } catch (error) {
      console.error('Erreur vérification disponibilité:', error);
      setIsAvailable(true); // Par défaut, on assume disponible
    } finally {
      setCheckingAvailability(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!car || !selectedDates.startDate || !selectedDates.endDate) return 0;
    const days = differenceInDays(
      new Date(selectedDates.endDate),
      new Date(selectedDates.startDate)
    );
    return days > 0 ? days * car.pricePerDay : car.pricePerDay;
  };

  const handleReserve = () => {
    if (!isAvailable) {
      toast.error('Cette voiture n\'est pas disponible pour ces dates');
      return;
    }
    setCar(car);
    setDates(selectedDates.startDate, selectedDates.endDate);
    navigate(`/booking/${id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message="Voiture introuvable" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {car.imageUrl ? (
                <img
                  src={car.imageUrl}
                  alt={car.brand + ' ' + car.model}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-gray-200">
                  <FiTruck className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {car.brand} {car.model}
                  </h1>
                  <Badge variant={car.categorie === 'LUXE' ? 'warning' : car.categorie === 'CONFORT' ? 'primary' : 'default'}>
                    {car.categorie}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    {formatPrice(car.pricePerDay)}
                  </p>
                  <p className="text-sm text-gray-500">par jour</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiCalendar className="w-5 h-5" />
                  <span>Année: {car.year}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <FiTruck className="w-5 h-5" />
                  <span>Disponible: {car.disponible ? 'Oui' : 'Non'}</span>
                </div>
              </div>

              {/* Booking Form */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Réserver cette voiture</h3>
                <DateRangePicker
                  startDate={selectedDates.startDate}
                  endDate={selectedDates.endDate}
                  onDateChange={(start, end) =>
                    setSelectedDates({ startDate: start, endDate: end })
                  }
                />

                {checkingAvailability ? (
                  <div className="mt-4">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : (
                  <div className="mt-4 flex items-center gap-2">
                    {isAvailable ? (
                      <>
                        <FiCheck className="w-5 h-5 text-success" />
                        <span className="text-success font-medium">Disponible</span>
                      </>
                    ) : (
                      <span className="text-danger font-medium">
                        Non disponible pour ces dates
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Prix total</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(calculateTotalPrice())}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {differenceInDays(
                      new Date(selectedDates.endDate),
                      new Date(selectedDates.startDate)
                    )}{' '}
                    jour(s)
                  </p>
                </div>

                <button
                  onClick={handleReserve}
                  disabled={!isAvailable || checkingAvailability}
                  className="btn-primary w-full mt-4"
                >
                  Réserver maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;

