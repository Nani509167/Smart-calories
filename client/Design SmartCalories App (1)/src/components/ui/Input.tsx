import React from 'react';

interface InputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
  placeholder?: string;
  unit?: string;
}

export function Input({ 
  label, 
  value, 
  onChange, 
  type = 'text',
  placeholder,
  unit
}: InputProps) {
  return (
    <div className="space-y-2">
      <label className="text-[#4A4A4A] text-sm ml-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-5 py-4 bg-white rounded-2xl border-2 border-[#E8E6E0] focus:border-[#8BA888] focus:outline-none transition-colors"
        />
        {unit && (
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[#9E9E9E]">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
