import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '../../services/paymentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Badge from '../../components/common/Badge';
import StatCard from '../../components/common/StatCard';
import { FiDollarSign, FiRefreshCw, FiCheck } from 'react-icons/fi';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const AdminPayments = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');

  const { data: payments, isLoading, error } = useQuery({
    queryKey: ['admin-payments', statusFilter],
    queryFn: async () => {
      const all = await paymentService.getAllPayments();
      if (statusFilter) {
        return all.filter((p) => p.statut === statusFilter);
      }
      return all;
    },
  });

  const { data: revenue } = useQuery({
    queryKey: ['admin-revenue'],
    queryFn: () => paymentService.getTotalRevenue(),
  });

  const refundMutation = useMutation({
    mutationFn: (id) => paymentService.refundPayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-payments']);
      toast.success('Remboursement effectué');
    },
  });

  const confirmMutation = useMutation({
    mutationFn: (id) => paymentService.confirmPayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-payments']);
      toast.success('Paiement confirmé');
    },
  });

  const getStatusColor = (statut) => {
    const colors = {
      EN_ATTENTE: 'warning',
      EN_COURS: 'primary',
      REUSSI: 'success',
      ECHOUE: 'danger',
      REMBOURSE: 'default',
    };
    return colors[statut] || 'default';
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des paiements</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field w-48"
        >
          <option value="">Tous les statuts</option>
          <option value="EN_ATTENTE">En attente</option>
          <option value="EN_COURS">En cours</option>
          <option value="REUSSI">Réussi</option>
          <option value="ECHOUE">Échoué</option>
          <option value="REMBOURSE">Remboursé</option>
        </select>
      </div>

      {/* Revenue Card */}
      <div className="mb-8">
        <StatCard
          title="Revenus Totaux"
          value={
            new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR',
            }).format(revenue?.total || 0)
          }
          icon={FiDollarSign}
          iconColor="text-success"
        />
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
                  Réservation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Méthode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments?.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{payment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{payment.rentalId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(payment.montant || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.methodePaiement}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusColor(payment.statut)}>
                      {payment.statut}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.datePaiement
                      ? format(new Date(payment.datePaiement), 'dd/MM/yyyy')
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {payment.statut === 'EN_ATTENTE' && (
                        <button
                          onClick={() => confirmMutation.mutate(payment.id)}
                          className="text-success hover:text-green-600"
                          title="Confirmer"
                        >
                          <FiCheck className="w-5 h-5" />
                        </button>
                      )}
                      {payment.statut === 'REUSSI' && (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                'Êtes-vous sûr de vouloir rembourser ce paiement ?'
                              )
                            ) {
                              refundMutation.mutate(payment.id);
                            }
                          }}
                          className="text-warning hover:text-orange-600"
                          title="Rembourser"
                        >
                          <FiRefreshCw className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;

