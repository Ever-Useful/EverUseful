import dropdownData from '../data/dropdownData.json';
import React from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  isOther?: boolean;
}

export interface CustomInputState {
  showCustomInput: boolean;
  customValue: string;
}

export const getDropdownOptions = (key: keyof typeof dropdownData): DropdownOption[] => {
  const data = dropdownData[key];
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  return data.map(item => ({
    value: item,
    label: item,
    isOther: item === 'Other'
  }));
};

export const getDesignationOptions = (userType: string): DropdownOption[] => {
  if (userType === 'Professors') {
    return getDropdownOptions('professorDesignations');
  } else {
    return getDropdownOptions('techDesignations');
  }
};

export const getCountryCodeOptions = (): DropdownOption[] => {
  const countryCodes = dropdownData.countryCodes;
  if (!countryCodes || !Array.isArray(countryCodes)) {
    return [];
  }
  
  return countryCodes.map(item => ({
    value: item.code,
    label: item.code,
    isOther: false
  }));
};

export const handleDropdownChange = (
  value: string,
  setValue: (value: string) => void,
  setCustomInput: (state: CustomInputState) => void,
  customInput: CustomInputState
) => {
  if (value === 'Other') {
    setCustomInput({
      showCustomInput: true,
      customValue: customInput.customValue
    });
  } else {
    setValue(value);
    setCustomInput({
      showCustomInput: false,
      customValue: ''
    });
  }
};

export const handleCustomInputChange = (
  customValue: string,
  setValue: (value: string) => void,
  setCustomInput: (state: CustomInputState) => void,
  customInput: CustomInputState
) => {
  setCustomInput({
    ...customInput,
    customValue
  });
  setValue(customValue);
};

export const getFinalValue = (value: string, customInput: CustomInputState): string => {
  if (value === 'Other' && customInput.showCustomInput) {
    return customInput.customValue;
  }
  return value;
};

// Hook for managing dropdown with "Other" option
export const useDropdownWithOther = (initialValue: string = '') => {
  const [value, setValue] = React.useState(initialValue);
  const [customInput, setCustomInput] = React.useState<CustomInputState>({
    showCustomInput: false,
    customValue: ''
  });

  const handleChange = (newValue: string) => {
    handleDropdownChange(newValue, setValue, setCustomInput, customInput);
  };

  const handleCustomChange = (customValue: string) => {
    handleCustomInputChange(customValue, setValue, setCustomInput, customInput);
  };

  const finalValue = getFinalValue(value, customInput);

  return {
    value,
    setValue,
    customInput,
    setCustomInput,
    handleChange,
    handleCustomChange,
    finalValue
  };
}; 