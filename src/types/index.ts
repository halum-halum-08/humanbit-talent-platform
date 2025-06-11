export interface JobDescription {
  title: string;
  company: string;
  location: string;
  experienceLevel: string;
  jobType: string;
  salary?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  benefits?: string[];
}

export interface LinkedInFilter {
  id: string;
  name: string;
  type: 'jobTitle' | 'company' | 'location' | 'experienceLevel' | 'industry';
  include: boolean; // true for include, false for exclude
}

export interface LinkedInProfile {
  id: string;
  name: string;
  headline: string;
  location: string;
  profileUrl: string;
  experience: string;
  company: string;
  skills: string[];
  connections?: number;
}

export interface FilterSuggestion {
  id: string;
  name: string;
  type: string;
}

export interface SearchFilters {
  jobTitles: LinkedInFilter[];
  companies: LinkedInFilter[];
  locations: LinkedInFilter[];
  experienceLevels: LinkedInFilter[];
  industries: LinkedInFilter[];
}
