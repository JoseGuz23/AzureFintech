import React, { useState } from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from './authConfig';

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
    maxWidth: '500px',
    maxHeight: '80vh',
    overflowY: 'auto',
    border: '1px solid rgba(169, 139, 81, 0.2)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
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
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: '600'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#A98B51',
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
    color: '#FFFFFF',
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
    background: 'linear-gradient(45deg, #A98B51, #C5A572)',
    color: '#0C1010',
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
    color: '#DC3545',
    fontSize: '0.9rem',
    marginTop: '5px'
  },
  successText: {
    color: '#28A745',
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
    color: '#A98B51',
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

function TransactionModal({ isOpen, onClose, onTransactionCreated }) {
  const { instance, accounts } = useMsal();
  const [formData, setFormData] = useState({
    recipientEmail: '',
    amount: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const uacjDomains = ['@uacj.mx', '@alumnos.uacj.mx', '@uacj.edu.mx'];
    
    if (!emailRegex.test(email)) {
      return 'Formato de email inválido';
    }
    
    const hasValidDomain = uacjDomains.some(domain => email.toLowerCase().endsWith(domain));
    if (!hasValidDomain) {
      return 'Solo se permiten emails de UACJ (@uacj.mx, @alumnos.uacj.mx)';
    }
    
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Validación en tiempo real para email
    if (name === 'recipientEmail' && value) {
      const emailError = validateEmail(value);
      if (emailError) {
        setErrors(prev => ({ ...prev, recipientEmail: emailError }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validar email
    if (!formData.recipientEmail) {
      newErrors.recipientEmail = 'Debe ingresar el email del destinatario';
    } else {
      const emailError = validateEmail(formData.recipientEmail);
      if (emailError) {
        newErrors.recipientEmail = emailError;
      }
    }
    
    // Validar monto
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Debe ingresar un monto válido mayor a 0';
    } else if (parseFloat(formData.amount) > 10000) {
      newErrors.amount = 'El monto no puede ser mayor a $10,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      const request = { ...loginRequest, account: accounts[0] };
      const tokenResponse = await instance.acquireTokenSilent(request);
      
      const response = await fetch(
        "https://apim-fintech-dev-jagm.azure-api.net/func-fintech-dev-jagm-v1/transactions",
        {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${tokenResponse.accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            recipient: formData.recipientEmail,
            amount: parseFloat(formData.amount),
            description: formData.description || `Transferencia a ${formData.recipientEmail}`
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear transacción: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('Transacción creada exitosamente:', result);
      
      // Notificar al componente padre
      onTransactionCreated();
      
      // Limpiar formulario y cerrar modal
      setFormData({ recipientEmail: '', amount: '', description: '' });
      setErrors({});
      onClose();
      
    } catch (err) {
      console.error("Error al crear transacción:", err);
      setErrors({ general: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ recipientEmail: '', amount: '', description: '' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay} onClick={handleClose}>
      <div style={modalStyles.content} onClick={e => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <h3 style={modalStyles.title}>Nueva Transferencia UACJ</h3>
          <button 
            onClick={handleClose} 
            style={modalStyles.closeButton}
            onMouseOver={e => e.target.style.color = '#FFFFFF'}
            onMouseOut={e => e.target.style.color = '#A98B51'}
          >
            ×
          </button>
        </div>

        <form style={modalStyles.form} onSubmit={handleSubmit}>
          {/* Email del destinatario */}
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label}>Email del destinatario:</label>
            <input
              type="email"
              name="recipientEmail"
              value={formData.recipientEmail}
              onChange={handleInputChange}
              placeholder="usuario@uacj.mx"
              style={{
                ...modalStyles.input,
                borderColor: errors.recipientEmail ? '#DC3545' : 
                           formData.recipientEmail && !errors.recipientEmail ? '#28A745' : 
                           'rgba(169, 139, 81, 0.3)'
              }}
              required
            />
            {errors.recipientEmail && (
              <div style={modalStyles.errorText}>{errors.recipientEmail}</div>
            )}
            {formData.recipientEmail && !errors.recipientEmail && validateEmail(formData.recipientEmail) === null && (
              <div style={modalStyles.successText}>✓ Email válido de UACJ</div>
            )}
            <div style={modalStyles.helperText}>
              Solo se permiten emails de UACJ
            </div>
          </div>

          {/* Ejemplos de emails válidos */}
          <div style={modalStyles.exampleEmails}>
            <div style={modalStyles.exampleTitle}>📧 Ejemplos de emails válidos:</div>
            <div style={modalStyles.exampleItem}>• profesor@uacj.mx</div>
            <div style={modalStyles.exampleItem}>• estudiante@alumnos.uacj.mx</div>
            <div style={modalStyles.exampleItem}>• admin@uacj.edu.mx</div>
          </div>

          {/* Monto */}
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label}>Monto:</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              min="0.01"
              max="10000"
              step="0.01"
              style={{
                ...modalStyles.input,
                borderColor: errors.amount ? '#DC3545' : 'rgba(169, 139, 81, 0.3)'
              }}
              required
            />
            {errors.amount && <div style={modalStyles.errorText}>{errors.amount}</div>}
            <div style={modalStyles.helperText}>
              Monto máximo: $10,000.00
            </div>
          </div>

          {/* Descripción */}
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label}>Descripción (opcional):</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Concepto de la transferencia..."
              maxLength="100"
              style={modalStyles.input}
            />
            <div style={modalStyles.helperText}>
              {formData.description.length}/100 caracteres
            </div>
          </div>

          {/* Error general */}
          {errors.general && (
            <div style={modalStyles.errorText}>{errors.general}</div>
          )}

          {/* Botones */}
          <div style={modalStyles.buttonGroup}>
            <button
              type="button"
              onClick={handleClose}
              style={modalStyles.cancelButton}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                ...modalStyles.submitButton,
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
              disabled={submitting}
            >
              {submitting ? 'Procesando...' : '💸 Enviar Transferencia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionModal;
