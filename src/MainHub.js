import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useIsAuthenticated } from "@azure/msal-react";

const styles = {
  body: {
    fontFamily: "'Inter', sans-serif",
    background: 'linear-gradient(135deg, #0C1010 0%, #111F20 50%, #162C2C 100%)',
    color: '#FFFFFF',
    lineHeight: 1.6,
    margin: 0,
    minHeight: '100vh',
    paddingTop: '100px' // Espacio para el header fijo
  },
  hero: {
    padding: '80px 50px 80px',
    textAlign: 'center',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  heroTitle: {
    fontSize: '4rem',
    fontWeight: 700,
    marginBottom: '20px',
    background: 'linear-gradient(45deg, #FFFFFF, #A98B51)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: 1.2
  },
  heroText: {
    fontSize: '1.3rem',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '40px',
    maxWidth: '700px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  ctaButton: {
    display: 'inline-block',
    padding: '18px 36px',
    background: 'linear-gradient(45deg, #A98B51, #C5A572)',
    color: '#0C1010',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 25px rgba(169, 139, 81, 0.3)',
    marginRight: '20px',
    border: 'none',
    cursor: 'pointer'
  },
  ctaSecondary: {
    display: 'inline-block',
    padding: '18px 36px',
    background: 'linear-gradient(45deg, #162C2C, #263B35)',
    color: '#FFFFFF',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: 600,
    border: '1px solid rgba(169, 139, 81, 0.3)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  services: {
    padding: '80px 50px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  servicesTitle: {
    textAlign: 'center',
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '60px',
    background: 'linear-gradient(45deg, #FFFFFF, #A98B51)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px'
  },
  serviceCard: {
    background: 'linear-gradient(135deg, #162C2C 0%, #263B35 100%)',
    borderRadius: '20px',
    padding: '40px 30px',
    textAlign: 'center',
    border: '1px solid rgba(169, 139, 81, 0.2)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  },
  serviceIcon: {
    fontSize: '3rem',
    marginBottom: '20px',
    display: 'block'
  },
  serviceTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '15px',
    color: '#A98B51'
  },
  serviceDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 1.6
  },
  techStack: {
    padding: '80px 50px',
    background: 'linear-gradient(135deg, #263B35 0%, #162C2C 100%)',
    margin: '0 auto'
  },
  techTitle: {
    textAlign: 'center',
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '20px',
    background: 'linear-gradient(45deg, #FFFFFF, #A98B51)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  techSubtitle: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '50px',
    maxWidth: '800px',
    margin: '0 auto 50px'
  },
  techGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  techItem: {
    background: 'rgba(169, 139, 81, 0.1)',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid rgba(169, 139, 81, 0.2)',
    transition: 'all 0.3s ease'
  },
  techIcon: {
    fontSize: '2.5rem',
    marginBottom: '10px',
    display: 'block',
    color: '#A98B51'
  },
  techName: {
    fontWeight: 600,
    fontSize: '1.1rem'
  }
};

function MainHub({ onLogin }) {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      onLogin();
    }
  };

  return (
    <div style={styles.body}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Arquitectura FinTech
          <br />
          en Microsoft Azure
        </h1>
        <p style={styles.heroText}>
          Solución completa de servicios financieros construida con tecnologías modernas en la nube.
          Escalable, segura y conforme a regulaciones financieras.
        </p>
        <div>
          <button onClick={handleDashboardClick} style={styles.ctaButton}>
            {isAuthenticated ? 'Ir al Dashboard' : 'Acceder al Dashboard'}
          </button>
          <Link to="/architecture" style={styles.ctaSecondary}>
            Ver Arquitectura
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section style={styles.services}>
        <h2 style={styles.servicesTitle}>
          Servicios Financieros Disponibles
        </h2>
        <div style={styles.servicesGrid}>
          <div style={styles.serviceCard}>
            <span style={styles.serviceIcon}>💳</span>
            <h3 style={styles.serviceTitle}>Gestión de Transacciones</h3>
            <p style={styles.serviceDescription}>
              Sistema completo para el manejo seguro de transacciones financieras con validación en tiempo real y cumplimiento normativo.
            </p>
          </div>
          
          <div style={styles.serviceCard}>
            <span style={styles.serviceIcon}>🔒</span>
            <h3 style={styles.serviceTitle}>Autenticación Segura</h3>
            <p style={styles.serviceDescription}>
              Integración con Microsoft Entra ID para autenticación robusta y gestión de identidades empresariales.
            </p>
          </div>
          
          <div style={styles.serviceCard}>
            <span style={styles.serviceIcon}>📊</span>
            <h3 style={styles.serviceTitle}>Monitoreo y Analytics</h3>
            <p style={styles.serviceDescription}>
              Dashboard completo con métricas en tiempo real, alertas proactivas y análisis de rendimiento del sistema.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section style={styles.techStack}>
        <h2 style={styles.techTitle}>
          Stack Tecnológico
        </h2>
        <p style={styles.techSubtitle}>
          Construido con las mejores tecnologías de Microsoft Azure para garantizar escalabilidad, seguridad y rendimiento.
        </p>
        <div style={styles.techGrid}>
          <div style={styles.techItem}>
            <span style={styles.techIcon}>⚛️</span>
            <div style={styles.techName}>React</div>
          </div>
          <div style={styles.techItem}>
            <span style={styles.techIcon}>☁️</span>
            <div style={styles.techName}>Azure Static Web Apps</div>
          </div>
          <div style={styles.techItem}>
            <span style={styles.techIcon}>🔐</span>
            <div style={styles.techName}>Azure AD</div>
          </div>
          <div style={styles.techItem}>
            <span style={styles.techIcon}>⚡</span>
            <div style={styles.techName}>Azure Functions</div>
          </div>
          <div style={styles.techItem}>
            <span style={styles.techIcon}>🗄️</span>
            <div style={styles.techName}>Cosmos DB</div>
          </div>
          <div style={styles.techItem}>
            <span style={styles.techIcon}>📈</span>
            <div style={styles.techName}>Application Insights</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MainHub;