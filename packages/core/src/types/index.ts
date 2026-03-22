import { z, ZodType } from 'zod';
import { UseFormReturn, FieldValues } from 'react-hook-form';

export type StepSchema = ZodType<Record<string, unknown>>;

export interface StepConfig {
  id: string;
  label?: string;
  schema?: StepSchema;
}

export interface StepsContextValue {
  currentStep: number;
  totalSteps: number;
  isFirst: boolean;
  isLast: boolean;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  formData: Record<string, unknown>;
  setStepData: (step: number, data: Record<string, unknown>) => void;
  schemas: StepSchema[];
}

export interface UseStepsOptions {
  totalSteps: number;
  initialStep?: number;
  onComplete?: () => void;
}

export interface UseStepsReturn {
  currentStep: number;
  totalSteps: number;
  isFirst: boolean;
  isLast: boolean;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  progress: number;
}

export interface UseStepFormOptions<TSchema extends ZodType = ZodType> {
  schema: TSchema;
  defaultValues?: Partial<z.infer<TSchema>>;
  onNext?: (data: z.infer<TSchema>) => void;
}

export interface UseStepFormReturn<TSchema extends ZodType = ZodType> {
  form: UseFormReturn<z.infer<TSchema> & FieldValues>;
  nextWithValidation: () => Promise<boolean>;
  isValidating: boolean;
}

export interface StepsProviderProps {
  children: React.ReactNode;
  schemas: StepSchema[];
  onSubmit?: (data: Record<string, unknown>) => void;
  initialStep?: number;
}
