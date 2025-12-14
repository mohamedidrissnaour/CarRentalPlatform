import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiTruck,
  FiCalendar,
  FiCreditCard,
  FiUsers,
  FiBarChart2,
} from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: FiHome },
    { path: '/admin/cars', label: 'Voitures', icon: FiTruck },
    { path: '/admin/reservations', label: 'Réservations', icon: FiCalendar },
    { path: '/admin/payments', label: 'Paiements', icon: FiCreditCard },
    { path: '/admin/clients', label: 'Clients', icon: FiUsers },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0 pt-16">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

