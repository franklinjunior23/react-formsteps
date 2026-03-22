import React from 'react';

export const cardStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: '1rem',
  padding: '2rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
};

export const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  marginBottom: '1rem',
};

export const inputStyle: React.CSSProperties = {
  padding: '0.625rem 0.75rem',
  borderRadius: '0.375rem',
  border: '1.5px solid #d1d5db',
  fontSize: '1rem',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};

export const errorStyle: React.CSSProperties = {
  color: '#dc2626',
  fontSize: '0.8rem',
};

export const btnPrimary: React.CSSProperties = {
  padding: '0.5rem 1.25rem',
  borderRadius: '0.5rem',
  border: 'none',
  background: '#2563eb',
  color: 'white',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '1rem',
};

export const btnSecondary: React.CSSProperties = {
  padding: '0.5rem 1.25rem',
  borderRadius: '0.5rem',
  border: '1.5px solid #d1d5db',
  background: 'white',
  cursor: 'pointer',
  fontSize: '1rem',
};
