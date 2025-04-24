import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import InputField from '../../components/InputField';
import SelectField from '../../components/SelectField';
import { ROLE_OPTIONS, BATTING_STYLES, BOWLING_STYLES } from '../../constants/team';

const PlayerFormModal = ({ isOpen, onClose, formData, handleInputChange, handleSubmit, currentPlayer, resetForm }) => {
  if (!isOpen) return null;

  const closeModal = () => {
    onClose();
    resetForm();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20">
      <div className="fixed inset-0 bg-gray-500 opacity-75 z-10" aria-hidden="true" />

      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative z-30">
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {currentPlayer ? 'Edit Player' : 'Create New Player'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            placeholder="Enter first name"
            required
          />
          <InputField
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            placeholder="Enter last name"
          />
          <InputField
            label="Date of Birth"
            name="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={handleInputChange}
          />
          <SelectField
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            placeholder="Select a role"
            options={ROLE_OPTIONS}
          />
          <SelectField
            label="Batting Style"
            name="batting_style"
            value={formData.batting_style}
            onChange={handleInputChange}
            placeholder="Select a batting style"
            options={BATTING_STYLES}
          />
          <SelectField
            label="Bowling Style"
            name="bowling_style"
            value={formData.bowling_style}
            onChange={handleInputChange}
            placeholder="Select a bowling style"
            options={BOWLING_STYLES}
          />

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm rounded-md border text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {currentPlayer ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerFormModal;
