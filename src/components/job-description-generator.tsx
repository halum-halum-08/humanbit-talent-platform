'use client';

import React, { useState } from 'react';
import { Wand2, ArrowLeft, ArrowRight, Loader2, AlertCircle, Plus, X, Edit3 } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { GlassCard } from '@/components/ui/glass-card';
import { JobDescription } from '@/types';

interface JobDescriptionGeneratorProps {
  onBack: () => void;
  onNext: (jobDescription: JobDescription) => void;
}

export function JobDescriptionGenerator({ onBack, onNext }: JobDescriptionGeneratorProps) {  const [prompt, setPrompt] = useState('');
  const [generatedJob, setGeneratedJob] = useState<JobDescription | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newFeature, setNewFeature] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('Sending request to generate job description...');
      
      const response = await fetch('/api/generate-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Failed to generate job description`);
      }

      console.log('Job description generated successfully:', data);
      setGeneratedJob(data);
    } catch (error) {
      console.error('Error generating job description:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      // Show a helpful message to users
      if (errorMessage.includes('API key') || errorMessage.includes('OpenAI')) {
        setError('Using demo mode - OpenAI API not configured. You can still test the interface!');
        // Generate mock data after a delay to simulate API call
        setTimeout(() => {
          setGeneratedJob({
            title: 'Frontend Developer',
            company: 'Demo Company',
            location: 'Remote',
            experienceLevel: 'Mid Level',
            jobType: 'Full-time',
            salary: '$80,000 - $120,000',
            description: 'This is a demo job description generated without OpenAI API. The full version would use AI to create comprehensive job descriptions.',
            requirements: ['React experience', 'JavaScript proficiency', 'Problem-solving skills'],
            responsibilities: ['Build user interfaces', 'Collaborate with team', 'Write clean code'],
            skills: ['React', 'JavaScript', 'CSS', 'Git'],
            benefits: ['Health insurance', 'Remote work', 'Professional development']
          });
          setError(null);
        }, 1000);
      }
    } finally {
      setIsGenerating(false);
    }
  };
  const handleFieldChange = (field: keyof JobDescription, value: string | string[]) => {
    if (!generatedJob) return;
    setGeneratedJob({ ...generatedJob, [field]: value });
  };

  const addFeature = (type: 'benefits' | 'requirements' | 'skills', value: string) => {
    if (!generatedJob || !value.trim()) return;
    
    const currentArray = generatedJob[type] || [];
    const newArray = [...currentArray, value.trim()];
    
    setGeneratedJob({
      ...generatedJob,
      [type]: newArray,
    });

    // Clear the input
    if (type === 'benefits') setNewBenefit('');
    if (type === 'requirements') setNewRequirement('');
    if (type === 'skills') setNewSkill('');
  };

  const removeFeature = (type: 'benefits' | 'requirements' | 'skills', index: number) => {
    if (!generatedJob) return;
    
    const currentArray = generatedJob[type] || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    
    setGeneratedJob({
      ...generatedJob,
      [type]: newArray,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'benefits' | 'requirements' | 'skills', value: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature(type, value);
    }
  };

  const handleNext = () => {
    if (generatedJob) {
      onNext(generatedJob);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <AnimatedButton
            onClick={onBack}
            variant="ghost"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </AnimatedButton>
          <h1 className="text-3xl font-encode-sans font-bold gradient-text">
            Create Job Description
          </h1>
          <div className="w-20" /> {/* Spacer */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
          {/* Left Panel - Input */}
          <GlassCard className="flex flex-col h-full">
            <h2 className="text-xl font-encode-sans font-semibold text-white mb-4">
              Describe Your Ideal Candidate
            </h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: I need a senior frontend developer with React experience for a fintech startup. They should have 5+ years of experience, know TypeScript, and be comfortable with modern development practices..."
              className="flex-1 w-full p-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isGenerating}            />
            
            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-red-300">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}
            
            <div className="flex justify-end mt-4">
              <AnimatedButton
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
                {isGenerating ? 'Generating...' : 'Generate Job Description'}
              </AnimatedButton>
            </div>
          </GlassCard>

          {/* Right Panel - Generated Job Description */}
          <GlassCard className="flex flex-col h-full">
            {generatedJob ? (
              <div className="flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-encode-sans font-semibold text-white">
                    Generated Job Description
                  </h2>
                  <AnimatedButton
                    onClick={() => setIsEditing(!isEditing)}
                    variant="ghost"
                    size="sm"
                  >
                    {isEditing ? 'View' : 'Edit'}
                  </AnimatedButton>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={generatedJob.title}
                        onChange={(e) => handleFieldChange('title', e.target.value)}
                        className="w-full p-2 bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={generatedJob.company}
                        onChange={(e) => handleFieldChange('company', e.target.value)}
                        className="w-full p-2 bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={generatedJob.location}
                          onChange={(e) => handleFieldChange('location', e.target.value)}
                          className="w-full p-2 bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Experience Level
                        </label>
                        <select
                          value={generatedJob.experienceLevel}
                          onChange={(e) => handleFieldChange('experienceLevel', e.target.value)}
                          className="w-full p-2 bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="Entry Level">Entry Level</option>
                          <option value="Mid Level">Mid Level</option>
                          <option value="Senior Level">Senior Level</option>
                          <option value="Executive">Executive</option>
                        </select>
                      </div>                    </div>
                    
                    {/* Job Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Job Description
                      </label>
                      <textarea
                        value={generatedJob.description}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        rows={4}
                        className="w-full p-2 bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      />
                    </div>

                    {/* Requirements Management */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Requirements
                      </label>
                      <div className="space-y-2">
                        {generatedJob.requirements.map((req, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-white/5 rounded">
                            <span className="flex-1 text-white">{req}</span>
                            <button
                              onClick={() => removeFeature('requirements', index)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newRequirement}
                            onChange={(e) => setNewRequirement(e.target.value)}
                            onKeyPress={(e) => handleKeyPress(e, 'requirements', newRequirement)}
                            placeholder="Add new requirement..."
                            className="flex-1 p-2 bg-white/5 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <AnimatedButton
                            onClick={() => addFeature('requirements', newRequirement)}
                            disabled={!newRequirement.trim()}
                            size="sm"
                            className="px-3"
                          >
                            <Plus className="w-4 h-4" />
                          </AnimatedButton>
                        </div>
                      </div>
                    </div>

                    {/* Skills Management */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Required Skills
                      </label>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {generatedJob.skills.map((skill, index) => (
                            <div key={index} className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                              <span>{skill}</span>
                              <button
                                onClick={() => removeFeature('skills', index)}
                                className="text-purple-400 hover:text-purple-300 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyPress={(e) => handleKeyPress(e, 'skills', newSkill)}
                            placeholder="Add new skill..."
                            className="flex-1 p-2 bg-white/5 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <AnimatedButton
                            onClick={() => addFeature('skills', newSkill)}
                            disabled={!newSkill.trim()}
                            size="sm"
                            className="px-3"
                          >
                            <Plus className="w-4 h-4" />
                          </AnimatedButton>
                        </div>
                      </div>
                    </div>

                    {/* Benefits Management */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Benefits & Perks
                      </label>
                      <div className="space-y-2">
                        {(generatedJob.benefits || []).map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-500/20 rounded">
                            <span className="flex-1 text-green-300">{benefit}</span>
                            <button
                              onClick={() => removeFeature('benefits', index)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newBenefit}
                            onChange={(e) => setNewBenefit(e.target.value)}
                            onKeyPress={(e) => handleKeyPress(e, 'benefits', newBenefit)}
                            placeholder="Add new benefit or perk..."
                            className="flex-1 p-2 bg-white/5 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <AnimatedButton
                            onClick={() => addFeature('benefits', newBenefit)}
                            disabled={!newBenefit.trim()}
                            size="sm"
                            className="px-3"
                          >
                            <Plus className="w-4 h-4" />
                          </AnimatedButton>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-encode-sans font-bold text-white mb-2">
                        {generatedJob.title}
                      </h3>
                      <div className="text-gray-300 space-y-1">
                        <p><strong>Company:</strong> {generatedJob.company}</p>
                        <p><strong>Location:</strong> {generatedJob.location}</p>
                        <p><strong>Experience:</strong> {generatedJob.experienceLevel}</p>
                        <p><strong>Type:</strong> {generatedJob.jobType}</p>
                        {generatedJob.salary && <p><strong>Salary:</strong> {generatedJob.salary}</p>}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-encode-sans font-semibold text-white mb-2">
                        Description
                      </h4>
                      <p className="text-gray-300 leading-relaxed">
                        {generatedJob.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-encode-sans font-semibold text-white mb-2">
                        Requirements
                      </h4>
                      <ul className="list-disc list-inside text-gray-300 space-y-1">
                        {generatedJob.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>                    <div>
                      <h4 className="text-lg font-encode-sans font-semibold text-white mb-2">
                        Key Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedJob.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Benefits Section */}
                    {generatedJob.benefits && generatedJob.benefits.length > 0 && (
                      <div>
                        <h4 className="text-lg font-encode-sans font-semibold text-white mb-2 flex items-center gap-2">
                          <Plus className="w-5 h-5 text-green-400" />
                          Benefits & Perks
                        </h4>
                        <ul className="list-disc list-inside text-gray-300 space-y-1">
                          {generatedJob.benefits.map((benefit, index) => (
                            <li key={index} className="text-green-300">{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end mt-6 pt-4 border-t border-white/20">
                  <AnimatedButton
                    onClick={handleNext}
                    className="flex items-center gap-2"
                  >
                    Continue to Search
                    <ArrowRight className="w-4 h-4" />
                  </AnimatedButton>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Wand2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Generate a job description to see the preview here</p>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
