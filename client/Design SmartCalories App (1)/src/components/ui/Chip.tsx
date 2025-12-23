import React from 'react';
import { motion } from 'motion/react';

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-5 py-3 rounded-full transition-all duration-200 ${
        selected
          ? 'bg-[#8BA888] text-white shadow-sm'
          : 'bg-white text-[#6B6B6B] border-2 border-[#E8E6E0] hover:border-[#8BA888]'
      }`}
    >
      {label}
    </motion.button>
  );
}
