import React from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

interface InputProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  type?: 'text' | 'email' | 'number' | 'date';
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function Input<T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  placeholder,
  required = false,
  className = ''
}: InputProps<T>) {
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
            <input
              {...field}
              id={name}
              type={type}
              placeholder={placeholder}
              className={`
                px-3 py-2 border border-gray-300 rounded-md shadow-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                ${error ? 'border-red-500' : ''}
              `}
              value={field.value || ''}
              onChange={(e) => {
                const value = type === 'number' ? 
                  (e.target.value === '' ? '' : Number(e.target.value)) : 
                  e.target.value;
                field.onChange(value);
              }}
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