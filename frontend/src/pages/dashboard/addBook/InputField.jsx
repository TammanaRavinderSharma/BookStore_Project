import React from 'react';

const InputField = ({ label, name, type = 'text', register, placeholder }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-300 mb-1">{label}</label>
      <input
        type={type}
        {...register(name,  { required: true })}
        className="p-2.5 w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all placeholder:text-slate-500"
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;