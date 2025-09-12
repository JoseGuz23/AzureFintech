// src/Dashboard.js - Adaptado a tu configuración existente
import React, { useState, useEffect, useCallback } from 'react';
import { useMsal } from "@azure/msal-react";

// Configuración de tu proyecto (extraída de tu bitácora)
const loginRequest = {
    scopes: ["api://4f36cf4f-dc44-47a9-907a-b81219672cea/access_as_user"]
};

// URL de tu APIM (ajustar según tu configuración)
const API_BASE_URL = "https://apim-fintech-dev-jagm.azure-api.net/func-fintech-dev-jagm-v1";

const styles = {
  // ... (mantener todos los estilos anteriores - son los mismos)
  container: {
    maxWidth: '100%',
    margin: '0 auto',
    color: '#FFFFFF'
  },
  userInfo: {
    background: 'linear-gradient(135deg, #263B35, #162C2C)',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '25px',
    border: '1px solid rgba(169, 139, 81, 0.2)'
  },
  title: {
    color: '#A98B51',
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '15px'
  },
  userDetail: {
    fontSize: '1rem',
    marginBottom: '8px',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  userValue: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  transactionsSection: {
    background: 'linear-gradient(135deg, #162C2C, #111F20)',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid rgba(169, 139, 81, 0.2)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  sectionTitle: {
    color: '#A98B51',
    fontSize: '1.5rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  button: {
    background: 'linear-gradient(45deg, #A98B51, #D4AF37)',
    color: '#0C1010',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  buttonSecondary: {
    background: 'linear-gradient(45deg, #6C757D, #868E96)',
    color: '#FFFFFF'
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
  transactionFrom: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.8rem',
    marginTop: '3px'
  },
  badge: {
    background: '#A98B51',
    color: '#0C1010',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '0.8rem',
    fontWeight: '600',
    marginLeft: '8px'
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
  }
};

// Estilos del modal - mantener los mismos
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  content: {
    background: 'linear-gradient(135deg, #263B35, #162C2C)',
    padding: '30px',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '500px',
    border: '1px solid rgba(169, 139, 81, 0.2)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #A98B51',
    paddingBottom: '15px',
    marginBottom: '25px'
  },
  title: {
    color: '#FFFFFF',
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: 0
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.8rem',
    cursor: 'pointer',
    color: '#A98B51',
    transition: 'color 0.3s ease'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    color: '#A98B51',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  input: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(169, 139, 81, 0.3)',
    borderRadius: '8px',
    padding: '12px 15px',
    color: '#FFFFFF',
    fontSize: '1rem',
    transition: 'all 0.3s ease'
  },
  buttonRow: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end',
    marginTop: '10px'
  },
  submitButton: {
    background: 'linear-gradient(45deg, #A98B51, #D4AF37)',
    color: '#0C1010',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  cancelButton: {
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '12px 25px',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  errorText: {
    color: '#DC3545',
    fontSize: '0.85rem',
    marginTop: '5px'
  }
};

// Modal de Nueva Transacción (mismo componente)
function NewTransactionModal({ isOpen, onClose, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    amount: '',
    recipient: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({ amount: '', recipient: '', description: '' });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'La cantidad debe ser mayor a 0';
    }
    
    if (!formData.recipient.trim()) {
      newErrors.recipient = 'El destinatario es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        amount: parseFloat(formData.amount),
        recipient: formData.recipient.trim(),
        description: formData.description.trim() || `Transferencia a ${formData.recipient.trim()}`
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.content} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <h3 style={modalStyles.title}>Nueva Transacción</h3>
          <button 
            onClick={onClose} 
            style={modalStyles.closeButton}
            disabled={isLoading}
          >
            ×
          </button>
        </div>
        
        <form style={modalStyles.form} onSubmit={handleSubmit}>
          <div style={modalStyles.inputGroup}>
            <label style={modalStyles.label}>Cantidad ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              style={modalStyles.input}
              placeholder="0.00"
              disabled={isLoading}
            />
            {errors.amount && <div style={modalStyles.errorText}>{errors.amount}</div>}
          </div>

          <div style={modalStyles.inputGroup}>
            <label style={modalStyles.label}>Destinatario</label>
            <input
              type="text"
              value={formData.recipient}
              onChange={(e) => handleInputChange('recipient', e.target.value)}
              style={modalStyles.input}
              placeholder="Nombre del destinatario o cuenta"
              disabled={isLoading}
            />
            {errors.recipient && <div style={modalStyles.errorText}>{errors.recipient}</div>}
          </div>

          <div style={modalStyles.inputGroup}>
            <label style={modalStyles.label}>Descripción (Opcional)</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              style={modalStyles.input}
              placeholder="Concepto de la transacción"
              disabled={isLoading}
            />
          </div>

          <div style={modalStyles.buttonRow}>
            <button 
              type="button" 
              onClick={onClose}
              style={modalStyles.cancelButton}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              style={modalStyles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Procesando...' : 'Crear Transacción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente principal adaptado a tu configuración
function Dashboard() {
  const { instance, accounts } = useMsal();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
  const [isCreatingTransaction, setIsCreatingTransaction] = useState(false);

  // Función para obtener token usando tu configuración existente
  const getAccessToken = useCallback(async () => {
    try {
      const request = { ...loginRequest, account: accounts[0] };
      const tokenResponse = await instance.acquireTokenSilent(request);
      return tokenResponse.accessToken;
    } catch (error) {
      console.error("Error obteniendo token:", error);
      throw error;
    }
  }, [instance, accounts]);

  // Función para obtener transacciones adaptada a tu API
  const fetchTransactions = useCallback(async () => {
    try {
      const accessToken = await getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error("Error al obtener transacciones:", err);
      setError(`Error al cargar transacciones: ${err.message}`);
    }
  }, [getAccessToken]);

  // Carga inicial
  const loadInitialData = useCallback(async () => {
    if (!accounts || accounts.length === 0) return;
    setLoading(true);
    setError(null);
    
    try {
      const tokenResponse = await instance.acquireTokenSilent({
        ...loginRequest, 
        account: accounts[0]
      });
      
      setUserInfo({
        name: tokenResponse.account.name || tokenResponse.account.username,
        id: tokenResponse.account.localAccountId,
        email: tokenResponse.account.username
      });

      await fetchTransactions();
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError("Error al cargar los datos iniciales.");
    } finally {
      setLoading(false);
    }
  }, [accounts, instance, fetchTransactions]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Función para crear nueva transacción adaptada a tu proyecto
  const createTransaction = async (transactionData) => {
    if (!accounts || accounts.length === 0 || !userInfo) {
      setError("No hay información de usuario disponible");
      return;
    }

    setIsCreatingTransaction(true);
    try {
      const accessToken = await getAccessToken();
      
      const newTransaction = {
        fromAccountId: userInfo.id,
        fromAccountName: userInfo.name,
        fromAccountEmail: userInfo.email,
        toAccount: transactionData.recipient,
        amount: transactionData.amount,
        description: transactionData.description,
        timestamp: new Date().toISOString(),
        type: 'debit',
        category: 'transfer',
        source: 'web_app',
        status: 'completed'
      };

      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newTransaction)
      });

      if (!response.ok) {
        throw new Error(`Error al crear transacción: ${response.statusText}`);
      }

      // Cerrar modal y recargar transacciones
      setShowNewTransactionModal(false);
      await fetchTransactions();
      
    } catch (err) {
      console.error("Error al crear transacción:", err);
      setError(`Error al crear transacción: ${err.message}`);
    } finally {
      setIsCreatingTransaction(false);
    }
  };

  // UI States (mantener los mismos)
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
          Email: <span style={styles.userValue}>{userInfo?.email}</span>
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
            <button 
              onClick={() => setShowNewTransactionModal(true)}
              style={styles.button}
              disabled={isCreatingTransaction}
            >
              Nueva Transacción
            </button>
          </div>
        </div>

        {/* Lista de transacciones */}
        {transactions.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No tienes transacciones aún.</p>
            <p style={styles.emptyText}>Haz clic en "Nueva Transacción" para comenzar.</p>
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
                  {/* Mostrar información de origen/destino */}
                  {transaction.fromAccountName && transaction.toAccount && (
                    <div style={styles.transactionFrom}>
                      De: {transaction.fromAccountName} → A: {transaction.toAccount}
                    </div>
                  )}
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
        )}
      </section>

      {/* Modal para nueva transacción */}
      <NewTransactionModal
        isOpen={showNewTransactionModal}
        onClose={() => setShowNewTransactionModal(false)}
        onSubmit={createTransaction}
        isLoading={isCreatingTransaction}
      />
    </div>
  );
}

export default Dashboard;