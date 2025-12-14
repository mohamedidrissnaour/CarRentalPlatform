import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { format, differenceInDays } from 'date-fns';
import { carService } from '../services/carService';
import { clientService } from '../services/clientService';
import { rentalService } from '../services/rentalService';
import { paymentService } from '../services/paymentService';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import PaymentForm from '../components/payment/PaymentForm';
import { FiCheck, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Booking = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { bookingData, clearBooking } = useBooking();
  const { user, login } = useAuth();
  const [step, setStep] = useState(1);
  const [reservationId, setReservationId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data: car, isLoading: carLoading } = useQuery({
    queryKey: ['car', carId],
    queryFn: () => carService.getCarById(carId),
    enabled: !!carId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!car && !carLoading) {
      navigate('/cars');
    }
  }, [car, carLoading, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const calculateTotalPrice = () => {
    if (!car || !bookingData.startDate || !bookingData.endDate) return 0;
    const days = differenceInDays(
      new Date(bookingData.endDate),
      new Date(bookingData.startDate)
    );
    return days > 0 ? days * car.pricePerDay : car.pricePerDay;
  };

  const onClientSubmit = async (data) => {
    setLoading(true);
    try {
      // Vérifier si le client existe
      let client;
      try {
        client = await clientService.getClientByEmail(data.email);
      } catch (error) {
        // Créer le client s'il n'existe pas
        client = await clientService.createClient(data);
      }

      // Mettre à jour le client si nécessaire
      if (client.id) {
        client = await clientService.updateClient(client.id, data);
      }

      // Simuler la connexion
      login({ ...client, email: data.email }, false);

      // Créer la réservation
      const reservationData = {
        clientId: client.id,
        carId: car.id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        montantTotal: calculateTotalPrice(),
      };

      const reservation = await rentalService.createReservation(reservationData);
      setReservationId(reservation.id);
      setStep(2);
      toast.success('Réservation créée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la création de la réservation');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onPaymentSubmit = async (paymentData) => {
    setLoading(true);
    try {
      await paymentService.processPayment({
        rentalId: reservationId,
        ...paymentData,
        montant: calculateTotalPrice(),
      });

      // Confirmer la réservation
      await rentalService.updateReservationStatus(reservationId, 'CONFIRMEE');

      setStep(3);
      toast.success('Paiement effectué avec succès');
    } catch (error) {
      toast.error('Erreur lors du traitement du paiement');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    clearBooking();
    navigate('/my-bookings');
  };

  if (carLoading || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step >= s
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step > s ? <FiCheck className="w-6 h-6" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > s ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Informations</span>
            <span>Récapitulatif</span>
            <span>Paiement</span>
            <span>Confirmation</span>
          </div>
        </div>

        {/* Step 1: Client Information */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Informations client</h2>
            <form onSubmit={handleSubmit(onClientSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    {...register('prenom', { required: 'Le prénom est requis' })}
                    className="input-field"
                  />
                  {errors.prenom && (
                    <p className="text-danger text-sm mt-1">{errors.prenom.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    {...register('nom', { required: 'Le nom est requis' })}
                    className="input-field"
                  />
                  {errors.nom && (
                    <p className="text-danger text-sm mt-1">{errors.nom.message}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide',
                    },
                  })}
                  className="input-field"
                />
                {errors.email && (
                  <p className="text-danger text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  {...register('telephone', { required: 'Le téléphone est requis' })}
                  className="input-field"
                />
                {errors.telephone && (
                  <p className="text-danger text-sm mt-1">
                    {errors.telephone.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse *
                </label>
                <input
                  type="text"
                  {...register('adresse', { required: 'L\'adresse est requise' })}
                  className="input-field"
                />
                {errors.adresse && (
                  <p className="text-danger text-sm mt-1">{errors.adresse.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Traitement...</span>
                  </>
                ) : (
                  <>
                    <span>Continuer</span>
                    <FiArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Summary */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Récapitulatif</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Voiture</h3>
                <p className="text-gray-600">
                  {car.brand} {car.model} - {car.categorie}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Dates</h3>
                <p className="text-gray-600">
                  Du {format(new Date(bookingData.startDate), 'dd/MM/yyyy')} au{' '}
                  {format(new Date(bookingData.endDate), 'dd/MM/yyyy')}
                </p>
                <p className="text-gray-600">
                  Durée: {differenceInDays(
                    new Date(bookingData.endDate),
                    new Date(bookingData.startDate)
                  )}{' '}
                  jour(s)
                </p>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(calculateTotalPrice())}
                  </span>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <FiArrowLeft className="w-5 h-5" />
                  <span>Retour</span>
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <span>Procéder au paiement</span>
                  <FiArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Paiement</h2>
            <PaymentForm
              onSubmit={onPaymentSubmit}
              totalAmount={calculateTotalPrice()}
              loading={loading}
            />
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Réservation confirmée !</h2>
              <p className="text-gray-600 mb-4">
                Votre réservation a été créée avec succès
              </p>
              <p className="text-lg font-semibold">
                Numéro de réservation: <span className="text-primary">#{reservationId}</span>
              </p>
            </div>
            <button onClick={handleFinish} className="btn-primary">
              Voir mes réservations
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;

