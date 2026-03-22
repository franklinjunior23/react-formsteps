import React, { useState, useCallback, useMemo } from 'react';
import {
  StepsContext,
  StepsContextValue,
  StepSchema,
  useSteps,
} from 'react-formsteps-core';

export interface StepsProps {
  children: React.ReactNode;
  schemas: StepSchema[];
  onSubmit?: (data: Record<string, unknown>) => void;
  initialStep?: number;
  className?: string;
}

export function Steps({ children, schemas, initialStep = 0, className }: StepsProps) {
  const childArray = React.Children.toArray(children);
  const totalStepsCount = childArray.length;

  if (process.env.NODE_ENV !== 'production' && schemas.length !== totalStepsCount) {
    console.warn(
      `[react-formsteps] schemas.length (${schemas.length}) does not match number of <Step> children (${totalStepsCount}). ` +
        'Each step should have a corresponding schema.'
    );
  }

  const { currentStep, next, prev, goTo, isFirst, isLast, totalSteps } = useSteps({
    totalSteps: totalStepsCount,
    initialStep,
  });

  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const setStepData = useCallback((_step: number, data: Record<string, unknown>) => {
    setFormData((prev) => {
      const merged = { ...prev, ...data };
      return merged;
    });
  }, []);

  const contextValue: StepsContextValue = useMemo(
    () => ({
      currentStep,
      totalSteps,
      isFirst,
      isLast,
      next,
      prev,
      goTo,
      formData,
      setStepData,
      schemas,
    }),
    [currentStep, totalSteps, isFirst, isLast, next, prev, goTo, formData, setStepData, schemas]
  );

  return (
    <StepsContext.Provider value={contextValue}>
      <div className={className ?? 'w-full max-w-xl mx-auto'}>{childArray[currentStep]}</div>
    </StepsContext.Provider>
  );
}
