// src/styles/theme.js
// Colores principales del tema UACJ
export const colors = {
  primary: '#162C2C',
  secondary: '#263B35', 
  dark: '#111F20',
  darker: '#0C1010',
  accent: '#A98B51',
  accentLight: '#C5A572',
  accentDark: '#D4AF37',
  white: '#FFFFFF',
  success: '#28A745',
  error: '#DC3545',
  info: '#17a2b8',
  infoLight: '#20c997'
};

// Gradientes reutilizables
export const gradients = {
  primary: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
  background: `linear-gradient(135deg, ${colors.darker}, ${colors.primary})`,
  accent: `linear-gradient(45deg, ${colors.accent}, ${colors.accentLight})`,
  accentBright: `linear-gradient(45deg, ${colors.accent}, ${colors.accentDark})`,
  error: `linear-gradient(45deg, ${colors.error}, #E85D75)`,
  info: `linear-gradient(45deg, ${colors.info}, ${colors.infoLight})`,
  text: `linear-gradient(45deg, ${colors.white}, ${colors.accent})`
};

// Estilos base del dashboard
export const dashboardStyles = {
  container: {
    color: colors.white,
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
    background: gradients.text,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: 1.2
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '1.1rem',
    margin: 0
  }
};

// Estilos para KPI Cards
export const kpiStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '40px'
  },
  card: {
    background: gradients.primary,
    padding: '30px',
    borderRadius: '16px',
    border: `1px solid rgba(${colors.accent.substring(1)}, 0.2)`.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', '),
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative'
  },
  cardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(169, 139, 81, 0.15)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  icon: {
    padding: '12px',
    background: 'rgba(169, 139, 81, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(169, 139, 81, 0.2)'
  },
  trend: {
    fontSize: '14px',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  trendPositive: {
    color: colors.accent,
    background: 'rgba(169, 139, 81, 0.1)'
  },
  trendNegative: {
    color: colors.error,
    background: 'rgba(220, 53, 69, 0.1)'
  },
  value: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: colors.accent,
    marginBottom: '8px',
    lineHeight: 1
  },
  label: {
    color: colors.white,
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '4px'
  },
  subLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.9rem'
  }
};

// Estilos para gráficos
export const chartStyles = {
  section: {
    marginBottom: '40px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
    marginBottom: '32px'
  },
  card: {
    background: gradients.primary,
    padding: '30px',
    borderRadius: '16px',
    border: '1px solid rgba(169, 139, 81, 0.2)'
  },
  title: {
    color: colors.white,
    fontSize: '1.3rem',
    fontWeight: '600',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
};

// Estilos para transacciones
export const transactionStyles = {
  section: {
    background: gradients.primary,
    padding: '30px',
    borderRadius: '16px',
    border: '1px solid rgba(169, 139, 81, 0.2)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    color: colors.white,
    fontSize: '1.3rem',
    fontWeight: '600',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  badge: {
    background: colors.accent,
    color: colors.darker,
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: '600',
    marginLeft: '8px'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(169, 139, 81, 0.1)',
    transition: 'all 0.3s ease'
  },
  itemHover: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(169, 139, 81, 0.2)',
    transform: 'translateX(4px)'
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  icon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px'
  },
  iconPositive: {
    background: 'rgba(169, 139, 81, 0.1)',
    border: '1px solid rgba(169, 139, 81, 0.2)',
    color: colors.accent
  },
  iconNegative: {
    background: 'rgba(220, 53, 69, 0.1)',
    border: '1px solid rgba(220, 53, 69, 0.2)',
    color: colors.error
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  description: {
    color: colors.white,
    fontSize: '1rem',
    fontWeight: '600'
  },
  date: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.85rem'
  },
  from: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.8rem',
    fontStyle: 'italic'
  },
  amount: {
    fontSize: '1.2rem',
    fontWeight: '700',
    fontFamily: 'monospace'
  },
  amountPositive: {
    color: colors.accent
  },
  amountNegative: {
    color: colors.error
  }
};

// Estilos para botones
export const buttonStyles = {
  group: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  base: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  primary: {
    background: gradients.accent,
    color: colors.darker,
    boxShadow: '0 4px 12px rgba(169, 139, 81, 0.25)'
  },
  secondary: {
    background: gradients.primary,
    color: colors.white,
    border: '1px solid rgba(169, 139, 81, 0.3)',
    boxShadow: 'none'
  },
  info: {
    background: gradients.info,
    color: colors.white,
    boxShadow: '0 4px 12px rgba(23, 162, 184, 0.25)'
  }
};

// Estilos para estados (loading, error, empty)
export const stateStyles = {
  loading: {
    textAlign: 'center',
    padding: '60px 20px',
    background: gradients.primary,
    borderRadius: '16px',
    border: '1px solid rgba(169, 139, 81, 0.2)'
  },
  loadingIcon: {
    color: colors.accent,
    marginBottom: '16px',
    animation: 'pulse 2s infinite'
  },
  error: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'rgba(220, 53, 69, 0.05)',
    borderRadius: '16px',
    border: '1px solid rgba(220, 53, 69, 0.2)',
    color: colors.error
  },
  empty: {
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

// Estilos para modales
export const modalStyles = {
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
    background: gradients.primary,
    padding: '30px',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '80vh',
    overflowY: 'auto',
    border: '1px solid rgba(169, 139, 81, 0.2)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `2px solid ${colors.accent}`,
    paddingBottom: '15px',
    marginBottom: '25px'
  },
  title: {
    color: colors.white,
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: 0
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.8rem',
    cursor: 'pointer',
    color: colors.accent,
    transition: 'color 0.3s ease'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '0.95rem',
    fontWeight: '500'
  },
  input: {
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(169, 139, 81, 0.3)',
    borderRadius: '6px',
    color: colors.white,
    fontSize: '1rem',
    transition: 'border-color 0.3s ease'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '10px'
  },
  submitButton: {
    flex: 1,
    padding: '12px',
    background: gradients.accent,
    color: colors.darker,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  cancelButton: {
    flex: 1,
    padding: '12px',
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.8)',
    border: '1px solid rgba(169, 139, 81, 0.3)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease'
  },
  errorText: {
    color: colors.error,
    fontSize: '0.9rem',
    marginTop: '5px'
  },
  successText: {
    color: colors.success,
    fontSize: '0.9rem',
    marginTop: '5px'
  },
  helperText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.85rem',
    marginTop: '4px'
  },
  exampleEmails: {
    background: 'rgba(169, 139, 81, 0.1)',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid rgba(169, 139, 81, 0.2)',
    marginTop: '10px'
  },
  exampleTitle: {
    color: colors.accent,
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '8px'
  },
  exampleItem: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.85rem',
    margin: '4px 0'
  }
};

// Configuración de tooltips para gráficos (Recharts)
export const chartConfig = {
  tooltipStyle: {
    background: gradients.primary,
    border: '1px solid rgba(169, 139, 81, 0.2)',
    borderRadius: '8px',
    color: colors.white
  },
  gridColor: 'rgba(169, 139, 81, 0.1)',
  axisColor: 'rgba(255, 255, 255, 0.7)',
  areaGradient: {
    id: 'volumeGradient',
    stops: [
      { offset: '5%', color: colors.accent, opacity: 0.3 },
      { offset: '95%', color: colors.accent, opacity: 0 }
    ]
  }
};