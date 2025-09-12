import React, { useState, useEffect, useCallback } from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Activity, DollarSign, TrendingUp, AlertTriangle, Users, Clock, Plus, Eye } from 'lucide-react';

// URL de tu APIM (de tu configuración)
const API_BASE_URL = "https://apim-fintech-dev-jagm.azure-api.net/func-fintech-dev-jagm-v1";

// Estilos usando tu paleta exacta (mantener todos los existentes)
const styles = {
  container: {
    color: '#FFFFFF',
    fontFamily: "'Inter', 'Arial', sans-serif"
  },
  header: {
    marginBottom: '32px',
    textAlign: 'center'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '8px',
    background: 'linear-gradient(45deg, #FFFFFF, #A98B51)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: 1.2
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '1.1rem',
    margin: 0
  },
  
  // KPI Cards usando tu estilo
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '40px'
  },
  kpiCard: {
    background: 'linear-gradient(135deg, #263B35, #162C2C)',
    padding: '30px',
    borderRadius: '16px',
    border: '1px solid rgba(169, 139, 81, 0.2)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative'
  },
  kpiCardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(169, 139, 81, 0.15)'
  },
  kpiHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  kpiIcon: {
    padding: '12px',
    background: 'rgba(169, 139, 81, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(169, 139, 81, 0.2)'
  },
  kpiTrend: {
    fontSize: '14px',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  kpiTrendPositive: {
    color: '#A98B51',
    background: 'rgba(169, 139, 81, 0.1)'
  },
  kpiTrendNegative: {
    color: '#DC3545',
    background: 'rgba(220, 53, 69, 0.1)'
  },
  kpiValue: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#A98B51',
    marginBottom: '8px',
    lineHeight: 1
  },
  kpiLabel: {
    color: '#FFFFFF',
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '4px'
  },
  kpiSubLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.9rem'
  },

  // Sección de gráficos
  chartsSection: {
    marginBottom: '40px'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
    marginBottom: '32px'
  },
  chartCard: {
    background: 'linear-gradient(135deg, #263B35, #162C2C)',
    padding: '30px',
    borderRadius: '16px',
    border: '1px solid rgba(169, 139, 81, 0.2)'
  },
  chartTitle: {
    color: '#FFFFFF',
    fontSize: '1.3rem',
    fontWeight: '600',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  // Sección de transacciones (mejorada)
  transactionsSection: {
    background: 'linear-gradient(135deg, #263B35, #162C2C)',
    padding: '30px',
    borderRadius: '16px',
    border: '1px solid rgba(169, 139, 81, 0.2)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: '1.3rem',
    fontWeight: '600',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  badge: {
    background: '#A98B51',
    color: '#0C1010',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: '600',
    marginLeft: '8px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  button: {
    padding: '12px 24px',
    background: 'linear-gradient(45deg, #A98B51, #C5A572)',
    color: '#0C1010',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(169, 139, 81, 0.25)'
  },
  buttonSecondary: {
    background: 'linear-gradient(45deg, #162C2C, #263B35)',
    color: '#FFFFFF',
    border: '1px solid rgba(169, 139, 81, 0.3)',
    boxShadow: 'none'
  },
  buttonInfo: {
    background: 'linear-gradient(45deg, #17a2b8, #20c997)',
    color: '#FFFFFF',
    boxShadow: '0 4px 12px rgba(23, 162, 184, 0.25)'
  },

  // Lista de transacciones mejorada
  transactionsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  transactionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(169, 139, 81, 0.1)',
    transition: 'all 0.3s ease'
  },
  transactionItemHover: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(169, 139, 81, 0.2)',
    transform: 'translateX(4px)'
  },
  transactionInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  transactionIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px'
  },
  transactionIconPositive: {
    background: 'rgba(169, 139, 81, 0.1)',
    border: '1px solid rgba(169, 139, 81, 0.2)',
    color: '#A98B51'
  },
  transactionIconNegative: {
    background: 'rgba(220, 53, 69, 0.1)',
    border: '1px solid rgba(220, 53, 69, 0.2)',
    color: '#DC3545'
  },
  transactionDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  transactionDescription: {
    color: '#FFFFFF',
    fontSize: '1rem',
    fontWeight: '600'
  },
  transactionDate: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.85rem'
  },
  transactionFrom: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.8rem',
    fontStyle: 'italic'
  },
  transactionAmount: {
    fontSize: '1.2rem',
    fontWeight: '700',
    fontFamily: 'monospace'
  },
  transactionAmountPositive: {
    color: '#A98B51'
  },
  transactionAmountNegative: {
    color: '#DC3545'
  },

  // Estados
  loadingState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'linear-gradient(135deg, #263B35, #162C2C)',
    borderRadius: '16px',
    border: '1px solid rgba(169, 139, 81, 0.2)'
  },
  loadingIcon: {
    color: '#A98B51',
    marginBottom: '16px',
    animation: 'pulse 2s infinite'
  },
  errorState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'rgba(220, 53, 69, 0.05)',
    borderRadius: '16px',
    border: '1px solid rgba(220, 53, 69, 0.2)',
    color: '#DC3545'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '12px',
    border: '2px dashed rgba(169, 139, 81, 0.2)'
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1rem',
    marginBottom: '8px'
  },
  emptySubtext: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '0.9rem'
  }
};

// NUEVOS ESTILOS PARA EL MODAL (agregando funcionalidad nueva)
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

// Componentes existentes (mantener todos)
const KPICard = ({ icon: Icon, title, value, subtitle, trend, onClick }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div 
      style={{
        ...styles.kpiCard,
        ...(hovered ? styles.kpiCardHover : {})
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.kpiHeader}>
        <div style={styles.kpiIcon}>
          <Icon size={24} color="#A98B51" />
        </div>
        {trend && (
          <div style={{
            ...styles.kpiTrend,
            ...(trend > 0 ? styles.kpiTrendPositive : styles.kpiTrendNegative)
          }}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div style={styles.kpiValue}>{value}</div>
      <div style={styles.kpiLabel}>{title}</div>
      {subtitle && <div style={styles.kpiSubLabel}>{subtitle}</div>}
    </div>
  );
};

const TransactionItem = ({ transaction, index }) => {
  const [hovered, setHovered] = useState(false);
  const isPositive = transaction.type === 'credit' || transaction.amount > 0;
  
  return (
    <div 
      style={{
        ...styles.transactionItem,
        ...(hovered ? styles.transactionItemHover : {})
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.transactionInfo}>
        <div style={{
          ...styles.transactionIcon,
          ...(isPositive ? styles.transactionIconPositive : styles.transactionIconNegative)
        }}>
          {isPositive ? '+' : '-'}
        </div>
        <div style={styles.transactionDetails}>
          <div style={styles.transactionDescription}>
            {transaction.description || `Transacción #${index + 1}`}
          </div>
          <div style={styles.transactionDate}>
            {transaction.timestamp ? 
              new Date(transaction.timestamp).toLocaleString() : 
              'Fecha no disponible'
            }
          </div>
          {/* NUEVO: Mostrar origen/destino */}
          {transaction.fromAccountName && transaction.toAccount && (
            <div style={styles.transactionFrom}>
              De: {transaction.fromAccountName} → A: {transaction.toAccount}
            </div>
          )}
        </div>
      </div>
      <div style={{
        ...styles.transactionAmount,
        ...(isPositive ? styles.transactionAmountPositive : styles.transactionAmountNegative)
      }}>
        {isPositive ? '+' : ''}${Math.abs(transaction.amount || 0).toLocaleString()}
      </div>
    </div>
  );
};

// NUEVO: Modal de Nueva Transacción
const NewTransactionModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
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
};

// Modal mejorado usando tu estilo (mantener existente)
const GlobalTransactionsModal = ({ transactions, onClose }) => (
  <div style={{
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  }}>
    <div style={{
      background: 'linear-gradient(135deg, #263B35, #162C2C)',
      padding: '30px',
      borderRadius: '16px',
      width: '90%',
      maxWidth: '800px',
      maxHeight: '80vh',
      overflowY: 'auto',
      border: '1px solid rgba(169, 139, 81, 0.2)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid #A98B51',
        paddingBottom: '15px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#FFFFFF', margin: 0, fontSize: '1.3rem', fontWeight: '600' }}>
          Transacciones Globales (Admin)
          <span style={styles.badge}>{transactions.length}</span>
        </h3>
        <button onClick={onClose} style={{
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          color: '#A98B51'
        }}>×</button>
      </div>
      <div style={styles.transactionsList}>
        {transactions.map((transaction, index) => (
          <TransactionItem key={transaction.id || index} transaction={transaction} index={index} />
        ))}
      </div>
    </div>
  </div>
);

// Función para procesar datos para gráficos (mantener existente)
const processTransactionsForChart = (transactions) => {
  if (!transactions || transactions.length === 0) return [];

  const hourlyData = {};
  const now = new Date();
  
  // Inicializar últimas 12 horas
  for (let i = 11; i >= 0; i--) {
    const hour = new Date(now.getTime() - (i * 60 * 60 * 1000));
    const hourKey = hour.getHours().toString().padStart(2, '0') + ':00';
    hourlyData[hourKey] = { time: hourKey, transactions: 0, volume: 0 };
  }

  // Procesar transacciones reales
  transactions.forEach(transaction => {
    if (transaction.timestamp) {
      const transactionDate = new Date(transaction.timestamp);
      const hourKey = transactionDate.getHours().toString().padStart(2, '0') + ':00';
      
      if (hourlyData[hourKey]) {
        hourlyData[hourKey].transactions += 1;
        hourlyData[hourKey].volume += Math.abs(transaction.amount || 0);
      }
    }
  });

  return Object.values(hourlyData);
};

function Dashboard() {
  const { instance, accounts } = useMsal();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [globalTransactions, setGlobalTransactions] = useState(null);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  
  // NUEVO: Estados para el modal de nueva transacción
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
  const [isCreatingTransaction, setIsCreatingTransaction] = useState(false);

  // Función para obtener token
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

  // Tu lógica existente de fetchTransactions (mantener)
  const fetchTransactions = useCallback(async (accessToken) => {
    try {
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
  }, []);

  // Tu lógica existente de loadInitialData (mantener)
  const loadInitialData = useCallback(async () => {
    if (!accounts || accounts.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const request = { ...loginRequest, account: accounts[0] };
      const tokenResponse = await instance.acquireTokenSilent(request);
      
      setUserInfo({
        name: tokenResponse.account.name || tokenResponse.account.username,
        id: tokenResponse.account.localAccountId,
        email: tokenResponse.account.username
      });

      await fetchTransactions(tokenResponse.accessToken);
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

  // NUEVA: Función para crear transacción con modal
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
      await fetchTransactions(accessToken);
      
    } catch (err) {
      console.error("Error al crear transacción:", err);
      setError(`Error al crear transacción: ${err.message}`);
    } finally {
      setIsCreatingTransaction(false);
    }
  };

  // MODIFICADA: Función existente createSampleTransaction
  const createSampleTransaction = async () => {
    if (!accounts || accounts.length === 0 || !userInfo) {
      setError("No hay información de usuario disponible");
      return;
    }

    try {
      const accessToken = await getAccessToken();
      
      const sampleTransaction = {
        fromAccountId: userInfo.id,
        fromAccountName: userInfo.name,
        fromAccountEmail: userInfo.email,
        toAccount: "Usuario de Prueba",
        amount: Math.floor(Math.random() * 1000) + 10,
        description: "Transacción de prueba generada automáticamente",
        timestamp: new Date().toISOString(),
        type: 'debit',
        category: 'test',
        source: 'web_app'
      };

      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(sampleTransaction)
      });

      if (!response.ok) {
        throw new Error(`Error al crear transacción: ${response.statusText}`);
      }

      await fetchTransactions(accessToken);
    } catch (err) {
      console.error("Error al crear transacción:", err);
      setError(`Error al crear transacción: ${err.message}`);
    }
  };

  // Mantener todas tus funciones existentes
  const fetchGlobalTransactions = async () => {
    setIsAdminLoading(true);
    setError(null);

    try {
      const accessToken = await getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/GetGlobalTransactions`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });

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
  };

  const debugToken = () => {
    instance.acquireTokenSilent({...loginRequest, account: accounts[0]})
      .then(tokenResponse => {
        const payload = JSON.parse(atob(tokenResponse.accessToken.split('.')[1]));
        console.log('Token payload:', payload);
        alert(`Usuario: ${payload.name}\nRoles: ${JSON.stringify(payload.roles || 'Sin roles')}`);
      })
      .catch(console.error);
  };

  // Cálculos para KPIs (mantener existentes)
  const totalVolume = transactions.reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
  const avgTransaction = transactions.length > 0 ? totalVolume / transactions.length : 0;
  const recentTransactions = transactions.filter(t => {
    if (!t.timestamp) return false;
    const transactionDate = new Date(t.timestamp);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return transactionDate > oneDayAgo;
  }).length;

  // Datos para gráficos (mantener existentes)
  const chartData = processTransactionsForChart(transactions);

  // Estados de carga y error (mantener existentes)
  if (loading) {
    return (
      <div style={styles.loadingState}>
        <div style={styles.loadingIcon}>
          <Activity size={48} />
        </div>
        <h3 style={{ color: '#FFFFFF', margin: '16px 0 8px 0' }}>Cargando Dashboard</h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
          Conectando con Azure Functions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorState}>
        <AlertTriangle size={48} style={{ marginBottom: '16px' }} />
        <h3 style={{ margin: '0 0 16px 0' }}>Error del Sistema</h3>
        <p style={{ marginBottom: '24px' }}>{error}</p>
        <button onClick={loadInitialData} style={{
          ...styles.button,
          background: 'linear-gradient(45deg, #DC3545, #E85D75)'
        }}>
          Reintentar Conexión
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header (mantener) */}
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard Financiero</h1>
        <p style={styles.subtitle}>
          Bienvenido, <strong>{userInfo?.name}</strong> • Última actualización: {new Date().toLocaleTimeString()}
        </p>
      </div>

      {/* KPI Cards (mantener) */}
      <div style={styles.kpiGrid}>
        <KPICard
          icon={DollarSign}
          title="Volumen Total"
          value={`$${totalVolume.toLocaleString()}`}
          subtitle="Todas las transacciones"
          trend={12.5}
        />
        <KPICard
          icon={Activity}
          title="Transacciones Totales"
          value={transactions.length.toLocaleString()}
          subtitle="Historial completo"
        />
        <KPICard
          icon={TrendingUp}
          title="Promedio por Transacción"
          value={`$${avgTransaction.toFixed(2)}`}
          subtitle="Valor medio"
        />
        <KPICard
          icon={Clock}
          title="Últimas 24 Horas"
          value={recentTransactions.toString()}
          subtitle="Actividad reciente"
          trend={8.3}
        />
      </div>

      {/* Charts Section (mantener todas las gráficas) */}
      {chartData.length > 0 && (
        <div style={styles.chartsSection}>
          <div style={styles.chartsGrid}>
            {/* Gráfico de volumen */}
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>
                <TrendingUp size={20} />
                Volumen por Hora
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A98B51" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#A98B51" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(169, 139, 81, 0.1)" />
                  <XAxis dataKey="time" stroke="rgba(255, 255, 255, 0.7)" fontSize={12} />
                  <YAxis stroke="rgba(255, 255, 255, 0.7)" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'linear-gradient(135deg, #263B35, #162C2C)', 
                      border: '1px solid rgba(169, 139, 81, 0.2)', 
                      borderRadius: '8px',
                      color: '#FFFFFF'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#A98B51" 
                    fillOpacity={1} 
                    fill="url(#volumeGradient)" 
                    strokeWidth={2} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de barras */}
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>
                <Activity size={20} />
                Transacciones por Hora
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(169, 139, 81, 0.1)" />
                  <XAxis dataKey="time" stroke="rgba(255, 255, 255, 0.7)" fontSize={10} />
                  <YAxis stroke="rgba(255, 255, 255, 0.7)" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'linear-gradient(135deg, #263B35, #162C2C)', 
                      border: '1px solid rgba(169, 139, 81, 0.2)', 
                      borderRadius: '8px',
                      color: '#FFFFFF'
                    }} 
                  />
                  <Bar dataKey="transactions" fill="#A98B51" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Sección de transacciones (MODIFICADA para incluir nuevo botón) */}
      <section style={styles.transactionsSection}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>
            Historial de Transacciones
            <span style={styles.badge}>{transactions.length}</span>
          </h3>
          <div style={styles.buttonGroup}>
            <button onClick={debugToken} style={{...styles.button, ...styles.buttonInfo}}>
              <Eye size={16} />
              Debug Token
            </button>
            <button 
              onClick={fetchGlobalTransactions} 
              disabled={isAdminLoading} 
              style={{...styles.button, ...styles.buttonSecondary}}
            >
              <Users size={16} />
              {isAdminLoading ? "Cargando..." : "Ver Todas (Admin)"}
            </button>
            {/* NUEVO: Botón de Nueva Transacción con Modal */}
            <button 
              onClick={() => setShowNewTransactionModal(true)} 
              style={styles.button}
              disabled={isCreatingTransaction}
            >
              <Plus size={16} />
              Nueva Transacción
            </button>
            <button onClick={createSampleTransaction} style={{...styles.button, ...styles.buttonSecondary}}>
              <Activity size={16} />
              Transacción Prueba
            </button>
          </div>
        </div>

        {/* Lista de transacciones (mantener) */}
        {transactions.length === 0 ? (
          <div style={styles.emptyState}>
            <DollarSign size={48} color="rgba(169, 139, 81, 0.5)" style={{ marginBottom: '16px' }} />
            <p style={styles.emptyText}>No tienes transacciones aún.</p>
            <p style={styles.emptySubtext}>Haz clic en "Nueva Transacción" para comenzar.</p>
          </div>
        ) : (
          <div style={styles.transactionsList}>
            {transactions.slice(-8).reverse().map((transaction, index) => (
              <TransactionItem key={transaction.id || index} transaction={transaction} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* NUEVO: Modal para nueva transacción */}
      <NewTransactionModal
        isOpen={showNewTransactionModal}
        onClose={() => setShowNewTransactionModal(false)}
        onSubmit={createTransaction}
        isLoading={isCreatingTransaction}
      />

      {/* Modal para transacciones globales (mantener) */}
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