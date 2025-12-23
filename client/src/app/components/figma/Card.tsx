import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`bg-card rounded-3xl shadow-sm p-6 border border-border ${className}`}>
            {children}
        </div>
    );
}
