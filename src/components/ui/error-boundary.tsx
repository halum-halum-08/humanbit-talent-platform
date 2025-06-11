'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { GlassCard } from '@/components/ui/glass-card';

interface ErrorBoundaryProps {
  error: Error;
  onRetry: () => void;
}

export function ErrorBoundary({ error, onRetry }: ErrorBoundaryProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <GlassCard className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-encode-sans font-semibold text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-300 mb-6 text-sm">
            {error.message || 'An unexpected error occurred'}
          </p>
          <AnimatedButton onClick={onRetry} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </AnimatedButton>
        </GlassCard>
      </motion.div>
    </div>
  );
}

export function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-300 font-encode-sans">{message}</p>
      </motion.div>
    </div>
  );
}
