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
            <label className="text-muted-foreground text-sm ml-1 font-medium">
                {label}
            </label>
            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-5 py-4 bg-background rounded-2xl border border-border focus:border-primary focus:outline-none transition-colors text-foreground"
                />
                {unit && (
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        {unit}
                    </span>
                )}
            </div>
        </div>
    );
}
