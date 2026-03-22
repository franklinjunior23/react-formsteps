import { z, ZodType, ZodObject, ZodTypeAny } from 'zod';

// ZodObject generics (shape, unknownKeys, catchall) vary across schemas after `.merge()`,
// making a precise generic type impractical here. `any` is intentional and safe.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyZodObject = ZodObject<any, any, any>;

/**
 * Merges multiple Zod schemas into a single ZodObject schema.
 * Only merges ZodObject schemas; other schema types are skipped.
 */
export function mergeSchemas(schemas: ZodType[]): AnyZodObject {
  let merged: AnyZodObject = z.object({});

  for (const schema of schemas) {
    if (schema instanceof ZodObject) {
      merged = merged.merge(schema as ZodObject<Record<string, ZodTypeAny>>);
    }
  }

  return merged;
}

/**
 * Validates all accumulated form data against the merged schema.
 */
export async function validateAllSteps(
  schemas: ZodType[],
  data: Record<string, unknown>
): Promise<{ success: boolean; data?: Record<string, unknown>; errors?: Record<string, string> }> {
  const mergedSchema = mergeSchemas(schemas);
  try {
    const parsed = await mergedSchema.parseAsync(data);
    return { success: true, data: parsed as Record<string, unknown> };
  } catch (err) {
    const { ZodError } = await import('zod');
    if (err instanceof ZodError) {
      const errors: Record<string, string> = {};
      for (const issue of err.issues) {
        errors[issue.path.join('.')] = issue.message;
      }
      return { success: false, errors };
    }
    return { success: false };
  }
}
