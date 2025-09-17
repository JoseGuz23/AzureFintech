// src/components/TransactionItem.js
import React, { useState } from 'react';
import { transactionStyles } from '../styles/theme';
import { HELPERS } from '../config';

const TransactionItem = ({ transaction, index, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const isPositive = transaction.amount > 0;
  
  // Determinar el texto a mostrar para from/to
  const getTransactionFlow = () => {
    if (transaction.fromAccountName && transaction.toAccount) {
      return `De: ${transaction.fromAccountName} → A: ${transaction.toAccount}`;
    }
    if (transaction.toAccount) {
      return `Para: ${transaction.toAccount}`;
    }
    if (transaction.fromAccountName) {
      return `De: ${transaction.fromAccountName}`;
    }
    return null;
  };

  const transactionFlow = getTransactionFlow();
  
  return (
    <div 
      style={{
        ...transactionStyles.item,
        ...(hovered ? transactionStyles.itemHover : {}),
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role={onClick ? "button" : "presentation"}
      tabIndex={onClick ? 0 : -1}
      onKeyPress={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div style={transactionStyles.info}>
        {/* Icono de la transacción */}
        <div style={{
          ...transactionStyles.icon,
          ...(isPositive ? transactionStyles.iconPositive : transactionStyles.iconNegative)
        }}>
          {isPositive ? '+' : '-'}
        </div>
        
        {/* Detalles de la transacción */}
        <div style={transactionStyles.details}>
          <div style={transactionStyles.description}>
            {transaction.description || `Transacción #${index + 1}`}
          </div>
          
          <div style={transactionStyles.date}>
            {HELPERS.formatDate(transaction.timestamp)}
          </div>
          
          {/* Mostrar flujo de la transacción si existe */}
          {transactionFlow && (
            <div style={transactionStyles.from}>
              {transactionFlow}
            </div>
          )}
          
          {/* Mostrar estado si existe */}
          {transaction.status && (
            <div style={{
              ...transactionStyles.from,
              color: transaction.status === 'completed' ? 'rgba(40, 167, 69, 0.8)' : 
                     transaction.status === 'pending' ? 'rgba(255, 193, 7, 0.8)' : 
                     'rgba(220, 53, 69, 0.8)'
            }}>
              Estado: {transaction.status === 'completed' ? 'Completada' : 
                      transaction.status === 'pending' ? 'Pendiente' : 
                      'Fallida'}
            </div>
          )}
        </div>
      </div>
      
      {/* Monto de la transacción */}
      <div style={{
        ...transactionStyles.amount,
        ...(isPositive ? transactionStyles.amountPositive : transactionStyles.amountNegative)
      }}>
        {isPositive ? '+' : ''}{HELPERS.formatMoney(transaction.amount)}
      </div>
    </div>
  );
};

export default TransactionItem;