/**
 * Tests for mergeSchemas and validateAllSteps
 *
 * mergeSchemas combines multiple ZodObject schemas into one, which is used
 * at the end of a multi-step form to validate the entire accumulated dataset.
 *
 * validateAllSteps is a convenience wrapper: it merges and validates in one
 * call, returning the same { success, data?, errors? } shape as validateStep.
 *
 * Coverage — mergeSchemas:
 *  - Returns a ZodObject that accepts an empty object when given an empty array
 *  - Merges two schemas so the result validates fields from both
 *  - Merges three schemas correctly
 *  - Silently skips non-ZodObject schemas (e.g. ZodString)
 *  - Later schema fields override earlier ones on key collision
 *  - Merged schema rejects data missing a field from any step
 *
 * Coverage — validateAllSteps:
 *  - Returns success: true when all step data is valid
 *  - Returns success: false when any field is missing or invalid
 *  - Errors include keys from all steps
 *  - Empty schemas array validates an empty object successfully
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { mergeSchemas, validateAllSteps } from '../utils/mergeSchemas';

// ---------------------------------------------------------------------------
// Shared step schemas used across tests
// ---------------------------------------------------------------------------

const step1 = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
});

const step2 = z.object({
  email: z.string().email('Invalid email'),
});

const step3 = z.object({
  password: z.string().min(8, 'Min 8 characters'),
});

// ---------------------------------------------------------------------------
// mergeSchemas
// ---------------------------------------------------------------------------

describe('mergeSchemas', () => {
  it('returns a ZodObject when given an empty array (no schemas to merge)', () => {
    const merged = mergeSchemas([]);

    // An empty object should pass an empty schema
    const result = merged.safeParse({});
    expect(result.success).toBe(true);
  });

  it('merges two ZodObject schemas — result validates fields from both', () => {
    const merged = mergeSchemas([step1, step2]);

    const valid = merged.safeParse({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
    });

    expect(valid.success).toBe(true);
  });

  it('fails if a field from the first schema is missing in the merged result', () => {
    const merged = mergeSchemas([step1, step2]);

    const result = merged.safeParse({
      // firstName missing
      lastName: 'Smith',
      email: 'alice@example.com',
    });

    expect(result.success).toBe(false);
  });

  it('fails if a field from the second schema is missing in the merged result', () => {
    const merged = mergeSchemas([step1, step2]);

    const result = merged.safeParse({
      firstName: 'Alice',
      lastName: 'Smith',
      // email missing
    });

    expect(result.success).toBe(false);
  });

  it('merges three schemas correctly — all fields required', () => {
    const merged = mergeSchemas([step1, step2, step3]);

    const valid = merged.safeParse({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      password: 'supersecure',
    });

    expect(valid.success).toBe(true);
  });

  it('fails when a field from the third schema is missing', () => {
    const merged = mergeSchemas([step1, step2, step3]);

    const result = merged.safeParse({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      // password missing
    });

    expect(result.success).toBe(false);
  });

  it('silently skips non-ZodObject schemas without throwing', () => {
    // ZodString is not a ZodObject — should be ignored during merge
    const skipped = z.string();

    expect(() => mergeSchemas([skipped as never, step2])).not.toThrow();
  });

  it('skipped non-ZodObject schemas do not add fields to the merged result', () => {
    const skipped = z.string();
    const merged = mergeSchemas([skipped as never, step2]);

    // Only step2 fields should be required
    const result = merged.safeParse({ email: 'ok@ok.com' });
    expect(result.success).toBe(true);
  });

  it('when two schemas share a key, the later schema definition wins', () => {
    // Both schemas define "name" — step B requires min(5) instead of min(1)
    const stepA = z.object({ name: z.string().min(1, 'min 1') });
    const stepB = z.object({ name: z.string().min(5, 'min 5') });

    const merged = mergeSchemas([stepA, stepB]);

    // 'Jo' passes stepA but should fail stepB (which overrides)
    const result = merged.safeParse({ name: 'Jo' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('min 5');
    }
  });

  it('single schema — works the same as using the schema directly', () => {
    const merged = mergeSchemas([step1]);

    const valid = merged.safeParse({ firstName: 'Alice', lastName: 'Smith' });
    expect(valid.success).toBe(true);

    const invalid = merged.safeParse({ firstName: '', lastName: 'Smith' });
    expect(invalid.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// validateAllSteps
// ---------------------------------------------------------------------------

describe('validateAllSteps', () => {
  it('returns success: true when all step data is valid', async () => {
    const schemas = [step1, step2, step3];

    const result = await validateAllSteps(schemas, {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      password: 'supersecure',
    });

    expect(result.success).toBe(true);
  });

  it('includes parsed data in result.data on success', async () => {
    const result = await validateAllSteps([step2], {
      email: 'alice@example.com',
    });

    expect(result.data).toEqual({ email: 'alice@example.com' });
  });

  it('returns success: false when a required field is missing', async () => {
    const result = await validateAllSteps([step1, step2], {
      firstName: 'Alice',
      // lastName missing
      email: 'alice@example.com',
    });

    expect(result.success).toBe(false);
  });

  it('returns success: false when a field value is invalid', async () => {
    const result = await validateAllSteps([step1, step2], {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'not-an-email', // fails step2 schema
    });

    expect(result.success).toBe(false);
  });

  it('errors object contains the field key of the failing field', async () => {
    const result = await validateAllSteps([step1, step2], {
      firstName: '',
      lastName: 'Smith',
      email: 'alice@example.com',
    });

    expect(result.errors).toBeDefined();
    expect(result.errors!['firstName']).toBe('First name required');
  });

  it('captures errors from multiple steps at once', async () => {
    const result = await validateAllSteps([step1, step2, step3], {
      firstName: '', // fails step1
      lastName: 'Smith',
      email: 'bad-email', // fails step2
      password: 'short', // fails step3
    });

    expect(result.success).toBe(false);
    expect(result.errors!['firstName']).toBeDefined();
    expect(result.errors!['email']).toBeDefined();
    expect(result.errors!['password']).toBeDefined();
  });

  it('empty schemas array — any data object passes (nothing to validate)', async () => {
    const result = await validateAllSteps([], { anything: 'value' });

    // Empty merged schema strips unknown keys but succeeds
    expect(result.success).toBe(true);
  });

  it('data is undefined on failure', async () => {
    const result = await validateAllSteps([step1], { firstName: '', lastName: '' });

    expect(result.data).toBeUndefined();
  });

  it('errors is undefined on success', async () => {
    const result = await validateAllSteps([step1], {
      firstName: 'Alice',
      lastName: 'Smith',
    });

    expect(result.errors).toBeUndefined();
  });
});
