import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { StepsContextValue, StepsProviderProps } from '../types';
import { validateAllSteps } from '../utils/mergeSchemas';

export const StepsContext = createContext<StepsContextValue | null>(null);

export function useStepsContext(): StepsContextValue {
  const ctx = useContext(StepsContext);
  if (!ctx) {
    throw new Error('useStepsContext must be used within a StepsProvider');
  }
  return ctx;
}

export function StepsProvider({
  children,
  schemas,
  onSubmit,
  initialStep = 0,
}: StepsProviderProps) {
  // We derive totalSteps from schemas length for headless usage
  const totalSteps = schemas.length;
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const next = useCallback(
    () => setCurrentStep((s) => Math.min(s + 1, totalSteps - 1)),
    [totalSteps]
  );
  const prev = useCallback(() => setCurrentStep((s) => Math.max(s - 1, 0)), []);
  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSteps) setCurrentStep(index);
    },
    [totalSteps]
  );

  const setStepData = useCallback((_step: number, data: Record<string, unknown>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const handleSubmit = useCallback(async () => {
    const result = await validateAllSteps(schemas, formData);
    if (result.success && result.data) {
      onSubmit?.(result.data);
    }
  }, [schemas, formData, onSubmit]);

  const contextValue: StepsContextValue = useMemo(
    () => ({
      currentStep,
      totalSteps,
      isFirst: currentStep === 0,
      isLast: currentStep === totalSteps - 1,
      next,
      prev,
      goTo,
      formData,
      setStepData,
      schemas,
    }),
    [currentStep, totalSteps, next, prev, goTo, formData, setStepData, schemas]
  );

  return React.createElement(StepsContext.Provider, { value: contextValue }, children);
}
