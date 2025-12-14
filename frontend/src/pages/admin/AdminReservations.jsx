import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rentalService } from '../../services/rentalService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { format } from 'date-fns';
import { FiEye, FiTrash2, FiEdit } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AdminReservations = () => {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const queryClient = useQueryClient();

  const { data: reservations, isLoading, error } = useQuery({
    queryKey: ['admin-reservations', statusFilter],
    queryFn: async () => {
      const all = await rentalService.getAllReservations();
      if (statusFilter) {
        return all.filter((r) => r.statut === statusFilter);
      }
      return all;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, statut }) =>
      rentalService.updateReservationStatus(id, statut),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-reservations']);
      toast.success('Statut mis à jour');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => rentalService.deleteReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-reservations']);
      toast.success('Réservation supprimée');
    },
  });

  const handleViewDetails = async (reservation) => {
    try {
      const details = await rentalService.getReservationDetails(reservation.id);
      setSelectedReservation(details);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateStatusMutation.mutate({ id, statut: newStatus });
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (statut) => {
    const colors = {
      EN_ATTENTE: 'warning',
      CONFIRMEE: 'success',
      EN_COURS: 'primary',
      TERMINEE: 'default',
      ANNULEE: 'danger',
    };
    return colors[statut] || 'default';
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des réservations</h1>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="">Tous les statuts</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="CONFIRMEE">Confirmée</option>
            <option value="EN_COURS">En cours</option>
            <option value="TERMINEE">Terminée</option>
            <option value="ANNULEE">Annulée</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-12" />
      ) : error ? (
        <ErrorMessage message="Erreur lors du chargement" />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Voiture
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations?.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{reservation.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reservation.client?.email || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reservation.car?.brand} {reservation.car?.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(reservation.startDate), 'dd/MM/yyyy')} -{' '}
                    {format(new Date(reservation.endDate), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(reservation.montantTotal || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusColor(reservation.statut)}>
                      {reservation.statut}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleViewDetails(reservation)}
                        className="text-primary hover:text-blue-600"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                      <select
                        value={reservation.statut}
                        onChange={(e) =>
                          handleStatusChange(reservation.id, e.target.value)
                        }
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="EN_ATTENTE">EN_ATTENTE</option>
                        <option value="CONFIRMEE">CONFIRMEE</option>
                        <option value="EN_COURS">EN_COURS</option>
                        <option value="TERMINEE">TERMINEE</option>
                        <option value="ANNULEE">ANNULEE</option>
                      </select>
                      <button
                        onClick={() => handleDelete(reservation.id)}
                        className="text-danger hover:text-red-600"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={!!selectedReservation}
        onClose={() => setSelectedReservation(null)}
        title="Détails de la réservation"
        size="lg"
      >
        {selectedReservation && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">ID</h3>
              <p className="text-gray-600">#{selectedReservation.id}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Client</h3>
              <p className="text-gray-600">
                {selectedReservation.client?.prenom}{' '}
                {selectedReservation.client?.nom}
              </p>
              <p className="text-gray-600">{selectedReservation.client?.email}</p>
            </div>
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
                Du {format(new Date(selectedReservation.startDate), 'dd/MM/yyyy')} au{' '}
                {format(new Date(selectedReservation.endDate), 'dd/MM/yyyy')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Statut</h3>
              <Badge variant={getStatusColor(selectedReservation.statut)}>
                {selectedReservation.statut}
              </Badge>
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
  );
};

export default AdminReservations;

