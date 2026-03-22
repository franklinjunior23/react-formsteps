import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSteps } from '@franklinjunior23/react-formsteps-core';
import { FormField, SuccessScreen, cardStyle, btnPrimary, btnSecondary } from '../shared';

const step1Schema = z.object({
  accountType: z.enum(['personal', 'business'], {
    errorMap: () => ({ message: 'Select an account type' }),
  }),
});
const personalSchema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  birthDate: z.string().min(1, 'Birth date is required'),
});
const businessSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  taxId: z.string().min(5, 'Tax ID must be at least 5 characters'),
});
const step3Schema = z.object({
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
});

type Step1 = z.infer<typeof step1Schema>;
type PersonalInfo = z.infer<typeof personalSchema>;
type BusinessInfo = z.infer<typeof businessSchema>;
type Step3 = z.infer<typeof step3Schema>;

export function ConditionalForm() {
  const [submitted, setSubmitted] = useState(false);
  const [allData, setAllData] = useState<Record<string, unknown>>({});

  const { currentStep, next, prev, isFirst, isLast, totalSteps } = useSteps({ totalSteps: 3 });

  const form1 = useForm<Step1>({ resolver: zodResolver(step1Schema) });
  const personalForm = useForm<PersonalInfo>({ resolver: zodResolver(personalSchema) });
  const businessForm = useForm<BusinessInfo>({ resolver: zodResolver(businessSchema) });
  const form3 = useForm<Step3>({ resolver: zodResolver(step3Schema) });

  const accountType = form1.watch('accountType');
  const isPersonal = accountType === 'personal';

  const handleNext = async () => {
    if (currentStep === 0) {
      const valid = await form1.trigger();
      if (!valid) return;
      // When account type changes, reset step 2 data to avoid stale fields
      const prevType = allData.accountType as string | undefined;
      const newType = form1.getValues().accountType;
      if (prevType && prevType !== newType) {
        personalForm.reset();
        businessForm.reset();
        setAllData((p) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { fullName, birthDate, companyName, taxId, ...rest } = p as Record<string, unknown>;
          return { ...rest, ...form1.getValues() };
        });
      } else {
        setAllData((p) => ({ ...p, ...form1.getValues() }));
      }
    } else if (currentStep === 1) {
      const activeForm = isPersonal ? personalForm : businessForm;
      const valid = await activeForm.trigger();
      if (!valid) return;
      setAllData((p) => ({ ...p, ...activeForm.getValues() }));
    } else if (currentStep === 2) {
      const valid = await form3.trigger();
      if (!valid) return;
      setAllData((p) => ({ ...p, ...form3.getValues() }));
      setSubmitted(true);
      return;
    }
    next();
  };

  const handleReset = () => {
    setSubmitted(false);
    setAllData({});
    [form1, personalForm, businessForm, form3].forEach((f) => f.reset());
  };

  if (submitted) return <SuccessScreen data={allData} onReset={handleReset} />;

  const stepLabels = ['Account Type', isPersonal ? 'Personal Info' : 'Business Info', 'Contact'];

  return (
    <div style={cardStyle}>
      <h2 style={{ marginBottom: '0.25rem' }}>Conditional Form</h2>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Step 2 changes based on account type chosen in step 1
      </p>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={stepLabels[i]} style={{ flex: 1, textAlign: 'center' }}>
            <div
              style={{
                height: '4px',
                borderRadius: '999px',
                background: i <= currentStep ? '#2563eb' : '#e5e7eb',
                marginBottom: '4px',
                transition: 'background 0.3s',
              }}
            />
            <span
              style={{
                fontSize: '0.7rem',
                color: i === currentStep ? '#2563eb' : '#9ca3af',
                fontWeight: i === currentStep ? 600 : 400,
              }}
            >
              {stepLabels[i]}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: account type */}
      {currentStep === 0 && (
        <div>
          <p style={{ marginBottom: '1rem', color: '#374151' }}>
            What type of account would you like?
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {(['personal', 'business'] as const).map((type) => (
              <label
                key={type}
                style={{
                  flex: 1,
                  border: `2px solid ${accountType === type ? '#2563eb' : '#e5e7eb'}`,
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  background: accountType === type ? '#eff6ff' : 'white',
                  transition: 'all 0.2s',
                }}
              >
                <input
                  type="radio"
                  value={type}
                  style={{ display: 'none' }}
                  {...form1.register('accountType')}
                />
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                  {type === 'personal' ? '👤' : '🏢'}
                </div>
                <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{type}</div>
              </label>
            ))}
          </div>
          {form1.formState.errors.accountType && (
            <span style={{ color: '#dc2626', fontSize: '0.8rem' }}>
              {form1.formState.errors.accountType.message}
            </span>
          )}
        </div>
      )}

      {/* Step 2: conditional */}
      {currentStep === 1 && isPersonal && (
        <>
          <FormField
            label="Full Name"
            inputProps={{ ...personalForm.register('fullName'), placeholder: 'John Doe' }}
            error={personalForm.formState.errors.fullName?.message}
          />
          <FormField
            label="Birth Date"
            inputProps={{ ...personalForm.register('birthDate'), type: 'date' }}
            error={personalForm.formState.errors.birthDate?.message}
          />
        </>
      )}

      {currentStep === 1 && !isPersonal && (
        <>
          <FormField
            label="Company Name"
            inputProps={{ ...businessForm.register('companyName'), placeholder: 'Acme Inc.' }}
            error={businessForm.formState.errors.companyName?.message}
          />
          <FormField
            label="Tax ID"
            inputProps={{ ...businessForm.register('taxId'), placeholder: 'XX-XXXXXXX' }}
            error={businessForm.formState.errors.taxId?.message}
          />
        </>
      )}

      {/* Step 3: contact */}
      {currentStep === 2 && (
        <>
          <FormField
            label="Email"
            inputProps={{
              ...form3.register('email'),
              type: 'email',
              placeholder: 'you@example.com',
            }}
            error={form3.formState.errors.email?.message}
          />
          <FormField
            label="Phone (optional)"
            inputProps={{ ...form3.register('phone'), type: 'tel', placeholder: '+1 555 000 0000' }}
          />
        </>
      )}

      {/* Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
        <button
          type="button"
          onClick={prev}
          disabled={isFirst}
          style={{
            ...btnSecondary,
            opacity: isFirst ? 0.4 : 1,
            cursor: isFirst ? 'not-allowed' : 'pointer',
          }}
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
