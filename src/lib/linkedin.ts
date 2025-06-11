import axios from 'axios';
import { FilterSuggestion, LinkedInProfile, SearchFilters } from '@/types';
import { getMockFilterSuggestions, getMockLinkedInProfiles } from './mock-data';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;
const USE_MOCK_DATA = !RAPIDAPI_KEY || process.env.NODE_ENV === 'development';

const rapidApiClient = axios.create({
  baseURL: `https://${RAPIDAPI_HOST}`,
  headers: {
    'X-RapidAPI-Key': RAPIDAPI_KEY,
    'X-RapidAPI-Host': RAPIDAPI_HOST,
  },
});

export async function getJobTitleSuggestions(query: string): Promise<FilterSuggestion[]> {
  if (USE_MOCK_DATA) {
    return new Promise(resolve => 
      setTimeout(() => resolve(getMockFilterSuggestions(query, 'jobTitle')), 500)
    );
  }

  try {
    const response = await rapidApiClient.get('/filter-suggestion-job-title', {
      params: { query }    });
    
    return response.data.map((item: { id?: string; value?: string; name?: string; label?: string }) => ({
      id: item.id || item.value || '',
      name: item.name || item.label || '',
      type: 'jobTitle'
    }));
  } catch (error) {
    console.error('Error fetching job title suggestions:', error);
    return getMockFilterSuggestions(query, 'jobTitle');
  }
}

export async function getCompanySuggestions(query: string): Promise<FilterSuggestion[]> {
  if (USE_MOCK_DATA) {
    return new Promise(resolve => 
      setTimeout(() => resolve(getMockFilterSuggestions(query, 'company')), 500)
    );
  }

  try {
    const response = await rapidApiClient.get('/filter-suggestion-company', {
      params: { query }    });
    
    return response.data.map((item: { id?: string; value?: string; name?: string; label?: string }) => ({
      id: item.id || item.value || '',
      name: item.name || item.label || '',
      type: 'company'
    }));
  } catch (error) {
    console.error('Error fetching company suggestions:', error);
    return getMockFilterSuggestions(query, 'company');
  }
}

export async function getLocationSuggestions(query: string): Promise<FilterSuggestion[]> {
  if (USE_MOCK_DATA) {
    return new Promise(resolve => 
      setTimeout(() => resolve(getMockFilterSuggestions(query, 'location')), 500)
    );
  }

  try {
    const response = await rapidApiClient.get('/filter-suggestion-location', {
      params: { query }    });
    
    return response.data.map((item: { id?: string; value?: string; name?: string; label?: string }) => ({
      id: item.id || item.value || '',
      name: item.name || item.label || '',
      type: 'location'
    }));
  } catch (error) {
    console.error('Error fetching location suggestions:', error);
    return getMockFilterSuggestions(query, 'location');
  }
}

export async function searchLinkedInProfiles(filters: SearchFilters): Promise<LinkedInProfile[]> {
  if (USE_MOCK_DATA) {
    return new Promise(resolve => 
      setTimeout(() => resolve(getMockLinkedInProfiles()), 1500)
    );
  }

  try {
    const response = await rapidApiClient.post('/search', {
      filters: filters,
      limit: 50
    });
      return response.data.profiles?.map((profile: {
      id?: string;
      linkedinId?: string;
      name?: string;
      firstName?: string;
      lastName?: string;
      headline?: string;
      location?: string;
      profileUrl?: string;
      url?: string;
      experience?: string;
      currentCompany?: string;
      company?: string;
      skills?: string[];
      connections?: number;
    }) => ({
      id: profile.id || profile.linkedinId || '',
      name: profile.name || `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
      headline: profile.headline || '',
      location: profile.location || '',
      profileUrl: profile.profileUrl || profile.url || '',
      experience: profile.experience || '',
      company: profile.currentCompany || profile.company || '',
      skills: profile.skills || [],
      connections: profile.connections
    })) || [];  } catch (error) {
    console.error('Error searching LinkedIn profiles:', error);
    return getMockLinkedInProfiles();
  }
}

export async function getFilterSuggestions(query: string, type: string): Promise<FilterSuggestion[]> {
  switch (type) {
    case 'jobTitle':
      return getJobTitleSuggestions(query);
    case 'company':
      return getCompanySuggestions(query);
    case 'location':
      return getLocationSuggestions(query);
    default:
      return [];
  }
}
