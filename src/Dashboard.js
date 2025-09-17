// src/Dashboard.js - Versión Final Limpia y Optimizada
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
  dashboardStyles, 
  kpiStyles, 
  chartStyles, 
  transactionStyles, 
  buttonStyles, 
  stateStyles,
  colors 
} from './styles/theme';

// Importar todos los componentes de una vez
import { 
  KPICard, 
  TransactionItem, 
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
      <div style={stateStyles.loading}>
        <div style={stateStyles.loadingIcon}>
          <Activity size={48} />
        </div>
        <h3 style={{ color: colors.white, margin: '16px 0 8px 0' }}>
          Cargando Dashboard
        </h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
          Conectando con Azure Functions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={stateStyles.error}>
        <AlertTriangle size={48} style={{ marginBottom: '16px' }} />
        <h3 style={{ margin: '0 0 16px 0' }}>Error del Sistema</h3>
        <p style={{ marginBottom: '24px' }}>{error}</p>
        <button 
          onClick={loadInitialData} 
          style={{
            ...buttonStyles.base,
            ...buttonStyles.primary,
            background: 'linear-gradient(45deg, #DC3545, #E85D75)'
          }}
        >
          Reintentar Conexión
        </button>
      </div>
    );
  }

  // Renderizado principal del dashboard
  return (
    <div style={dashboardStyles.container}>
      {/* Encabezado */}
      <header style={dashboardStyles.header}>
        <h1 style={dashboardStyles.title}>{APP_CONFIG.NAME}</h1>
        <p style={dashboardStyles.subtitle}>
          Bienvenido, <strong>{userInfo?.name}</strong> • {HELPERS.formatDate(new Date().toISOString())}
        </p>
      </header>

      {/* Tarjetas de métricas clave (KPIs) */}
      <section style={kpiStyles.grid} aria-label="Métricas principales">
        <KPICard
          icon={DollarSign}
          title="Volumen Total"
          value={HELPERS.formatMoney(metrics.totalVolume)}
          subtitle="Todas las transacciones"
          trend={12.5}
        />
        <KPICard
          icon={Activity}
          title="Transacciones Totales"
          value={metrics.totalCount.toLocaleString()}
          subtitle="Historial completo"
        />
        <KPICard
          icon={TrendingUp}
          title="Promedio por Transacción"
          value={HELPERS.formatMoney(metrics.avgTransaction)}
          subtitle="Valor promedio"
        />
        <KPICard
          icon={Clock}
          title="Últimas 24 Horas"
          value={metrics.recentCount.toString()}
          subtitle="Actividad reciente"
          trend={8.3}
        />
      </section>

      {/* Gráficos de análisis */}
      {chartData.length > 0 && (
        <section style={chartStyles.section} aria-label="Gráficos de análisis">
          <div style={chartStyles.grid}>
            {/* Gráfico de área - Volumen por hora */}
            <div style={chartStyles.card}>
              <h3 style={chartStyles.title}>
                <TrendingUp size={20} />
                Volumen por Hora
              </h3>
              <ResponsiveContainer width="100%" height={CHART_CONFIG.DIMENSIONS.DEFAULT_HEIGHT}>
                <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke={CHART_CONFIG.COLORS.AXIS} 
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={CHART_CONFIG.DIMENSIONS.TOOLTIP_STYLE}
                    formatter={(value, name) => [HELPERS.formatMoney(value), 'Volumen']}
                    labelFormatter={(label) => `Hora: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="volume" 
                    stroke={CHART_CONFIG.COLORS.PRIMARY} 
                    fillOpacity={1} 
                    fill={`url(#${CHART_CONFIG.GRADIENTS.AREA_FILL.id})`} 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: CHART_CONFIG.COLORS.PRIMARY }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de barras - Cantidad de transacciones por hora */}
            <div style={chartStyles.card}>
              <h3 style={chartStyles.title}>
                <Activity size={20} />
                Transacciones por Hora
              </h3>
              <ResponsiveContainer width="100%" height={CHART_CONFIG.DIMENSIONS.DEFAULT_HEIGHT}>
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_CONFIG.COLORS.GRID} />
                  <XAxis 
                    dataKey="time" 
                    stroke={CHART_CONFIG.COLORS.AXIS} 
                    fontSize={10}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke={CHART_CONFIG.COLORS.AXIS} 
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={CHART_CONFIG.DIMENSIONS.TOOLTIP_STYLE}
                    formatter={(value, name) => [value, 'Transacciones']}
                    labelFormatter={(label) => `Hora: ${label}`}
                  />
                  <Bar 
                    dataKey="transactions" 
                    fill={CHART_CONFIG.COLORS.PRIMARY} 
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      {/* Sección de transacciones */}
      <section style={transactionStyles.section} aria-label="Historial de transacciones">
        <div style={transactionStyles.header}>
          <h3 style={transactionStyles.title}>
            Historial de Transacciones
            <span style={transactionStyles.badge}>{transactions.length}</span>
          </h3>
          
          {/* Grupo de botones de acción */}
          <div style={buttonStyles.group}>
            {/* Botón de debug (solo en desarrollo) */}
            {ENVIRONMENT.DEBUG.ENABLE_DEBUG_BUTTONS && (
              <button 
                onClick={debugToken} 
                style={{...buttonStyles.base, ...buttonStyles.info}}
                title="Mostrar información del token JWT"
              >
                <Eye size={16} />
                Debug Token
              </button>
            )}
            
            {/* Botón para ver transacciones globales (admin) */}
            <button 
              onClick={fetchGlobalTransactions} 
              disabled={isAdminLoading} 
              style={{...buttonStyles.base, ...buttonStyles.secondary}}
              title="Ver todas las transacciones del sistema (requiere permisos de admin)"
            >
              <Users size={16} />
              {isAdminLoading ? "Cargando..." : "Ver Todas (Admin)"}
            </button>
            
            {/* Botón principal para nueva transacción */}
            <button 
              onClick={() => setShowUACJTransactionModal(true)} 
              style={{...buttonStyles.base, ...buttonStyles.primary}}
              disabled={isCreatingTransaction}
              title="Crear nueva transferencia a usuarios UACJ"
            >
              <Plus size={16} />
              Nueva Transferencia UACJ
            </button>
          </div>
        </div>

        {/* Lista de transacciones o estado vacío */}
        {transactions.length === 0 ? (
          <div style={stateStyles.empty}>
            <DollarSign size={48} color="rgba(169, 139, 81, 0.5)" style={{ marginBottom: '16px' }} />
            <p style={stateStyles.emptyText}>No tienes transacciones aún.</p>
            <p style={stateStyles.emptySubtext}>
              Haz clic en "Nueva Transferencia UACJ" para comenzar.
            </p>
          </div>
        ) : (
          <div style={transactionStyles.list}>
            {transactions
              .slice(-APP_CONFIG.MAX_RECENT_TRANSACTIONS)
              .reverse()
              .map((transaction, index) => (
                <TransactionItem 
                  key={transaction.id || `transaction-${index}`} 
                  transaction={transaction} 
                  index={index}
                />
              ))
            }
            
            {/* Mostrar indicador si hay más transacciones */}
            {transactions.length > APP_CONFIG.MAX_RECENT_TRANSACTIONS && (
              <div style={{
                textAlign: 'center',
                padding: '20px',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.9rem'
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
      />

      {/* Modal para transacciones globales (admin) */}
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