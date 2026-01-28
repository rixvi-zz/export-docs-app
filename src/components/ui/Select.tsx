import React from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  options: SelectOption[];
  required?: boolean;
  allowCustom?: boolean;
  className?: string;
}

export function Select<T extends FieldValues>({
  name,
  control,
  label,
  options,
  required = false,
  allowCustom = false,
  className = ''
}: SelectProps<T>) {
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
            <select
              {...field}
              id={name}
              className={`
                px-3 py-2 border border-gray-300 rounded-md shadow-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                ${error ? 'border-red-500' : ''}
              `}
              value={field.value || ''}
            >
              <option value="">Select an option</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
              {allowCustom && (
                <option value="custom">Custom (Enter below)</option>
              )}
            </select>
            {error && (
              <span className="text-sm text-red-600">{error.message}</span>
            )}
          </>
        )}
      />
    </div>
  );
}