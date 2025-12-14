import { format } from 'date-fns';
import { FiCalendar, FiTruck, FiDollarSign } from 'react-icons/fi';
import Badge from '../common/Badge';

const BookingCard = ({ reservation, onViewDetails, onCancel }) => {
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (date) => {
    try {
      return format(new Date(date), 'dd MMM yyyy');
    } catch (error) {
      return new Date(date).toLocaleDateString('fr-FR');
    }
  };

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Réservation #{reservation.id}
          </h3>
          <Badge variant={getStatusColor(reservation.statut)}>
            {reservation.statut}
          </Badge>
        </div>
        {reservation.montantTotal && (
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              {formatPrice(reservation.montantTotal)}
            </p>
          </div>
        )}
      </div>
      <div className="space-y-3 mb-4">
        {reservation.car && (
          <div className="flex items-center gap-2 text-gray-600">
            <FiTruck className="w-4 h-4" />
            <span>
              {reservation.car.brand} {reservation.car.model}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-600">
          <FiCalendar className="w-4 h-4" />
          <span>
            Du {formatDate(reservation.startDate)} au{' '}
            {formatDate(reservation.endDate)}
          </span>
        </div>
        {reservation.montantTotal && (
          <div className="flex items-center gap-2 text-gray-600">
            <FiDollarSign className="w-4 h-4" />
            <span>Prix total: {formatPrice(reservation.montantTotal)}</span>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        {onViewDetails && (
          <button onClick={() => onViewDetails(reservation)} className="btn-secondary flex-1">
            Voir détails
          </button>
        )}
        {onCancel &&
          reservation.statut === 'EN_ATTENTE' && (
            <button
              onClick={() => onCancel(reservation.id)}
              className="btn-danger flex-1"
            >
              Annuler
            </button>
          )}
      </div>
    </div>
  );
};

export default BookingCard;

