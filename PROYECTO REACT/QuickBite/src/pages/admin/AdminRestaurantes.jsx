import { useState, useEffect } from 'react';
import { restauranteService } from '../../services/api';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

const AdminRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    direccion: '',
    telefono: '',
    imagenUrl: '',
    activo: true
  });

  useEffect(() => {
    fetchRestaurantes();
  }, []);

  const fetchRestaurantes = async () => {
    try {
      setLoading(true);
      const response = await restauranteService.getAll(0, 100);
      setRestaurantes(response.data.content);
    } catch (err) {
      setError('Error al cargar restaurantes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await restauranteService.update(editingId, formData);
      } else {
        await restauranteService.create(formData);
      }
      fetchRestaurantes();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    }
  };

  const handleEdit = (restaurante) => {
    setEditingId(restaurante.id);
    setFormData(restaurante);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este restaurante?')) return;
    try {
      await restauranteService.delete(id);
      fetchRestaurantes();
    } catch (err) {
      setError('Error al eliminar');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      nombre: '',
      descripcion: '',
      direccion: '',
      telefono: '',
      imagenUrl: '',
      activo: true
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Restaurantes</h1>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary flex items-center"
          >
            <FaPlus className="mr-2" />
            Nuevo Restaurante
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurantes.map((restaurante) => (
              <div key={restaurante.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">{restaurante.nombre}</h3>
                  {restaurante.activo ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded flex items-center">
                      <FaCheck className="mr-1" /> Activo
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded flex items-center">
                      <FaTimes className="mr-1" /> Inactivo
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{restaurante.descripcion}</p>
                <p className="text-gray-500 text-sm mb-2">{restaurante.direccion}</p>
                <p className="text-gray-500 text-sm mb-4">{restaurante.telefono}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(restaurante)}
                    className="flex-1 btn btn-secondary flex items-center justify-center"
                  >
                    <FaEdit className="mr-1" /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(restaurante.id)}
                    className="flex-1 btn btn-danger flex items-center justify-center"
                  >
                    <FaTrash className="mr-1" /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {editingId ? 'Editar Restaurante' : 'Nuevo Restaurante'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label">Nombre *</label>
                    <input
                      type="text"
                      required
                      minLength="3"
                      maxLength="150"
                      className="input"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">Descripción *</label>
                    <textarea
                      required
                      maxLength="500"
                      rows="3"
                      className="input"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">Dirección *</label>
                    <input
                      type="text"
                      required
                      minLength="5"
                      maxLength="300"
                      className="input"
                      value={formData.direccion}
                      onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">Teléfono *</label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{9}"
                      className="input"
                      placeholder="123456789"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">URL de Imagen</label>
                    <input
                      type="url"
                      maxLength="500"
                      className="input"
                      placeholder="https://..."
                      value={formData.imagenUrl}
                      onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
                    />
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

export default AdminRestaurantes;