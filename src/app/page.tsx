'use client';

import React, { useState } from 'react';
import { LandingPage } from '@/components/landing-page';
import { JobDescriptionGenerator } from '@/components/job-description-generator';
import { LinkedInFilterSearch } from '@/components/linkedin-filter-search';
import { CandidateResults } from '@/components/candidate-results';
import { JobDescription, SearchFilters } from '@/types';

type AppState = 'landing' | 'job-generator' | 'filter-search' | 'results';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    jobTitles: [],
    companies: [],
    locations: [],
    experienceLevels: [],
    industries: []
  });

  const handleFindTalent = () => {
    setAppState('job-generator');
  };

  const handleJobDescriptionGenerated = (job: JobDescription) => {
    setJobDescription(job);
    setAppState('filter-search');
  };

  const handleFiltersChange = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  const handleStartSearch = () => {
    setAppState('results');
  };

  const handleBackToLanding = () => {
    setAppState('landing');
    setJobDescription(null);
    setSearchFilters({
      jobTitles: [],
      companies: [],
      locations: [],
      experienceLevels: [],
      industries: []
    });
  };

  const handleBackToJobGenerator = () => {
    setAppState('job-generator');
  };

  switch (appState) {
    case 'landing':
      return <LandingPage onFindTalent={handleFindTalent} />;
    
    case 'job-generator':
      return (
        <JobDescriptionGenerator
          onBack={handleBackToLanding}
          onNext={handleJobDescriptionGenerated}
        />
      );
    
    case 'filter-search':
      return (
        <div className="min-h-screen p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={handleBackToJobGenerator}
                className="text-purple-300 hover:text-white flex items-center gap-2"
              >
                ← Back to Job Description
              </button>
              <h1 className="text-3xl font-encode-sans font-bold gradient-text">
                Search Configuration
              </h1>
              <div className="w-40" />
            </div>
            
            {jobDescription && (
              <div className="mb-8 p-4 glass rounded-lg">
                <h3 className="text-lg font-encode-sans font-semibold text-white mb-2">
                  Current Job: {jobDescription.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {jobDescription.company} • {jobDescription.location} • {jobDescription.experienceLevel}
                </p>
              </div>
            )}
            
            <LinkedInFilterSearch
              onFiltersChange={handleFiltersChange}
              initialFilters={searchFilters}
            />
            
            {/* Start Search Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handleStartSearch}
                className="btn-gradient px-8 py-4 rounded-xl text-white font-encode-sans font-semibold text-lg hover:shadow-xl transition-all duration-300"
                disabled={Object.values(searchFilters).every(arr => arr.length === 0)}
              >
                🚀 Start AI Search
              </button>
            </div>
          </div>
        </div>
      );
    
    case 'results':
      return jobDescription ? (
        <CandidateResults
          jobDescription={jobDescription}
          onBack={() => setAppState('filter-search')}
          onStartNewSearch={handleBackToLanding}
        />
      ) : (
        <LandingPage onFindTalent={handleFindTalent} />
      );
    
    default:
      return <LandingPage onFindTalent={handleFindTalent} />;
  }
}
