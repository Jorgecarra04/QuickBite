import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Páginas públicas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Páginas protegidas
import Restaurantes from './pages/Restaurantes';
import RestauranteDetalle from './pages/RestauranteDetalle';
import RealizarPedido from './pages/RealizarPedido';
import MisPedidos from './pages/MisPedidos';

// Páginas de administración
import Admin from './pages/admin/Admin';
import AdminRestaurantes from './pages/admin/AdminRestaurantes';
import AdminProductos from './pages/admin/AdminProductos';
import AdminCategorias from './pages/admin/AdminCategorias';
import AdminPedidos from './pages/admin/AdminPedidos';
import AdminRepartidores from './pages/admin/AdminRepartidores';
import AdminClientes from './pages/admin/AdminClientes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rutas protegidas */}
            <Route
              path="/restaurantes"
              element={
                <PrivateRoute>
                  <Restaurantes />
                </PrivateRoute>
              }
            />
            <Route
              path="/restaurantes/:id"
              element={
                <PrivateRoute>
                  <RestauranteDetalle />
                </PrivateRoute>
              }
            />
            <Route
              path="/realizar-pedido"
              element={
                <PrivateRoute>
                  <RealizarPedido />
                </PrivateRoute>
              }
            />
            <Route
              path="/mis-pedidos"
              element={
                <PrivateRoute>
                  <MisPedidos />
                </PrivateRoute>
              }
            />

            {/* Rutas de administración */}
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly>
                  <Admin />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/restaurantes"
              element={
                <PrivateRoute adminOnly>
                  <AdminRestaurantes />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/productos"
              element={
                <PrivateRoute adminOnly>
                  <AdminProductos />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/categorias"
              element={
                <PrivateRoute adminOnly>
                  <AdminCategorias />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/pedidos"
              element={
                <PrivateRoute adminOnly>
                  <AdminPedidos />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/repartidores"
              element={
                <PrivateRoute adminOnly>
                  <AdminRepartidores />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/clientes"
              element={
                <PrivateRoute adminOnly>
                  <AdminClientes />
                </PrivateRoute>
              }
            />

            {/* Ruta 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;