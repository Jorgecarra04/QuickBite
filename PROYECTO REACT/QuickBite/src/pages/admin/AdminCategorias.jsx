import { useState, useEffect } from 'react';
import { categoriaService } from '../../services/api';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const AdminCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const response = await categoriaService.getAll();
      setCategorias(response.data);
    } catch (err) {
      setError('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await categoriaService.update(editingId, formData);
      } else {
        await categoriaService.create(formData);
      }
      fetchCategorias();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    }
  };

  const handleEdit = (categoria) => {
    setEditingId(categoria.id);
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;
    try {
      await categoriaService.delete(id);
      fetchCategorias();
    } catch (err) {
      setError('Error al eliminar');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      nombre: '',
      descripcion: ''
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Categorías</h1>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary flex items-center"
          >
            <FaPlus className="mr-2" />
            Nueva Categoría
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
            {categorias.map((categoria) => (
              <div key={categoria.id} className="card">
                <h3 className="text-lg font-bold mb-2">{categoria.nombre}</h3>
                <p className="text-gray-600 text-sm mb-4">{categoria.descripcion}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(categoria)}
                    className="flex-1 btn btn-secondary flex items-center justify-center"
                  >
                    <FaEdit className="mr-1" /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(categoria.id)}
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
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <label className="label">Descripción</label>
                    <textarea
                      maxLength="300"
                      rows="3"
                      className="input"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    />
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

export default AdminCategorias;