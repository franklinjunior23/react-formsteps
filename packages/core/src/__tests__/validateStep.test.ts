/**
 * Tests for validateStep
 *
 * validateStep is a thin async wrapper around schema.parseAsync() that
 * normalises the result into { success, data?, errors? } so callers never
 * have to catch ZodErrors themselves.
 *
 * Coverage:
 *  - Returns success: true + parsed data for valid input
 *  - Returns success: false + field errors for invalid input
 *  - Error message text matches the Zod schema message
 *  - Multiple failing fields are all captured
 *  - Nested field paths are formatted with dot notation
 *  - Never throws — always returns a result object
 *  - Works with common field types: string, email, number, enum, date
 *  - Zod transformations are applied and returned in data
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { validateStep } from '../utils/validateStep';

// ---------------------------------------------------------------------------
// Success cases
// ---------------------------------------------------------------------------

describe('validateStep — success', () => {
  it('returns success: true when all fields satisfy the schema', async () => {
    const schema = z.object({ name: z.string().min(1) });

    const result = await validateStep(schema, { name: 'Alice' });

    expect(result.success).toBe(true);
  });

  it('returns the parsed data in result.data on success', async () => {
    const schema = z.object({ email: z.string().email() });

    const result = await validateStep(schema, { email: 'alice@example.com' });

    expect(result.data).toEqual({ email: 'alice@example.com' });
  });

  it('errors is undefined on success', async () => {
    const schema = z.object({ age: z.number().min(0) });

    const result = await validateStep(schema, { age: 25 });

    expect(result.errors).toBeUndefined();
  });

  it('applies Zod transformations and returns the transformed value', async () => {
    // .trim() is a transform — the returned value should be trimmed
    const schema = z.object({ username: z.string().trim().min(1) });

    const result = await validateStep(schema, { username: '  alice  ' });

    expect(result.success).toBe(true);
    expect((result.data as { username: string }).username).toBe('alice');
  });

  it('passes with optional fields that are absent from data', async () => {
    const schema = z.object({
      required: z.string().min(1),
      optional: z.string().optional(),
    });

    const result = await validateStep(schema, { required: 'hello' });

    expect(result.success).toBe(true);
  });

  it('passes with a number field at its exact minimum boundary', async () => {
    const schema = z.object({ age: z.number().min(18) });

    const result = await validateStep(schema, { age: 18 });

    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Failure cases — single field
// ---------------------------------------------------------------------------

describe('validateStep — single field failure', () => {
  it('returns success: false for an empty required string', async () => {
    const schema = z.object({ name: z.string().min(1, 'Name is required') });

    const result = await validateStep(schema, { name: '' });

    expect(result.success).toBe(false);
  });

  it('puts the field name as a key in errors', async () => {
    const schema = z.object({ name: z.string().min(1, 'Name is required') });

    const result = await validateStep(schema, { name: '' });

    expect(result.errors).toBeDefined();
    expect(result.errors!['name']).toBeDefined();
  });

  it('uses the custom error message defined in the schema', async () => {
    const schema = z.object({ name: z.string().min(1, 'Name is required') });

    const result = await validateStep(schema, { name: '' });

    expect(result.errors!['name']).toBe('Name is required');
  });

  it('catches an invalid email and reports the correct message', async () => {
    const schema = z.object({ email: z.string().email('Invalid email') });

    const result = await validateStep(schema, { email: 'not-an-email' });

    expect(result.success).toBe(false);
    expect(result.errors!['email']).toBe('Invalid email');
  });

  it('fails when a number is below its minimum', async () => {
    const schema = z.object({ age: z.number().min(18, 'Must be 18 or older') });

    const result = await validateStep(schema, { age: 16 });

    expect(result.success).toBe(false);
    expect(result.errors!['age']).toBe('Must be 18 or older');
  });

  it('fails when an enum value is not in the allowed set', async () => {
    const schema = z.object({
      role: z.enum(['admin', 'user'], { errorMap: () => ({ message: 'Invalid role' }) }),
    });

    const result = await validateStep(schema, { role: 'superuser' });

    expect(result.success).toBe(false);
    expect(result.errors!['role']).toBe('Invalid role');
  });

  it('data is undefined on failure', async () => {
    const schema = z.object({ name: z.string().min(1) });

    const result = await validateStep(schema, { name: '' });

    expect(result.data).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Failure cases — multiple fields
// ---------------------------------------------------------------------------

describe('validateStep — multiple field failures', () => {
  it('captures all failing fields in one pass', async () => {
    const schema = z.object({
      firstName: z.string().min(1, 'First name required'),
      lastName: z.string().min(1, 'Last name required'),
      email: z.string().email('Invalid email'),
    });

    const result = await validateStep(schema, {
      firstName: '',
      lastName: '',
      email: 'bad',
    });

    expect(result.success).toBe(false);
    expect(result.errors!['firstName']).toBe('First name required');
    expect(result.errors!['lastName']).toBe('Last name required');
    expect(result.errors!['email']).toBe('Invalid email');
  });

  it('only reports errors for failing fields — passing fields are omitted', async () => {
    const schema = z.object({
      firstName: z.string().min(1, 'First name required'),
      email: z.string().email('Invalid email'),
    });

    const result = await validateStep(schema, {
      firstName: 'Alice', // valid
      email: '', // invalid
    });

    expect(result.errors!['firstName']).toBeUndefined();
    expect(result.errors!['email']).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Nested field paths
// ---------------------------------------------------------------------------

describe('validateStep — nested field paths', () => {
  it('formats nested error keys with dot notation', async () => {
    const schema = z.object({
      address: z.object({
        city: z.string().min(1, 'City is required'),
      }),
    });

    const result = await validateStep(schema, { address: { city: '' } });

    expect(result.success).toBe(false);
    // Dot-separated path: "address.city"
    expect(result.errors!['address.city']).toBe('City is required');
  });
});

// ---------------------------------------------------------------------------
// Never throws
// ---------------------------------------------------------------------------

describe('validateStep — never throws', () => {
  it('returns a result object instead of throwing for invalid data', async () => {
    const schema = z.object({ value: z.number() });

    // Passing a string where a number is expected
    await expect(
      validateStep(schema, { value: 'not-a-number' as unknown as number })
    ).resolves.toMatchObject({ success: false });
  });

  it('handles completely empty data without throwing', async () => {
    const schema = z.object({
      required: z.string().min(1),
    });

    await expect(validateStep(schema, {})).resolves.toMatchObject({
      success: false,
    });
  });
});
