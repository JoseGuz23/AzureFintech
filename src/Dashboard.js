// src/Dashboard.js - Versión Desktop Profesional Corregida
import React, { useState, useEffect, useCallback } from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Activity, DollarSign, TrendingUp, AlertTriangle, Users, Clock, Plus, Eye } from 'lucide-react';

// Importaciones centralizadas
import { 
  API_CONFIG, 
  APP_CONFIG, 
  HTTP_HEADERS, 
  ERROR_MESSAGES, 
  ENVIRONMENT, 
  HELPERS,
  CHART_CONFIG 
} from './config';

import { 
  transactionStyles, 
  stateStyles,
  colors 
} from './styles/theme';

// Importar todos los componentes de una vez
import { 
  KPICard, 
  UACJTransactionModal, 
  GlobalTransactionsModal 
} from './components';

/**
 * Procesa las transacciones para mostrar en gráficos
 * @param {Array} transactions - Array de transacciones
 * @returns {Array} Datos formateados para gráficos
 */
const processTransactionsForChart = (transactions) => {
  if (!transactions || transactions.length === 0) return [];

  const hourlyData = {};
  const now = new Date();
  
  // Crear estructura de datos para las últimas horas
  for (let i = APP_CONFIG.CHART_HOURS_RANGE - 1; i >= 0; i--) {
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
        hourlyData[hourKey].volume += Math.abs(transaction.amount) || 0;
      }
    }
  });

  return Object.values(hourlyData);
};

/**
 * Componente mejorado para mostrar cada transacción
 */
const ImprovedTransactionItem = ({ transaction, index, isMobile }) => {
  return (
    <div className="transaction-item">
      <div className="transaction-left">
        <div className="transaction-icon">
          <Plus size={isMobile ? 14 : 18} color={colors.primary} />
        </div>
        <div className="transaction-info">
          <h4 className="transaction-description">
            Transacción #{index + 1}
          </h4>
          <p className="transaction-date">
            {HELPERS.formatDate(transaction.timestamp)}
          </p>
        </div>
      </div>
      <div className="transaction-right">
        <div className="transaction-amount">
          {HELPERS.formatMoney(Math.abs(transaction.amount || 0))}
        </div>
      </div>
    </div>
  );
};

/**
 * Componente principal del Dashboard
 */
function Dashboard() {
  // Estados principales
  const { instance, accounts } = useMsal();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  
  // Estados para modales
  const [globalTransactions, setGlobalTransactions] = useState(null);
  const [showUACJTransactionModal, setShowUACJTransactionModal] = useState(false);
  
  // Estados para operaciones en progreso
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [isCreatingTransaction, setIsCreatingTransaction] = useState(false);

  // ✅ Estado para responsive design
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * Obtiene las transacciones del usuario desde la API
   */
  const fetchTransactions = useCallback(async (accessToken) => {
    try {
      HELPERS.debugLog('Fetching user transactions...');
      
      const response = await fetch(
        API_CONFIG.getURL(API_CONFIG.ENDPOINTS.TRANSACTIONS),
        {
          method: "GET",
          headers: HTTP_HEADERS.withAuth(accessToken)
        }
      );

      if (!response.ok) {
        throw new Error(`${ERROR_MESSAGES.NETWORK.SERVER_ERROR} (${response.status})`);
      }
      
      const data = await response.json();
      const userTransactions = data.transactions || [];
      setTransactions(userTransactions);
      
      HELPERS.debugLog('User transactions loaded', userTransactions.length);
    } catch (err) {
      console.error("Error al obtener transacciones:", err);
      setError(`${ERROR_MESSAGES.TRANSACTION.LOAD_FAILED}: ${err.message}`);
    }
  }, []);

  /**
   * Carga inicial de datos del usuario
   */
  const loadInitialData = useCallback(async () => {
    if (!accounts || accounts.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const request = { ...loginRequest, account: accounts[0] };
      const tokenResponse = await instance.acquireTokenSilent(request);
      
      // Extraer información del usuario del token
      setUserInfo({
        name: tokenResponse.account.name || tokenResponse.account.username,
        id: tokenResponse.account.localAccountId,
        email: tokenResponse.account.username
      });

      // Cargar transacciones del usuario
      await fetchTransactions(tokenResponse.accessToken);
      
    } catch (err) {
      console.error("Error al cargar datos iniciales:", err);
      setError(ERROR_MESSAGES.NETWORK.CONNECTION_FAILED);
    } finally {
      setLoading(false);
    }
  }, [accounts, instance, fetchTransactions]);

  // Efecto para carga inicial
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  /**
   * Crea una nueva transacción UACJ
   */
  const createUACJTransaction = async (transactionData) => {
    if (!accounts || accounts.length === 0 || !userInfo) {
      setError(ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED);
      return;
    }

    setIsCreatingTransaction(true);
    
    try {
      const request = { ...loginRequest, account: accounts[0] };
      const tokenResponse = await instance.acquireTokenSilent(request);
      
      HELPERS.debugLog('Creating new UACJ transaction', transactionData);
      
      const response = await fetch(
        API_CONFIG.getURL(API_CONFIG.ENDPOINTS.TRANSACTIONS),
        {
          method: "POST",
          headers: HTTP_HEADERS.withAuth(tokenResponse.accessToken),
          body: JSON.stringify({
            recipient: transactionData.recipient,
            amount: transactionData.amount,
            description: transactionData.description
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${ERROR_MESSAGES.TRANSACTION.CREATE_FAILED}: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      HELPERS.debugLog('Transaction created successfully', result);

      // Cerrar modal y recargar datos
      setShowUACJTransactionModal(false);
      await fetchTransactions(tokenResponse.accessToken);
      
    } catch (err) {
      console.error("Error al crear transacción:", err);
      setError(err.message);
    } finally {
      setIsCreatingTransaction(false);
    }
  };

  /**
   * Obtiene todas las transacciones del sistema (solo admin)
   */
  const fetchGlobalTransactions = async () => {
    setIsAdminLoading(true);
    setError(null);

    try {
      const request = { ...loginRequest, account: accounts[0] };
      const tokenResponse = await instance.acquireTokenSilent(request);
      
      const response = await fetch(
        API_CONFIG.getURL(API_CONFIG.ENDPOINTS.GLOBAL_TRANSACTIONS),
        {
          method: "GET",
          headers: HTTP_HEADERS.withAuth(tokenResponse.accessToken)
        }
      );

      if (response.status === 401) {
        throw new Error(ERROR_MESSAGES.AUTH.TOKEN_EXPIRED);
      }
      
      if (response.status === 403) {
        throw new Error(ERROR_MESSAGES.AUTH.INSUFFICIENT_PERMISSIONS);
      }
      
      if (!response.ok) {
        throw new Error(`${ERROR_MESSAGES.NETWORK.SERVER_ERROR}: ${response.status}`);
      }

      const data = await response.json();
      setGlobalTransactions(data.transactions || []);
      
    } catch (err) {
      console.error('Error al obtener transacciones globales:', err);
      setError(err.message);
    } finally {
      setIsAdminLoading(false);
    }
  };

  async function updateTransaction(transactionId, currentAmount) {
    if (!accounts || accounts.length === 0) {
      setError(ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED);
      return;
    }

    const newAmountStr = prompt(`Actualizar monto de la transacción\n\nMonto actual: $${currentAmount}`, currentAmount);
    
    if (!newAmountStr) return;
    
    const newAmount = parseFloat(newAmountStr);
    
    if (isNaN(newAmount) || newAmount <= 0) {
      alert("Monto inválido. Debe ser un número positivo.");
      return;
    }

    try {
      const request = { ...loginRequest, account: accounts[0] };
      const tokenResponse = await instance.acquireTokenSilent(request);
      
      const response = await fetch(
        `${API_CONFIG.getURL(API_CONFIG.ENDPOINTS.TRANSACTIONS)}/${transactionId}`,
        {
          method: "PUT",
          headers: HTTP_HEADERS.withAuth(tokenResponse.accessToken),
          body: JSON.stringify({
            amount: newAmount,
            timestamp: new Date().toISOString()
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.statusText}`);
      }

      const result = await response.json();
      alert(`${result.message}`);
      
      await fetchTransactions(tokenResponse.accessToken);
      
    } catch (err) {
      console.error("Error al actualizar:", err);
      alert(`Error al actualizar: ${err.message}`);
      setError(`Error al actualizar: ${err.message}`);
    }
  }

  async function deleteTransaction(transactionId, amount) {
    if (!accounts || accounts.length === 0) {
      setError(ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED);
      return;
    }

    if (!window.confirm(`¿Estás seguro de eliminar esta transacción?\n\nMonto: $${amount}\nID: ${transactionId}\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const request = { ...loginRequest, account: accounts[0] };
      const tokenResponse = await instance.acquireTokenSilent(request);
      
      const response = await fetch(
        `${API_CONFIG.getURL(API_CONFIG.ENDPOINTS.TRANSACTIONS)}/${transactionId}`,
        {
          method: "DELETE",
          headers: HTTP_HEADERS.withAuth(tokenResponse.accessToken)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.statusText}`);
      }

      const result = await response.json();
      alert(`${result.message}`);
      
      await fetchTransactions(tokenResponse.accessToken);
      
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert(`Error al eliminar: ${err.message}`);
      setError(`Error al eliminar: ${err.message}`);
    }
  }
  /**
   * Función de debug para mostrar información del token (solo desarrollo)
   */
  const debugToken = () => {
    if (!ENVIRONMENT.DEBUG.ENABLE_DEBUG_BUTTONS) return;
    
    instance.acquireTokenSilent({...loginRequest, account: accounts[0]})
      .then(tokenResponse => {
        const payload = JSON.parse(atob(tokenResponse.accessToken.split('.')[1]));
        HELPERS.debugLog('Token payload', payload);
        
        const debugInfo = `
Usuario: ${payload.name || 'N/A'}
Email: ${payload.email || payload.preferred_username || 'N/A'}
ID: ${payload.oid || payload.sub || 'N/A'}
Roles: ${JSON.stringify(payload.roles || [])}
Tenant: ${payload.tid || 'N/A'}
        `.trim();
        
        alert(debugInfo);
      })
      .catch(console.error);
  };

  // Cálculos de métricas (KPIs)
  const metrics = {
    totalVolume: transactions.reduce((sum, t) => sum + Math.abs(t.amount || 0), 0),
    totalCount: transactions.length,
    avgTransaction: transactions.length > 0 ? 
      transactions.reduce((sum, t) => sum + Math.abs(t.amount || 0), 0) / transactions.length : 0,
    recentCount: transactions.filter(t => {
      if (!t.timestamp) return false;
      const transactionDate = new Date(t.timestamp);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return transactionDate > oneDayAgo;
    }).length
  };

  const chartData = processTransactionsForChart(transactions);

  // Renderizado condicional para estados de carga y error
  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          textAlign: 'center'
        }}>
          <Activity size={isMobile ? 40 : 60} color="#A98B51" style={{ marginBottom: '20px' }} />
          <h3 style={{ 
            color: colors.white, 
            margin: '0 0 12px 0',
            fontSize: isMobile ? '1.3rem' : '1.8rem',
            fontWeight: '600'
          }}>
            Cargando Dashboard Financiero
          </h3>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            margin: 0,
            fontSize: isMobile ? '1rem' : '1.1rem'
          }}>
            Conectando con Azure Functions...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          textAlign: 'center'
        }}>
          <AlertTriangle size={isMobile ? 40 : 60} color="#DC3545" style={{ marginBottom: '20px' }} />
          <h3 style={{ 
            margin: '0 0 16px 0',
            fontSize: isMobile ? '1.3rem' : '1.8rem',
            color: '#DC3545',
            fontWeight: '600'
          }}>Error del Sistema</h3>
          <p style={{ 
            marginBottom: '24px',
            fontSize: isMobile ? '1rem' : '1.1rem',
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: '600px'
          }}>{error}</p>
          <button 
            onClick={loadInitialData} 
            className="dashboard-button"
            style={{
              background: 'linear-gradient(45deg, #DC3545, #E85D75)',
              color: 'white'
            }}
          >
            Reintentar Conexión
          </button>
        </div>
      </div>
    );
  }

  // ✅ Renderizado principal del dashboard - SIN wrapper problemático
  return (
    <div className="dashboard-container">
      {/* Encabezado */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">{APP_CONFIG.NAME}</h1>
        <p className="dashboard-subtitle">
          Bienvenido, <strong>{userInfo?.name}</strong> • {HELPERS.formatDate(new Date().toISOString())}
        </p>
      </header>

      {/* Tarjetas de métricas clave (KPIs) */}
      <section className="kpi-grid" aria-label="Métricas principales">
        <KPICard
          icon={DollarSign}
          title="Volumen Total"
          value={HELPERS.formatMoney(metrics.totalVolume)}
          subtitle="Todas las transacciones"
          trend={12.5}
          isMobile={isMobile}
        />
        <KPICard
          icon={Activity}
          title="Transacciones Totales"
          value={metrics.totalCount.toLocaleString()}
          subtitle="Historial completo"
          isMobile={isMobile}
        />
        <KPICard
          icon={TrendingUp}
          title="Promedio por Transacción"
          value={HELPERS.formatMoney(metrics.avgTransaction)}
          subtitle="Valor promedio"
          isMobile={isMobile}
        />
        <KPICard
          icon={Clock}
          title="Últimas 24 Horas"
          value={metrics.recentCount.toString()}
          subtitle="Actividad reciente"
          trend={8.3}
          isMobile={isMobile}
        />
      </section>

      {/* Gráficos de análisis */}
      {chartData.length > 0 && (
        <section className="charts-section" aria-label="Gráficos de análisis">
          <div className="charts-grid">
            {/* Gráfico de área - Volumen por hora */}
            <div className="chart-card">
              <h3 className="chart-title">
                <TrendingUp size={isMobile ? 18 : 24} />
                Volumen por Hora
              </h3>
              <ResponsiveContainer 
                width="100%" 
                height={isMobile ? 220 : 320}
                className="recharts-responsive-container"
              >
                <AreaChart data={chartData} margin={{ 
                  top: 10, 
                  right: isMobile ? 10 : 30, 
                  left: isMobile ? 10 : 20, 
                  bottom: 10 
                }}>
                  <defs>
                    <linearGradient id={CHART_CONFIG.GRADIENTS.AREA_FILL.id} x1="0" y1="0" x2="0" y2="1">
                      {CHART_CONFIG.GRADIENTS.AREA_FILL.stops.map((stop, index) => (
                        <stop 
                          key={index} 
                          offset={stop.offset} 
                          stopColor={stop.color} 
                          stopOpacity={stop.opacity} 
                        />
                      ))}
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_CONFIG.COLORS.GRID} />
                  <XAxis 
                    dataKey="time" 
                    stroke={CHART_CONFIG.COLORS.AXIS} 
                    fontSize={isMobile ? 11 : 13}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke={CHART_CONFIG.COLORS.AXIS} 
                    fontSize={isMobile ? 11 : 13}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      ...CHART_CONFIG.DIMENSIONS.TOOLTIP_STYLE,
                      fontSize: isMobile ? '13px' : '14px'
                    }}
                    formatter={(value, name) => [HELPERS.formatMoney(value), 'Volumen']}
                    labelFormatter={(label) => `Hora: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="volume" 
                    stroke={CHART_CONFIG.COLORS.PRIMARY} 
                    fillOpacity={1} 
                    fill={`url(#${CHART_CONFIG.GRADIENTS.AREA_FILL.id})`} 
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: isMobile ? 4 : 5, fill: CHART_CONFIG.COLORS.PRIMARY }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de barras - Cantidad de transacciones por hora */}
            <div className="chart-card">
              <h3 className="chart-title">
                <Activity size={isMobile ? 18 : 24} />
                Transacciones por Hora
              </h3>
              <ResponsiveContainer 
                width="100%" 
                height={isMobile ? 220 : 320}
                className="recharts-responsive-container"
              >
                <BarChart data={chartData} margin={{ 
                  top: 10, 
                  right: isMobile ? 10 : 30, 
                  left: isMobile ? 10 : 20, 
                  bottom: 10 
                }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_CONFIG.COLORS.GRID} />
                  <XAxis 
                    dataKey="time" 
                    stroke={CHART_CONFIG.COLORS.AXIS} 
                    fontSize={isMobile ? 10 : 12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke={CHART_CONFIG.COLORS.AXIS} 
                    fontSize={isMobile ? 11 : 13}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      ...CHART_CONFIG.DIMENSIONS.TOOLTIP_STYLE,
                      fontSize: isMobile ? '13px' : '14px'
                    }}
                    formatter={(value, name) => [value, 'Transacciones']}
                    labelFormatter={(label) => `Hora: ${label}`}
                  />
                  <Bar 
                    dataKey="transactions" 
                    fill={CHART_CONFIG.COLORS.PRIMARY} 
                    radius={[6, 6, 0, 0]}
                    maxBarSize={isMobile ? 35 : 45}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      {/* Sección de transacciones */}
      <section style={transactionStyles.section} aria-label="Historial de transacciones">
        <div className="transaction-header">
          <h3 className="transaction-title">
            Historial de Transacciones
            <span className="transaction-badge">{transactions.length}</span>
          </h3>
          
          {/* Grupo de botones de acción */}
          <div className="button-group">
            {/* Botón de debug (solo en desarrollo) */}
            {ENVIRONMENT.DEBUG.ENABLE_DEBUG_BUTTONS && (
              <button 
                onClick={debugToken} 
                className="dashboard-button"
                style={{
                  background: 'linear-gradient(45deg, #17A2B8, #3FBDCF)',
                  color: 'white'
                }}
                title="Mostrar información del token JWT"
              >
                <Eye size={16} />
                Debug
              </button>
            )}
            
            {/* Botón para ver transacciones globales (admin) */}
            <button 
              onClick={fetchGlobalTransactions} 
              disabled={isAdminLoading} 
              className="dashboard-button"
              style={{
                background: 'linear-gradient(45deg, #6C757D, #ADB5BD)',
                color: 'white'
              }}
              title="Ver todas las transacciones del sistema (requiere permisos de admin)"
            >
              <Users size={16} />
              {isAdminLoading ? "Cargando..." : "Admin"}
            </button>
            
            {/* ✅ BOTÓN PRINCIPAL CORREGIDO */}
            <button 
              onClick={() => setShowUACJTransactionModal(true)} 
              className="dashboard-button"
              style={{
                background: 'linear-gradient(45deg, #A98B51, #D4AF37)',
                color: 'white'
              }}
              disabled={isCreatingTransaction}
              title="Crear nueva transferencia a usuarios UACJ"
            >
              <Plus size={16} />
              {isMobile ? "Nueva Transacción" : "Nueva Transferencia UACJ"}
            </button>
          </div>
        </div>

        {/* Lista de transacciones o estado vacío */}
        {transactions.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #162C2C, #263B35)',
            borderRadius: '16px',
            border: '2px dashed rgba(169, 139, 81, 0.3)',
            padding: isMobile ? '40px 20px' : '60px 40px'
          }}>
            <DollarSign size={isMobile ? 48 : 64} color="rgba(169, 139, 81, 0.5)" style={{ marginBottom: '20px' }} />
            <h3 style={{
              color: '#FFFFFF',
              fontSize: isMobile ? '1.2rem' : '1.5rem',
              fontWeight: '600',
              margin: '0 0 12px 0'
            }}>No tienes transacciones aún</h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: isMobile ? '1rem' : '1.1rem',
              margin: 0,
              maxWidth: '400px'
            }}>
              Haz clic en "Nueva Transferencia UACJ" para comenzar a usar el sistema.
            </p>
          </div>
        ) : (
          <div style={transactionStyles.list}>
            {transactions
              .slice(-APP_CONFIG.MAX_RECENT_TRANSACTIONS)
              .reverse()
              .map((transaction, index) => (
                <ImprovedTransactionItem 
                  key={transaction.id || `transaction-${index}`} 
                  transaction={transaction} 
                  index={index}
                  isMobile={isMobile}
                />
              ))
            }
            
            {/* Mostrar indicador si hay más transacciones */}
            {transactions.length > APP_CONFIG.MAX_RECENT_TRANSACTIONS && (
              <div style={{
                textAlign: 'center',
                padding: isMobile ? '20px' : '30px',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: isMobile ? '0.9rem' : '1rem',
                borderTop: '1px solid rgba(169, 139, 81, 0.1)',
                marginTop: '20px'
              }}>
                Mostrando las últimas {APP_CONFIG.MAX_RECENT_TRANSACTIONS} transacciones de {transactions.length} total
              </div>
            )}
          </div>
        )}
      </section>

      {/* Modal para nueva transferencia UACJ */}
      <UACJTransactionModal
        isOpen={showUACJTransactionModal}
        onClose={() => setShowUACJTransactionModal(false)}
        onSubmit={createUACJTransaction}
        isLoading={isCreatingTransaction}
        isMobile={isMobile}
      />

      {/* Modal para transacciones globales (admin) */}
      {globalTransactions && (
        <GlobalTransactionsModal
          transactions={globalTransactions}
          onClose={() => setGlobalTransactions(null)}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}

export default Dashboard;
