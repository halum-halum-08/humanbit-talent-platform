'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function AnimatedButton({
  children,
  onClick,
  className,
  disabled = false,
  variant = 'primary',
  size = 'md'
}: AnimatedButtonProps) {
  const baseClasses = cn(
    'relative overflow-hidden rounded-xl font-encode-sans font-semibold',
    'transition-all duration-300 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    {
      'px-4 py-2 text-sm': size === 'sm',
      'px-6 py-3 text-base': size === 'md',
      'px-8 py-4 text-lg': size === 'lg',
      'btn-gradient text-white shadow-lg hover:shadow-xl': variant === 'primary',
      'glass text-white border-white/20': variant === 'secondary',
      'text-purple-300 hover:text-white hover:bg-white/10': variant === 'ghost',
    },
    className
  );

  return (
    <motion.button
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
