import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import { DocumentType } from '@/lib/schemas';

interface TextareaFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  register: UseFormRegister<DocumentType>;
  error?: FieldError;
  className?: string;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  name,
  placeholder,
  required = false,
  rows = 3,
  register,
  error,
  className = ''
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        {...register(name as any)}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical ${
          error ? 'border-red-500' : ''
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};