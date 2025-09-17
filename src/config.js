// src/config.js
// Configuración centralizada para todo el proyecto

// URLs de APIs
export const API_CONFIG = {
  BASE_URL: "https://apim-fintech-dev-jagm.azure-api.net/func-fintech-dev-jagm-v1",
  ENDPOINTS: {
    TRANSACTIONS: "/transactions",
    GLOBAL_TRANSACTIONS: "/GetGlobalTransactions"
  },
  // Helper para construir URLs completas
  getURL: function(endpoint) {
    return `${this.BASE_URL}${endpoint}`;
  }
};

// Reglas de validación para transacciones
export const VALIDATION_RULES = {
  TRANSACTION: {
    MIN_AMOUNT: 0.01,
    MAX_AMOUNT: 10000,
    MAX_DESCRIPTION_LENGTH: 100
  },
  EMAIL: {
    // Dominios permitidos para transferencias UACJ
    ALLOWED_DOMAINS: [
      '@uacj.mx',
      '@alumnos.uacj.mx', 
      '@uacj.edu.mx'
    ],
    // Regex para validación básica de email
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
};

// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: "Dashboard Financiero UACJ",
  VERSION: "1.0.0",
  // Número de transacciones a mostrar en el dashboard
  MAX_RECENT_TRANSACTIONS: 8,
  // Intervalo en horas para el cálculo de gráficos
  CHART_HOURS_RANGE: 12,
  // Configuración de paginación
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100
  }
};

// Headers HTTP estándar
export const HTTP_HEADERS = {
  JSON: {
    "Content-Type": "application/json"
  },
  // Helper para crear headers con autorización
  withAuth: function(accessToken) {
    return {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    };
  }
};

// Mensajes de error estándar
export const ERROR_MESSAGES = {
  NETWORK: {
    CONNECTION_FAILED: "Error de conexión. Verifica tu conexión a internet.",
    TIMEOUT: "La solicitud ha tardado demasiado. Intenta nuevamente.",
    SERVER_ERROR: "Error del servidor. Intenta más tarde."
  },
  AUTH: {
    NOT_AUTHENTICATED: "Usuario no autenticado",
    TOKEN_EXPIRED: "Token expirado. Inicia sesión nuevamente.",
    INSUFFICIENT_PERMISSIONS: "No tienes permisos para realizar esta acción."
  },
  VALIDATION: {
    REQUIRED_FIELD: "Este campo es requerido",
    INVALID_EMAIL: "Formato de email inválido",
    INVALID_AMOUNT: "Debe ingresar un monto válido mayor a 0",
    AMOUNT_TOO_HIGH: `El monto no puede ser mayor a $${VALIDATION_RULES.TRANSACTION.MAX_AMOUNT.toLocaleString()}`,
    INVALID_UACJ_DOMAIN: "Solo se permiten emails de UACJ (@uacj.mx, @alumnos.uacj.mx, @uacj.edu.mx)"
  },
  TRANSACTION: {
    CREATE_FAILED: "Error al crear la transacción",
    LOAD_FAILED: "Error al cargar las transacciones",
    INVALID_DATA: "Datos de transacción inválidos"
  }
};

// Configuración de desarrollo vs producción
export const ENVIRONMENT = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  // Configuración específica por ambiente
  DEBUG: {
    ENABLE_CONSOLE_LOGS: process.env.NODE_ENV === 'development',
    ENABLE_DEBUG_BUTTONS: process.env.NODE_ENV === 'development'
  }
};

// Utilidades para validación
export const VALIDATORS = {
  email: {
    // Valida formato básico de email
    isValidFormat: (email) => VALIDATION_RULES.EMAIL.REGEX.test(email),
    
    // Valida que sea un dominio UACJ permitido
    isUACJDomain: (email) => {
      if (!email) return false;
      const emailLower = email.toLowerCase();
      return VALIDATION_RULES.EMAIL.ALLOWED_DOMAINS.some(domain => 
        emailLower.endsWith(domain)
      );
    },
    
    // Validación completa para emails UACJ
    validateUACJEmail: (email) => {
      if (!email) {
        return ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD;
      }
      
      if (!VALIDATORS.email.isValidFormat(email)) {
        return ERROR_MESSAGES.VALIDATION.INVALID_EMAIL;
      }
      
      if (!VALIDATORS.email.isUACJDomain(email)) {
        return ERROR_MESSAGES.VALIDATION.INVALID_UACJ_DOMAIN;
      }
      
      return null; // Sin errores
    }
  },
  
  transaction: {
    // Valida monto de transacción
    validateAmount: (amount) => {
      if (!amount || isNaN(amount)) {
        return ERROR_MESSAGES.VALIDATION.INVALID_AMOUNT;
      }
      
      const numAmount = parseFloat(amount);
      
      if (numAmount < VALIDATION_RULES.TRANSACTION.MIN_AMOUNT) {
        return ERROR_MESSAGES.VALIDATION.INVALID_AMOUNT;
      }
      
      if (numAmount > VALIDATION_RULES.TRANSACTION.MAX_AMOUNT) {
        return ERROR_MESSAGES.VALIDATION.AMOUNT_TOO_HIGH;
      }
      
      return null; // Sin errores
    },
    
    // Valida descripción
    validateDescription: (description) => {
      if (description && description.length > VALIDATION_RULES.TRANSACTION.MAX_DESCRIPTION_LENGTH) {
        return `La descripción no puede exceder ${VALIDATION_RULES.TRANSACTION.MAX_DESCRIPTION_LENGTH} caracteres`;
      }
      return null; // Sin errores
    }
  }
};

// Configuración para gráficos y visualizaciones
export const CHART_CONFIG = {
  COLORS: {
    PRIMARY: '#A98B51',
    GRID: 'rgba(169, 139, 81, 0.1)',
    AXIS: 'rgba(255, 255, 255, 0.7)'
  },
  GRADIENTS: {
    AREA_FILL: {
      id: 'volumeGradient',
      stops: [
        { offset: '5%', color: '#A98B51', opacity: 0.3 },
        { offset: '95%', color: '#A98B51', opacity: 0 }
      ]
    }
  },
  DIMENSIONS: {
    DEFAULT_HEIGHT: 250,
    TOOLTIP_STYLE: {
      background: 'linear-gradient(135deg, #263B35, #162C2C)',
      border: '1px solid rgba(169, 139, 81, 0.2)',
      borderRadius: '8px',
      color: '#FFFFFF'
    }
  }
};

// Configuración de tiempo y fechas
export const TIME_CONFIG = {
  LOCALE: 'es-MX',
  TIMEZONE: 'America/Mexico_City',
  FORMATS: {
    DATETIME_FULL: 'dd/MM/yyyy HH:mm:ss',
    DATE_ONLY: 'dd/MM/yyyy',
    TIME_ONLY: 'HH:mm'
  }
};

// Helper functions para uso común
export const HELPERS = {
  // Formatear fecha para mostrar
  formatDate: (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      return new Date(dateString).toLocaleString(TIME_CONFIG.LOCALE);
    } catch {
      return 'Fecha inválida';
    }
  },
  
  // Formatear dinero
  formatMoney: (amount) => {
    if (isNaN(amount)) return '$0.00';
    return `$${Math.abs(amount).toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  },
  
  // Log condicional (solo en desarrollo)
  debugLog: (message, data = null) => {
    if (ENVIRONMENT.DEBUG.ENABLE_CONSOLE_LOGS) {
      if (data) {
        console.log(`[DEBUG] ${message}`, data);
      } else {
        console.log(`[DEBUG] ${message}`);
      }
    }
  },
  
  // Generar ID único simple
  generateId: () => {
    return new Date().toISOString() + Math.random().toString(36).substring(7);
  }
};