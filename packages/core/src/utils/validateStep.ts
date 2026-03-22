import { ZodType, ZodError } from 'zod';

export interface ValidateStepResult {
  success: boolean;
  errors?: Record<string, string>;
  data?: Record<string, unknown>;
}

export async function validateStep(
  schema: ZodType,
  data: Record<string, unknown>
): Promise<ValidateStepResult> {
  try {
    const parsed = await schema.parseAsync(data);
    return { success: true, data: parsed as Record<string, unknown> };
  } catch (err) {
    if (err instanceof ZodError) {
      const errors: Record<string, string> = {};
      for (const issue of err.issues) {
        const path = issue.path.join('.');
        errors[path] = issue.message;
      }
      return { success: false, errors };
    }
    return { success: false, errors: { _root: 'Validation failed' } };
  }
}
