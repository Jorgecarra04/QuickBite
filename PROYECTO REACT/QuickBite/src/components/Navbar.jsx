import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaCog } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                QuickBite
              </span>
            </Link>
            
            {user && (
              <div className="hidden md:flex ml-10 space-x-8">
                <Link
                  to="/restaurantes"
                  className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Restaurantes
                </Link>
                <Link
                  to="/mis-pedidos"
                  className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Mis Pedidos
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    <FaCog className="text-sm" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                      <FaUser className="text-white text-xs" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:inline">{user.username}</span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Salir
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-sm font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;