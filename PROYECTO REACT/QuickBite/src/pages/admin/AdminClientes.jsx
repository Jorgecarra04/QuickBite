import { useState, useEffect } from 'react';
import { clienteService } from '../../services/api';
import { FaSearch, FaEye, FaTrash } from 'react-icons/fa';

const AdminClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchClientes();
  }, [page]);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const response = await clienteService.getAll(page, 20);
      setClientes(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchText.trim()) {
      fetchClientes();
      return;
    }

    try {
      setLoading(true);
      const response = await clienteService.buscar(searchText, 0, 20);
      setClientes(response.data.content);
      setTotalPages(response.data.totalPages);
      setPage(0);
    } catch (err) {
      setError('Error al buscar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este cliente?')) return;
    try {
      await clienteService.delete(id);
      fetchClientes();
    } catch (err) {
      setError('Error al eliminar');
    }
  };

  const verDetalle = async (clienteId) => {
    try {
      const response = await clienteService.getById(clienteId);
      setSelectedCliente(response.data);
      setShowModal(true);
    } catch (err) {
      setError('Error al cargar detalle');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Gestión de Clientes</h1>
          
          {/* Buscador */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                className="input pl-10"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button type="submit" className="btn btn-primary">
              Buscar
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchText('');
                fetchClientes();
              }}
              className="btn btn-secondary"
            >
              Limpiar
            </button>
          </form>
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
          <>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ciudad</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{cliente.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {cliente.nombre} {cliente.apellidos}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cliente.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cliente.telefono || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cliente.ciudad || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => verDetalle(cliente.id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleDelete(cliente.id)}
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

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center space-x-2">
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

        {/* Modal Detalle */}
        {showModal && selectedCliente && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedCliente.nombre} {selectedCliente.apellidos}
                    </h2>
                    <p className="text-gray-500">Cliente #{selectedCliente.id}</p>
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

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700">Información de Contacto</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-gray-600"><span className="font-medium">Email:</span> {selectedCliente.email}</p>
                      <p className="text-gray-600"><span className="font-medium">Teléfono:</span> {selectedCliente.telefono || '-'}</p>
                    </div>
                  </div>

                  {selectedCliente.direccion && (
                    <div>
                      <h3 className="font-semibold text-gray-700">Dirección</h3>
                      <div className="mt-2 space-y-1">
                        <p className="text-gray-600">{selectedCliente.direccion}</p>
                        <p className="text-gray-600">
                          {selectedCliente.ciudad}, {selectedCliente.codigoPostal}
                        </p>
                        <p className="text-gray-600">
                          {selectedCliente.provincia}, {selectedCliente.pais}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-gray-700">Información de Usuario</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-gray-600"><span className="font-medium">Username:</span> {selectedCliente.username}</p>
                      <p className="text-gray-600"><span className="font-medium">Rol:</span> {selectedCliente.role}</p>
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

export default AdminClientes;