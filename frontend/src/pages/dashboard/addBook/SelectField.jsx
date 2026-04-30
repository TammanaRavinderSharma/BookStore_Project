import React from 'react';

const SelectField = ({ label, name, options, register }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-300 mb-1">{label}</label>
      <select
        {...register(name,  { required: true })}
        className="w-full p-2.5 bg-slate-900/50 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;