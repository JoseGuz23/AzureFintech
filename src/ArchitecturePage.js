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
  mainContent: {
    minHeight: '100vh'
  },
  pageHeader: {
    textAlign: 'center',
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  pageTitle: {
    fontSize: '3rem',
    fontWeight: 700,
    marginBottom: '20px',
    background: 'linear-gradient(45deg, #FFFFFF, #A98B51)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  pageSubtitle: {
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.8)',
    maxWidth: '800px',
    margin: '0 auto'
  },
  diagramContainer: {
    background: 'linear-gradient(135deg, #263B35, #162C2C)',
    borderRadius: '20px',
    padding: '40px',
    margin: '40px auto',
    maxWidth: '1200px',
    border: '1px solid rgba(169, 139, 81, 0.2)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
  },
  diagramTitle: {
    textAlign: 'center',
    fontSize: '1.8rem',
    fontWeight: 600,
    marginBottom: '30px',
    color: '#A98B51'
  },
  diagramImage: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
  },
  legend: {
    marginTop: '30px',
    padding: '20px',
    background: 'rgba(169,139,81,0.1)',
    borderRadius: '8px'
  },
  legendTitle: {
    color: '#A98B51',
    fontSize: '1.2rem',
    marginBottom: '15px'
  },
  legendGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
    color: 'rgba(255,255,255,0.8)'
  },
  technicalDetails: {
    maxWidth: '1200px',
    margin: '60px auto',
    padding: '0 20px'
  },
  detailsTitle: {
    textAlign: 'center',
    fontSize: '2.5rem',
    marginBottom: '40px',
    background: 'linear-gradient(45deg, #FFFFFF, #A98B51)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '30px',
    marginTop: '40px'
  },
  detailCard: {
    background: 'linear-gradient(135deg, #263B35, #162C2C)',
    padding: '30px',
    borderRadius: '16px',
    border: '1px solid rgba(169, 139, 81, 0.2)',
    transition: 'all 0.3s ease'
  },
  detailTitle: {
    color: '#A98B51',
    fontSize: '1.4rem',
    fontWeight: 600,
    marginBottom: '15px'
  },
  detailText: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '15px'
  },
  techList: {
    listStyle: 'none',
    padding: 0
  },
  techItem: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '8px',
    position: 'relative',
    paddingLeft: '20px'
  }
};

function ArchitecturePage() {
  return (
    <div style={styles.body}>
      {/* Main Content */}
      <main style={styles.mainContent}>
        {/* Page Header */}
        <section style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Arquitectura de Servicios Azure</h1>
          <p style={styles.pageSubtitle}>
            Infraestructura escalable y segura diseñada específicamente para entornos Fintech, implementando las mejores prácticas de Microsoft Azure.
          </p>
        </section>

        {/* Architecture Diagram */}
        <section style={styles.diagramContainer}>
          <h2 style={styles.diagramTitle}>Diagrama de Arquitectura</h2>
          
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <img src="/Arquitecture.png" alt="Diagrama Arquitectura" style={styles.diagramImage} />
          </div>

          {/* Leyenda del diagrama */}
          <div style={styles.legend}>
            <h3 style={styles.legendTitle}>Flujo de la Arquitectura:</h3>
            <div style={styles.legendGrid}>
              <div>1. Usuario accede via React SPA</div>
              <div>2. Hosting en Static Web Apps</div>
              <div>3. Autenticación con Entra ID</div>
              <div>4. APIs protegidas por APIM</div>
              <div>5. Lógica en Azure Functions</div>
              <div>6. Datos en Cosmos DB</div>
              <div>7. Monitoreo con App Insights</div>
              <div>8. Pruebas con Load Testing</div>
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section style={styles.technicalDetails}>
          <h2 style={styles.detailsTitle}>
            Detalles Técnicos de Implementación
          </h2>

          <div style={styles.detailsGrid}>
            <div style={styles.detailCard}>
              <h3 style={styles.detailTitle}>Frontend & Hosting</h3>
              <p style={styles.detailText}>Aplicación React moderna desplegada en Azure Static Web Apps con integración continua desde GitHub.</p>
              <ul style={styles.techList}>
                <li style={styles.techItem}>→ React 18 con hooks modernos</li>
                <li style={styles.techItem}>→ MSAL.js para autenticación</li>
                <li style={styles.techItem}>→ Azure Static Web Apps</li>
                <li style={styles.techItem}>→ CDN global integrado</li>
                <li style={styles.techItem}>→ CI/CD automático con GitHub Actions</li>
              </ul>
            </div>

            <div style={styles.detailCard}>
              <h3 style={styles.detailTitle}>Autenticación & Seguridad</h3>
              <p style={styles.detailText}>Sistema robusto de identidades con Azure AD y gestión segura de secretos con Key Vault.</p>
              <ul style={styles.techList}>
                <li style={styles.techItem}>→ Microsoft Entra ID (Azure AD)</li>
                <li style={styles.techItem}>→ Tokens JWT con validación</li>
                <li style={styles.techItem}>→ Control de acceso basado en roles</li>
                <li style={styles.techItem}>→ Azure Key Vault para secretos</li>
                <li style={styles.techItem}>→ Políticas de seguridad APIM</li>
              </ul>
            </div>

            <div style={styles.detailCard}>
              <h3 style={styles.detailTitle}>APIs & Compute</h3>
              <p style={styles.detailText}>Arquitectura serverless con Azure Functions protegidas por API Management para escalabilidad automática.</p>
              <ul style={styles.techList}>
                <li style={styles.techItem}>→ Azure Functions (Node.js)</li>
                <li style={styles.techItem}>→ API Management Gateway</li>
                <li style={styles.techItem}>→ RESTful API design</li>
                <li style={styles.techItem}>→ Escalado automático</li>
                <li style={styles.techItem}>→ Versionado de APIs</li>
              </ul>
            </div>

            <div style={styles.detailCard}>
              <h3 style={styles.detailTitle}>Base de Datos</h3>
              <p style={styles.detailText}>Azure Cosmos DB configurado para alta disponibilidad con redundancia geográfica y consistencia global.</p>
              <ul style={styles.techList}>
                <li style={styles.techItem}>→ Azure Cosmos DB (NoSQL)</li>
                <li style={styles.techItem}>→ Redundancia geográfica</li>
                <li style={styles.techItem}>→ Autenticación basada en identidades</li>
                <li style={styles.techItem}>→ Escalado automático de RU</li>
                <li style={styles.techItem}>→ Backup automático</li>
              </ul>
            </div>

            <div style={styles.detailCard}>
              <h3 style={styles.detailTitle}>Monitoreo & Observabilidad</h3>
              <p style={styles.detailText}>Sistema completo de monitoreo con Azure Monitor, alertas inteligentes y dashboard personalizado.</p>
              <ul style={styles.techList}>
                <li style={styles.techItem}>→ Application Insights</li>
                <li style={styles.techItem}>→ Log Analytics Workspace</li>
                <li style={styles.techItem}>→ Alertas proactivas</li>
                <li style={styles.techItem}>→ Dashboard personalizado</li>
                <li style={styles.techItem}>→ Métricas en tiempo real</li>
              </ul>
            </div>

            <div style={styles.detailCard}>
              <h3 style={styles.detailTitle}>Infraestructura & Red</h3>
              <p style={styles.detailText}>Configuración de red segura con balanceadores de carga y grupos de seguridad para proteger el tráfico.</p>
              <ul style={styles.techList}>
                <li style={styles.techItem}>→ Azure Load Balancer</li>
                <li style={styles.techItem}>→ Network Security Groups</li>
                <li style={styles.techItem}>→ Virtual Networks</li>
                <li style={styles.techItem}>→ Firewall rules</li>
                <li style={styles.techItem}>→ SSL/TLS encryption</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ArchitecturePage;