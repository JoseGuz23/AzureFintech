import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ type, onNavigate, onLogin, onLogout, userName }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogoClick = () => {
    navigate('/');
    onNavigate('hub');
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (page) => {
    navigate(`/${page}`);
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    onLogin();
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsMobileMenuOpen(false);
  };

  const headerStyles = {
    header: {
      position: 'fixed',
      top: 0,
      width: '100%',
      background: 'rgba(12, 16, 16, 0.9)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(169, 139, 81, 0.2)',
      zIndex: 1000,
      padding: isMobile ? '15px 0' : '20px 0'
    },
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: isMobile ? '0 20px' : '0 50px',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    logo: {
      fontSize: isMobile ? '1.5rem' : '1.8rem',
      fontWeight: 700,
      background: 'linear-gradient(45deg, #FFFFFF, #A98B51)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      cursor: 'pointer'
    },
    navLinks: {
      display: isMobile ? 'none' : 'flex',
      gap: '30px',
      alignItems: 'center'
    },
    navButton: {
      color: 'rgba(255, 255, 255, 0.8)',
      background: 'none',
      border: 'none',
      fontWeight: 500,
      fontSize: '16px',
      transition: 'color 0.3s ease',
      cursor: 'pointer',
      fontFamily: 'inherit'
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
    },
    hamburger: {
      display: isMobile ? 'block' : 'none',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '5px',
      zIndex: 1001
    },
    hamburgerLine: {
      display: 'block',
      width: '25px',
      height: '3px',
      background: '#A98B51',
      margin: '5px 0',
      transition: 'all 0.3s ease',
      transformOrigin: 'center'
    },
    hamburgerLineOpen1: {
      transform: 'rotate(45deg) translate(6px, 6px)'
    },
    hamburgerLineOpen2: {
      opacity: 0
    },
    hamburgerLineOpen3: {
      transform: 'rotate(-45deg) translate(7px, -6px)'
    },
    mobileNavLinks: {
      display: isMobile && isMobileMenuOpen ? 'flex' : 'none',
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      background: 'rgba(12, 16, 16, 0.98)',
      backdropFilter: 'blur(10px)',
      flexDirection: 'column',
      padding: '20px',
      gap: '15px',
      borderTop: '1px solid rgba(169, 139, 81, 0.2)',
      zIndex: 999
    },
    mobileNavButton: {
      color: 'rgba(255, 255, 255, 0.8)',
      background: 'none',
      border: 'none',
      fontWeight: 500,
      fontSize: '18px',
      transition: 'color 0.3s ease',
      cursor: 'pointer',
      fontFamily: 'inherit',
      padding: '10px 0',
      textAlign: 'center',
      width: '100%'
    },
    mobileButton: {
      padding: '12px 24px',
      background: 'linear-gradient(45deg, #A98B51, #C5A572)',
      color: '#0C1010',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 600,
      transition: 'all 0.3s ease',
      width: '100%'
    },
    mobileLogoutButton: {
      padding: '12px 24px',
      background: 'linear-gradient(45deg, #DC3545, #E85D75)',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 600,
      width: '100%'
    },
    mobileUserInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      flexDirection: 'column',
      width: '100%',
      textAlign: 'center'
    }
  };

  // Header para usuarios NO autenticados
  if (type === 'public') {
    return (
      <header style={headerStyles.header}>
        <nav style={headerStyles.nav}>
          <div style={headerStyles.logo} onClick={handleLogoClick}>
            FINTECH PRO
          </div>
          
          <button
            style={headerStyles.hamburger}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            <span style={{...headerStyles.hamburgerLine, ...(isMobileMenuOpen ? headerStyles.hamburgerLineOpen1 : {})}}></span>
            <span style={{...headerStyles.hamburgerLine, ...(isMobileMenuOpen ? headerStyles.hamburgerLineOpen2 : {})}}></span>
            <span style={{...headerStyles.hamburgerLine, ...(isMobileMenuOpen ? headerStyles.hamburgerLineOpen3 : {})}}></span>
          </button>

          <div style={headerStyles.navLinks}>
            <button style={headerStyles.navButton} onClick={() => handleNavigation('hub')}>Servicios</button>
            <button style={headerStyles.navButton} onClick={() => handleNavigation('architecture')}>Arquitectura</button>
            <button style={headerStyles.navButton} onClick={() => handleNavigation('hub')}>Casos de Éxito</button>
            <button style={headerStyles.button} onClick={handleLogin}>Acceder al Sistema</button>
          </div>

          <div style={headerStyles.mobileNavLinks}>
            <button style={headerStyles.mobileNavButton} onClick={() => handleNavigation('hub')}>Servicios</button>
            <button style={headerStyles.mobileNavButton} onClick={() => handleNavigation('architecture')}>Arquitectura</button>
            <button style={headerStyles.mobileNavButton} onClick={() => handleNavigation('hub')}>Casos de Éxito</button>
            <button style={headerStyles.mobileButton} onClick={handleLogin}>Acceder al Sistema</button>
          </div>
        </nav>
      </header>
    );
  }

  // Header para usuarios AUTENTICADOS
  if (type === 'authenticated') {
    return (
      <header style={headerStyles.header}>
        <nav style={headerStyles.nav}>
          <div style={headerStyles.logo} onClick={handleLogoClick}>
            FINTECH PRO
          </div>

          <button
            style={headerStyles.hamburger}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            <span style={{...headerStyles.hamburgerLine, ...(isMobileMenuOpen ? headerStyles.hamburgerLineOpen1 : {})}}></span>
            <span style={{...headerStyles.hamburgerLine, ...(isMobileMenuOpen ? headerStyles.hamburgerLineOpen2 : {})}}></span>
            <span style={{...headerStyles.hamburgerLine, ...(isMobileMenuOpen ? headerStyles.hamburgerLineOpen3 : {})}}></span>
          </button>

          <div style={headerStyles.navLinks}>
            <button style={headerStyles.navButton} onClick={() => handleNavigation('dashboard')}>Dashboard</button>
            <button style={headerStyles.navButton} onClick={() => handleNavigation('architecture')}>Arquitectura</button>
            <button style={headerStyles.navButton} onClick={() => handleNavigation('admin')}>Admin</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Hola, <span style={{ color: '#A98B51', fontWeight: 600 }}>{userName}</span>
              </span>
              <button style={headerStyles.logoutButton} onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          </div>

          <div style={headerStyles.mobileNavLinks}>
            <button style={headerStyles.mobileNavButton} onClick={() => handleNavigation('dashboard')}>Dashboard</button>
            <button style={headerStyles.mobileNavButton} onClick={() => handleNavigation('architecture')}>Arquitectura</button>
            <button style={headerStyles.mobileNavButton} onClick={() => handleNavigation('admin')}>Admin</button>
            <div style={headerStyles.mobileUserInfo}>
              <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                Hola, <span style={{ color: '#A98B51', fontWeight: 600 }}>{userName}</span>
              </span>
              <button style={headerStyles.mobileLogoutButton} onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return null;
};

export default Header;