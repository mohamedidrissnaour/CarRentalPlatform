import { Link } from 'react-router-dom';
import { FiTruck, FiUsers, FiCalendar } from 'react-icons/fi';
import Badge from '../common/Badge';

const CarCard = ({ car }) => {
  const getCategoryColor = (category) => {
    const colors = {
      ECONOMIQUE: 'default',
      CONFORT: 'primary',
      LUXE: 'warning',
    };
    return colors[category] || 'default';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {car.imageUrl ? (
          <img
            src={car.imageUrl}
            alt={car.brand + ' ' + car.model}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiTruck className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant={getCategoryColor(car.categorie)}>
            {car.categorie}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {car.brand} {car.model}
        </h3>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <FiCalendar className="w-4 h-4" />
            <span>Année: {car.year}</span>
          </div>

        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-primary">
              {formatPrice(car.pricePerDay)}
            </p>
            <p className="text-xs text-gray-500">par jour</p>
          </div>
          <Link
            to={`/cars/${car.id}`}
            className="btn-primary"
          >
            Voir détails
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;

