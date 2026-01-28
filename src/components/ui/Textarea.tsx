import React from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

interface TextareaProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

export function Textarea<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  required = false,
  rows = 3,
  className = ''
}: TextareaProps<T>) {
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <textarea
              {...field}
              id={name}
              rows={rows}
              placeholder={placeholder}
              className={`
                px-3 py-2 border border-gray-300 rounded-md shadow-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                resize-vertical
                ${error ? 'border-red-500' : ''}
              `}
              value={field.value || ''}
            />
            {error && (
              <span className="text-sm text-red-600">{error.message}</span>
            )}
          </>
        )}
      />
    </div>
  );
}