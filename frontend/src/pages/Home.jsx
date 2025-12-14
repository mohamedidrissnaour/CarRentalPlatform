import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiTruck, FiShield, FiClock } from 'react-icons/fi';
import { carService } from '../services/carService';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CarCard from '../components/car/CarCard';
import DateRangePicker from '../components/booking/DateRangePicker';

const Home = () => {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({
    category: '',
    startDate: '',
    endDate: '',
  });

  const { data: popularCars, isLoading, error: carsError } = useQuery({
    queryKey: ['popularCars'],
    queryFn: async () => {
      try {
        const cars = await carService.getAllCars();
        return cars.slice(0, 6); // Prendre les 6 premières voitures
      } catch (error) {
        console.error('Erreur lors du chargement des voitures:', error);
        return []; // Retourner un tableau vide en cas d'erreur
      }
    },
    retry: false, // Ne pas réessayer en cas d'erreur
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchForm.category) params.append('category', searchForm.category);
    if (searchForm.startDate) params.append('startDate', searchForm.startDate);
    if (searchForm.endDate) params.append('endDate', searchForm.endDate);
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Trouvez la voiture parfaite pour votre voyage
            </h1>
            <p className="text-xl text-blue-100">
              Des milliers de véhicules disponibles à des prix compétitifs
            </p>
          </div>

          {/* Search Form */}
            <div className="max-w-4xl mx-auto">
                <form
                    onSubmit={handleSearch}
                    className="bg-white rounded-lg shadow-xl p-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Catégorie
                            </label>
                            <select
                                value={searchForm.category}
                                onChange={(e) =>
                                    setSearchForm({ ...searchForm, category: e.target.value })
                                }
                                className="input-field"
                            >
                                <option value="">Toutes les catégories</option>
                                <option value="ECONOMIQUE">Économique</option>
                                <option value="CONFORT">Confort</option>
                                <option value="LUXE">Luxe</option>
                            </select>
                        </div>
                        <DateRangePicker
                            startDate={searchForm.startDate}
                            endDate={searchForm.endDate}
                            onDateChange={(start, end) =>
                                setSearchForm({ ...searchForm, startDate: start, endDate: end })
                            }
                            className="md:col-span-2"
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
                        <FiSearch className="w-5 h-5" />
                        <span>Rechercher</span>
                    </button>
                </form>
            </div>
        </div>
      </section>

      {/* Popular Cars Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Voitures populaires
          </h2>
          {isLoading ? (
            <LoadingSpinner size="lg" className="py-12" />
          ) : carsError ? (
            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
              <ErrorMessage 
                message={
                  carsError?.response?.status === 0 || carsError?.code === 'ERR_NETWORK' || carsError?.message?.includes('Network Error')
                    ? "Impossible de se connecter au serveur. Assurez-vous que le backend est démarré."
                    : `Erreur lors du chargement: ${carsError?.message || 'Erreur inconnue'}`
                } 
              />
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Vérifiez que le service CAR-SERVICE est démarré sur le port 8081.</strong>
                </p>
              </div>
            </div>
          ) : popularCars && popularCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucune voiture disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Comment ça marche
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Recherchez</h3>
              <p className="text-gray-600">
                Trouvez la voiture qui correspond à vos besoins et à votre budget
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTruck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Réservez</h3>
              <p className="text-gray-600">
                Complétez votre réservation en quelques clics
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Profitez</h3>
              <p className="text-gray-600">
                Récupérez votre véhicule et profitez de votre voyage
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

