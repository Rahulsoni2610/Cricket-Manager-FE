import React, { useState, useMemo } from 'react';

const SelectField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  placeholder = "Select an option",
  searchPlaceholder = "Search options..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const handleSelectChange = (e) => {
    onChange(e);
    setIsOpen(false);
    setSearchTerm('');
  };

  const selectedOptionLabel = options.find(opt => opt.value === value)?.label || placeholder;

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      
      {/* Custom dropdown trigger */}
      <div 
        className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "" : "text-gray-400"}>{selectedOptionLabel}</span>
        <svg 
          className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {/* Search input */}
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full px-3 py-1 text-sm border rounded-md focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          
          {/* Options list */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => (
                <div
                  key={opt.value}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-indigo-50 ${
                    value === opt.value ? 'bg-indigo-100 text-indigo-800' : ''
                  }`}
                  onClick={() => handleSelectChange({
                    target: {
                      name: name,
                      value: opt.value
                    }
                  })}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectField;
