import React from 'react';
import { cardStyle, btnPrimary } from './styles';

interface SuccessScreenProps {
  data: Record<string, unknown>;
  onReset: () => void;
}

export function SuccessScreen({ data, onReset }: SuccessScreenProps) {
  return (
    <div style={{ ...cardStyle, textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
      <h2 style={{ marginBottom: '0.5rem' }}>Form Submitted!</h2>
      <pre
        style={{
          background: '#f3f4f6',
          padding: '1rem',
          borderRadius: '0.5rem',
          textAlign: 'left',
          fontSize: '0.85rem',
          overflow: 'auto',
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
      <button onClick={onReset} style={{ ...btnPrimary, marginTop: '1rem' }}>
        Reset
      </button>
    </div>
  );
}
