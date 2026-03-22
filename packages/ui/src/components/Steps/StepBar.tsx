import React from 'react';
import { useStepsContext } from '@franxx/react-formsteps-core';

export interface StepBarProps {
  className?: string;
  showLabels?: boolean;
  labels?: string[];
}

export function StepBar({ className, showLabels = false, labels }: StepBarProps) {
  const { currentStep, totalSteps } = useStepsContext();
  const progress = totalSteps > 1 ? Math.round((currentStep / (totalSteps - 1)) * 100) : 100;

  if (
    process.env.NODE_ENV !== 'production' &&
    showLabels &&
    labels &&
    labels.length !== totalSteps
  ) {
    console.warn(
      `[StepBar] labels.length (${labels.length}) does not match totalSteps (${totalSteps}). Some steps will have no label.`
    );
  }

  return (
    <div className={className ?? 'w-full mb-6'}>
      <div className="flex items-center justify-between mb-1 text-sm text-gray-600">
        <span>
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span>{progress}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-in-out rounded-full"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabels && labels && (
        <div className="flex justify-between mt-2">
          {labels.map((label, i) => (
            <span
              key={i}
              className={`text-xs ${i === currentStep ? 'text-blue-600 font-medium' : 'text-gray-400'}`}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
