import React from 'react';

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
    fontWeight: 600,
    marginBottom: '60px',
    background: 'linear-gradient(45deg, #FFFFFF, #A98B51)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '40px'
  },
  serviceCard: {
    background: 'linear-gradient(135deg, #263B35, #162C2C)',
    padding: '40px 30px',
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
    fontSize: '1.4rem',
    fontWeight: 600,
    marginBottom: '15px',
    color: '#FFFFFF'
  },
  serviceText: {
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 1.6,
    marginBottom: '20px'
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
    paddingLeft: '20px'
  },
  valueProp: {
    padding: '80px 50px',
    background: 'linear-gradient(135deg, #111F20, #0C1010)',
    textAlign: 'center'
  },
  valueTitle: {
    fontSize: '2.5rem',
    fontWeight: 600,
    marginBottom: '40px',
    background: 'linear-gradient(45deg, #FFFFFF, #A98B51)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  valueGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  valueItem: {
    padding: '30px 20px'
  },
  valueNumber: {
    fontSize: '3rem',
    fontWeight: 700,
    color: '#A98B51',
    marginBottom: '10px'
  },
  valueSubtitle: {
    fontSize: '1.3rem',
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: '15px'
  },
  valueDesc: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1rem'
  },
  ctaSection: {
    padding: '80px 50px',
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto'
  },
  footer: {
    padding: '60px 50px 40px',
    background: '#0C1010',
    borderTop: '1px solid rgba(169, 139, 81, 0.2)',
    textAlign: 'center'
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '20px'
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    marginBottom: '30px'
  },
  footerLink: {
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    cursor: 'pointer'
  }
};

function MainHub({ onNavigate, onLogin }) {
  return (
    <div style={styles.body}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Arquitecturas Azure para Fintech</h1>
        <p style={styles.heroText}>
          Especializados en diseño e implementación de infraestructuras cloud escalables para el sector financiero. 
          Transformamos ideas fintech en realidades tecnológicas robustas y seguras.
        </p>
        <button style={styles.ctaButton} onClick={onLogin}>
          Solicitar Consultoría
        </button>
        <button style={styles.ctaSecondary} onClick={() => onNavigate('architecture')}>
          Ver Nuestra Arquitectura
        </button>
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
              <li style={styles.featureItem}>✓ Análisis de requerimientos técnicos</li>
              <li style={styles.featureItem}>✓ Diseño de arquitectura escalable</li>
              <li style={styles.featureItem}>✓ Cumplimiento normativo fintech</li>
              <li style={styles.featureItem}>✓ Documentación técnica completa</li>
            </ul>
          </div>
          <div style={styles.serviceCard}>
            <div style={styles.serviceIcon}>IMPLEMENTATION</div>
            <h3 style={styles.serviceTitle}>Implementación Azure</h3>
            <p style={styles.serviceText}>
              Implementamos soluciones completas en Microsoft Azure con las mejores prácticas de seguridad y performance para entornos financieros.
            </p>
            <ul style={styles.serviceFeatures}>
              <li style={styles.featureItem}>✓ Azure Functions y API Management</li>
              <li style={styles.featureItem}>✓ Cosmos DB y almacenamiento seguro</li>
              <li style={styles.featureItem}>✓ Azure AD y gestión de identidades</li>
              <li style={styles.featureItem}>✓ Monitoreo y alertas avanzadas</li>
            </ul>
          </div>
          <div style={styles.serviceCard}>
            <div style={styles.serviceIcon}>CONSULTING</div>
            <h3 style={styles.serviceTitle}>Consultoría Estratégica</h3>
            <p style={styles.serviceText}>
              Asesoramos en la adopción de tecnologías cloud, optimización de costos y estrategias de migración para empresas fintech.
            </p>
            <ul style={styles.serviceFeatures}>
              <li style={styles.featureItem}>✓ Evaluación de infraestructura actual</li>
              <li style={styles.featureItem}>✓ Estrategia de migración a cloud</li>
              <li style={styles.featureItem}>✓ Optimización de costos Azure</li>
              <li style={styles.featureItem}>✓ Capacitación técnica de equipos</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section style={styles.valueProp}>
        <h2 style={styles.valueTitle}>Por Qué Elegir FINTECH PRO</h2>
        <div style={styles.valueGrid}>
          <div style={styles.valueItem}>
            <h3 style={styles.valueNumber}>5+</h3>
            <h4 style={styles.valueSubtitle}>Años de Experiencia</h4>
            <p style={styles.valueDesc}>Especializados en arquitecturas cloud para el sector financiero y fintech</p>
          </div>
          <div style={styles.valueItem}>
            <h3 style={styles.valueNumber}>100%</h3>
            <h4 style={styles.valueSubtitle}>Azure Certified</h4>
            <p style={styles.valueDesc}>Equipo certificado en tecnologías Microsoft Azure y mejores prácticas</p>
          </div>
          <div style={styles.valueItem}>
            <h3 style={styles.valueNumber}>24/7</h3>
            <h4 style={styles.valueSubtitle}>Soporte Técnico</h4>
            <p style={styles.valueDesc}>Monitoreo continuo y soporte especializado para entornos críticos</p>
          </div>
          <div style={styles.valueItem}>
            <h3 style={styles.valueNumber}>99.9%</h3>
            <h4 style={styles.valueSubtitle}>Disponibilidad</h4>
            <p style={styles.valueDesc}>Garantizamos alta disponibilidad con arquitecturas resilientes y redundantes</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <h2 style={styles.valueTitle}>¿Listo para Transformar tu Fintech?</h2>
        <p style={styles.heroText}>
          Agenda una consultoría gratuita y descubre cómo podemos acelerar tu crecimiento con la infraestructura adecuada.
        </p>
        <button style={styles.ctaButton} onClick={onLogin}>
          Agendar Consultoría Gratuita
        </button>
        <button style={styles.ctaSecondary} onClick={() => onNavigate('architecture')}>
          Conocer Nuestra Arquitectura
        </button>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLinks}>
            <a style={styles.footerLink}>Proyecto de Tesis UACJ</a>
            <a style={styles.footerLink}>Documentación Técnica</a>
            <a style={styles.footerLink} onClick={() => onNavigate('architecture')}>Arquitectura Azure</a>
            <a style={styles.footerLink}>GitHub Repository</a>
          </div>
          <p style={styles.footerText}>© 2025 FINTECH PRO - Proyecto de Tesis. Universidad Autónoma de Ciudad Juárez.</p>
          <p style={styles.footerText}>Diseño e Implementación de una Arquitectura de Servicios en la Nube para Entornos Fintech en Microsoft Azure - José Ángel Guzmán Moreno.</p>
        </div>
      </footer>
    </div>
  );
}

export default MainHub;