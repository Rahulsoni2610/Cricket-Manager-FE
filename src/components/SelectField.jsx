import React, { useState, useMemo } from 'react';

const SelectField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options,
  placeholder = "Select an option",
  searchPlaceholder = "Search options...",
  helper,
  error,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const normalizedOptions = useMemo(() => {
    return (options || []).map((option) => ({
      ...option,
      label: option.label ?? option.name ?? String(option.value ?? ''),
    }));
  }, [options]);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return normalizedOptions;
    return normalizedOptions.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [normalizedOptions, searchTerm]);

  const handleSelectChange = (e) => {
    onChange(e);
    setIsOpen(false);
    setSearchTerm('');
  };

  const selectedOptionLabel = normalizedOptions.find(opt => opt.value === value)?.label || placeholder;

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-slate-700 mb-1">
        {label}
      </label>

      <div
        className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-white shadow-sm cursor-pointer flex justify-between items-center transition ${
          error ? 'border-red-300' : 'border-slate-200'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        onBlur={onBlur}
        tabIndex={0}
      >
        <span className={value ? "" : "text-slate-400"}>{selectedOptionLabel}</span>
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

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg">
          <div className="p-2 border-b border-slate-100">
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => (
                <div
                  key={opt.value}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-orange-50 ${
                    value === opt.value ? 'bg-orange-100 text-orange-800' : ''
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
              <div className="px-4 py-2 text-sm text-slate-500">No options found</div>
            )}
          </div>
        </div>
      )}

      {helper && !error && (
        <p className="mt-1 text-xs text-slate-500">{helper}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default SelectField;
