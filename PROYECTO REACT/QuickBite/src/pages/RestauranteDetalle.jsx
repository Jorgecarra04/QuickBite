import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restauranteService, productoService, categoriaService } from '../services/api';
import { FaMapMarkerAlt, FaPhone, FaShoppingCart, FaPlus, FaMinus } from 'react-icons/fa';

const RestauranteDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurante, setRestaurante] = useState(null);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [id, categoriaSeleccionada]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('=== CARGANDO RESTAURANTE ===');
      console.log('ID del restaurante:', id);
      console.log('Categoría seleccionada:', categoriaSeleccionada);
      
      // Cargar restaurante
      const restResponse = await restauranteService.getById(id);
      console.log('✅ Restaurante cargado:', restResponse.data);
      setRestaurante(restResponse.data);
      
      // Cargar productos FILTRADOS por este restaurante
      console.log('Cargando productos con filtro...');
      console.log('Parámetros: restauranteId=', id, ', categoriaId=', categoriaSeleccionada, ', disponible=true');
      
      const prodResponse = await productoService.filtrar(
        parseInt(id),           // restauranteId
        categoriaSeleccionada,  // categoriaId (puede ser null)
        true,                   // solo productos disponibles
        0,                      // página
        50                      // tamaño
      );
      
      console.log('📦 Respuesta de productos:', prodResponse.data);
      const productosData = prodResponse.data.content || prodResponse.data || [];
      console.log('✅ Productos filtrados:', productosData.length, 'productos');
      console.log('Productos:', productosData);
      setProductos(productosData);
      
      // Cargar categorías
      const catResponse = await categoriaService.getAll();
      console.log('✅ Categorías cargadas:', catResponse.data.length, 'categorías');
      setCategorias(catResponse.data || []);
      
    } catch (err) {
      console.error('❌ ERROR AL CARGAR:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      let errorMsg = 'Error al cargar datos del restaurante';
      
      if (err.response) {
        if (err.response.status === 404) {
          errorMsg = 'Restaurante no encontrado';
        } else {
          errorMsg = `Error ${err.response.status}: ${err.response.data?.message || err.response.statusText}`;
        }
      } else if (err.request) {
        errorMsg = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo en puerto 8080.';
      } else {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find(item => item.id === producto.id);
    if (existe) {
      setCarrito(carrito.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const quitarDelCarrito = (productoId) => {
    const existe = carrito.find(item => item.id === productoId);
    if (existe.cantidad === 1) {
      setCarrito(carrito.filter(item => item.id !== productoId));
    } else {
      setCarrito(carrito.map(item =>
        item.id === productoId
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      ));
    }
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const realizarPedido = () => {
    if (carrito.length === 0) return;
    navigate('/realizar-pedido', { state: { carrito, restaurante } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos del restaurante...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-red-50 border-2 border-red-400 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="space-y-2">
              <button
                onClick={() => fetchData()}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reintentar
              </button>
              <button
                onClick={() => navigate('/restaurantes')}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Volver a restaurantes
              </button>
            </div>
            <div className="mt-4 p-3 bg-white rounded border border-red-200">
              <p className="text-xs text-gray-600 font-mono">
                Abre la consola (F12) para ver detalles técnicos
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del restaurante */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {restaurante?.nombre}
              </h1>
              <p className="text-gray-600 mb-4">{restaurante?.descripcion}</p>
              <div className="space-y-1 text-sm text-gray-500">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{restaurante?.direccion}</span>
                </div>
                <div className="flex items-center">
                  <FaPhone className="mr-2" />
                  <span>{restaurante?.telefono}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Productos */}
          <div className="lg:col-span-2">
            {/* Filtro por categoría */}
            {categorias.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                <button
                  onClick={() => setCategoriaSeleccionada(null)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    categoriaSeleccionada === null
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  } border border-gray-300`}
                >
                  Todos
                </button>
                {categorias.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoriaSeleccionada(cat.id)}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      categoriaSeleccionada === cat.id
                        ? 'bg-orange-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    } border border-gray-300`}
                  >
                    {cat.nombre}
                  </button>
                ))}
              </div>
            )}

            {/* Lista de productos */}
            {productos.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-500 text-lg mb-2">
                  No hay productos disponibles
                </p>
                <p className="text-gray-400 text-sm">
                  {categoriaSeleccionada 
                    ? 'Intenta seleccionar otra categoría o "Todos"' 
                    : 'Este restaurante aún no tiene productos disponibles.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {productos.map(producto => {
                  const enCarrito = carrito.find(item => item.id === producto.id);
                  return (
                    <div key={producto.id} className="card flex justify-between items-center hover:shadow-lg transition-shadow">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{producto.nombre}</h3>
                        <p className="text-gray-600 text-sm">{producto.descripcion}</p>
                        <p className="text-orange-600 font-bold mt-2">
                          €{producto.precio.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Stock: {producto.stock}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {enCarrito ? (
                          <>
                            <button
                              onClick={() => quitarDelCarrito(producto.id)}
                              className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition-colors"
                            >
                              <FaMinus />
                            </button>
                            <span className="font-bold w-8 text-center">
                              {enCarrito.cantidad}
                            </span>
                            <button
                              onClick={() => agregarAlCarrito(producto)}
                              disabled={enCarrito.cantidad >= producto.stock}
                              className="bg-orange-100 text-orange-600 p-2 rounded-full hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <FaPlus />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => agregarAlCarrito(producto)}
                            disabled={producto.stock === 0}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                          >
                            Agregar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Carrito */}
          <div className="lg:col-span-1">
            <div className="card sticky top-20">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FaShoppingCart className="mr-2 text-orange-600" />
                Tu Pedido
              </h2>
              
              {carrito.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  El carrito está vacío
                </p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {carrito.map(item => (
                      <div key={item.id} className="flex justify-between items-start text-sm">
                        <div className="flex-1">
                          <p className="font-medium">{item.nombre}</p>
                          <p className="text-gray-500">
                            {item.cantidad} x €{item.precio.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-bold">
                          €{(item.precio * item.cantidad).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span className="text-orange-600">
                        €{calcularTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={realizarPedido}
                    className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                  >
                    Realizar Pedido
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestauranteDetalle;