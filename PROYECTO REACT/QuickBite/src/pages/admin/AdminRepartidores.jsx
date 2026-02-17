import { useState, useEffect } from 'react';
import { repartidorService } from '../../services/api';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

const AdminRepartidores = () => {
  const [repartidores, setRepartidores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    email: '',
    vehiculo: '',
    matricula: '',
    activo: true
  });

  useEffect(() => {
    fetchRepartidores();
  }, []);

  const fetchRepartidores = async () => {
    try {
      setLoading(true);
      const response = await repartidorService.getAll(0, 100);
      setRepartidores(response.data.content);
    } catch (err) {
      setError('Error al cargar repartidores');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await repartidorService.update(editingId, formData);
      } else {
        await repartidorService.create(formData);
      }
      fetchRepartidores();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    }
  };

  const handleEdit = (repartidor) => {
    setEditingId(repartidor.id);
    setFormData({
      nombre: repartidor.nombre,
      apellidos: repartidor.apellidos || '',
      telefono: repartidor.telefono,
      email: repartidor.email,
      vehiculo: repartidor.vehiculo || '',
      matricula: repartidor.matricula || '',
      activo: repartidor.activo
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este repartidor?')) return;
    try {
      await repartidorService.delete(id);
      fetchRepartidores();
    } catch (err) {
      setError('Error al eliminar');
    }
  };

  const toggleActivo = async (id, activo) => {
    try {
      await repartidorService.cambiarEstado(id, !activo);
      fetchRepartidores();
    } catch (err) {
      setError('Error al cambiar estado');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      nombre: '',
      apellidos: '',
      telefono: '',
      email: '',
      vehiculo: '',
      matricula: '',
      activo: true
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Repartidores</h1>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary flex items-center"
          >
            <FaPlus className="mr-2" />
            Nuevo Repartidor
          </button>
        </div>

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehículo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matrícula</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {repartidores.map((repartidor) => (
                  <tr key={repartidor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {repartidor.nombre} {repartidor.apellidos}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {repartidor.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {repartidor.telefono}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {repartidor.vehiculo || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {repartidor.matricula || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleActivo(repartidor.id, repartidor.activo)}
                        className="focus:outline-none"
                      >
                        {repartidor.activo ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            <FaCheck className="mr-1 mt-0.5" /> Activo
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            <FaTimes className="mr-1 mt-0.5" /> Inactivo
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(repartidor)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(repartidor.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {editingId ? 'Editar Repartidor' : 'Nuevo Repartidor'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Nombre *</label>
                      <input
                        type="text"
                        required
                        minLength="2"
                        maxLength="100"
                        className="input"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="label">Apellidos</label>
                      <input
                        type="text"
                        maxLength="100"
                        className="input"
                        value={formData.apellidos}
                        onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Email *</label>
                    <input
                      type="email"
                      required
                      className="input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">Teléfono *</label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{9}"
                      placeholder="123456789"
                      className="input"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Vehículo</label>
                      <input
                        type="text"
                        maxLength="50"
                        placeholder="Ej: Moto, Bicicleta"
                        className="input"
                        value={formData.vehiculo}
                        onChange={(e) => setFormData({ ...formData, vehiculo: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="label">Matrícula</label>
                      <input
                        type="text"
                        maxLength="20"
                        placeholder="Ej: 1234ABC"
                        className="input"
                        value={formData.matricula}
                        onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="activo"
                      className="mr-2"
                      checked={formData.activo}
                      onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                    />
                    <label htmlFor="activo" className="text-sm font-medium">Activo</label>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button type="submit" className="flex-1 btn btn-primary">
                      {editingId ? 'Actualizar' : 'Crear'}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 btn btn-secondary"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRepartidores;