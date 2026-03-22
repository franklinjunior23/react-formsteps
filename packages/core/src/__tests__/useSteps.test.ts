import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSteps } from '../hooks/useSteps';

describe('useSteps', () => {
  it('initializes with step 0 by default', () => {
    const { result } = renderHook(() => useSteps({ totalSteps: 3 }));
    expect(result.current.currentStep).toBe(0);
    expect(result.current.totalSteps).toBe(3);
    expect(result.current.isFirst).toBe(true);
    expect(result.current.isLast).toBe(false);
  });

  it('initializes with custom initial step', () => {
    const { result } = renderHook(() => useSteps({ totalSteps: 3, initialStep: 1 }));
    expect(result.current.currentStep).toBe(1);
    expect(result.current.isFirst).toBe(false);
    expect(result.current.isLast).toBe(false);
  });

  it('advances to next step', () => {
    const { result } = renderHook(() => useSteps({ totalSteps: 3 }));
    act(() => { result.current.next(); });
    expect(result.current.currentStep).toBe(1);
  });

  it('does not go beyond last step', () => {
    const { result } = renderHook(() => useSteps({ totalSteps: 3, initialStep: 2 }));
    act(() => { result.current.next(); });
    expect(result.current.currentStep).toBe(2);
  });

  it('goes to previous step', () => {
    const { result } = renderHook(() => useSteps({ totalSteps: 3, initialStep: 2 }));
    act(() => { result.current.prev(); });
    expect(result.current.currentStep).toBe(1);
  });

  it('does not go before first step', () => {
    const { result } = renderHook(() => useSteps({ totalSteps: 3 }));
    act(() => { result.current.prev(); });
    expect(result.current.currentStep).toBe(0);
  });

  it('jumps to a specific step with goTo', () => {
    const { result } = renderHook(() => useSteps({ totalSteps: 5 }));
    act(() => { result.current.goTo(3); });
    expect(result.current.currentStep).toBe(3);
  });

  it('ignores invalid goTo values', () => {
    const { result } = renderHook(() => useSteps({ totalSteps: 3 }));
    act(() => { result.current.goTo(-1); });
    expect(result.current.currentStep).toBe(0);
    act(() => { result.current.goTo(99); });
    expect(result.current.currentStep).toBe(0);
  });

  it('correctly identifies last step', () => {
    const { result } = renderHook(() => useSteps({ totalSteps: 3, initialStep: 2 }));
    expect(result.current.isLast).toBe(true);
  });

  it('calculates progress correctly', () => {
    const { result } = renderHook(() => useSteps({ totalSteps: 5, initialStep: 2 }));
    expect(result.current.progress).toBe(50);
  });

  it('calls onComplete when reaching the last step', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useSteps({ totalSteps: 3, initialStep: 2, onComplete })
    );
    act(() => { result.current.next(); });
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
