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
  const baseClasses = "px-6 py-4 rounded-2xl transition-all duration-200";
  
  const variantClasses = {
    primary: "bg-[#8BA888] text-white shadow-sm hover:bg-[#7A9777] active:scale-[0.98]",
    secondary: "bg-white text-[#8BA888] border-2 border-[#8BA888] hover:bg-[#F5F5F3] active:scale-[0.98]"
  };
  
  const disabledClasses = "opacity-50 cursor-not-allowed";
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
