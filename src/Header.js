import React from 'react';

const headerStyles = {
  header: {
    position: 'fixed',
    top: 0,
    width: '100%',
    background: 'rgba(12, 16, 16, 0.9)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(169, 139, 81, 0.2)',
    zIndex: 1000,
    padding: '20px 0'
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 50px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 700,
    background: 'linear-gradient(45deg, #FFFFFF, #A98B51)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    cursor: 'pointer'
  },
  navLinks: {
    display: 'flex',
    gap: '30px',
    alignItems: 'center'
  },
  navLink: {
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'color 0.3s ease',
    cursor: 'pointer'
  },
  button: {
    padding: '10px 20px',
    background: 'linear-gradient(45deg, #A98B51, #C5A572)',
    color: '#0C1010',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'all 0.3s ease'
  },
  logoutButton: {
    padding: '10px 20px',
    background: 'linear-gradient(45deg, #DC3545, #E85D75)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600
  }
};

function Header({ type, onNavigate, onLogin, onLogout, userName }) {
  const handleLogoClick = () => {
    onNavigate('hub');
  };

  // Header para usuarios NO autenticados (MainHub + Architecture)
  if (type === 'public') {
    return (
      <header style={headerStyles.header}>
        <nav style={headerStyles.nav}>
          <div style={headerStyles.logo} onClick={handleLogoClick}>
            FINTECH PRO
          </div>
          <div style={headerStyles.navLinks}>
            <a style={headerStyles.navLink} onClick={() => onNavigate('hub')}>
              Servicios
            </a>
            <a style={headerStyles.navLink} onClick={() => onNavigate('architecture')}>
              Arquitectura
            </a>
            <a style={headerStyles.navLink} onClick={() => onNavigate('hub')}>
              Casos de Éxito
            </a>
            <button style={headerStyles.button} onClick={onLogin}>
              Acceder al Sistema
            </button>
          </div>
        </nav>
      </header>
    );
  }

  // Header para usuarios AUTENTICADOS (Dashboard)
  if (type === 'authenticated') {
    return (
      <header style={headerStyles.header}>
        <nav style={headerStyles.nav}>
          <div style={headerStyles.logo} onClick={handleLogoClick}>
            FINTECH PRO
          </div>
          <div style={headerStyles.navLinks}>
            <a style={headerStyles.navLink} onClick={() => onNavigate('dashboard')}>
              Dashboard
            </a>
            <a style={headerStyles.navLink} onClick={() => onNavigate('architecture')}>
              Arquitectura
            </a>
            <a style={headerStyles.navLink} onClick={() => onNavigate('admin')}>
              Admin
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Hola, <span style={{ color: '#A98B51', fontWeight: 600 }}>{userName}</span>
              </span>
              <button style={headerStyles.logoutButton} onClick={onLogout}>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return null;
}

export default Header;