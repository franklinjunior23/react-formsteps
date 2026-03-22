import { useState, useCallback } from 'react';
import { UseStepsOptions, UseStepsReturn } from '../types';

export function useSteps({
  totalSteps,
  initialStep = 0,
  onComplete,
}: UseStepsOptions): UseStepsReturn {
  if (totalSteps <= 0) {
    throw new Error('[useSteps] totalSteps must be a positive integer');
  }

  const [currentStep, setCurrentStep] = useState(initialStep);

  const next = useCallback(() => {
    setCurrentStep((prev) => {
      const nextStep = Math.min(prev + 1, totalSteps - 1);
      if (nextStep === totalSteps - 1 && prev !== totalSteps - 1) {
        onComplete?.();
      }
      return nextStep;
    });
  }, [totalSteps, onComplete]);

  const prev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSteps) {
        setCurrentStep(index);
      }
    },
    [totalSteps]
  );

  const progress = totalSteps > 1 ? Math.round((currentStep / (totalSteps - 1)) * 100) : 100;

  return {
    currentStep,
    totalSteps,
    isFirst: currentStep === 0,
    isLast: currentStep === totalSteps - 1,
    next,
    prev,
    goTo,
    progress,
  };
}
