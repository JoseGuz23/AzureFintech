import React, { useState } from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import Dashboard from "./Dashboard";
import MainHub from "./MainHub";
import ArchitecturePage from "./ArchitecturePage";
import Header from "./Header";
 
const styles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0C1010 0%, #111F20 50%, #162C2C 100%)',
    padding: '40px 20px',
    paddingTop: '120px', // Espacio para el header fijo
    fontFamily: "'Inter', 'Arial', sans-serif"
  },
  dashboardCard: {
    backgroundColor: '#162C2C',
    padding: '30px 40px',
    borderRadius: '16px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '900px',
    border: '1px solid rgba(169, 139, 81, 0.2)'
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
        
        {currentPage === 'dashboard' && (
          <div style={styles.page}>
            <div style={styles.dashboardCard}>
              <Dashboard />
            </div>
          </div>
        )}
        
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
          <MainHub onNavigate={handleNavigation} onLogin={handleLogin} />
        )}
      </UnauthenticatedTemplate>
    </div>
  );
}

export default App;