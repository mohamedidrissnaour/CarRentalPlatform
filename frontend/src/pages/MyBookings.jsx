import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { rentalService } from '../services/rentalService';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/booking/BookingCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Modal from '../components/common/Modal';
import { toast } from 'react-toastify';

const MyBookings = () => {
  const { user } = useAuth();
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const { data: reservations, isLoading, error, refetch } = useQuery({
    queryKey: ['reservations', user?.id, statusFilter],
    queryFn: async () => {
      if (!user?.id) return [];
      const allReservations = await rentalService.getReservationsByClient(user.id);
      if (statusFilter) {
        return allReservations.filter((r) => r.statut === statusFilter);
      }
      return allReservations;
    },
    enabled: !!user?.id,
  });

  const handleCancel = async (reservationId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return;
    }

    try {
      await rentalService.updateReservationStatus(reservationId, 'ANNULEE');
      toast.success('Réservation annulée avec succès');
      refetch();
    } catch (error) {
      toast.error('Erreur lors de l\'annulation');
      console.error(error);
    }
  };

  const handleViewDetails = async (reservation) => {
    try {
      const details = await rentalService.getReservationDetails(reservation.id);
      setSelectedReservation(details);
    } catch (error) {
      toast.error('Erreur lors du chargement des détails');
      console.error(error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message="Vous devez être connecté pour voir vos réservations" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Mes réservations</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('')}
              className={`px-4 py-2 rounded-lg ${
                statusFilter === ''
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Toutes
            </button>
            {['EN_ATTENTE', 'CONFIRMEE', 'EN_COURS', 'TERMINEE', 'ANNULEE'].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg ${
                    statusFilter === status
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" className="py-12" />
        ) : error ? (
          <ErrorMessage message="Erreur lors du chargement des réservations" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations?.map((reservation) => (
              <BookingCard
                key={reservation.id}
                reservation={reservation}
                onViewDetails={handleViewDetails}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}

        {reservations?.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucune réservation trouvée</p>
          </div>
        )}

        {/* Details Modal */}
        <Modal
          isOpen={!!selectedReservation}
          onClose={() => setSelectedReservation(null)}
          title="Détails de la réservation"
          size="lg"
        >
          {selectedReservation && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Voiture</h3>
                <p className="text-gray-600">
                  {selectedReservation.car?.brand}{' '}
                  {selectedReservation.car?.model}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Dates</h3>
                <p className="text-gray-600">
                  Du {new Date(selectedReservation.startDate).toLocaleDateString('fr-FR')} au{' '}
                  {new Date(selectedReservation.endDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Statut</h3>
                <p className="text-gray-600">{selectedReservation.statut}</p>
              </div>
              {selectedReservation.montantTotal && (
                <div>
                  <h3 className="font-semibold mb-2">Prix total</h3>
                  <p className="text-gray-600">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(selectedReservation.montantTotal)}
                  </p>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default MyBookings;

