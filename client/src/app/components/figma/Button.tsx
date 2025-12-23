import React from 'react';
import { motion } from 'motion/react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    fullWidth?: boolean;
    type?: 'button' | 'submit';
}

export function Button({
    children,
    onClick,
    variant = 'primary',
    disabled = false,
    fullWidth = false,
    type = 'button'
}: ButtonProps) {
    const baseClasses = "px-6 py-4 rounded-2xl transition-all duration-200 font-semibold text-lg";

    const variantClasses = {
        primary: "bg-primary text-primary-foreground shadow-sm hover:opacity-90 active:scale-[0.98]",
        secondary: "bg-transparent text-primary border border-primary hover:bg-primary/5 active:scale-[0.98]"
    };

    const disabledClasses = "opacity-50 cursor-not-allowed grayscale";
    const widthClasses = fullWidth ? "w-full" : "";

    return (
        <motion.button
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${disabled ? disabledClasses : ''} ${widthClasses}`}
        >
            {children}
        </motion.button>
    );
}
