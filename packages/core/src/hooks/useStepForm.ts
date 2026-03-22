import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodType, z } from 'zod';
import { UseStepFormOptions, UseStepFormReturn } from '../types';

export function useStepForm<TSchema extends ZodType>({
  schema,
  defaultValues,
  onNext,
}: UseStepFormOptions<TSchema>): UseStepFormReturn<TSchema> {
  const [isValidating, setIsValidating] = useState(false);

  const form = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    // Cast needed: react-hook-form expects FieldValues but z.infer<TSchema> satisfies it at runtime
    defaultValues: defaultValues as z.infer<TSchema>,
    mode: 'onSubmit',
  });

  const nextWithValidation = useCallback(async (): Promise<boolean> => {
    setIsValidating(true);
    try {
      const isValid = await form.trigger();
      if (isValid) {
        const data = form.getValues();
        onNext?.(data);
        return true;
      }
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [form, onNext]);

  return {
    form,
    nextWithValidation,
    isValidating,
  };
}
