'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Users, Target, Info } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { GlassCard } from '@/components/ui/glass-card';

interface LandingPageProps {
  onFindTalent: () => void;
}

export function LandingPage({ onFindTalent }: LandingPageProps) {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "AI-Powered Job Descriptions",
      description: "Generate comprehensive job descriptions with AI assistance"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Smart LinkedIn Search",
      description: "Advanced filtering and search optimization for better candidate matching"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Talent Discovery",
      description: "Find the perfect candidates from millions of LinkedIn profiles"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Precise Matching",
      description: "AI-driven candidate filtering based on job requirements"
    }
  ];
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-6xl mx-auto text-center">
        {/* Demo Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="glass p-4 rounded-lg border border-blue-500/30 bg-blue-500/10">
            <div className="flex items-center justify-center gap-2 text-blue-300">
              <Info className="w-5 h-5" />
              <span className="text-sm font-medium">
                🚀 Demo Mode Active - Full functionality with mock data for testing
              </span>
            </div>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h1 className="text-6xl md:text-7xl font-encode-sans font-bold mb-6">
            <span className="gradient-text">Find Perfect</span>
            <br />
            <span className="text-white">Talent with AI</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Revolutionize your recruitment process with AI-powered job description generation 
            and intelligent LinkedIn candidate discovery
          </p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <AnimatedButton
              onClick={onFindTalent}
              size="lg"
              className="text-xl px-12 py-6"
            >
              <Search className="w-6 h-6" />
              Find Talent
            </AnimatedButton>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
            >
              <GlassCard className="h-full">
                <div className="text-purple-400 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-encode-sans font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <div className="text-4xl font-encode-sans font-bold gradient-text mb-2">
              1M+
            </div>
            <div className="text-gray-300">LinkedIn Profiles</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-encode-sans font-bold gradient-text mb-2">
              95%
            </div>
            <div className="text-gray-300">Match Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-encode-sans font-bold gradient-text mb-2">
              50%
            </div>
            <div className="text-gray-300">Time Saved</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
