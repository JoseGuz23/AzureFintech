import React from 'react';
import { Link, useLocation } from 'react-router-dom';

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
    cursor: 'pointer',
    textDecoration: 'none'
  },
  navLinks: {
    display: 'flex',
    gap: '30px',
    alignItems: 'center'
  },
  navLink: {
    color: 'rgba(255, 255, 255, 0.8)',
    background: 'none',
    border: 'none',
    fontWeight: 500,
    fontSize: '16px',
    transition: 'color 0.3s ease',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '6px'
  },
  activeNavLink: {
    color: '#A98B51',
    backgroundColor: 'rgba(169, 139, 81, 0.1)'
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
    transition: 'all 0.3s ease',
    textDecoration: 'none'
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

function Header({ type, onLogin, onLogout, userName }) {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  // Header para usuarios NO autenticados (MainHub + Architecture)
  if (type === 'public') {
    return (
      <header style={headerStyles.header}>
        <nav style={headerStyles.nav}>
          <Link to="/" style={headerStyles.logo}>
            FINTECH PRO
          </Link>
          <div style={headerStyles.navLinks}>
            <Link 
              to="/" 
              style={{
                ...headerStyles.navLink, 
                ...(isActive('/') ? headerStyles.activeNavLink : {})
              }}
            >
              Servicios
            </Link>
            <Link 
              to="/architecture" 
              style={{
                ...headerStyles.navLink, 
                ...(isActive('/architecture') ? headerStyles.activeNavLink : {})
              }}
            >
              Arquitectura
            </Link>
            <Link 
              to="/" 
              style={headerStyles.navLink}
            >
              Casos de Éxito
            </Link>
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
          <Link to="/" style={headerStyles.logo}>
            FINTECH PRO
          </Link>
          <div style={headerStyles.navLinks}>
            <Link 
              to="/dashboard" 
              style={{
                ...headerStyles.navLink, 
                ...(isActive('/dashboard') ? headerStyles.activeNavLink : {})
              }}
            >
              Dashboard
            </Link>
            <Link 
              to="/architecture" 
              style={{
                ...headerStyles.navLink, 
                ...(isActive('/architecture') ? headerStyles.activeNavLink : {})
              }}
            >
              Arquitectura
            </Link>
            <Link 
              to="/" 
              style={{
                ...headerStyles.navLink, 
                ...(isActive('/') ? headerStyles.activeNavLink : {})
              }}
            >
              Admin
            </Link>
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