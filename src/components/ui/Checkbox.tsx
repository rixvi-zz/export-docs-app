import React from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

interface CheckboxProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  className?: string;
}

export function Checkbox<T extends FieldValues>({
  name,
  control,
  label,
  className = ''
}: CheckboxProps<T>) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <input
              {...field}
              id={name}
              type="checkbox"
              checked={field.value || false}
              className={`
                h-4 w-4 text-blue-600 border-gray-300 rounded
                focus:ring-2 focus:ring-blue-500
                ${error ? 'border-red-500' : ''}
              `}
            />
            <label htmlFor={name} className="text-sm font-medium text-gray-700">
              {label}
            </label>
            {error && (
              <span className="text-sm text-red-600 ml-2">{error.message}</span>
            )}
          </>
        )}
      />
    </div>
  );
}