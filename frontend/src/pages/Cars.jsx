import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { carService } from '../services/carService';
import CarCard from '../components/car/CarCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SearchBar from '../components/common/SearchBar';
import { FiFilter, FiX } from 'react-icons/fi';

const Cars = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: '',
    sortBy: 'prix',
    sortOrder: 'asc',
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: cars, isLoading, error } = useQuery({
    queryKey: ['cars', filters],
    queryFn: async () => {
      try {
        return await carService.getAllCars();
      } catch (error) {
        console.error('Erreur lors du chargement des voitures:', error);
        throw error;
      }
    },
    retry: false, // Ne pas réessayer automatiquement
  });

  const filteredCars = cars
    ? cars
        .filter((car) => {
          if (filters.category && car.categorie !== filters.category) {
            return false;
          }
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
              car.brand.toLowerCase().includes(searchLower) ||
              car.model.toLowerCase().includes(searchLower)
            );
          }
          return true;
        })
        .sort((a, b) => {
          if (filters.sortBy === 'prix') {
            return filters.sortOrder === 'asc'
              ? a.pricePerDay - b.pricePerDay
              : b.pricePerDay - a.pricePerDay;
          }
          return 0;
        })
    : [];

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      sortBy: 'prix',
      sortOrder: 'asc',
    });
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Catalogue de voitures
          </h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                onSearch={(term) => handleFilterChange('search', term)}
                placeholder="Rechercher une voiture..."
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center gap-2"
            >
              <FiFilter className="w-5 h-5" />
              <span>Filtres</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filtres</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Réinitialiser
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Toutes</option>
                    <option value="ECONOMIQUE">Économique</option>
                    <option value="CONFORT">Confort</option>
                    <option value="LUXE">Luxe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trier par
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="input-field"
                  >
                    <option value="prix">Prix</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordre
                  </label>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                    className="input-field"
                  >
                    <option value="asc">Croissant</option>
                    <option value="desc">Décroissant</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" className="py-12" />
        ) : error ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <ErrorMessage 
              message={
                error?.response?.status === 0 || error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error')
                  ? "Impossible de se connecter au serveur. Assurez-vous que le backend est démarré sur le port 8081."
                  : error?.response?.status === 404
                  ? "L'endpoint API n'a pas été trouvé. Vérifiez la configuration du backend."
                  : error?.response?.status === 500
                  ? "Erreur serveur. Vérifiez les logs du backend."
                  : `Erreur lors du chargement des voitures: ${error?.message || 'Erreur inconnue'}`
              } 
            />
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Vérifications à faire :</strong>
              </p>
              <ul className="list-disc list-inside text-sm text-blue-600 mt-2 space-y-1">
                <li>Le service CAR-SERVICE est-il démarré sur le port 8081 ?</li>
                <li>L'URL de l'API est-elle correcte dans le fichier .env ?</li>
                <li>Y a-t-il des erreurs CORS dans la console du navigateur ?</li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              {filteredCars.length} voiture{filteredCars.length > 1 ? 's' : ''} trouvée{filteredCars.length > 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
            {filteredCars.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Aucune voiture ne correspond à vos critères
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Cars;

