import React, { useCallback } from 'react';
import { useStepsContext } from 'react-formsteps-core';
import { validateStep } from 'react-formsteps-core';

export interface StepNavProps {
  onBeforeNext?: () => Promise<boolean> | boolean;
  onSubmit?: () => void;
  nextLabel?: string;
  prevLabel?: string;
  submitLabel?: string;
  className?: string;
  getValues?: () => Record<string, unknown>;
}

export function StepNav({
  onBeforeNext,
  onSubmit,
  nextLabel = 'Next',
  prevLabel = 'Back',
  submitLabel = 'Submit',
  className,
  getValues,
}: StepNavProps) {
  const { currentStep, isFirst, isLast, next, prev, schemas, formData } = useStepsContext();

  const handleNext = useCallback(async () => {
    const schema = schemas[currentStep] ?? null;
    const data = getValues ? getValues() : formData;

    if (schema) {
      const result = await validateStep(schema, data);
      if (!result.success) return;
    }

    if (onBeforeNext) {
      const canProceed = await onBeforeNext();
      if (!canProceed) return;
    }

    if (isLast) {
      onSubmit?.();
    } else {
      next();
    }
  }, [currentStep, schemas, formData, getValues, onBeforeNext, isLast, next, onSubmit]);

  return (
    <div className={className ?? 'flex items-center justify-between mt-6 gap-4'}>
      <button
        type="button"
        onClick={prev}
        disabled={isFirst}
        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-colors"
      >
        {prevLabel}
      </button>
      <button
        type="button"
        onClick={handleNext}
        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        {isLast ? submitLabel : nextLabel}
      </button>
    </div>
  );
}
