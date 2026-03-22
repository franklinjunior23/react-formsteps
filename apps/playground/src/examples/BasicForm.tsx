import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSteps } from '@franxx/react-formsteps-core';
import { FormField, SuccessScreen, cardStyle, btnPrimary, btnSecondary } from '../shared';

const step1Schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});
const step2Schema = z.object({
  email: z.string().email('Enter a valid email'),
});
const step3Schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type Step1 = z.infer<typeof step1Schema>;
type Step2 = z.infer<typeof step2Schema>;
type Step3 = z.infer<typeof step3Schema>;

const stepTitles = ['Personal Info', 'Contact', 'Password'];

export function BasicForm() {
  const [submitted, setSubmitted] = useState(false);
  const [allData, setAllData] = useState<Record<string, unknown>>({});

  const { currentStep, next, prev, isFirst, isLast, totalSteps, progress } = useSteps({
    totalSteps: 3,
  });

  const form1 = useForm<Step1>({ resolver: zodResolver(step1Schema) });
  const form2 = useForm<Step2>({ resolver: zodResolver(step2Schema) });
  const form3 = useForm<Step3>({ resolver: zodResolver(step3Schema) });
  const forms = [form1, form2, form3];

  const handleNext = async () => {
    const currentForm = forms[currentStep];
    const isValid = await currentForm.trigger();
    if (!isValid) return;
    const data = currentForm.getValues();
    setAllData((prev) => ({ ...prev, ...data }));
    if (isLast) {
      setSubmitted(true);
    } else {
      next();
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setAllData({});
    forms.forEach((f) => f.reset());
  };

  if (submitted) return <SuccessScreen data={allData} onReset={handleReset} />;

  const e1 = form1.formState.errors;
  const e2 = form2.formState.errors;
  const e3 = form3.formState.errors;

  return (
    <div style={cardStyle}>
      <h2 style={{ marginBottom: '0.25rem' }}>Basic Form Example</h2>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Headless usage with useSteps + react-hook-form
      </p>

      {/* Progress bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
            color: '#6b7280',
            marginBottom: '4px',
          }}
        >
          <span>{stepTitles[currentStep]}</span>
          <span>
            Step {currentStep + 1} / {totalSteps}
          </span>
        </div>
        <div
          style={{
            height: '8px',
            background: '#e5e7eb',
            borderRadius: '999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: '#2563eb',
              borderRadius: '999px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {currentStep === 0 && (
        <>
          <FormField
            label="First Name"
            inputProps={{ ...form1.register('firstName'), placeholder: 'John' }}
            error={e1.firstName?.message}
          />
          <FormField
            label="Last Name"
            inputProps={{ ...form1.register('lastName'), placeholder: 'Doe' }}
            error={e1.lastName?.message}
          />
        </>
      )}

      {currentStep === 1 && (
        <FormField
          label="Email Address"
          inputProps={{ ...form2.register('email'), type: 'email', placeholder: 'john@example.com' }}
          error={e2.email?.message}
        />
      )}

      {currentStep === 2 && (
        <>
          <FormField
            label="Password"
            inputProps={{ ...form3.register('password'), type: 'password', placeholder: 'Min. 8 characters' }}
            error={e3.password?.message}
          />
          <FormField
            label="Confirm Password"
            inputProps={{ ...form3.register('confirmPassword'), type: 'password', placeholder: 'Repeat password' }}
            error={e3.confirmPassword?.message}
          />
        </>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
        <button
          type="button"
          onClick={prev}
          disabled={isFirst}
          style={{ ...btnSecondary, opacity: isFirst ? 0.4 : 1, cursor: isFirst ? 'not-allowed' : 'pointer' }}
        >
          Back
        </button>
        <button type="button" onClick={handleNext} style={btnPrimary}>
          {isLast ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
}
