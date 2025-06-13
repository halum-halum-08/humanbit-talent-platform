'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Building2, MapPin, ExternalLink, Loader2, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { GlassCard } from '@/components/ui/glass-card';
import { LinkedInProfile, JobDescription, SearchFilters } from '@/types';

interface CandidateResultsProps {
  jobDescription: JobDescription;
  onBack: () => void;
  onStartNewSearch: () => void;
}

export function CandidateResults({ jobDescription, onBack, onStartNewSearch }: CandidateResultsProps) {
  const [profiles, setProfiles] = useState<LinkedInProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);
  const [searchStats, setSearchStats] = useState({
    iterations: 0,
    totalResults: 0,
    success: false  });
  const [currentPage, setCurrentPage] = useState(1);
  
  const profilesPerPage = 10;
  const totalPages = Math.ceil(profiles.length / profilesPerPage);
  const startIndex = (currentPage - 1) * profilesPerPage;
  const endIndex = startIndex + profilesPerPage;
  const currentProfiles = profiles.slice(startIndex, endIndex);
  useEffect(() => {
    startAISearch();
  }, [jobDescription]);

  const startAISearch = async () => {
    setIsSearching(true);
    setSearchComplete(false);
    setProfiles([]);
    
    try {
      const response = await fetch('/api/linkedin/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          jobDescription,
          useAI: true 
        }),
      });

      if (!response.ok) throw new Error('Search failed');      const data = await response.json();
      
      setProfiles(data.profiles || []);
      setSearchStats({
        iterations: data.iterations || 0,
        totalResults: data.totalResults || 0,
        success: data.success || false
      });
    } catch (error) {
      console.error('Error searching profiles:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSearching(false);
      setSearchComplete(true);
    }
  };

  const ProfileCard = ({ profile, index }: { profile: LinkedInProfile, index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <GlassCard className="p-6 hover:bg-white/15 transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-encode-sans font-semibold text-white mb-1">
                  {profile.name}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {profile.headline}
                </p>
              </div>
              {profile.profileUrl && (
                <a
                  href={profile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
              {profile.company && (
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  <span>{profile.company}</span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.connections && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{profile.connections}+ connections</span>
                </div>
              )}
            </div>
            
            {profile.skills && profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.skills.slice(0, 6).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
                {profile.skills.length > 6 && (
                  <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs">
                    +{profile.skills.length - 6} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );

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
            <ChevronLeft className="w-4 h-4" />
            Back to Filters
          </AnimatedButton>
          <h1 className="text-3xl font-encode-sans font-bold gradient-text">
            Candidate Results
          </h1>
          <AnimatedButton
            onClick={onStartNewSearch}
            variant="secondary"
            size="sm"
          >
            New Search
          </AnimatedButton>
        </div>

        {/* Job Info */}
        <GlassCard className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-encode-sans font-semibold text-white mb-2">
                {jobDescription.title}
              </h2>
              <p className="text-gray-300">
                {jobDescription.company} • {jobDescription.location} • {jobDescription.experienceLevel}
              </p>
            </div>
            <AnimatedButton
              onClick={startAISearch}
              disabled={isSearching}
              variant="primary"
              size="sm"
              className="flex items-center gap-2"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {isSearching ? 'Searching...' : 'Refresh Search'}
            </AnimatedButton>
          </div>
        </GlassCard>

        {/* Search Progress */}
        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <GlassCard className="text-center">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                  <div>
                    <h3 className="text-lg font-encode-sans font-semibold text-white mb-2">
                      AI is optimizing your search...
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Finding the best candidates using intelligent filter optimization
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Stats */}
        {searchComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <GlassCard>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-encode-sans font-bold gradient-text">
                    {searchStats.totalResults}
                  </div>
                  <div className="text-gray-300 text-sm">Candidates Found</div>
                </div>
                <div>
                  <div className="text-2xl font-encode-sans font-bold gradient-text">
                    {searchStats.iterations}
                  </div>
                  <div className="text-gray-300 text-sm">AI Iterations</div>
                </div>
                <div>
                  <div className={`text-2xl font-encode-sans font-bold ${
                    searchStats.success ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {searchStats.success ? 'Success' : 'Partial'}
                  </div>
                  <div className="text-gray-300 text-sm">Search Status</div>
                </div>
                <div>
                  <div className="text-2xl font-encode-sans font-bold gradient-text">
                    {totalPages}
                  </div>
                  <div className="text-gray-300 text-sm">Pages</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Results */}
        {profiles.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-4 mb-8">
              {currentProfiles.map((profile, index) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  index={index}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <AnimatedButton
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  variant="ghost"
                  size="sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </AnimatedButton>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg font-medium text-sm transition-colors ${
                        page === currentPage
                          ? 'bg-purple-500 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <AnimatedButton
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  variant="ghost"
                  size="sm"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </AnimatedButton>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {searchComplete && profiles.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <GlassCard>
              <div className="py-16">
                <User className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                <h3 className="text-xl font-encode-sans font-semibold text-white mb-2">
                  No candidates found
                </h3>
                <p className="text-gray-300 mb-6">
                  Try adjusting your job requirements or search filters
                </p>
                <div className="flex justify-center gap-4">
                  <AnimatedButton onClick={onBack} variant="secondary">
                    Modify Filters
                  </AnimatedButton>
                  <AnimatedButton onClick={startAISearch} variant="primary">
                    Try Again
                  </AnimatedButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
