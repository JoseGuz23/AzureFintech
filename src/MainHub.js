import React, { useState, useEffect } from 'react';

const MainHub = ({ onNavigate, onLogin }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024 && window.innerWidth > 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    body: {
      fontFamily: "'Inter', sans-serif",
      background: 'linear-gradient(135deg, #0C1010 0%, #111F20 50%, #162C2C 100%)',
      color: '#FFFFFF',
      lineHeight: 1.6,
      margin: 0,
      minHeight: '100vh',
      paddingTop: isMobile ? '80px' : '100px'
    },
    
    hero: {
      padding: isMobile ? '40px 20px' : isTablet ? '60px 30px' : '80px 50px',
      textAlign: 'center',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    
    heroTitle: {
      fontSize: isMobile ? '2rem' : isTablet ? '3rem' : '4rem',
      fontWeight: 700,
      marginBottom: '20px',
      background: 'linear-gradient(45deg, #FFFFFF, #A98B51)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      lineHeight: isMobile ? 1.1 : 1.2
    },
    
    heroText: {
      fontSize: isMobile ? '1rem' : isTablet ? '1.2rem' : '1.3rem',
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: isMobile ? '30px' : '40px',
      maxWidth: '700px',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    
    ctaContainer: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '15px' : '20px',
      justifyContent: 'center',
      alignItems: 'center'
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
      border: 'none',
      cursor: 'pointer',
      width: isMobile ? '100%' : 'auto',
      maxWidth: isMobile ? '280px' : 'none',
      textAlign: 'center'
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
      cursor: 'pointer',
      width: isMobile ? '100%' : 'auto',
      maxWidth: isMobile ? '280px' : 'none',
      textAlign: 'center'
    },
    
    services: {
      padding: isMobile ? '40px 20px' : isTablet ? '60px 30px' : '80px 50px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    
    servicesTitle: {
      textAlign: 'center',
      fontSize: isMobile ? '1.8rem' : isTablet ? '2rem' : '2.5rem',
      fontWeight: 600,
      marginBottom: isMobile ? '40px' : '60px',
      background: 'linear-gradient(45deg, #FFFFFF, #A98B51)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    
    servicesGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(auto-fit, minmax(300px, 1fr))' : 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: isMobile ? '25px' : isTablet ? '30px' : '40px'
    },
    
    serviceCard: {
      background: 'linear-gradient(135deg, #263B35, #162C2C)',
      padding: isMobile ? '25px 15px' : isTablet ? '30px 20px' : '40px 30px',
      borderRadius: '16px',
      border: '1px solid rgba(169, 139, 81, 0.2)',
      transition: 'all 0.3s ease',
      textAlign: 'center'
    },
    
    serviceIcon: {
      fontSize: '1.2rem',
      color: '#A98B51',
      marginBottom: '20px',
      fontWeight: 600,
      letterSpacing: '1px'
    },
    
    serviceTitle: {
      fontSize: isMobile ? '1.2rem' : '1.4rem',
      fontWeight: 600,
      marginBottom: '15px',
      color: '#FFFFFF'
    },
    
    serviceText: {
      color: isMobile ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.8)',
      lineHeight: 1.6,
      marginBottom: '20px',
      fontSize: isMobile ? '0.95rem' : '1rem'
    },
    
    serviceFeatures: {
      listStyle: 'none',
      padding: 0,
      textAlign: 'left'
    },
    
    featureItem: {
      color: 'rgba(255, 255, 255, 0.7)',
      marginBottom: '8px',
      position: 'relative',
      paddingLeft: '20px',
      fontSize: isMobile ? '0.9rem' : '1rem'
    },
    
    valueProp: {
      padding: isMobile ? '40px 20px' : isTablet ? '60px 30px' : '80px 50px',
      background: 'linear-gradient(135deg, #111F20, #0C1010)',
      textAlign: 'center'
    },
    
    valueTitle: {
      fontSize: isMobile ? '1.8rem' : isTablet ? '2rem' : '2.5rem',
      fontWeight: 600,
      marginBottom: isMobile ? '30px' : '40px',
      background: 'linear-gradient(45deg, #FFFFFF, #A98B51)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    
    valueGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: isMobile ? '20px' : isTablet ? '30px' : '40px',
      maxWidth: '1000px',
      margin: '0 auto'
    },
    
    valueItem: {
      padding: isMobile ? '25px 15px' : '30px 20px'
    },
    
    valueNumber: {
      fontSize: isMobile ? '2rem' : isTablet ? '2.5rem' : '3rem',
      fontWeight: 700,
      color: '#A98B51',
      marginBottom: '10px'
    },
    
    valueSubtitle: {
      fontSize: isMobile ? '1.1rem' : '1.3rem',
      fontWeight: 600,
      color: '#FFFFFF',
      marginBottom: '15px'
    },
    
    valueDesc: {
      color: isMobile ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.7)',
      fontSize: '1rem'
    },
    
    ctaSection: {
      padding: isMobile ? '40px 20px' : isTablet ? '60px 30px' : '80px 50px',
      textAlign: 'center',
      maxWidth: '800px',
      margin: '0 auto'
    },
    
    footer: {
      padding: isMobile ? '30px 20px 20px' : isTablet ? '40px 30px 30px' : '60px 50px 40px',
      background: '#0C1010',
      borderTop: '1px solid rgba(169, 139, 81, 0.2)',
      textAlign: 'center'
    },
    
    footerContent: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    
    footerText: {
      color: isMobile ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.6)',
      marginBottom: isMobile ? '15px' : '20px',
      fontSize: isMobile ? '0.9rem' : '1rem'
    },
    
    footerLinks: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'center',
      gap: isMobile ? '15px' : '30px',
      marginBottom: isMobile ? '20px' : '30px'
    },
    
    footerButton: {
      color: 'rgba(255, 255, 255, 0.7)',
      background: 'none',
      border: 'none',
      textDecoration: 'none',
      transition: 'color 0.3s ease',
      cursor: 'pointer',
      fontSize: isMobile ? '14px' : '16px',
      fontFamily: 'inherit'
    }
  };

  return (
    <div style={styles.body}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Arquitecturas Azure para Fintech</h1>
        <p style={styles.heroText}>
          Especializados en diseño e implementación de infraestructuras cloud escalables para el sector financiero. 
          Transformamos ideas fintech en realidades tecnológicas robustas y seguras.
        </p>
        <div style={styles.ctaContainer}>
          <button style={styles.ctaButton} onClick={onLogin}>
            Solicitar Consultoría
          </button>
          <button style={styles.ctaSecondary} onClick={() => onNavigate('architecture')}>
            Ver Nuestra Arquitectura
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section style={styles.services}>
        <h2 style={styles.servicesTitle}>Servicios Especializados</h2>
        <div style={styles.servicesGrid}>
          <div style={styles.serviceCard}>
            <div style={styles.serviceIcon}>CLOUD ARCHITECTURE</div>
            <h3 style={styles.serviceTitle}>Diseño de Arquitectura</h3>
            <p style={styles.serviceText}>
              Diseñamos infraestructuras cloud personalizadas que cumplen con regulaciones financieras y escalan según las necesidades de tu negocio.
            </p>
            <ul style={styles.serviceFeatures}>
              <li style={styles.featureItem}>→ Arquitecturas serverless con Azure Functions</li>
              <li style={styles.featureItem}>→ Integración con servicios financieros</li>
              <li style={styles.featureItem}>→ Compliance PCI DSS y regulaciones locales</li>
              <li style={styles.featureItem}>→ Alta disponibilidad y disaster recovery</li>
            </ul>
          </div>

          <div style={styles.serviceCard}>
            <div style={styles.serviceIcon}>DEVELOPMENT & INTEGRATION</div>
            <h3 style={styles.serviceTitle}>Desarrollo e Integración</h3>
            <p style={styles.serviceText}>
              Desarrollamos soluciones fintech completas con APIs robustas y interfaces de usuario modernas que se integran perfectamente con tu ecosistema.
            </p>
            <ul style={styles.serviceFeatures}>
              <li style={styles.featureItem}>→ APIs RESTful con Azure API Management</li>
              <li style={styles.featureItem}>→ Frontend React con autenticación Azure AD</li>
              <li style={styles.featureItem}>→ Integración con sistemas legacy</li>
              <li style={styles.featureItem}>→ Microservicios y arquitectura modular</li>
            </ul>
          </div>

          <div style={styles.serviceCard}>
            <div style={styles.serviceIcon}>SECURITY & COMPLIANCE</div>
            <h3 style={styles.serviceTitle}>Seguridad y Cumplimiento</h3>
            <p style={styles.serviceText}>
              Implementamos marcos de seguridad enterprise-grade que protegen datos financieros sensibles y cumplen con estándares internacionales.
            </p>
            <ul style={styles.serviceFeatures}>
              <li style={styles.featureItem}>→ Azure Active Directory y gestión de identidades</li>
              <li style={styles.featureItem}>→ Cifrado end-to-end y Key Vault</li>
              <li style={styles.featureItem}>→ Monitoreo y auditoría con Application Insights</li>
              <li style={styles.featureItem}>→ Certificaciones SOC 2 y ISO 27001</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section style={styles.valueProp}>
        <h2 style={styles.valueTitle}>¿Por Qué Elegirnos?</h2>
        <div style={styles.valueGrid}>
          <div style={styles.valueItem}>
            <div style={styles.valueNumber}>99.9%</div>
            <h3 style={styles.valueSubtitle}>Uptime Garantizado</h3>
            <p style={styles.valueDesc}>
              Infraestructura diseñada para máxima disponibilidad con redundancia geográfica.
            </p>
          </div>
          <div style={styles.valueItem}>
            <div style={styles.valueNumber}>100ms</div>
            <h3 style={styles.valueSubtitle}>Latencia Optimizada</h3>
            <p style={styles.valueDesc}>
              Arquitecturas optimizadas para transacciones financieras de alta frecuencia.
            </p>
          </div>
          <div style={styles.valueItem}>
            <div style={styles.valueNumber}>24/7</div>
            <h3 style={styles.valueSubtitle}>Soporte Especializado</h3>
            <p style={styles.valueDesc}>
              Equipo dedicado con expertise en fintech y tecnologías Azure.
            </p>
          </div>
          <div style={styles.valueItem}>
            <div style={styles.valueNumber}>ISO 27001</div>
            <h3 style={styles.valueSubtitle}>Certificaciones</h3>
            <p style={styles.valueDesc}>
              Cumplimiento total con estándares internacionales de seguridad.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={styles.ctaSection}>
        <h2 style={styles.valueTitle}>¿Listo para Transformar tu Fintech?</h2>
        <p style={styles.heroText}>
          Agenda una consultoría gratuita y descubre cómo podemos acelerar tu crecimiento con la infraestructura cloud adecuada.
        </p>
        <div style={styles.ctaContainer}>
          <button style={styles.ctaButton} onClick={onLogin}>
            Agendar Consultoría Gratuita
          </button>
          <button style={styles.ctaSecondary} onClick={() => onNavigate('architecture')}>
            Conocer Nuestra Arquitectura
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLinks}>
            <button style={styles.footerButton}>Proyecto de Tesis UACJ</button>
            <button style={styles.footerButton}>Documentación Técnica</button>
            <button style={styles.footerButton} onClick={() => onNavigate('architecture')}>Arquitectura Azure</button>
            <button style={styles.footerButton}>GitHub Repository</button>
          </div>
          <p style={styles.footerText}>© 2025 FINTECH PRO - Proyecto de Tesis. Universidad Autónoma de Ciudad Juárez.</p>
          <p style={styles.footerText}>Diseño e Implementación de una Arquitectura de Servicios en la Nube para Entornos Fintech en Microsoft Azure - José Ángel Guzmán Moreno.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainHub;