import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restauranteService } from '../services/api';
import { FaClock, FaStar } from 'react-icons/fa';

const Restaurantes = () => {
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurantes();
  }, [page]);

  const fetchRestaurantes = async () => {
    try {
      setLoading(true);
      const response = await restauranteService.getAll(page, 12);
      setRestaurantes(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Error al cargar los restaurantes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-black border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Restaurantes</h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {restaurantes.map((restaurante) => (
            <div
              key={restaurante.id}
              className="bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/restaurantes/${restaurante.id}`)}
            >
              <div className="relative h-40">
                {restaurante.imagenUrl ? (
                  <img
                    src={restaurante.imagenUrl}
                    alt={restaurante.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-400">
                      {restaurante.nombre.charAt(0)}
                    </span>
                  </div>
                )}
                {!restaurante.activo && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">Cerrado</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">
                  {restaurante.nombre}
                </h3>
                
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="font-medium">4.5</span>
                  <span className="mx-1">•</span>
                  <FaClock className="mr-1" />
                  <span>25-35 min</span>
                </div>

                <p className="text-sm text-gray-500 truncate">
                  {restaurante.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === index
                      ? 'z-10 bg-black border-black text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
                className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurantes;