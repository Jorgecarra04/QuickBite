import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { pedidoService, clienteService } from '../services/api';
import { FaShoppingCart, FaMapMarkerAlt } from 'react-icons/fa';

const RealizarPedido = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { carrito, restaurante } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cliente, setCliente] = useState(null);
  const [formData, setFormData] = useState({
    direccionEntrega: '',
    ciudadEntrega: '',
    codigoPostalEntrega: '',
    provinciaEntrega: '',
    paisEntrega: 'España',
    observaciones: ''
  });

  useEffect(() => {
    if (!carrito || carrito.length === 0) {
      navigate('/restaurantes');
      return;
    }
    fetchCliente();
  }, []);

  const fetchCliente = async () => {
    try {
      const response = await clienteService.getMiPerfil();
      setCliente(response.data);
      // Pre-llenar el formulario con los datos del cliente
      if (response.data.direccion) {
        setFormData(prev => ({
          ...prev,
          direccionEntrega: response.data.direccion || '',
          ciudadEntrega: response.data.ciudad || '',
          codigoPostalEntrega: response.data.codigoPostal || '',
          provinciaEntrega: response.data.provincia || '',
          paisEntrega: response.data.pais || 'España'
        }));
      }
    } catch (err) {
      console.error('Error al cargar perfil:', err);
    }
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const pedidoData = {
        ...formData,
        detalles: carrito.map(item => ({
          productoId: item.id,
          cantidad: item.cantidad
        }))
      };

      await pedidoService.create(pedidoData);
      navigate('/mis-pedidos', { 
        state: { mensaje: 'Pedido realizado con éxito' } 
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al realizar el pedido');
    } finally {
      setLoading(false);
    }
  };

  if (!carrito) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Confirmar Pedido
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de dirección */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              Dirección de Entrega
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Dirección</label>
                <input
                  type="text"
                  name="direccionEntrega"
                  required
                  minLength="5"
                  maxLength="300"
                  className="input"
                  placeholder="Calle, número, piso..."
                  value={formData.direccionEntrega}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Ciudad</label>
                  <input
                    type="text"
                    name="ciudadEntrega"
                    required
                    maxLength="100"
                    className="input"
                    value={formData.ciudadEntrega}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="label">Código Postal</label>
                  <input
                    type="text"
                    name="codigoPostalEntrega"
                    required
                    pattern="[0-9]{5}"
                    className="input"
                    placeholder="12345"
                    value={formData.codigoPostalEntrega}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="label">Provincia</label>
                <input
                  type="text"
                  name="provinciaEntrega"
                  required
                  maxLength="100"
                  className="input"
                  value={formData.provinciaEntrega}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="label">País</label>
                <input
                  type="text"
                  name="paisEntrega"
                  maxLength="100"
                  className="input"
                  value={formData.paisEntrega}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="label">Observaciones (opcional)</label>
                <textarea
                  name="observaciones"
                  maxLength="500"
                  rows="3"
                  className="input"
                  placeholder="Instrucciones especiales para el repartidor..."
                  value={formData.observaciones}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary text-lg py-3"
              >
                {loading ? 'Procesando...' : 'Confirmar Pedido'}
              </button>
            </form>
          </div>

          {/* Resumen del pedido */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FaShoppingCart className="mr-2" />
                Resumen del Pedido
              </h2>

              <div className="mb-4 pb-4 border-b">
                <p className="font-semibold">{restaurante?.nombre}</p>
                <p className="text-sm text-gray-500">{restaurante?.direccion}</p>
              </div>

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

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">
                    €{calcularTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="card bg-blue-50">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Un repartidor será asignado automáticamente a tu pedido. 
                Recibirás actualizaciones del estado de tu entrega.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealizarPedido;