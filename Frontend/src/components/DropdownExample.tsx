import React, { useState } from 'react';
import { DropdownWithOther } from './ui/dropdown-with-other';
import { getDropdownOptions, getDesignationOptions } from '../utils/dropdownUtils';

const DropdownExample: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Dropdown Examples</h2>
      
      <div className="space-y-4">
        <DropdownWithOther
          label="Course"
          options={getDropdownOptions('courses')}
          value={selectedCourse}
          onChange={setSelectedCourse}
          placeholder="Select Course"
          required={true}
        />

        <DropdownWithOther
          label="Specialization"
          options={getDropdownOptions('courseSpecializations')}
          value={selectedSpecialization}
          onChange={setSelectedSpecialization}
          placeholder="Select Specialization"
          required={true}
        />

        <DropdownWithOther
          label="Designation"
          options={getDesignationOptions('Students')}
          value={selectedDesignation}
          onChange={setSelectedDesignation}
          placeholder="Select Designation"
          required={true}
        />
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Selected Values:</h3>
        <p>Course: {selectedCourse}</p>
        <p>Specialization: {selectedSpecialization}</p>
        <p>Designation: {selectedDesignation}</p>
      </div>
    </div>
  );
};

export default DropdownExample; 