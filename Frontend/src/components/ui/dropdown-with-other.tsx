import React, { useState, useEffect } from 'react';
import { Input } from './input';
import { Label } from './label';
import { DropdownOption, CustomInputState, handleDropdownChange, handleCustomInputChange } from '../../utils/dropdownUtils';

interface DropdownWithOtherProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
}

export const DropdownWithOther: React.FC<DropdownWithOtherProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  required = false,
  className = "",
  error
}) => {
  const [customInput, setCustomInput] = useState<CustomInputState>({
    showCustomInput: false,
    customValue: ''
  });

  // Check if current value is not in options (custom value)
  useEffect(() => {
    const optionValues = options.map(opt => opt.value);
    if (value && !optionValues.includes(value) && value !== 'Other') {
      setCustomInput({
        showCustomInput: true,
        customValue: value
      });
    }
  }, [value, options]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    handleDropdownChange(newValue, onChange, setCustomInput, customInput);
  };

  const handleCustomInputChangeLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const customValue = e.target.value;
    handleCustomInputChange(customValue, onChange, setCustomInput, customInput);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="space-y-2">
        <select
          id={label.toLowerCase().replace(/\s+/g, '-')}
          value={customInput.showCustomInput ? 'Other' : value}
          onChange={handleSelectChange}
          className={`w-full px-3 py-2 border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          required={required}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {customInput.showCustomInput && (
          <Input
            placeholder="Please specify..."
            value={customInput.customValue}
            onChange={handleCustomInputChangeLocal}
            className="mt-2"
          />
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
}; 