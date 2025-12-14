import { useQuery } from '@tanstack/react-query';
import { carService } from '../../services/carService';
import { rentalService } from '../../services/rentalService';
import { paymentService } from '../../services/paymentService';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  FiTruck,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const { data: cars, isLoading: carsLoading } = useQuery({
    queryKey: ['admin-cars'],
    queryFn: () => carService.getAllCars(),
  });

  const { data: reservations, isLoading: reservationsLoading } = useQuery({
    queryKey: ['admin-reservations'],
    queryFn: () => rentalService.getAllReservations(),
  });

  const { data: revenue, isLoading: revenueLoading } = useQuery({
    queryKey: ['admin-revenue'],
    queryFn: () => paymentService.getTotalRevenue(),
  });

  const availableCars = cars?.filter((car) => car.disponible) || [];
  const occupiedCars = cars?.filter((car) => !car.disponible) || [];
  const occupancyRate =
    cars?.length > 0 ? ((occupiedCars.length / cars.length) * 100).toFixed(1) : 0;

  // Données pour les graphiques (simulées)
  const revenueData = [
    { name: 'Lun', revenus: 1200 },
    { name: 'Mar', revenus: 1900 },
    { name: 'Mer', revenus: 1500 },
    { name: 'Jeu', revenus: 2100 },
    { name: 'Ven', revenus: 1800 },
    { name: 'Sam', revenus: 2500 },
    { name: 'Dim', revenus: 2200 },
  ];

  const popularCarsData = [
    { name: 'BMW Série 3', reservations: 45 },
    { name: 'Mercedes Classe C', reservations: 38 },
    { name: 'Audi A4', reservations: 32 },
    { name: 'Peugeot 308', reservations: 28 },
  ];

  const categoryData = [
    { name: 'Économique', value: 40 },
    { name: 'Confort', value: 35 },
    { name: 'Luxe', value: 25 },
  ];

  const COLORS = ['#3B82F6', '#6366F1', '#F59E0B'];

  if (carsLoading || reservationsLoading || revenueLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Voitures"
          value={cars?.length || 0}
          icon={FiTruck}
          iconColor="text-primary"
        />
        <StatCard
          title="Voitures Disponibles"
          value={availableCars.length}
          icon={FiTruck}
          iconColor="text-success"
        />
        <StatCard
          title="Taux d'occupation"
          value={`${occupancyRate}%`}
          icon={FiTrendingUp}
          iconColor="text-warning"
        />
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Revenus par jour</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenus"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Popular Cars Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Voitures les plus populaires</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={popularCarsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="reservations" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Répartition par catégorie</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;

