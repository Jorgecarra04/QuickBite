import { useState, useEffect } from 'react';
import { pedidoService, repartidorService } from '../../services/api';
import { FaBoxOpen, FaClock, FaTruck, FaCheckCircle, FaTimesCircle, FaEye } from 'react-icons/fa';

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [repartidores, setRepartidores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pedRes, repRes] = await Promise.all([
        pedidoService.getAll(0, 100),
        repartidorService.getActivos(0, 100)
      ]);
      setPedidos(pedRes.data.content);
      setRepartidores(repRes.data.content);
    } catch (err) {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
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

  const handleEstadoChange = async (pedidoId, nuevoEstado) => {
    try {
      await pedidoService.actualizarEstado(pedidoId, nuevoEstado);
      fetchData();
      setError('');
    } catch (err) {
      setError('Error al actualizar estado');
    }
  };

  const handleAsignarRepartidor = async (pedidoId, repartidorId) => {
    try {
      await pedidoService.asignarRepartidor(pedidoId, repartidorId);
      fetchData();
      setError('');
    } catch (err) {
      setError('Error al asignar repartidor');
    }
  };

  const verDetalle = async (pedidoId) => {
    try {
      const response = await pedidoService.getById(pedidoId);
      setSelectedPedido(response.data);
      setShowModal(true);
    } catch (err) {
      setError('Error al cargar detalle');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestión de Pedidos</h1>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Repartidor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{pedido.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pedido.clienteNombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      €{pedido.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={pedido.estado}
                        onChange={(e) => handleEstadoChange(pedido.id, e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="EN_PREPARACION">En Preparación</option>
                        <option value="EN_CAMINO">En Camino</option>
                        <option value="ENTREGADO">Entregado</option>
                        <option value="CANCELADO">Cancelado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pedido.repartidorNombre ? (
                        pedido.repartidorNombre
                      ) : (
                        <select
                          onChange={(e) => handleAsignarRepartidor(pedido.id, e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                          defaultValue=""
                        >
                          <option value="">Asignar...</option>
                          {repartidores.map(rep => (
                            <option key={rep.id} value={rep.id}>{rep.nombre}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pedido.fechaPedido}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => verDetalle(pedido.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Detalle */}
        {showModal && selectedPedido && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Pedido #{selectedPedido.id}</h2>
                    <p className="text-gray-500">{selectedPedido.fechaPedido}</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Cliente</h3>
                    <p>{selectedPedido.clienteNombre}</p>
                    <p className="text-sm text-gray-500">{selectedPedido.clienteEmail}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Dirección de Entrega</h3>
                    <p>{selectedPedido.direccionEntrega}</p>
                    <p className="text-sm text-gray-500">
                      {selectedPedido.ciudadEntrega}, {selectedPedido.codigoPostalEntrega}
                    </p>
                  </div>

                  {selectedPedido.repartidorNombre && (
                    <div>
                      <h3 className="font-semibold mb-2">Repartidor</h3>
                      <p>{selectedPedido.repartidorNombre}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold mb-3">Productos</h3>
                    {selectedPedido.detalles.map((detalle, index) => (
                      <div key={index} className="flex justify-between py-2 border-b">
                        <div>
                          <p className="font-medium">{detalle.productoNombre}</p>
                          <p className="text-sm text-gray-500">
                            {detalle.cantidad} x €{detalle.precioUnitario.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold">€{detalle.subtotal.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span>€{selectedPedido.total.toFixed(2)}</span>
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

export default AdminPedidos;