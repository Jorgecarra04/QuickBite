import { useState, useEffect } from 'react';
import { productoService, restauranteService, categoriaService } from '../../services/api';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [restaurantes, setRestaurantes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    disponible: true,
    restauranteId: '',
    categoriaId: '',
    imagenUrl: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, restRes, catRes] = await Promise.all([
        productoService.getAll(0, 100),
        restauranteService.getAll(0, 100),
        categoriaService.getAll()
      ]);
      setProductos(prodRes.data.content);
      setRestaurantes(restRes.data.content);
      setCategorias(catRes.data);
    } catch (err) {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        restauranteId: parseInt(formData.restauranteId),
        categoriaId: parseInt(formData.categoriaId)
      };

      if (editingId) {
        await productoService.update(editingId, data);
      } else {
        await productoService.create(data);
      }
      fetchData();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    }
  };

  const handleEdit = (producto) => {
    setEditingId(producto.id);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      disponible: producto.disponible,
      restauranteId: producto.restauranteId,
      categoriaId: producto.categoriaId,
      imagenUrl: producto.imagenUrl || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await productoService.delete(id);
      fetchData();
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
      precio: '',
      stock: '',
      disponible: true,
      restauranteId: '',
      categoriaId: '',
      imagenUrl: ''
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary flex items-center"
          >
            <FaPlus className="mr-2" />
            Nuevo Producto
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Restaurante</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{producto.nombre}</div>
                      <div className="text-sm text-gray-500">{producto.descripcion?.substring(0, 50)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {producto.restauranteNombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {producto.categoriaNombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €{producto.precio.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {producto.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {producto.disponible ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          <FaCheck className="mr-1 mt-0.5" /> Disponible
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          <FaTimes className="mr-1 mt-0.5" /> No disponible
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(producto)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(producto.id)}
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
                  {editingId ? 'Editar Producto' : 'Nuevo Producto'}
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
                    <label className="label">Descripción</label>
                    <textarea
                      maxLength="500"
                      rows="3"
                      className="input"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Precio (€) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        className="input"
                        value={formData.precio}
                        onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="label">Stock *</label>
                      <input
                        type="number"
                        min="0"
                        required
                        className="input"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Restaurante *</label>
                    <select
                      required
                      className="input"
                      value={formData.restauranteId}
                      onChange={(e) => setFormData({ ...formData, restauranteId: e.target.value })}
                    >
                      <option value="">Seleccionar...</option>
                      {restaurantes.map(rest => (
                        <option key={rest.id} value={rest.id}>{rest.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Categoría *</label>
                    <select
                      required
                      className="input"
                      value={formData.categoriaId}
                      onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                    >
                      <option value="">Seleccionar...</option>
                      {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                      ))}
                    </select>
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
                      id="disponible"
                      className="mr-2"
                      checked={formData.disponible}
                      onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })}
                    />
                    <label htmlFor="disponible" className="text-sm font-medium">Disponible</label>
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

export default AdminProductos;