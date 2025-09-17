import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
  const { instance, accounts } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest)
      .then(() => {
        // React Router manejará la navegación automáticamente
      })
      .catch(e => {
        console.error(e);
      });
  };

  const handleLogout = () => {
    if (window.confirm('¿Cerrar sesión en esta app?')) {
      instance.clearCache();
      window.location.reload();
    }
  };

  const userName = accounts[0] && accounts[0].name;

  return (
    <Router>
      <div>
        <AuthenticatedTemplate>
          <Header 
            type="authenticated" 
            onLogin={handleLogin}
            onLogout={handleLogout}
            userName={userName}
          />
          
          <Routes>
            <Route path="/" element={<MainHub onLogin={handleLogin} />} />
            <Route 
              path="/dashboard" 
              element={
                <div style={styles.page}>
                  <div style={styles.dashboardCard}>
                    <Dashboard />
                  </div>
                </div>
              } 
            />
            <Route path="/architecture" element={<ArchitecturePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthenticatedTemplate>

        <UnauthenticatedTemplate>
          <Header 
            type="public" 
            onLogin={handleLogin}
          />
          
          <Routes>
            <Route path="/" element={<MainHub onLogin={handleLogin} />} />
            <Route path="/architecture" element={<ArchitecturePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </UnauthenticatedTemplate>
      </div>
    </Router>
  );
}

export default App;