import React, { useState } from 'react';
import Link from 'next/link';

const INSTALL_CMD = 'pnpm add @franxx/react-formsteps-core react-hook-form zod @hookform/resolvers';

// One Dark theme tokens
const kw = (s: string) => <span style={{ color: '#c678dd' }}>{s}</span>; // keyword / operator
const str = (s: string) => <span style={{ color: '#98c379' }}>{s}</span>; // string
const fn = (s: string) => <span style={{ color: '#61afef' }}>{s}</span>; // function / method
const vr = (s: string) => <span style={{ color: '#e5c07b' }}>{s}</span>; // variable / destructured
const tag = (s: string) => <span style={{ color: '#e06c75' }}>{s}</span>; // JSX tag
const prop = (s: string) => <span style={{ color: '#d19a66' }}>{s}</span>; // prop / number
const tx = (s: string) => <span style={{ color: '#abb2bf' }}>{s}</span>; // default text

function CodeExample() {
  return (
    <pre
      style={{
        background: '#282c34',
        margin: 0,
        padding: '1.5rem',
        overflowX: 'auto',
        fontSize: '0.875rem',
        lineHeight: 1.8,
        color: '#abb2bf',
        fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
      }}
    >
      <code>
        {/* line 1 */}
        {kw('import')} {'{ '}
        {fn('useSteps')}
        {tx(', ')}
        {fn('useStepForm')}
        {' } '}
        {kw('from')} {str("'@franxx/react-formsteps-core'")}
        {tx(';')}
        {'\n'}
        {/* line 2 */}
        {kw('import')} {'{ '}
        {vr('z')}
        {' } '}
        {kw('from')} {str("'zod'")}
        {tx(';')}
        {'\n'}
        {'\n'}
        {/* line 4 */}
        {kw('const')} {vr('schema')} {tx('= ')}
        {vr('z')}
        {tx('.')}
        {fn('object')}
        {tx('({ ')}
        {tag('email')}
        {tx(': ')}
        {vr('z')}
        {tx('.')}
        {fn('string')}
        {tx('().')}
        {fn('email')}
        {tx('() });')}
        {'\n'}
        {'\n'}
        {/* line 6 */}
        {kw('function')} {fn('MyForm')}
        {tx('() {')}
        {'\n'}
        {/* line 7 */}
        {'  '}
        {kw('const')} {'{ '}
        {vr('currentStep')}
        {tx(', ')}
        {vr('next')}
        {tx(', ')}
        {vr('prev')}
        {tx(', ')}
        {vr('isLast')}
        {tx(', ')}
        {vr('progress')}
        {' } = '}
        {fn('useSteps')}
        {tx('({')}
        {'\n'}
        {/* line 8 */}
        {'    '}
        {prop('totalSteps')}
        {tx(': ')}
        {prop('3')}
        {tx(',')}
        {'\n'}
        {/* line 9 */}
        {'  '}
        {tx('});')}
        {'\n'}
        {'\n'}
        {/* line 11 */}
        {'  '}
        {kw('const')} {'{ '}
        {vr('form')}
        {tx(', ')}
        {vr('nextWithValidation')}
        {' } = '}
        {fn('useStepForm')}
        {tx('({ ')}
        {vr('schema')}
        {tx(' });')}
        {'\n'}
        {'\n'}
        {/* line 13 */}
        {'  '}
        {kw('return')} {tx('(')}
        {'\n'}
        {/* line 14 */}
        {'    '}
        {tx('<')}
        {tag('form')}
        {tx('>')}
        {'\n'}
        {/* line 15 */}
        {'      '}
        {tx('<')}
        {tag('progress')} {prop('value')}
        {tx('={')}
        {vr('progress')}
        {tx('} ')}
        {prop('max')}
        {tx('={')}
        {prop('100')}
        {tx('} />')}
        {'\n'}
        {/* line 16 */}
        {'      '}
        {tx('<')}
        {tag('input')} {tx('{...')}
        {vr('form')}
        {tx('.')}
        {fn('register')}
        {tx('(')}
        {str("'email'")}
        {tx(')} />')}
        {'\n'}
        {/* line 17 */}
        {'      '}
        {tx('<')}
        {tag('button')} {prop('onClick')}
        {tx('={')}
        {vr('prev')}
        {tx('}>')}
        {tx('Back')}
        {tx('</')}
        {tag('button')}
        {tx('>')}
        {'\n'}
        {/* line 18 */}
        {'      '}
        {tx('<')}
        {tag('button')} {prop('onClick')}
        {tx('={()')}
        {kw(' => ')}
        {fn('nextWithValidation')}
        {tx('().')}
        {fn('then')}
        {tx('(')}
        {vr('ok')}
        {kw(' => ')}
        {vr('ok')}
        {tx(' && ')}
        {fn('next')}
        {tx('())}>')}
        {'\n'}
        {/* line 19 */}
        {'        '}
        {tx('{')}
        {vr('isLast')}
        {kw(' ? ')}
        {str("'Submit'")}
        {kw(' : ')}
        {str("'Next'")}
        {tx('}')}
        {'\n'}
        {/* line 20 */}
        {'      '}
        {tx('</')}
        {tag('button')}
        {tx('>')}
        {'\n'}
        {/* line 21 */}
        {'    '}
        {tx('</')}
        {tag('form')}
        {tx('>')}
        {'\n'}
        {'  '}
        {tx(');')}
        {'\n'}
        {tx('}')}
      </code>
    </pre>
  );
}

const features = [
  {
    icon: '🧩',
    title: 'Headless by default',
    desc: 'Zero UI opinions. Bring your own design system, CSS framework, or component library.',
  },
  {
    icon: '🔒',
    title: 'Per-step validation',
    desc: 'Each step validates only its own Zod schema before advancing. No full-form re-validation.',
  },
  {
    icon: '⚡',
    title: 'Built on react-hook-form',
    desc: 'Fully compatible with the react-hook-form ecosystem. Use any resolver or field array.',
  },
  {
    icon: '🎯',
    title: 'Type-safe to the core',
    desc: 'Strict TypeScript throughout. Inferred types from Zod schemas flow into your form fields.',
  },
  {
    icon: '🪶',
    title: 'Tiny footprint',
    desc: 'Tree-shakeable. No CSS bundled. Only ship what you actually use.',
  },
  {
    icon: '🏗️',
    title: 'Flexible architecture',
    desc: 'Use the headless hooks alone, or drop in the optional UI components for a quick start.',
  },
];

const DEMO_STEPS = [
  {
    title: 'Personal info',
    field: 'Name',
    placeholder: 'John Doe',
    type: 'text',
    validate: (v: string) => (v.trim().length >= 2 ? null : 'Name must be at least 2 characters'),
  },
  {
    title: 'Contact',
    field: 'Email',
    placeholder: 'john@example.com',
    type: 'email',
    validate: (v: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Enter a valid email'),
  },
  {
    title: 'Security',
    field: 'Password',
    placeholder: 'Min. 8 characters',
    type: 'password',
    validate: (v: string) => (v.length >= 8 ? null : 'Password must be at least 8 characters'),
  },
];

function MiniFormDemo() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(['', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const current = DEMO_STEPS[step];
  const progress = Math.round((step / (DEMO_STEPS.length - 1)) * 100);

  const handleNext = () => {
    const err = current.validate(values[step]);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    if (step === DEMO_STEPS.length - 1) {
      setDone(true);
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleReset = () => {
    setStep(0);
    setValues(['', '', '']);
    setError(null);
    setDone(false);
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '1rem',
        border: '1.5px solid #e5e7eb',
        padding: '1.75rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}
    >
      {done ? (
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎉</div>
          <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>All done!</p>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Data merged from all 3 steps.
          </p>
          <button
            onClick={handleReset}
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.5rem 1.25rem',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          {/* Progress */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: '#6b7280',
              marginBottom: '6px',
            }}
          >
            <span style={{ fontWeight: 600, color: '#111827' }}>{current.title}</span>
            <span>
              Step {step + 1} / {DEMO_STEPS.length}
            </span>
          </div>
          <div
            style={{
              height: '6px',
              background: '#e5e7eb',
              borderRadius: '999px',
              overflow: 'hidden',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${step === 0 ? 10 : progress}%`,
                background: '#2563eb',
                borderRadius: '999px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          {/* Step indicators */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {DEMO_STEPS.map((s, i) => (
              <div
                key={s.title}
                style={{
                  flex: 1,
                  height: '3px',
                  borderRadius: '999px',
                  background: i <= step ? '#2563eb' : '#e5e7eb',
                  transition: 'background 0.3s',
                }}
              />
            ))}
          </div>

          {/* Field */}
          <label
            style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '0.4rem',
            }}
          >
            {current.field}
          </label>
          <input
            key={step}
            type={current.type}
            placeholder={current.placeholder}
            value={values[step]}
            onChange={(e) => {
              setError(null);
              setValues((v) => {
                const c = [...v];
                c[step] = e.target.value;
                return c;
              });
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleNext();
            }}
            style={{
              width: '100%',
              padding: '0.625rem 0.75rem',
              borderRadius: '0.4rem',
              border: `1.5px solid ${error ? '#fca5a5' : '#d1d5db'}`,
              fontSize: '0.9rem',
              outline: 'none',
              boxSizing: 'border-box',
              background: error ? '#fef2f2' : '#fff',
              transition: 'border-color 0.2s',
            }}
          />
          {error && (
            <p style={{ color: '#dc2626', fontSize: '0.78rem', margin: '0.35rem 0 0' }}>{error}</p>
          )}

          {/* Nav */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem' }}>
            <button
              onClick={handleBack}
              disabled={step === 0}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.4rem',
                border: '1.5px solid #d4d4d8',
                background: '#f5f5f7',
                cursor: step === 0 ? 'not-allowed' : 'pointer',
                opacity: step === 0 ? 0.4 : 1,
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '0.4rem',
                border: 'none',
                background: '#2563eb',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              {step === DEMO_STEPS.length - 1 ? 'Submit ✓' : 'Next →'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function LandingPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(INSTALL_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#111827',
        background: '#f5f5f7',
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 2rem',
          borderBottom: '1px solid #e4e4e7',
          position: 'sticky',
          top: 0,
          background: 'rgba(245,245,247,0.88)',
          backdropFilter: 'blur(8px)',
          zIndex: 50,
        }}
      >
        <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
          react-formsteps
        </span>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link
            href="/getting-started"
            style={{ color: '#374151', textDecoration: 'none', fontSize: '0.95rem' }}
          >
            Docs
          </Link>
          <Link
            href="/api-reference"
            style={{ color: '#374151', textDecoration: 'none', fontSize: '0.95rem' }}
          >
            API
          </Link>
          <a
            href="https://github.com/franxx/react-formsteps"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#374151',
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}
          >
            <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub
          </a>
          <Link
            href="/getting-started"
            style={{
              background: '#111827',
              color: '#fff',
              padding: '0.45rem 1.1rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            Get started →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          textAlign: 'center',
          padding: '6rem 2rem 4rem',
          background: 'linear-gradient(180deg, #eaeaec 0%, #f5f5f7 100%)',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: '#eff6ff',
            color: '#2563eb',
            fontSize: '0.8rem',
            fontWeight: 600,
            padding: '0.3rem 0.8rem',
            borderRadius: '999px',
            marginBottom: '1.5rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Open source · TypeScript · Zod + react-hook-form
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            margin: '0 auto 1.5rem',
            maxWidth: '800px',
          }}
        >
          Multi-step forms for React, <span style={{ color: '#2563eb' }}>done right</span>
        </h1>

        <p
          style={{
            fontSize: '1.2rem',
            color: '#6b7280',
            maxWidth: '560px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6,
          }}
        >
          Headless hooks and optional UI components for building type-safe wizard forms with
          per-step Zod validation. Zero CSS imposed.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '3rem',
          }}
        >
          <Link
            href="/getting-started"
            style={{
              background: '#111827',
              color: '#fff',
              padding: '0.75rem 1.75rem',
              borderRadius: '0.6rem',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            Get started
          </Link>
          <Link
            href="/api-reference"
            style={{
              background: '#fff',
              color: '#111827',
              padding: '0.75rem 1.75rem',
              borderRadius: '0.6rem',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              border: '1.5px solid #d4d4d8',
            }}
          >
            API reference
          </Link>
        </div>

        {/* Install command */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem',
            background: '#1e1e2e',
            borderRadius: '0.75rem',
            padding: '0.85rem 1.25rem',
            maxWidth: '100%',
            overflow: 'hidden',
          }}
        >
          <code
            style={{
              color: '#cdd6f4',
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <span style={{ color: '#a6e3a1' }}>pnpm</span>{' '}
            <span style={{ color: '#89dceb' }}>add</span>{' '}
            <span style={{ color: '#cdd6f4' }}>@franxx/react-formsteps-core</span>
          </code>
          <button
            onClick={handleCopy}
            style={{
              background: 'transparent',
              border: '1px solid #45475a',
              borderRadius: '0.4rem',
              color: '#cdd6f4',
              padding: '0.3rem 0.7rem',
              cursor: 'pointer',
              fontSize: '0.8rem',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </section>

      {/* Features grid */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <h2
          style={{
            textAlign: 'center',
            fontSize: '1.75rem',
            fontWeight: 800,
            marginBottom: '3rem',
            letterSpacing: '-0.02em',
          }}
        >
          Everything you need, nothing you don't
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                padding: '1.5rem',
                borderRadius: '1rem',
                border: '1.5px solid #e4e4e7',
                background: '#fff',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>
                {f.title}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works — sequence map */}
      <section style={{ padding: '4rem 2rem', background: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2
            style={{
              textAlign: 'center',
              fontSize: '1.75rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '0.5rem',
            }}
          >
            How it works
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: '#6b7280',
              marginBottom: '3rem',
              fontSize: '1rem',
            }}
          >
            Every click on "Next" runs through this sequence automatically.
          </p>

          {/* Flow diagram */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {/* Row 1: happy path */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {[
                {
                  label: 'User fills step',
                  color: '#eff6ff',
                  border: '#bfdbfe',
                  text: '#1d4ed8',
                  icon: '✏️',
                },
                null,
                {
                  label: 'Click Next',
                  color: '#f0fdf4',
                  border: '#bbf7d0',
                  text: '#15803d',
                  icon: '→',
                },
                null,
                {
                  label: 'validateStep(schema, data)',
                  color: '#fefce8',
                  border: '#fde68a',
                  text: '#92400e',
                  icon: '🔍',
                  mono: true,
                },
                null,
                {
                  label: 'Valid ✓',
                  color: '#f0fdf4',
                  border: '#bbf7d0',
                  text: '#15803d',
                  icon: '',
                },
                null,
                {
                  label: 'Advance to next step',
                  color: '#eff6ff',
                  border: '#bfdbfe',
                  text: '#1d4ed8',
                  icon: '⏭️',
                },
              ].map((node, i) =>
                node === null ? (
                  <div
                    key={i}
                    style={{
                      color: '#9ca3af',
                      fontSize: '1.25rem',
                      padding: '0 0.25rem',
                      flexShrink: 0,
                    }}
                  >
                    →
                  </div>
                ) : (
                  <div
                    key={i}
                    style={{
                      background: node.color,
                      border: `1.5px solid ${node.border}`,
                      borderRadius: '0.6rem',
                      padding: '0.6rem 0.9rem',
                      fontSize: node.mono ? '0.75rem' : '0.85rem',
                      fontFamily: node.mono ? 'monospace' : 'inherit',
                      color: node.text,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {node.icon && node.icon !== '→' ? `${node.icon} ` : ''}
                    {node.label}
                  </div>
                )
              )}
            </div>

            {/* Branch down from "Valid?" */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
              <div
                style={{
                  width: '1px',
                  height: '2rem',
                  background: '#e5e7eb',
                  marginLeft: '-19.5rem',
                }}
              />
            </div>

            {/* Row 2: invalid path */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0', justifyContent: 'center' }}
            >
              <div style={{ width: '19.5rem', flexShrink: 0 }} />
              <div
                style={{
                  background: '#fef2f2',
                  border: '1.5px solid #fecaca',
                  borderRadius: '0.6rem',
                  padding: '0.6rem 0.9rem',
                  fontSize: '0.85rem',
                  color: '#dc2626',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                Invalid ✗
              </div>
              <div style={{ color: '#9ca3af', fontSize: '1.25rem', padding: '0 0.25rem' }}>→</div>
              <div
                style={{
                  background: '#fef2f2',
                  border: '1.5px solid #fecaca',
                  borderRadius: '0.6rem',
                  padding: '0.6rem 0.9rem',
                  fontSize: '0.85rem',
                  color: '#dc2626',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                🚫 Show field errors, stay on step
              </div>
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
              <span style={{ color: '#9ca3af', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                on last step
              </span>
              <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            </div>

            {/* Final submit row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {[
                {
                  label: 'Click Submit',
                  color: '#eff6ff',
                  border: '#bfdbfe',
                  text: '#1d4ed8',
                  icon: '🚀',
                },
                null,
                {
                  label: 'validateAllSteps(schemas, data)',
                  color: '#fefce8',
                  border: '#fde68a',
                  text: '#92400e',
                  icon: '🔍',
                  mono: true,
                },
                null,
                {
                  label: 'Merge all step data',
                  color: '#f5f3ff',
                  border: '#ddd6fe',
                  text: '#6d28d9',
                  icon: '🔗',
                },
                null,
                {
                  label: 'onSubmit(data)',
                  color: '#f0fdf4',
                  border: '#bbf7d0',
                  text: '#15803d',
                  icon: '✅',
                  mono: true,
                },
              ].map((node, i) =>
                node === null ? (
                  <div
                    key={i}
                    style={{
                      color: '#9ca3af',
                      fontSize: '1.25rem',
                      padding: '0 0.25rem',
                      flexShrink: 0,
                    }}
                  >
                    →
                  </div>
                ) : (
                  <div
                    key={i}
                    style={{
                      background: node.color,
                      border: `1.5px solid ${node.border}`,
                      borderRadius: '0.6rem',
                      padding: '0.6rem 0.9rem',
                      fontSize: node.mono ? '0.75rem' : '0.85rem',
                      fontFamily: node.mono ? 'monospace' : 'inherit',
                      color: node.text,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {node.icon && node.icon !== '→' ? `${node.icon} ` : ''}
                    {node.label}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mini interactive example */}
      <section style={{ padding: '4rem 2rem', background: '#f5f5f7' }}>
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          {/* Left: description */}
          <div>
            <div
              style={{
                display: 'inline-block',
                background: '#f0fdf4',
                color: '#15803d',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.25rem 0.7rem',
                borderRadius: '999px',
                marginBottom: '1rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Live preview
            </div>
            <h2
              style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: '1rem',
                lineHeight: 1.2,
              }}
            >
              See it in action
            </h2>
            <p
              style={{
                color: '#6b7280',
                lineHeight: 1.7,
                marginBottom: '1rem',
                fontSize: '0.95rem',
              }}
            >
              Each step only validates its own schema. You can't advance until the current step is
              valid — and going back never loses accumulated data.
            </p>
            <ul
              style={{
                color: '#6b7280',
                paddingLeft: '1.2rem',
                lineHeight: 2,
                fontSize: '0.9rem',
                margin: 0,
              }}
            >
              <li>Progress tracked automatically</li>
              <li>Per-step Zod validation</li>
              <li>Back navigation preserves data</li>
              <li>Final submit merges all steps</li>
            </ul>
          </div>

          {/* Right: interactive mini demo */}
          <MiniFormDemo />
        </div>
      </section>

      {/* Code example */}
      <section style={{ padding: '4rem 2rem', background: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: '0.5rem',
              }}
            >
              Simple API, powerful results
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              Drop in the hooks and keep full control over your UI.
            </p>
          </div>
          <div
            style={{
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            }}
          >
            {/* Code block header */}
            <div
              style={{
                background: '#21252b',
                padding: '0.75rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderBottom: '1px solid #181a1f',
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#e06c75',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#e5c07b',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#98c379',
                  display: 'inline-block',
                }}
              />
              <span style={{ color: '#5c6370', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                MyForm.tsx
              </span>
            </div>
            <CodeExample />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center', background: '#eaeaec' }}>
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '1rem',
          }}
        >
          Ready to build?
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '1.05rem' }}>
          Check the docs and have your first multi-step form running in minutes.
        </p>
        <Link
          href="/getting-started"
          style={{
            background: '#2563eb',
            color: '#fff',
            padding: '0.85rem 2rem',
            borderRadius: '0.6rem',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '1rem',
          }}
        >
          Read the docs →
        </Link>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid #e4e4e7',
          padding: '1.5rem 2rem',
          background: '#f5f5f7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          color: '#9ca3af',
          fontSize: '0.875rem',
        }}
      >
        <span>react-formsteps © {new Date().getFullYear()} Franxx</span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link href="/getting-started" style={{ color: '#9ca3af', textDecoration: 'none' }}>
            Docs
          </Link>
          <Link href="/api-reference" style={{ color: '#9ca3af', textDecoration: 'none' }}>
            API
          </Link>
          <a
            href="https://github.com/franxx/react-formsteps"
            style={{ color: '#9ca3af', textDecoration: 'none' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}

// Skip Nextra's docs layout for this page
LandingPage.getLayout = (page: React.ReactElement) => page;
