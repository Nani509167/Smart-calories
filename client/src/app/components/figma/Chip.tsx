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
            className={`px-5 py-3 rounded-full transition-all duration-200 text-sm font-medium ${selected
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-card text-muted-foreground border border-border hover:border-primary'
                }`}
        >
            {label}
        </motion.button>
    );
}
