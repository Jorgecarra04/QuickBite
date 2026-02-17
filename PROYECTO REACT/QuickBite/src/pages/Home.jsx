import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaMotorcycle, FaClock, FaPercent, FaShieldAlt, FaUtensils, FaShippingFast, FaStar, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section con gradiente */}
      <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              Entrega de comida<br/>
              <span className="text-yellow-300">en tu ciudad</span>
            </h1>
            <p className="text-xl sm:text-2xl text-white text-opacity-95 mb-10 max-w-2xl mx-auto">
              Pide lo que quieras de tus restaurantes favoritos y recíbelo en la puerta de tu casa
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <button
                  onClick={() => navigate('/restaurantes')}
                  className="px-10 py-4 bg-white text-orange-600 rounded-xl text-lg font-bold hover:bg-yellow-50 transition-all shadow-2xl hover:shadow-xl transform hover:scale-105"
                >
                  Buscar restaurantes
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-10 py-4 bg-white text-orange-600 rounded-xl text-lg font-bold hover:bg-yellow-50 transition-all shadow-2xl hover:shadow-xl transform hover:scale-105"
                  >
                    Empezar
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-xl text-lg font-bold hover:bg-white hover:text-orange-600 transition-all"
                  >
                    Iniciar sesión
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaMotorcycle className="text-white text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Entrega rápida</h3>
              <p className="text-gray-600 text-sm">Seguimiento en tiempo real de tu pedido</p>
            </div>

            <div className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaClock className="text-white text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Pedidos programados</h3>
              <p className="text-gray-600 text-sm">Elige cuándo recibir tu pedido</p>
            </div>

            <div className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaPercent className="text-white text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Ofertas exclusivas</h3>
              <p className="text-gray-600 text-sm">Descuentos y promociones especiales</p>
            </div>

            <div className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaShieldAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Pago seguro</h3>
              <p className="text-gray-600 text-sm">Protección garantizada en cada pedido</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - ¿Por qué elegirnos? */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Por qué elegirnos?</h2>
          <p className="text-xl text-gray-600">La mejor experiencia de delivery a tu alcance</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="group text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
            <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <FaUtensils className="text-white text-4xl" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Variedad Infinita</h3>
            <p className="text-gray-600 leading-relaxed">
              Cientos de restaurantes con menús para todos los gustos
            </p>
          </div>

          <div className="group text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <FaShippingFast className="text-white text-4xl" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Super Rápido</h3>
            <p className="text-gray-600 leading-relaxed">
              Entrega en 30 minutos o menos garantizado
            </p>
          </div>

          <div className="group text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
            <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <FaClock className="text-white text-4xl" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Tracking Real</h3>
            <p className="text-gray-600 leading-relaxed">
              Sigue tu pedido en tiempo real desde tu móvil
            </p>
          </div>

          <div className="group text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <FaStar className="text-white text-4xl" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">100% Calidad</h3>
            <p className="text-gray-600 leading-relaxed">
              Solo los mejores restaurantes certificados
            </p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pedir es súper fácil
            </h2>
            <p className="text-xl text-gray-600">Solo 3 pasos te separan de tu comida favorita</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="relative">
              <div className="text-center">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 text-3xl font-bold shadow-2xl transform hover:scale-110 transition-transform">
                  1
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Elige tu favorito</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Explora cientos de restaurantes y descubre nuevos sabores cada día
                  </p>
                </div>
              </div>
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-orange-300 to-red-300"></div>
            </div>

            <div className="relative">
              <div className="text-center">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 text-3xl font-bold shadow-2xl transform hover:scale-110 transition-transform">
                  2
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Personaliza tu orden</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Agrega tus platos favoritos y deja instrucciones especiales
                  </p>
                </div>
              </div>
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-green-300 to-blue-300"></div>
            </div>

            <div className="relative">
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 text-3xl font-bold shadow-2xl transform hover:scale-110 transition-transform">
                  3
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">¡A disfrutar!</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Recibe tu pedido calentito y disfruta desde la comodidad de tu hogar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - ¿Listo para tu primera orden? */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para tu primera orden?
          </h2>
          <p className="text-xl text-white text-opacity-90 mb-10">
            Únete a miles de usuarios satisfechos y descubre por qué somos el #1 en delivery
          </p>
          {!user && (
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-orange-600 px-12 py-5 rounded-full text-xl font-bold hover:bg-yellow-300 hover:text-orange-700 transition-all transform hover:scale-105 shadow-2xl inline-flex items-center gap-3"
            >
              Registrarse Gratis
              <FaArrowRight />
            </button>
          )}
        </div>
      </div>

      {/* CTA Section - ¿Tienes un restaurante? */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                ¿Tienes un restaurante?
              </h2>
              <p className="text-xl text-gray-300">
                Únete a QuickBite y llega a miles de clientes
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-lg font-bold hover:from-orange-600 hover:to-orange-700 transition-all shadow-xl">
                Saber más
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;