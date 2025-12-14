import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';

// Pages publiques
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';

// Pages admin
import Dashboard from './pages/admin/Dashboard';
import AdminCars from './pages/admin/AdminCars';
import AdminReservations from './pages/admin/AdminReservations';
import AdminPayments from './pages/admin/AdminPayments';
import AdminClients from './pages/admin/AdminClients';

// Configuration React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Composant wrapper pour les routes (doit être à l'intérieur des providers)
const AppRoutes = () => {
  // Composant pour les routes publiques
  const PublicLayout = () => {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/cars/:id" element={<CarDetails />} />
            <Route path="/booking/:carId" element={<Booking />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    );
  };

  // Composant pour les routes admin
  const AdminLayout = () => {
    const { isAdmin } = useAuth();

    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }

    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <main>
            <Routes>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/cars" element={<AdminCars />} />
              <Route path="/admin/reservations" element={<AdminReservations />} />
              <Route path="/admin/payments" element={<AdminPayments />} />
              <Route path="/admin/clients" element={<AdminClients />} />
              <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    );
  };

  return (
    <Routes>
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="/*" element={<PublicLayout />} />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BookingProvider>
            <Router>
              <AppRoutes />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </Router>
          </BookingProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
