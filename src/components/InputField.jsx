const InputField = ({ label, name, type = "text", value, onChange, required = false, placeholder = "" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

export default InputField;
