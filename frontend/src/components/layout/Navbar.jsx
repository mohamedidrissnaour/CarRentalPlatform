import { Link, useNavigate } from 'react-router-dom';
import { FiTruck, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
              <FiTruck className="w-6 h-6" />
              <span>CarRental</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/cars"
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Voitures
              </Link>
              {user && (
                <Link
                  to="/my-bookings"
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  Mes réservations
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  Administration
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-gray-700">
                  <FiUser className="w-5 h-5" />
                  <span className="hidden sm:inline">{user.email}</span>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="p-2 text-gray-700 hover:text-primary transition-colors"
                    title="Administration"
                  >
                    <FiSettings className="w-5 h-5" />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-700 hover:text-danger transition-colors"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </button>
              </>
            ) : (
              <span className="text-gray-700 text-sm">
                Connectez-vous lors de la réservation
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

