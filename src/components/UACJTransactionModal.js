// src/components/UACJTransactionModal.js
import React, { useState, useEffect } from 'react';
import { modalStyles, colors } from '../styles/theme';
import { VALIDATION_RULES, VALIDATORS, HELPERS } from '../config';

const UACJTransactionModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    recipientEmail: '',
    amount: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  // Reset del formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setFormData({ recipientEmail: '', amount: '', description: '' });
      setErrors({});
    }
  }, [isOpen]);

  // Manejo de cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar errores cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Validación en tiempo real
    if (name === 'recipientEmail' && value) {
      const emailError = VALIDATORS.email.validateUACJEmail(value);
      if (emailError) {
        setErrors(prev => ({ ...prev, recipientEmail: emailError }));
      }
    }

    if (name === 'amount' && value) {
      const amountError = VALIDATORS.transaction.validateAmount(value);
      if (amountError) {
        setErrors(prev => ({ ...prev, amount: amountError }));
      }
    }
  };

  // Validación completa del formulario
  const validateForm = () => {
    const newErrors = {};
    
    // Validar email usando validadores centralizados
    const emailError = VALIDATORS.email.validateUACJEmail(formData.recipientEmail);
    if (emailError) {
      newErrors.recipientEmail = emailError;
    }
    
    // Validar monto
    const amountError = VALIDATORS.transaction.validateAmount(formData.amount);
    if (amountError) {
      newErrors.amount = amountError;
    }

    // Validar descripción
    const descriptionError = VALIDATORS.transaction.validateDescription(formData.description);
    if (descriptionError) {
      newErrors.description = descriptionError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      HELPERS.debugLog('Form validation failed', errors);
      return;
    }
    
    const transactionData = {
      recipient: formData.recipientEmail.trim(),
      amount: parseFloat(formData.amount),
      description: formData.description.trim() || `Transferencia a ${formData.recipientEmail.trim()}`
    };
    
    HELPERS.debugLog('Submitting transaction', transactionData);
    onSubmit(transactionData);
  };

  // Cerrar modal y limpiar formulario
  const handleClose = () => {
    if (isLoading) return; // Prevenir cerrar mientras se procesa
    
    setFormData({ recipientEmail: '', amount: '', description: '' });
    setErrors({});
    onClose();
  };

  // Manejo de teclas para accesibilidad
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && !isLoading) {
      handleClose();
    }
  };

  // No renderizar si está cerrado
  if (!isOpen) return null;

  // Verificar si el email es válido para mostrar estado de éxito
  const isEmailValid = formData.recipientEmail && 
                      !errors.recipientEmail && 
                      VALIDATORS.email.validateUACJEmail(formData.recipientEmail) === null;

  return (
    <div 
      style={modalStyles.overlay} 
      onClick={handleClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        style={modalStyles.content} 
        onClick={e => e.stopPropagation()}
      >
        {/* Header del modal */}
        <div style={modalStyles.header}>
          <h3 id="modal-title" style={modalStyles.title}>
            Nueva Transferencia UACJ
          </h3>
          <button 
            onClick={handleClose} 
            style={modalStyles.closeButton}
            onMouseOver={e => e.target.style.color = colors.white}
            onMouseOut={e => e.target.style.color = colors.accent}
            disabled={isLoading}
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        {/* Formulario */}
        <form style={modalStyles.form} onSubmit={handleSubmit}>
          {/* Campo de email */}
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label} htmlFor="recipientEmail">
              Email del destinatario:
            </label>
            <input
              id="recipientEmail"
              type="email"
              name="recipientEmail"
              value={formData.recipientEmail}
              onChange={handleInputChange}
              placeholder="usuario@uacj.mx"
              style={{
                ...modalStyles.input,
                borderColor: errors.recipientEmail ? colors.error : 
                           isEmailValid ? colors.success : 
                           'rgba(169, 139, 81, 0.3)'
              }}
              disabled={isLoading}
              required
              aria-describedby="email-error email-help"
            />
            
            {/* Mensajes de error/éxito para email */}
            {errors.recipientEmail && (
              <div id="email-error" style={modalStyles.errorText} role="alert">
                {errors.recipientEmail}
              </div>
            )}
            {isEmailValid && (
              <div style={modalStyles.successText}>
                ✓ Email válido de UACJ
              </div>
            )}
            <div id="email-help" style={modalStyles.helperText}>
              Solo se permiten emails de UACJ
            </div>
          </div>

          {/* Ejemplos de emails válidos */}
          <div style={modalStyles.exampleEmails}>
            <div style={modalStyles.exampleTitle}>Ejemplos de emails válidos:</div>
            {VALIDATION_RULES.EMAIL.ALLOWED_DOMAINS.map((domain, index) => (
              <div key={index} style={modalStyles.exampleItem}>
                • usuario{domain}
              </div>
            ))}
          </div>

          {/* Campo de monto */}
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label} htmlFor="amount">
              Monto:
            </label>
            <input
              id="amount"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              min={VALIDATION_RULES.TRANSACTION.MIN_AMOUNT}
              max={VALIDATION_RULES.TRANSACTION.MAX_AMOUNT}
              step="0.01"
              style={{
                ...modalStyles.input,
                borderColor: errors.amount ? colors.error : 'rgba(169, 139, 81, 0.3)'
              }}
              disabled={isLoading}
              required
              aria-describedby="amount-error amount-help"
            />
            
            {errors.amount && (
              <div id="amount-error" style={modalStyles.errorText} role="alert">
                {errors.amount}
              </div>
            )}
            <div id="amount-help" style={modalStyles.helperText}>
              Monto máximo: {HELPERS.formatMoney(VALIDATION_RULES.TRANSACTION.MAX_AMOUNT)}
            </div>
          </div>

          {/* Campo de descripción */}
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label} htmlFor="description">
              Descripción (opcional):
            </label>
            <input
              id="description"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Concepto de la transferencia..."
              maxLength={VALIDATION_RULES.TRANSACTION.MAX_DESCRIPTION_LENGTH}
              style={modalStyles.input}
              disabled={isLoading}
              aria-describedby="description-help"
            />
            <div id="description-help" style={modalStyles.helperText}>
              {formData.description.length}/{VALIDATION_RULES.TRANSACTION.MAX_DESCRIPTION_LENGTH} caracteres
            </div>
          </div>

          {/* Error general */}
          {errors.general && (
            <div style={modalStyles.errorText} role="alert">
              {errors.general}
            </div>
          )}

          {/* Botones */}
          <div style={modalStyles.buttonGroup}>
            <button
              type="button"
              onClick={handleClose}
              style={modalStyles.cancelButton}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                ...modalStyles.submitButton,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Procesando...' : 'Enviar Transferencia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UACJTransactionModal;