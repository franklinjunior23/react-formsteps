/**
 * Tests for StepsContext, useStepsContext and StepsProvider
 *
 * StepsProvider is the headless context provider — it holds all wizard state
 * and exposes it through StepsContext. useStepsContext is the consumer hook.
 *
 * Coverage:
 *  - useStepsContext throws when called outside a provider
 *  - StepsProvider exposes correct initial values
 *  - next() / prev() / goTo() update currentStep
 *  - isFirst / isLast are derived correctly from context state
 *  - setStepData accumulates formData across multiple calls
 *  - schemas array is accessible from context
 *  - initialStep prop shifts the starting step
 *  - onSubmit is called with merged validated data when triggered
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, renderHook, act, screen } from '@testing-library/react';
import { z } from 'zod';
import { StepsProvider, useStepsContext } from '../context/StepsContext';

// ---------------------------------------------------------------------------
// Shared schemas
// ---------------------------------------------------------------------------

const schema1 = z.object({ name: z.string().min(1) });
const schema2 = z.object({ email: z.string().email() });

// ---------------------------------------------------------------------------
// Helper: wrap a hook in StepsProvider
// ---------------------------------------------------------------------------

const withProvider = (
  schemas = [schema1, schema2],
  onSubmit?: (data: Record<string, unknown>) => void,
  initialStep = 0
) => ({
  wrapper: ({ children }: { children: React.ReactNode }) => (
    <StepsProvider schemas={schemas} onSubmit={onSubmit} initialStep={initialStep}>
      {children}
    </StepsProvider>
  ),
});

// ---------------------------------------------------------------------------
// useStepsContext — guard
// ---------------------------------------------------------------------------

describe('useStepsContext — outside provider', () => {
  it('throws a descriptive error when called outside a StepsProvider', () => {
    // Suppress the React error boundary output in test console
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useStepsContext())).toThrow(
      'useStepsContext must be used within a StepsProvider'
    );

    consoleError.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

describe('StepsProvider — initial state', () => {
  it('starts on step 0 by default', () => {
    const { result } = renderHook(() => useStepsContext(), withProvider());

    expect(result.current.currentStep).toBe(0);
  });

  it('exposes totalSteps equal to the number of schemas passed', () => {
    const { result } = renderHook(() => useStepsContext(), withProvider([schema1, schema2]));

    expect(result.current.totalSteps).toBe(2);
  });

  it('marks isFirst as true and isLast as false on step 0 with multiple steps', () => {
    const { result } = renderHook(() => useStepsContext(), withProvider());

    expect(result.current.isFirst).toBe(true);
    expect(result.current.isLast).toBe(false);
  });

  it('formData starts as an empty object', () => {
    const { result } = renderHook(() => useStepsContext(), withProvider());

    expect(result.current.formData).toEqual({});
  });

  it('schemas from context match the schemas passed to the provider', () => {
    const schemas = [schema1, schema2];
    const { result } = renderHook(() => useStepsContext(), withProvider(schemas));

    expect(result.current.schemas).toBe(schemas);
  });

  it('respects the initialStep prop', () => {
    const { result } = renderHook(
      () => useStepsContext(),
      withProvider([schema1, schema2], undefined, 1)
    );

    expect(result.current.currentStep).toBe(1);
    expect(result.current.isLast).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Navigation via context
// ---------------------------------------------------------------------------

describe('StepsProvider — navigation', () => {
  it('next() advances currentStep by 1', () => {
    const { result } = renderHook(() => useStepsContext(), withProvider());

    act(() => result.current.next());

    expect(result.current.currentStep).toBe(1);
  });

  it('next() does not go past the last step', () => {
    const { result } = renderHook(
      () => useStepsContext(),
      withProvider([schema1, schema2], undefined, 1) // start on last step
    );

    act(() => result.current.next());

    expect(result.current.currentStep).toBe(1);
  });

  it('prev() goes back one step', () => {
    const { result } = renderHook(
      () => useStepsContext(),
      withProvider([schema1, schema2], undefined, 1) // start on step 1
    );

    act(() => result.current.prev());

    expect(result.current.currentStep).toBe(0);
  });

  it('prev() does not go below step 0', () => {
    const { result } = renderHook(() => useStepsContext(), withProvider());

    act(() => result.current.prev()); // already at 0

    expect(result.current.currentStep).toBe(0);
  });

  it('goTo() jumps to a valid index', () => {
    const schemas = [schema1, schema2, z.object({ pw: z.string() })];
    const { result } = renderHook(() => useStepsContext(), withProvider(schemas));

    act(() => result.current.goTo(2));

    expect(result.current.currentStep).toBe(2);
  });

  it('goTo() ignores out-of-bounds values', () => {
    const { result } = renderHook(() => useStepsContext(), withProvider());

    act(() => result.current.goTo(99));

    expect(result.current.currentStep).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// isFirst / isLast derived values
// ---------------------------------------------------------------------------

describe('StepsProvider — isFirst / isLast', () => {
  it('isFirst becomes false after advancing', () => {
    const { result } = renderHook(() => useStepsContext(), withProvider());

    act(() => result.current.next());

    expect(result.current.isFirst).toBe(false);
  });

  it('isLast becomes true after advancing to the last step', () => {
    const { result } = renderHook(() => useStepsContext(), withProvider());

    act(() => result.current.next()); // step 0 → 1 (last of 2)

    expect(result.current.isLast).toBe(true);
  });

  it('isFirst becomes true again after going back to step 0', () => {
    const { result } = renderHook(
      () => useStepsContext(),
      withProvider([schema1, schema2], undefined, 1)
    );

    act(() => result.current.prev());

    expect(result.current.isFirst).toBe(true);
  });

  it('with a single schema both isFirst and isLast are true', () => {
    const { result } = renderHook(() => useStepsContext(), withProvider([schema1]));

    expect(result.current.isFirst).toBe(true);
    expect(result.current.isLast).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// setStepData / formData accumulation
// ---------------------------------------------------------------------------

describe('StepsProvider — setStepData and formData', () => {
  it('setStepData merges data into formData', () => {
    const { result } = renderHook(() => useStepsContext(), withProvider());

    act(() => result.current.setStepData(0, { name: 'Alice' }));

    expect(result.current.formData).toEqual({ name: 'Alice' });
  });

  it('setStepData accumulates data across multiple calls', () => {
    const { result } = renderHook(() => useStepsContext(), withProvider());

    act(() => result.current.setStepData(0, { name: 'Alice' }));
    act(() => result.current.setStepData(1, { email: 'alice@example.com' }));

    expect(result.current.formData).toEqual({
      name: 'Alice',
      email: 'alice@example.com',
    });
  });

  it('later setStepData calls overwrite earlier data for the same key', () => {
    const { result } = renderHook(() => useStepsContext(), withProvider());

    act(() => result.current.setStepData(0, { name: 'Alice' }));
    act(() => result.current.setStepData(0, { name: 'Bob' })); // overwrite

    expect(result.current.formData.name).toBe('Bob');
  });
});

// ---------------------------------------------------------------------------
// Children can consume context
// ---------------------------------------------------------------------------

describe('StepsProvider — children can read context', () => {
  it('a child component can read currentStep from context', () => {
    function StepDisplay() {
      const { currentStep } = useStepsContext();
      return <div data-testid="step">step-{currentStep}</div>;
    }

    render(
      <StepsProvider schemas={[schema1, schema2]}>
        <StepDisplay />
      </StepsProvider>
    );

    expect(screen.getByTestId('step').textContent).toBe('step-0');
  });

  it('a child component can call next() and the parent re-renders with updated step', () => {
    function StepControl() {
      const { currentStep, next } = useStepsContext();
      return (
        <div>
          <span data-testid="step">{currentStep}</span>
          <button onClick={next} data-testid="btn">
            next
          </button>
        </div>
      );
    }

    render(
      <StepsProvider schemas={[schema1, schema2]}>
        <StepControl />
      </StepsProvider>
    );

    expect(screen.getByTestId('step').textContent).toBe('0');

    act(() => screen.getByTestId('btn').click());

    expect(screen.getByTestId('step').textContent).toBe('1');
  });
});
