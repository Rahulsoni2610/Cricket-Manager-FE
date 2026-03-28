const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  required = false,
  placeholder = "",
  helper,
  error,
  min,
  max,
  step,
}) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1">
      {label}
      {required && <span className="text-orange-500"> *</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      required={required}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-white shadow-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition ${
        error ? 'border-red-300' : 'border-slate-200'
      }`}
    />
    {helper && !error && (
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
    )}
    {error && (
      <p className="mt-1 text-xs text-red-600">{error}</p>
    )}
  </div>
);

export default InputField;
