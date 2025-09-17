// src/components/GlobalTransactionsModal.js
import React from 'react';
import { modalStyles, transactionStyles } from '../styles/theme';
import TransactionItem from './TransactionItem';

/**
 * Modal para mostrar todas las transacciones del sistema (solo administradores)
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.transactions - Array de transacciones a mostrar
 * @param {function} props.onClose - Función para cerrar el modal
 */
const GlobalTransactionsModal = ({ transactions, onClose }) => {
  // Manejo de teclas para accesibilidad
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      style={modalStyles.overlay}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="global-modal-title"
    >
      <div 
        style={{
          ...modalStyles.content,
          maxWidth: '800px'
        }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Header del modal */}
        <div style={modalStyles.header}>
          <h3 id="global-modal-title" style={modalStyles.title}>
            Transacciones Globales (Admin)
            <span style={transactionStyles.badge}>
              {transactions.length}
            </span>
          </h3>
          <button 
            onClick={onClose} 
            style={modalStyles.closeButton}
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>
        
        {/* Lista de transacciones */}
        <div style={transactionStyles.list}>
          {transactions.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              No hay transacciones para mostrar
            </div>
          ) : (
            transactions.map((transaction, index) => (
              <TransactionItem 
                key={transaction.id || `global-${index}`} 
                transaction={transaction} 
                index={index} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalTransactionsModal;