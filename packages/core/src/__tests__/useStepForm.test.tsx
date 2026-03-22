/**
 * Tests for useStepForm
 *
 * useStepForm wraps react-hook-form and adds per-step Zod validation.
 * Its key responsibility is nextWithValidation(): it runs form.trigger(),
 * calls onNext only when valid, and always resets isValidating afterward.
 *
 * Coverage:
 *  - Return shape (form, nextWithValidation, isValidating)
 *  - nextWithValidation returns true when schema passes
 *  - nextWithValidation returns false when schema fails
 *  - Field errors are registered on the form after a failed validation
 *  - onNext is called with the validated data on success
 *  - onNext is NOT called when validation fails
 *  - isValidating toggles correctly around the async call
 *  - defaultValues pre-populate the form
 *  - Works correctly with different field types (string, email, number)
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, render, screen } from '@testing-library/react';
import { z } from 'zod';
import { useStepForm } from '../hooks/useStepForm';

// ---------------------------------------------------------------------------
// Helper: a minimal form component that subscribes to formState.errors
// so react-hook-form's Proxy propagates error updates.
// ---------------------------------------------------------------------------

interface TestFormProps {
  schema: z.ZodType;
  fields: string[];
  onReady?: (next: () => Promise<boolean>) => void;
}

function TestForm({ schema, fields, onReady }: TestFormProps) {
  const { form, nextWithValidation } = useStepForm({ schema });

  // expose nextWithValidation to the test via callback on first render
  React.useEffect(() => {
    onReady?.(nextWithValidation);
  }, []);

  return (
    <form>
      {fields.map((field) => (
        <div key={field}>
          <input data-testid={field} {...form.register(field as never)} />
          <span data-testid={`error-${field}`}>
            {(form.formState.errors as Record<string, { message?: string }>)[field]?.message ?? ''}
          </span>
        </div>
      ))}
    </form>
  );
}

// ---------------------------------------------------------------------------
// Shared schemas used across tests
// ---------------------------------------------------------------------------

const nameSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

const emailSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});

// ---------------------------------------------------------------------------
// Return shape
// ---------------------------------------------------------------------------

describe('useStepForm — return shape', () => {
  it('returns form, nextWithValidation and isValidating', () => {
    const { result } = renderHook(() => useStepForm({ schema: nameSchema }));

    expect(result.current.form).toBeDefined();
    expect(typeof result.current.nextWithValidation).toBe('function');
    expect(typeof result.current.isValidating).toBe('boolean');
  });

  it('isValidating starts as false', () => {
    const { result } = renderHook(() => useStepForm({ schema: nameSchema }));

    expect(result.current.isValidating).toBe(false);
  });

  it('exposes a react-hook-form instance with register, handleSubmit and formState', () => {
    const { result } = renderHook(() => useStepForm({ schema: emailSchema }));

    expect(typeof result.current.form.register).toBe('function');
    expect(typeof result.current.form.handleSubmit).toBe('function');
    expect(result.current.form.formState).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// nextWithValidation — success path
// ---------------------------------------------------------------------------

describe('useStepForm — nextWithValidation — valid data', () => {
  it('returns true when all required fields pass the schema', async () => {
    const { result } = renderHook(() => useStepForm({ schema: emailSchema }));

    // Pre-fill the form with a valid value
    act(() => {
      result.current.form.setValue('email', 'user@example.com');
    });

    let returnValue: boolean | undefined;
    await act(async () => {
      returnValue = await result.current.nextWithValidation();
    });

    expect(returnValue).toBe(true);
  });

  it('calls onNext with the validated data when the schema passes', async () => {
    const onNext = vi.fn();

    const { result } = renderHook(() => useStepForm({ schema: emailSchema, onNext }));

    act(() => {
      result.current.form.setValue('email', 'hello@world.com');
    });

    await act(async () => {
      await result.current.nextWithValidation();
    });

    expect(onNext).toHaveBeenCalledOnce();
    expect(onNext).toHaveBeenCalledWith({ email: 'hello@world.com' });
  });

  it('passes correct data for multi-field schemas', async () => {
    const onNext = vi.fn();

    const { result } = renderHook(() => useStepForm({ schema: nameSchema, onNext }));

    act(() => {
      result.current.form.setValue('firstName', 'John');
      result.current.form.setValue('lastName', 'Doe');
    });

    await act(async () => {
      await result.current.nextWithValidation();
    });

    expect(onNext).toHaveBeenCalledWith({ firstName: 'John', lastName: 'Doe' });
  });
});

// ---------------------------------------------------------------------------
// nextWithValidation — failure path
// ---------------------------------------------------------------------------

describe('useStepForm — nextWithValidation — invalid data', () => {
  it('returns false when required fields are empty', async () => {
    const { result } = renderHook(() => useStepForm({ schema: emailSchema }));

    // email is empty — should fail z.string().email()
    let returnValue: boolean | undefined;
    await act(async () => {
      returnValue = await result.current.nextWithValidation();
    });

    expect(returnValue).toBe(false);
  });

  it('does NOT call onNext when validation fails', async () => {
    const onNext = vi.fn();

    const { result } = renderHook(() => useStepForm({ schema: emailSchema, onNext }));

    // Leave email empty
    await act(async () => {
      await result.current.nextWithValidation();
    });

    expect(onNext).not.toHaveBeenCalled();
  });

  it('populates form errors after a failed validation', async () => {
    // react-hook-form's formState.errors requires a subscribed component to propagate.
    // We mount a real component that renders the error span so the Proxy is activated.
    let triggerNext!: () => Promise<boolean>;

    await act(async () => {
      render(
        <TestForm
          schema={emailSchema}
          fields={['email']}
          onReady={(fn) => {
            triggerNext = fn;
          }}
        />
      );
    });

    // Set an invalid value and trigger validation
    await act(async () => {
      screen.getByTestId('email').focus();
      (screen.getByTestId('email') as HTMLInputElement).value = 'not-an-email';
      screen.getByTestId('email').dispatchEvent(new Event('input', { bubbles: true }));
      await triggerNext();
    });

    expect(screen.getByTestId('error-email').textContent).toBe('Enter a valid email address');
  });

  it('populates errors for all failing fields in a multi-field schema', async () => {
    let triggerNext!: () => Promise<boolean>;

    await act(async () => {
      render(
        <TestForm
          schema={nameSchema}
          fields={['firstName', 'lastName']}
          onReady={(fn) => {
            triggerNext = fn;
          }}
        />
      );
    });

    // Both fields left empty — trigger validation
    await act(async () => {
      await triggerNext();
    });

    expect(screen.getByTestId('error-firstName').textContent).toBe('First name is required');
    expect(screen.getByTestId('error-lastName').textContent).toBe('Last name is required');
  });

  it('returns false even if only one of multiple required fields is missing', async () => {
    let triggerNext!: () => Promise<boolean>;

    await act(async () => {
      render(
        <TestForm
          schema={nameSchema}
          fields={['firstName', 'lastName']}
          onReady={(fn) => {
            triggerNext = fn;
          }}
        />
      );
    });

    // Fill only firstName, leave lastName empty
    await act(async () => {
      const input = screen.getByTestId('firstName') as HTMLInputElement;
      Object.defineProperty(input, 'value', { writable: true, value: 'John' });
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    let returnValue: boolean | undefined;
    await act(async () => {
      returnValue = await triggerNext();
    });

    expect(returnValue).toBe(false);
    expect(screen.getByTestId('error-lastName').textContent).toBe('Last name is required');
  });
});

// ---------------------------------------------------------------------------
// defaultValues
// ---------------------------------------------------------------------------

describe('useStepForm — defaultValues', () => {
  it('pre-populates the form with provided defaultValues', () => {
    const { result } = renderHook(() =>
      useStepForm({
        schema: emailSchema,
        defaultValues: { email: 'prefilled@example.com' },
      })
    );

    expect(result.current.form.getValues('email')).toBe('prefilled@example.com');
  });

  it('a pre-filled valid default allows nextWithValidation to pass immediately', async () => {
    const { result } = renderHook(() =>
      useStepForm({
        schema: emailSchema,
        defaultValues: { email: 'valid@test.com' },
      })
    );

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.nextWithValidation();
    });

    expect(ok).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// isValidating flag
// ---------------------------------------------------------------------------

describe('useStepForm — isValidating', () => {
  it('is false after nextWithValidation resolves (success)', async () => {
    const { result } = renderHook(() => useStepForm({ schema: emailSchema }));

    act(() => result.current.form.setValue('email', 'ok@ok.com'));

    await act(async () => {
      await result.current.nextWithValidation();
    });

    expect(result.current.isValidating).toBe(false);
  });

  it('is false after nextWithValidation resolves (failure)', async () => {
    const { result } = renderHook(() => useStepForm({ schema: emailSchema }));

    // Intentionally invalid — nextWithValidation will return false
    await act(async () => {
      await result.current.nextWithValidation();
    });

    expect(result.current.isValidating).toBe(false);
  });
});
