import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import { DocumentType } from '@/lib/schemas';

interface CheckboxFieldProps {
  label: string;
  name: string;
  description?: string;
  register: UseFormRegister<DocumentType>;
  error?: FieldError;
  className?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  name,
  description,
  register,
  error,
  className = ''
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-start">
        <input
          id={name}
          type="checkbox"
          {...register(name as any)}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <div className="ml-3">
          <label htmlFor={name} className="text-sm font-medium text-gray-700">
            {label}
          </label>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};