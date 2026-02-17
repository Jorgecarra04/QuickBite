import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pedidoService } from '../services/api';
import { FaBoxOpen, FaClock, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const MisPedidos = () => {
  const location = useLocation();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(location.state?.mensaje || '');
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchPedidos();
  }, [page]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const response = await pedidoService.getMisPedidos(page, 10);
      setPedidos(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const verDetalle = async (pedidoId) => {
    try {
      const response = await pedidoService.getById(pedidoId);
      setSelectedPedido(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      PENDIENTE: { icon: FaClock, color: 'yellow', text: 'Pendiente' },
      EN_PREPARACION: { icon: FaBoxOpen, color: 'blue', text: 'En Preparación' },
      EN_CAMINO: { icon: FaTruck, color: 'purple', text: 'En Camino' },
      ENTREGADO: { icon: FaCheckCircle, color: 'green', text: 'Entregado' },
      CANCELADO: { icon: FaTimesCircle, color: 'red', text: 'Cancelado' }
    };

    const badge = badges[estado] || badges.PENDIENTE;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-${badge.color}-100 text-${badge.color}-800`}>
        <Icon className="mr-1" />
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Mis Pedidos
        </h1>

        {mensaje && (
          <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {mensaje}
          </div>
        )}

        {pedidos.length === 0 ? (
          <div className="card text-center py-12">
            <FaBoxOpen className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No tienes pedidos aún</p>
            <p className="text-gray-400 mt-2">
              Explora nuestros restaurantes y realiza tu primer pedido
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Pedido #{pedido.id} - {pedido.fechaPedido}
                      </p>
                      <p className="font-semibold text-lg mt-1">
                        {pedido.clienteNombre}
                      </p>
                    </div>
                    {getEstadoBadge(pedido.estado)}
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-primary-600">
                        €{pedido.total.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => verDetalle(pedido.id)}
                      className="btn btn-secondary"
                    >
                      Ver Detalle
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  className="btn btn-secondary disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Página {page + 1} de {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="btn btn-secondary disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal de detalle */}
        {selectedPedido && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Detalle del Pedido #{selectedPedido.id}</h2>
                    <p className="text-gray-500">{selectedPedido.fechaPedido}</p>
                  </div>
                  <button
                    onClick={() => setSelectedPedido(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Estado */}
                  <div>
                    <h3 className="font-semibold mb-2">Estado</h3>
                    {getEstadoBadge(selectedPedido.estado)}
                  </div>

                  {/* Dirección de entrega */}
                  <div>
                    <h3 className="font-semibold mb-2">Dirección de Entrega</h3>
                    <p className="text-gray-700">{selectedPedido.direccionEntrega}</p>
                    <p className="text-gray-600 text-sm">
                      {selectedPedido.ciudadEntrega}, {selectedPedido.codigoPostalEntrega}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {selectedPedido.provinciaEntrega}, {selectedPedido.paisEntrega}
                    </p>
                  </div>

                  {/* Repartidor */}
                  {selectedPedido.repartidorNombre && (
                    <div>
                      <h3 className="font-semibold mb-2">Repartidor</h3>
                      <p className="text-gray-700">{selectedPedido.repartidorNombre}</p>
                      <p className="text-gray-600 text-sm">{selectedPedido.repartidorEmail}</p>
                    </div>
                  )}

                  {/* Productos */}
                  <div>
                    <h3 className="font-semibold mb-3">Productos</h3>
                    <div className="space-y-2">
                      {selectedPedido.detalles.map((detalle, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b">
                          <div>
                            <p className="font-medium">{detalle.productoNombre}</p>
                            <p className="text-sm text-gray-500">
                              {detalle.cantidad} x €{detalle.precioUnitario.toFixed(2)}
                            </p>
                          </div>
                          <p className="font-semibold">
                            €{detalle.subtotal.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Observaciones */}
                  {selectedPedido.observaciones && (
                    <div>
                      <h3 className="font-semibold mb-2">Observaciones</h3>
                      <p className="text-gray-700">{selectedPedido.observaciones}</p>
                    </div>
                  )}

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total</span>
                      <span className="text-primary-600">
                        €{selectedPedido.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisPedidos;