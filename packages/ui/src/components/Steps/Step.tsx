import React from 'react';

export interface StepProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Step({ children, className, title }: StepProps) {
  return (
    <div className={className ?? 'w-full'}>
      {title && (
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
      )}
      {children}
    </div>
  );
}
