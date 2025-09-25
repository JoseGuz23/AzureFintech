import React, { useState } from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import Dashboard from "./Dashboard";
import MainHub from "./MainHub";
import ArchitecturePage from "./ArchitecturePage";
import Header from "./Header";

// ✅ SOLUCIÓN: Estilos SIN limitaciones de ancho para el dashboard
const styles = {
  // Página completa sin restricciones para el dashboard
  fullPage: {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #0C1010 0%, #111F20 50%, #162C2C 100%)',
    margin: 0,
    padding: 0
  },
  
  // Solo para páginas que SÍ necesitan contenedor centrado (MainHub, Login)
  centeredPage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0C1010 0%, #111F20 50%, #162C2C 100%)',
    padding: '40px 20px',
    paddingTop: '120px',
    fontFamily: "'Inter', 'Arial', sans-serif"
  },

  // Contenedor para login - SÍ limitado
  loginCard: {
    backgroundColor: '#263B35',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '500px',
    border: '1px solid rgba(169, 139, 81, 0.2)'
  },

  loginTitle: {
    color: '#FFFFFF',
    fontSize: '2.2rem',
    fontWeight: '700',
    marginBottom: '15px',
    background: 'linear-gradient(45deg, #FFFFFF, #A98B51)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },

  loginSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '1.1rem',
    marginBottom: '30px',
    lineHeight: '1.5'
  },

  signInButton: {
    padding: '14px 28px',
    background: 'linear-gradient(45deg, #A98B51, #C5A572)',
    color: '#0C1010',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    marginTop: '20px'
  }
};

function App() {
  const [currentPage, setCurrentPage] = useState('hub');
  const { instance, accounts } = useMsal();

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = () => {
    instance.loginPopup(loginRequest)
      .then(() => {
        setCurrentPage('dashboard');
      })
      .catch(e => {
        console.error(e);
      });
  };

  const handleLogout = () => {
    instance.logoutPopup();
    setCurrentPage('hub');
  };

  const userName = accounts[0] && accounts[0].name;

  return (
    <div>
      <AuthenticatedTemplate>
        <Header 
          type="authenticated" 
          onNavigate={handleNavigation}
          onLogin={handleLogin}
          onLogout={handleLogout}
          userName={userName}
        />
        
        {/* ✅ DASHBOARD - SIN contenedor limitante, usa ancho completo */}
        {currentPage === 'dashboard' && (
          <div style={styles.fullPage}>
            <Dashboard />
          </div>
        )}
        
        {/* Otras páginas sí pueden usar contenedor centrado */}
        {currentPage === 'architecture' && (
          <ArchitecturePage />
        )}
        
        {currentPage === 'hub' && (
          <MainHub onNavigate={handleNavigation} onLogin={handleLogin} />
        )}
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <Header 
          type="public" 
          onNavigate={handleNavigation}
          onLogin={handleLogin}
        />
        
        {currentPage === 'architecture' && (
          <ArchitecturePage />
        )}
        
        {currentPage !== 'architecture' && (
          <div>
            {currentPage === 'login' ? (
              <div style={styles.centeredPage}>
                <div style={styles.loginCard}>
                  <h1 style={styles.loginTitle}>FINTECH PRO</h1>
                  <p style={styles.loginSubtitle}>
                    Plataforma Financiera Universitaria<br />
                    Inicia sesión para acceder al dashboard
                  </p>
                  <SignInButton />
                </div>
              </div>
            ) : (
              <MainHub onNavigate={handleNavigation} onLogin={handleLogin} />
            )}
          </div>
        )}
      </UnauthenticatedTemplate>
    </div>
  );
}

function SignInButton() {
  const { instance } = useMsal();
  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch(e => {
      console.error(e);
    });
  };
  
  return (
    <button 
      onClick={handleLogin} 
      style={styles.signInButton}
      onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
      onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
    >
      Acceder al Sistema
    </button>
  );
}

export default App;