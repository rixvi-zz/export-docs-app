'use client';

import React, { forwardRef } from 'react';

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  error?: string;
  className?: string;
}

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  ({ label, options, value = [], onChange, error, className = '' }, ref) => {
    const handleCheckboxChange = (optionValue: string, checked: boolean) => {
      if (checked) {
        onChange([...value, optionValue]);
      } else {
        onChange(value.filter(v => v !== optionValue));
      }
    };

    return (
      <div ref={ref} className={`flex flex-col space-y-1 ${className}`}>
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="border border-gray-300 rounded-md p-3 space-y-2 bg-white">
          {options.map((option) => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value.includes(option.value)}
                onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
          {options.length === 0 && (
            <p className="text-sm text-gray-500">No options available</p>
          )}
        </div>
        {value.length > 0 && (
          <div className="text-xs text-gray-600">
            Selected: {value.map(v => options.find(o => o.value === v)?.label).join(', ')}
          </div>
        )}
        {error && (
          <span className="text-sm text-red-600">{error}</span>
        )}
      </div>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';