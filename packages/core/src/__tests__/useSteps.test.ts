/**
 * Tests for useSteps
 *
 * useSteps is the core navigation hook. It manages which step is active,
 * exposes helpers to move forward/back/jump, and computes derived state
 * (isFirst, isLast, progress).
 *
 * Coverage:
 *  - Initial state
 *  - next() / prev() / goTo() navigation
 *  - Boundary clamping (can't go below 0 or above last)
 *  - isFirst / isLast derived flags
 *  - progress percentage calculation
 *  - onComplete callback behavior
 *  - Edge cases: single step, invalid totalSteps
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSteps } from '../hooks/useSteps';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Shorthand to render useSteps with sensible defaults. */
const render = (opts: Parameters<typeof useSteps>[0]) => renderHook(() => useSteps(opts));

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

describe('useSteps — initial state', () => {
  it('starts on step 0 by default', () => {
    const { result } = render({ totalSteps: 3 });

    expect(result.current.currentStep).toBe(0);
  });

  it('exposes the totalSteps value that was passed in', () => {
    const { result } = render({ totalSteps: 5 });

    expect(result.current.totalSteps).toBe(5);
  });

  it('marks isFirst as true and isLast as false when starting on step 0 with multiple steps', () => {
    const { result } = render({ totalSteps: 4 });

    expect(result.current.isFirst).toBe(true);
    expect(result.current.isLast).toBe(false);
  });

  it('respects a custom initialStep', () => {
    const { result } = render({ totalSteps: 5, initialStep: 3 });

    expect(result.current.currentStep).toBe(3);
    expect(result.current.isFirst).toBe(false);
    expect(result.current.isLast).toBe(false);
  });

  it('marks isLast as true when initialStep is the last index', () => {
    const { result } = render({ totalSteps: 3, initialStep: 2 });

    expect(result.current.isLast).toBe(true);
    expect(result.current.isFirst).toBe(false);
  });

  it('throws an error when totalSteps is 0', () => {
    // useSteps should fail fast rather than producing silent broken state
    expect(() => render({ totalSteps: 0 })).toThrow(
      '[useSteps] totalSteps must be a positive integer'
    );
  });

  it('throws an error when totalSteps is negative', () => {
    expect(() => render({ totalSteps: -5 })).toThrow(
      '[useSteps] totalSteps must be a positive integer'
    );
  });
});

// ---------------------------------------------------------------------------
// next()
// ---------------------------------------------------------------------------

describe('useSteps — next()', () => {
  it('advances currentStep by 1', () => {
    const { result } = render({ totalSteps: 3 });

    act(() => result.current.next());

    expect(result.current.currentStep).toBe(1);
  });

  it('can advance all the way to the last step', () => {
    const { result } = render({ totalSteps: 3 });

    act(() => result.current.next());
    act(() => result.current.next());

    expect(result.current.currentStep).toBe(2);
    expect(result.current.isLast).toBe(true);
  });

  it('does NOT go beyond the last step — stays clamped', () => {
    // Already on last step (index 2 of 3)
    const { result } = render({ totalSteps: 3, initialStep: 2 });

    act(() => result.current.next());

    expect(result.current.currentStep).toBe(2);
  });

  it('calling next() many times on the last step keeps it clamped', () => {
    const { result } = render({ totalSteps: 2, initialStep: 1 });

    act(() => {
      result.current.next();
      result.current.next();
      result.current.next();
    });

    expect(result.current.currentStep).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// prev()
// ---------------------------------------------------------------------------

describe('useSteps — prev()', () => {
  it('moves currentStep back by 1', () => {
    const { result } = render({ totalSteps: 3, initialStep: 2 });

    act(() => result.current.prev());

    expect(result.current.currentStep).toBe(1);
  });

  it('does NOT go below step 0 — stays clamped', () => {
    const { result } = render({ totalSteps: 3 }); // already at step 0

    act(() => result.current.prev());

    expect(result.current.currentStep).toBe(0);
  });

  it('calling prev() many times on step 0 keeps it clamped', () => {
    const { result } = render({ totalSteps: 3 });

    act(() => {
      result.current.prev();
      result.current.prev();
      result.current.prev();
    });

    expect(result.current.currentStep).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// goTo()
// ---------------------------------------------------------------------------

describe('useSteps — goTo()', () => {
  it('jumps directly to a specific valid index', () => {
    const { result } = render({ totalSteps: 5 });

    act(() => result.current.goTo(4));

    expect(result.current.currentStep).toBe(4);
  });

  it('can jump backwards', () => {
    const { result } = render({ totalSteps: 5, initialStep: 4 });

    act(() => result.current.goTo(1));

    expect(result.current.currentStep).toBe(1);
  });

  it('accepts step 0 (first step)', () => {
    const { result } = render({ totalSteps: 5, initialStep: 3 });

    act(() => result.current.goTo(0));

    expect(result.current.currentStep).toBe(0);
  });

  it('accepts the last valid index (totalSteps - 1)', () => {
    const { result } = render({ totalSteps: 5 });

    act(() => result.current.goTo(4));

    expect(result.current.currentStep).toBe(4);
  });

  it('ignores negative indices — step stays unchanged', () => {
    const { result } = render({ totalSteps: 3, initialStep: 1 });

    act(() => result.current.goTo(-1));

    expect(result.current.currentStep).toBe(1);
  });

  it('ignores out-of-bounds indices — step stays unchanged', () => {
    const { result } = render({ totalSteps: 3, initialStep: 1 });

    act(() => result.current.goTo(99));

    expect(result.current.currentStep).toBe(1);
  });

  it('ignores exactly totalSteps (one past the end)', () => {
    const { result } = render({ totalSteps: 3, initialStep: 0 });

    act(() => result.current.goTo(3)); // valid range is 0-2

    expect(result.current.currentStep).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// isFirst / isLast
// ---------------------------------------------------------------------------

describe('useSteps — isFirst / isLast', () => {
  it('isFirst is true only on step 0', () => {
    const { result } = render({ totalSteps: 3 });

    expect(result.current.isFirst).toBe(true);

    act(() => result.current.next());
    expect(result.current.isFirst).toBe(false);

    act(() => result.current.prev());
    expect(result.current.isFirst).toBe(true);
  });

  it('isLast is true only on the last step', () => {
    const { result } = render({ totalSteps: 3 });

    expect(result.current.isLast).toBe(false);

    act(() => result.current.next());
    act(() => result.current.next());

    expect(result.current.isLast).toBe(true);
  });

  it('with a single step both isFirst and isLast are true simultaneously', () => {
    const { result } = render({ totalSteps: 1 });

    expect(result.current.isFirst).toBe(true);
    expect(result.current.isLast).toBe(true);
  });

  it('with exactly 2 steps — first step is isFirst and not isLast', () => {
    const { result } = render({ totalSteps: 2 });

    expect(result.current.isFirst).toBe(true);
    expect(result.current.isLast).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// progress
// ---------------------------------------------------------------------------

describe('useSteps — progress', () => {
  it('is 0 on step 0 with multiple steps', () => {
    const { result } = render({ totalSteps: 5 });

    expect(result.current.progress).toBe(0);
  });

  it('is 100 on the last step', () => {
    const { result } = render({ totalSteps: 5, initialStep: 4 });

    expect(result.current.progress).toBe(100);
  });

  it('is 50 at the midpoint of a 5-step form (step 2 of 0-4)', () => {
    const { result } = render({ totalSteps: 5, initialStep: 2 });

    expect(result.current.progress).toBe(50);
  });

  it('is 25 at step 1 of a 5-step form', () => {
    const { result } = render({ totalSteps: 5, initialStep: 1 });

    expect(result.current.progress).toBe(25);
  });

  it('is always 100 when there is only 1 step', () => {
    // A form with a single step is always "complete"
    const { result } = render({ totalSteps: 1 });

    expect(result.current.progress).toBe(100);
  });

  it('updates correctly after navigation', () => {
    const { result } = render({ totalSteps: 3 });

    expect(result.current.progress).toBe(0);

    act(() => result.current.next());
    expect(result.current.progress).toBe(50);

    act(() => result.current.next());
    expect(result.current.progress).toBe(100);

    act(() => result.current.prev());
    expect(result.current.progress).toBe(50);
  });
});

// ---------------------------------------------------------------------------
// onComplete callback
// ---------------------------------------------------------------------------

describe('useSteps — onComplete callback', () => {
  it('fires onComplete when the user arrives at the last step for the first time', () => {
    const onComplete = vi.fn();

    // Start on the second-to-last step (index 1 of 3)
    const { result } = render({ totalSteps: 3, initialStep: 1, onComplete });

    act(() => result.current.next()); // step 1 → 2 (last)

    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('does NOT fire onComplete when already on the last step and next() is pressed again', () => {
    const onComplete = vi.fn();

    // Already on the last step
    const { result } = render({ totalSteps: 3, initialStep: 2, onComplete });

    act(() => result.current.next()); // clamped — no movement

    expect(onComplete).not.toHaveBeenCalled();
  });

  it('does NOT fire onComplete when navigating backwards', () => {
    const onComplete = vi.fn();
    const { result } = render({ totalSteps: 3, initialStep: 2, onComplete });

    act(() => result.current.prev());

    expect(onComplete).not.toHaveBeenCalled();
  });

  it('does NOT fire onComplete when using goTo() to jump to the last step', () => {
    // onComplete is intentionally only tied to next() flow, not goTo()
    const onComplete = vi.fn();
    const { result } = render({ totalSteps: 3, onComplete });

    act(() => result.current.goTo(2));

    expect(onComplete).not.toHaveBeenCalled();
  });

  it('fires onComplete exactly once even when next() is called rapidly multiple times', () => {
    const onComplete = vi.fn();
    const { result } = render({ totalSteps: 3, initialStep: 1, onComplete });

    act(() => {
      result.current.next(); // arrives at last → fires
      result.current.next(); // already at last → clamped, no fire
      result.current.next(); // same
    });

    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('works correctly without an onComplete callback (no crash)', () => {
    // Ensure the hook is safe when onComplete is not provided
    const { result } = render({ totalSteps: 2 });

    expect(() => act(() => result.current.next())).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Full navigation sequence
// ---------------------------------------------------------------------------

describe('useSteps — full navigation sequences', () => {
  it('can traverse a 4-step form forwards and backwards correctly', () => {
    const { result } = render({ totalSteps: 4 });

    // Forward
    act(() => result.current.next());
    expect(result.current.currentStep).toBe(1);

    act(() => result.current.next());
    expect(result.current.currentStep).toBe(2);

    act(() => result.current.next());
    expect(result.current.currentStep).toBe(3);
    expect(result.current.isLast).toBe(true);

    // Backward
    act(() => result.current.prev());
    expect(result.current.currentStep).toBe(2);

    act(() => result.current.prev());
    expect(result.current.currentStep).toBe(1);

    // Jump
    act(() => result.current.goTo(3));
    expect(result.current.currentStep).toBe(3);
  });
});
