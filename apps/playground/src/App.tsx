import React, { useState } from 'react';
import { BasicForm } from './examples/BasicForm';
import { ConditionalForm } from './examples/ConditionalForm';

type Tab = 'basic' | 'conditional';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('basic');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'basic', label: 'Basic Form' },
    { id: 'conditional', label: 'Conditional Form' },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>react-formsteps playground</h1>
        <p style={{ color: '#6b7280' }}>Interactive examples of @franklinjunior23/react-formsteps</p>
      </header>

      <div
        style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              border: '2px solid',
              borderColor: activeTab === tab.id ? '#2563eb' : '#e5e7eb',
              background: activeTab === tab.id ? '#2563eb' : 'white',
              color: activeTab === tab.id ? 'white' : '#374151',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main style={{ maxWidth: '600px', margin: '0 auto' }}>
        {activeTab === 'basic' && <BasicForm />}
        {activeTab === 'conditional' && <ConditionalForm />}
      </main>
    </div>
  );
}
