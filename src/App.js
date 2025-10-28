import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import Dashboard from "./Dashboard";
import MainHub from "./MainHub";
import ArchitecturePage from "./ArchitecturePage";
import Header from "./Header";

function AppContent() {
  const [currentPage, setCurrentPage] = useState('hub');
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();

  const handleNavigation = (page) => {
    setCurrentPage(page);
    navigate(`/${page}`);
  };

  const handleLogin = () => {
    instance.loginPopup(loginRequest)
      .then(() => {
        setCurrentPage('dashboard');
        navigate('/dashboard');
      })
      .catch(e => {
        console.error(e);
      });
  };

  const handleLogout = () => {
    instance.logoutPopup();
    setCurrentPage('hub');
    navigate('/');
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
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/hub" element={<MainHub onNavigate={handleNavigation} onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <Header 
          type="public" 
          onNavigate={handleNavigation}
          onLogin={handleLogin}
        />
        
        <Routes>
          <Route path="/" element={<MainHub onNavigate={handleNavigation} onLogin={handleLogin} />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </UnauthenticatedTemplate>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;