import React, { useState, useEffect } from 'react';
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
  select: {
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(169, 139, 81, 0.3)',
    borderRadius: '6px',
    color: '#FFFFFF',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  option: {
    background: '#162C2C',
    color: '#FFFFFF'
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
  loadingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '10px'
  },
  errorText: {
    color: '#DC3545',
    fontSize: '0.9rem',
    marginTop: '5px'
  },
  userOption: {
    padding: '8px',
    display: 'flex',
    flexDirection: 'column'
  },
  userEmail: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.6)'
  }
};

function TransactionModal({ isOpen, onClose, onTransactionCreated }) {
  const { instance, accounts } = useMsal();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Cargar usuarios del tenant cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      loadTenantUsers();
    }
  }, [isOpen]);

  const loadTenantUsers = async () => {
    setLoadingUsers(true);
    try {
      const request = { ...loginRequest, account: accounts[0] };
      const tokenResponse = await instance.acquireTokenSilent(request);
      
      const response = await fetch(
        "https://apim-fintech-dev-jagm.azure-api.net/func-fintech-dev-jagm-v1/getTenantUsers", // Ajusta esta URL
        {
          method: "GET",
          headers: { 
            "Authorization": `Bearer ${tokenResponse.accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setErrors({ general: "Error al cargar usuarios del tenant" });
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.recipient) {
      newErrors.recipient = 'Debe seleccionar un destinatario';
    }
    
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Debe ingresar un monto válido mayor a 0';
    }
    
    if (parseFloat(formData.amount) > 10000) {
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
            recipient: formData.recipient,
            amount: parseFloat(formData.amount),
            description: formData.description || `Transferencia a ${getSelectedUserName()}`
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Error al crear transacción: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Transacción creada:', result);
      
      // Notificar al componente padre que se creó la transacción
      onTransactionCreated();
      
      // Limpiar formulario y cerrar modal
      setFormData({ recipient: '', amount: '', description: '' });
      onClose();
      
    } catch (err) {
      console.error("Error al crear transacción:", err);
      setErrors({ general: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const getSelectedUserName = () => {
    const selectedUser = users.find(user => user.id === formData.recipient);
    return selectedUser ? selectedUser.name : '';
  };

  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.content} onClick={e => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <h3 style={modalStyles.title}>Nueva Transferencia</h3>
          <button 
            onClick={onClose} 
            style={modalStyles.closeButton}
            onMouseOver={e => e.target.style.color = '#FFFFFF'}
            onMouseOut={e => e.target.style.color = '#A98B51'}
          >
            ×
          </button>
        </div>

        <form style={modalStyles.form} onSubmit={handleSubmit}>
          {/* Selector de destinatario */}
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label}>Destinatario:</label>
            {loadingUsers ? (
              <div style={modalStyles.loadingText}>Cargando usuarios del tenant UACJ...</div>
            ) : (
              <select
                name="recipient"
                value={formData.recipient}
                onChange={handleInputChange}
                style={modalStyles.select}
                required
              >
                <option value="">Seleccionar usuario...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id} style={modalStyles.option}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            )}
            {errors.recipient && <div style={modalStyles.errorText}>{errors.recipient}</div>}
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
              style={modalStyles.input}
              required
            />
            {errors.amount && <div style={modalStyles.errorText}>{errors.amount}</div>}
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
          </div>

          {/* Error general */}
          {errors.general && (
            <div style={modalStyles.errorText}>{errors.general}</div>
          )}

          {/* Botones */}
          <div style={modalStyles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
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
              {submitting ? 'Procesando...' : 'Enviar Transferencia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionModal;
