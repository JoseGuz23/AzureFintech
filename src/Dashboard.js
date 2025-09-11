import React, { useEffect, useCallback, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";

const styles = {
  container: {
    maxWidth: '800px',
    margin: 'auto',
    color: '#FFFFFF'
  },
  userInfo: {
    background: 'linear-gradient(135deg, #263B35, #162C2C)',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '1px solid rgba(169, 139, 81, 0.2)'
  },
  title: {
    color: '#FFFFFF',
    fontSize: '1.8rem',
    fontWeight: '600',
    marginBottom: '10px',
    background: 'linear-gradient(45deg, #FFFFFF, #A98B51)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  userDetail: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '5px'
  },
  userValue: {
    color: '#A98B51',
    fontWeight: '600'
  },
  transactionsSection: {
    background: '#263B35',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid rgba(169, 139, 81, 0.15)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: '1.3rem',
    fontWeight: '600',
    margin: 0
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  button: {
    padding: '8px 16px',
    background: 'linear-gradient(45deg, #A98B51, #C5A572)',
    color: '#0C1010',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  buttonSecondary: {
    background: 'linear-gradient(45deg, #162C2C, #263B35)',
    color: '#FFFFFF',
    border: '1px solid rgba(169, 139, 81, 0.3)'
  },
  buttonInfo: {
    background: 'linear-gradient(45deg, #17a2b8, #20c997)',
    color: '#FFFFFF',
    fontSize: '12px',
    padding: '6px 12px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    background: 'linear-gradient(135deg, #162C2C, #263B35)',
    borderRadius: '8px',
    border: '2px dashed rgba(169, 139, 81, 0.3)'
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '1rem'
  },
  transactionsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  transactionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    marginBottom: '8px',
    backgrou
