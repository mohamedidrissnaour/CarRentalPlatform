import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '../../services/clientService';
import { rentalService } from '../../services/rentalService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { useForm } from 'react-hook-form';
import { FiEdit, FiTrash2, FiEye, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AdminClients = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [viewingClient, setViewingClient] = useState(null);
  const [clientReservations, setClientReservations] = useState([]);
  const queryClient = useQueryClient();

  const { data: clients, isLoading, error } = useQuery({
    queryKey: ['admin-clients'],
    queryFn: () => clientService.getAllClients(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => clientService.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-clients']);
      toast.success('Client modifié avec succès');
      setIsModalOpen(false);
      setEditingClient(null);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => clientService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-clients']);
      toast.success('Client supprimé avec succès');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    updateMutation.mutate({ id: editingClient.id, data });
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    reset(client);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewReservations = async (clientId) => {
    try {
      const reservations = await rentalService.getReservationsByClient(clientId);
      setClientReservations(reservations);
      const client = clients.find((c) => c.id === clientId);
      setViewingClient(client);
    } catch (error) {
      toast.error('Erreur lors du chargement des réservations');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des clients</h1>

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
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients?.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {client.prenom} {client.nom}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.telephone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleViewReservations(client.id)}
                        className="text-primary hover:text-blue-600"
                        title="Voir réservations"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(client)}
                        className="text-primary hover:text-blue-600"
                      >
                        <FiEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
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

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClient(null);
          reset();
        }}
        title="Modifier le client"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
                required: "L'email est requis",
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
              {...register('adresse', { required: "L'adresse est requise" })}
              className="input-field"
            />
            {errors.adresse && (
              <p className="text-danger text-sm mt-1">{errors.adresse.message}</p>
            )}
          </div>
          <div className="flex gap-4">
            <button type="submit" className="btn-primary flex-1">
              Modifier
            </button>
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingClient(null);
                reset();
              }}
              className="btn-secondary flex-1"
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal>

      {/* Reservations Modal */}
      <Modal
        isOpen={!!viewingClient}
        onClose={() => {
          setViewingClient(null);
          setClientReservations([]);
        }}
        title={`Réservations de ${viewingClient?.prenom} ${viewingClient?.nom}`}
        size="lg"
      >
        <div className="space-y-4">
          {clientReservations.length === 0 ? (
            <p className="text-gray-500">Aucune réservation</p>
          ) : (
            clientReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">Réservation #{reservation.id}</p>
                    <p className="text-sm text-gray-600">
                      {reservation.car?.brand} {reservation.car?.model}
                    </p>
                  </div>
                  <Badge
                    variant={
                      reservation.statut === 'CONFIRMEE'
                        ? 'success'
                        : reservation.statut === 'EN_ATTENTE'
                        ? 'warning'
                        : 'default'
                    }
                  >
                    {reservation.statut}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Du {new Date(reservation.startDate).toLocaleDateString('fr-FR')} au{' '}
                  {new Date(reservation.endDate).toLocaleDateString('fr-FR')}
                </p>
                {reservation.montantTotal && (
                  <p className="text-sm font-semibold mt-2">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(reservation.montantTotal)}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AdminClients;

