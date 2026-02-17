import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellidos: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      setSuccess('Registro correcto, redirigiendo...');
      setTimeout(() => {
        navigate('/restaurantes');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.brand}>QuickBite</div>
          <p style={styles.headerText}>Crea tu cuenta</p>
        </div>

        <div style={styles.formContainer}>
          {/* Loader */}
          {loading && (
            <div style={styles.loader}></div>
          )}

          {/* Alerts */}
          {error && (
            <div style={{...styles.alert, ...styles.alertError}}>
              {error}
            </div>
          )}
          {success && (
            <div style={{...styles.alert, ...styles.alertSuccess}}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel} htmlFor="username">Usuario *</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                minLength="3"
                autoComplete="username"
                style={styles.formInput}
                value={formData.username}
                onChange={handleChange}
                onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel} htmlFor="email">Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                style={styles.formInput}
                value={formData.email}
                onChange={handleChange}
                onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={styles.formRow} className="form-row">
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  autoComplete="given-name"
                  style={styles.formInput}
                  value={formData.nombre}
                  onChange={handleChange}
                  onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="apellidos">Apellidos</label>
                <input
                  id="apellidos"
                  name="apellidos"
                  type="text"
                  autoComplete="family-name"
                  style={styles.formInput}
                  value={formData.apellidos}
                  onChange={handleChange}
                  onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel} htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                pattern="[0-9]{9}"
                placeholder="Ej: 612345678"
                autoComplete="tel"
                style={styles.formInput}
                value={formData.telefono}
                onChange={handleChange}
                onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel} htmlFor="password">Contraseña *</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength="6"
                autoComplete="new-password"
                style={styles.formInput}
                value={formData.password}
                onChange={handleChange}
                onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel} htmlFor="confirmPassword">Confirmar Contraseña *</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                style={styles.formInput}
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.btnSubmit,
                ...(loading ? styles.btnDisabled : {})
              }}
              onMouseEnter={(e) => !loading && (e.target.style.background = '#e85b2a')}
              onMouseLeave={(e) => !loading && (e.target.style.background = '#ff6b35')}
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <div style={styles.linkSection}>
            <p style={styles.linkText}>¿Ya tienes cuenta?</p>
            <Link to="/login" style={styles.link}>
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  body: {
    fontFamily: "'Outfit', sans-serif",
    background: 'linear-gradient(135deg, #0f172a, #1e293b)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  container: {
    background: '#ffffff',
    width: '100%',
    maxWidth: '520px',
    borderRadius: '18px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    animation: 'fadeUp 0.5s ease',
  },
  header: {
    background: 'linear-gradient(135deg, #ff6b35, #ff8c5a)',
    color: 'white',
    padding: '2.5rem 2rem',
    textAlign: 'center',
  },
  brand: {
    fontSize: '2.5rem',
    fontWeight: '700',
  },
  headerText: {
    opacity: 0.9,
    marginTop: '0.3rem',
    margin: 0,
  },
  formContainer: {
    padding: '2.5rem',
  },
  alert: {
    padding: '0.9rem 1rem',
    borderRadius: '10px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  alertSuccess: {
    background: '#d1fae5',
    color: '#065f46',
  },
  alertError: {
    background: '#fee2e2',
    color: '#991b1b',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  formGroup: {
    marginBottom: '1.4rem',
  },
  formLabel: {
    fontWeight: '600',
    fontSize: '0.9rem',
    marginBottom: '0.4rem',
    display: 'block',
  },
  formInput: {
    width: '100%',
    padding: '0.9rem 1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '1rem',
    transition: '0.2s',
    outline: 'none',
  },
  btnSubmit: {
    width: '100%',
    padding: '1rem',
    border: 'none',
    borderRadius: '12px',
    background: '#ff6b35',
    color: 'white',
    fontSize: '1.05rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: '0.2s',
    marginTop: '0.5rem',
  },
  btnDisabled: {
    background: '#6b7280',
    cursor: 'not-allowed',
  },
  loader: {
    width: '36px',
    height: '36px',
    border: '4px solid #eee',
    borderTop: '4px solid #ff6b35',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem',
  },
  linkSection: {
    textAlign: 'center',
    marginTop: '1.5rem',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '1rem',
  },
  linkText: {
    color: '#6b7280',
    fontSize: '0.9rem',
    margin: 0,
  },
  link: {
    color: '#ff6b35',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

export default Register;