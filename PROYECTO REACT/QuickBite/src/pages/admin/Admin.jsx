import { Link } from 'react-router-dom';
import { FaUtensils, FaBoxOpen, FaTruck, FaUsers, FaList, FaShoppingBag } from 'react-icons/fa';

const Admin = () => {
  const menuItems = [
    {
      title: 'Restaurantes',
      description: 'Gestionar restaurantes',
      icon: FaUtensils,
      link: '/admin/restaurantes',
      color: 'bg-blue-500'
    },
    {
      title: 'Productos',
      description: 'Gestionar productos',
      icon: FaShoppingBag,
      link: '/admin/productos',
      color: 'bg-green-500'
    },
    {
      title: 'Categorías',
      description: 'Gestionar categorías',
      icon: FaList,
      link: '/admin/categorias',
      color: 'bg-purple-500'
    },
    {
      title: 'Pedidos',
      description: 'Gestionar pedidos',
      icon: FaBoxOpen,
      link: '/admin/pedidos',
      color: 'bg-yellow-500'
    },
    {
      title: 'Repartidores',
      description: 'Gestionar repartidores',
      icon: FaTruck,
      link: '/admin/repartidores',
      color: 'bg-red-500'
    },
    {
      title: 'Clientes',
      description: 'Gestionar clientes',
      icon: FaUsers,
      link: '/admin/clientes',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600 mt-2">Gestiona todos los aspectos de QuickBite</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                to={item.link}
                className="card hover:shadow-xl transition-shadow group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`${item.color} p-4 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                    <Icon className="text-3xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Admin;