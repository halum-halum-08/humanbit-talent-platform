'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, X, Check, Filter } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { GlassCard } from '@/components/ui/glass-card';
import { FilterSuggestion, LinkedInFilter, SearchFilters } from '@/types';
import { cn } from '@/lib/utils';

interface LinkedInFilterSearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

export function LinkedInFilterSearch({ onFiltersChange, initialFilters }: LinkedInFilterSearchProps) {
  const [activeFilterType, setActiveFilterType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<FilterSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(
    initialFilters || {
      jobTitles: [],
      companies: [],
      locations: [],
      experienceLevels: [],
      industries: []
    }
  );

  const filterTypes = [
    { key: 'jobTitles', label: 'Job Titles', icon: '💼' },
    { key: 'companies', label: 'Companies', icon: '🏢' },
    { key: 'locations', label: 'Locations', icon: '📍' },
    { key: 'experienceLevels', label: 'Experience Level', icon: '⭐' },
    { key: 'industries', label: 'Industries', icon: '🏭' }
  ];

  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  const searchSuggestions = useCallback(
    debounce(async (query: string, type: string) => {
      if (!query.trim() || !type) return;

      setIsLoading(true);
      try {
        const response = await fetch('/api/linkedin/suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, type }),
        });

        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.suggestions || []);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (searchQuery && activeFilterType) {
      searchSuggestions(searchQuery, activeFilterType);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, activeFilterType, searchSuggestions]);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const addFilter = (suggestion: FilterSuggestion, include: boolean) => {
    const newFilter: LinkedInFilter = {
      id: suggestion.id,
      name: suggestion.name,
      type: suggestion.type as any,
      include
    };

    const filterKey = `${suggestion.type}s` as keyof SearchFilters;
    const currentFilters = filters[filterKey] as LinkedInFilter[];
    
    // Check if filter already exists
    if (currentFilters.some(f => f.id === suggestion.id && f.include === include)) {
      return;
    }

    setFilters(prev => ({
      ...prev,
      [filterKey]: [...currentFilters, newFilter]
    }));

    // Clear search
    setSearchQuery('');
    setSuggestions([]);
  };

  const removeFilter = (filterId: string, filterType: string) => {
    const filterKey = `${filterType}s` as keyof SearchFilters;
    const currentFilters = filters[filterKey] as LinkedInFilter[];
    
    setFilters(prev => ({
      ...prev,
      [filterKey]: currentFilters.filter(f => f.id !== filterId)
    }));
  };

  const getFilterCount = () => {
    return Object.values(filters).reduce((total, filterArray) => total + filterArray.length, 0);
  };

  const clearAllFilters = () => {
    setFilters({
      jobTitles: [],
      companies: [],
      locations: [],
      experienceLevels: [],
      industries: []
    });
  };

  const openFilterType = (type: string) => {
    setActiveFilterType(type);
    setSearchQuery('');
    setSuggestions([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-encode-sans font-bold text-white">
            LinkedIn Search Filters
          </h2>
          {getFilterCount() > 0 && (
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
              {getFilterCount()} filters
            </span>
          )}
        </div>
        {getFilterCount() > 0 && (
          <AnimatedButton
            onClick={clearAllFilters}
            variant="ghost"
            size="sm"
          >
            Clear All
          </AnimatedButton>
        )}
      </div>

      {/* Filter Type Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {filterTypes.map((type) => (
          <AnimatedButton
            key={type.key}
            onClick={() => openFilterType(type.key)}
            variant="secondary"
            className={cn(
              'flex flex-col items-center gap-2 p-4 h-auto',
              activeFilterType === type.key && 'ring-2 ring-purple-500'
            )}
          >
            <span className="text-2xl">{type.icon}</span>
            <span className="text-sm font-medium">{type.label}</span>
            {(filters[type.key as keyof SearchFilters] as LinkedInFilter[]).length > 0 && (
              <span className="text-xs bg-purple-500/30 px-2 py-1 rounded-full">
                {(filters[type.key as keyof SearchFilters] as LinkedInFilter[]).length}
              </span>
            )}
          </AnimatedButton>
        ))}
      </div>

      {/* Search Input */}
      {activeFilterType && (
        <GlassCard>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-encode-sans font-semibold text-white">
                Add {filterTypes.find(t => t.key === activeFilterType)?.label}
              </h3>
              <button
                onClick={() => setActiveFilterType('')}
                className="ml-auto text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search for ${filterTypes.find(t => t.key === activeFilterType)?.label.toLowerCase()}...`}
                className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <p className="text-sm text-gray-400">Click to add as Include or Exclude filter:</p>
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <span className="text-white">{suggestion.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addFilter(suggestion, true)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Include
                      </button>
                      <button
                        onClick={() => addFilter(suggestion, false)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Exclude
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>
      )}

      {/* Applied Filters */}
      {getFilterCount() > 0 && (
        <GlassCard>
          <h3 className="text-lg font-encode-sans font-semibold text-white mb-4">
            Applied Filters
          </h3>
          <div className="space-y-4">
            {filterTypes.map((type) => {
              const typeFilters = filters[type.key as keyof SearchFilters] as LinkedInFilter[];
              if (typeFilters.length === 0) return null;

              return (
                <div key={type.key}>
                  <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                    <span>{type.icon}</span>
                    {type.label}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {typeFilters.map((filter) => (
                      <motion.div
                        key={`${filter.id}-${filter.include}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={cn(
                          'flex items-center gap-2 px-3 py-1 rounded-full text-sm',
                          filter.include
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        )}
                      >
                        <span>{filter.include ? '+' : '-'}</span>
                        <span>{filter.name}</span>
                        <button
                          onClick={() => removeFilter(filter.id, filter.type)}
                          className="hover:bg-white/10 rounded-full p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
