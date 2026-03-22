import React from 'react';
import { fieldStyle, inputStyle, errorStyle } from './styles';

interface FormFieldProps {
  label: string;
  error?: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

export function FormField({ label, error, inputProps }: FormFieldProps) {
  return (
    <div style={fieldStyle}>
      <label>{label}</label>
      <input style={inputStyle} {...inputProps} />
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
}
