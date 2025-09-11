import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";

const styles = {
  container: {
    maxWidth: '800px',
    margin: 'auto',
    color: '#FFFFFF'
  },
  userInfo: {
    background: 'linear-gradient(135deg, #263B35, #162C2C)',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '1px solid rgba(169, 139, 81, 0.2)'
  },
  title: {
    color: '#FFFFFF',
    fontSize: '1.8rem',
    fontWeight: '600',
    marginBottom: '10px',
    background: 'linear-gradient(45deg, #FFFFFF, #A98B51)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  userDetail: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '5px'
  },
  userValue: {
    color: '#A98B51',
    fontWeight: '600'
  },
  transactionsSection: {
    background: '#263B35',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid rgba(169, 139, 81, 0.15)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: '1.3rem',
    fontWeight: '600',
    margin: 0
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  button: {
    padding: '8px 16px',
    background: 'linear-gradient(45deg, #A98B51, #C5A572)',
    color: '#0C1010',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  buttonSecondary: {
    background: 'linear-gradient(45deg, #162C2C, #263B35)',
    color: '#FFFFFF',
    border: '1px solid rgba(169, 139, 81, 0.3)'
  },
  buttonInfo: {
    background: 'linear-gradient(45deg, #17a2b8, #20c997)',
    color: '#FFFFFF',
    fontSize: '12px',
    padding: '6px 12px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    background: 'linear-gradient(135deg, #162C2C, #263B35)',
    borderRadius: '8px',
    border: '2px dashed rgba(169, 139, 81, 0.3)'
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '1rem'
  },
  transactionsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  transactionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    marginBottom: '8px',
    background: 'linear-gradient(135deg, #162C2C, #111F20)',
    borderRadius: '8px',
    border: '1px solid rgba(169, 139, 81, 0.1)'
  },
  transactionDescription: {
    color: '#FFFFFF',
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '3px'
  },
  transactionDate: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.85rem'
  },
  transactionAmount: {
    fontSize: '1.1rem',
    fontWeight: '700',
    fontFamily: 'monospace'
  },
  loadingState: {
    textAlign: 'center',
    padding: '50px',
    color: '#FFFFFF'
  },
  errorState: {
    textAlign: 'center',
    padding: '50px',
    color: '#DC3545',
    background: 'rgba(220, 53, 69, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(220, 53, 69, 0.3)'
  },
  badge: {
    background: '#A98B51',
    color: '#0C1010',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '0.8rem',
    fontWeight: '600',
    marginLeft: '8px'
  }
};

// Modal simple
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  content: {
    background: 'linear-gradient(135deg, #263B35, #162C2C)',
    padding: '30px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '80vh',
    overflowY: 'auto',
    border: '1px solid rgba(169, 139, 81, 0.2)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #A98B51',
    paddingBottom: '15px',
    marginBottom: '20px'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#A98B51'
  }
};

function GlobalTransactionsModal({ transactions, onClose }) {
  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <div style={modalStyles.header}>
          <h3 style={{ color: '#FFFFFF', margin: 0 }}>
            Transacciones Globales (Admin)
            <span style={styles.badge}>{transactions.length}</span>
          </h3>
          <button onClick={onClose} style={modalStyles.closeButton}>×</button>
        </div>
        <ul style={styles.transactionsList}>
          {transactions.map((transaction, index) => (
            <li key={transaction.id || index} style={styles.transactionItem}>
              <div>
                <div style={styles.transactionDescription}>
                  {transaction.description || 'Transacción'}
                </div>
                <div style={styles.transactionDate}>
                  {transaction.timestamp 
                    ? new Date(transaction.timestamp).toLocaleString() 
                    : 'Fecha no disponible'
                  }
                </div>
              </div>
              <div style={{
                ...styles.transactionAmount,
                color: transaction.type === 'credit' ? '#28A745' : '#DC3545'
              }}>
                {transaction.type === 'credit' ? '+' : '-'}${transaction.amount || 0}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Dashboard() {
  const { instance, accounts } = useMsal();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [globalTransactions, setGlobalTransactions] = useState(null);
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  // Función simple para obtener transacciones
  async function fetchTransactions(accessToken) {
    try {
      const response = await fetch(
        "https://apim-fintech-dev-jagm.azure-api.net/func-fintech-dev-jagm-v1/transactions",
        {
          method: "GET",
          headers: { 
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error("Error al obtener transacciones:", err);
      setError(`Error al cargar transacciones: ${err.message}`);
    }
  }

  // Función simple para cargar datos iniciales
  async function loadInitialData() {
    if (!accounts || accounts.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const request = { ...loginRequest, account: accounts[0] };
      const tokenResponse = await instance.acquireTokenSilent(request);
      
      // Guardar info del usuario
      setUserInfo({
        name: tokenResponse.account.name || tokenResponse.account.username,
        id: tokenResponse.account.localAccountId
      });

      // Cargar transacciones
      await fetchTransactions(tokenResponse.accessToken);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError("Error al cargar los datos iniciales.");
    } finally {
      setLoading(false);
    }
  }

  // Cargar datos al inicio
  useEffect(() => {
  loadInitialData();
  }, [accounts, instance, loadInitialData]);

  // Función simple para crear transacción de prueba
  async function createSampleTransaction() {
    if (!accounts || accounts.length === 0 || !userInfo) {
      setError("No hay información de usuario disponible");
      return;
    }

    try {
      const request = { ...loginRequest, account: accounts[0] };
      const tokenResponse = await instance.acquireTokenSilent(request);
      
      const sampleTransaction = {
        accountId: userInfo.id,
        amount: Math.floor(Math.random() * 1000) + 10,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(
        "https://apim-fintech-dev-jagm.azure-api.net/func-fintech-dev-jagm-v1/transactions",
        {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${tokenResponse.accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(sampleTransaction)
        }
      );

      if (!response.ok) {
        throw new Error(`Error al crear transacción: ${response.statusText}`);
      }

      // Recargar transacciones
      await fetchTransactions(tokenResponse.accessToken);
    } catch (err) {
      console.error("Error al crear transacción:", err);
      setError(`Error al crear transacción: ${err.message}`);
    }
  }

  // Función simple para obtener transacciones globales
  async function fetchGlobalTransactions() {
    setIsAdminLoading(true);
    setError(null);

    try {
      const request = { ...loginRequest, account: accounts[0] };
      const tokenResponse = await instance.acquireTokenSilent(request);
      
      const response = await fetch(
        "https://apim-fintech-dev-jagm.azure-api.net/func-fintech-dev-jagm-v1/GetGlobalTransactions",
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${tokenResponse.accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 401) {
        throw new Error("Token rechazado. Verifica la configuración.");
      }
      
      if (response.status === 403) {
        throw new Error("Acceso denegado. Se requiere rol de administrador.");
      }
      
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setGlobalTransactions(data.transactions || []);

    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setIsAdminLoading(false);
    }
  }

  // Función simple para debug del token
  function debugToken() {
    instance.acquireTokenSilent({...loginRequest, account: accounts[0]})
    .then(tokenResponse => {
      const payload = JSON.parse(atob(tokenResponse.accessToken.split('.')[1]));
      console.log('Token payload:', payload);
      alert(`Usuario: ${payload.name}\nRoles: ${JSON.stringify(payload.roles || 'Sin roles')}`);
    })
    .catch(console.error);
  }

  // Estados de carga y error
  if (loading) {
    return (
      <div style={styles.loadingState}>
        Cargando datos financieros...
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorState}>
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={loadInitialData} style={styles.button}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Información del usuario */}
      <div style={styles.userInfo}>
        <h2 style={styles.title}>Dashboard Financiero</h2>
        <p style={styles.userDetail}>
          Usuario: <span style={styles.userValue}>{userInfo?.name}</span>
        </p>
        <p style={styles.userDetail}>
          ID: <span style={styles.userValue}>{userInfo?.id}</span>
        </p>
      </div>

      {/* Sección de transacciones */}
      <section style={styles.transactionsSection}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>
            Historial de Transacciones
            <span style={styles.badge}>{transactions.length}</span>
          </h3>
          <div style={styles.buttonGroup}>
            <button onClick={debugToken} style={{...styles.button, ...styles.buttonInfo}}>
              Debug Token
            </button>
            <button 
              onClick={fetchGlobalTransactions} 
              disabled={isAdminLoading} 
              style={{...styles.button, ...styles.buttonSecondary}}
            >
              {isAdminLoading ? "Cargando..." : "Ver Todas (Admin)"}
            </button>
            <button onClick={createSampleTransaction} style={styles.button}>
              Crear Transacción
            </button>
          </div>
        </div>

        {/* Lista de transacciones */}
        {transactions.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No tienes transacciones aún.</p>
            <p style={styles.emptyText}>Haz clic en "Crear Transacción" para comenzar.</p>
          </div>
        ) : (
          <ul style={styles.transactionsList}>
            {transactions.map((transaction, index) => (
              <li key={transaction.id || index} style={styles.transactionItem}>
                <div>
                  <div style={styles.transactionDescription}>
                    {transaction.description || `Transacción #${index + 1}`}
                  </div>
                  <div style={styles.transactionDate}>
                    {transaction.timestamp 
                      ? new Date(transaction.timestamp).toLocaleString() 
                      : 'Fecha no disponible'
                    }
                  </div>
                </div>
                <div style={{
                  ...styles.transactionAmount,
                  color: transaction.amount > 0 ? '#28A745' : '#DC3545'
                }}>
                  ${transaction.amount || 0}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Modal para transacciones globales */}
      {globalTransactions && (
        <GlobalTransactionsModal
          transactions={globalTransactions}
          onClose={() => setGlobalTransactions(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;