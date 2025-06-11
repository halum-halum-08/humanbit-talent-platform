import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { JobDescription, SearchFilters, LinkedInProfile } from '@/types';
import { getFilterSuggestions, searchLinkedInProfiles } from './linkedin';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const USE_MOCK_DATA = !OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here';

export class LinkedInSearchAgent {
  private llm: ChatOpenAI | null;
  private optimizationPrompt: PromptTemplate;
  private fallbackPrompt: PromptTemplate;

  constructor() {
    this.llm = USE_MOCK_DATA ? null : new ChatOpenAI({
      openAIApiKey: OPENAI_API_KEY,
      modelName: 'gpt-4',
      temperature: 0.3,
    });

    this.optimizationPrompt = PromptTemplate.fromTemplate(`
      You are an expert LinkedIn recruiter. Given a job description, generate optimized search filters.
      
      Job Description:
      Title: {title}
      Company: {company}
      Location: {location}
      Experience Level: {experienceLevel}
      Description: {description}
      Requirements: {requirements}
      Skills: {skills}
      
      Generate search terms for each category. Provide variations and synonyms.
      Return a JSON object with this structure:
      {{
        "jobTitles": ["primary title", "synonym 1", "synonym 2"],
        "companies": ["target company types"],
        "locations": ["primary location", "alternative locations"],
        "skills": ["key skill 1", "key skill 2", "skill variation"],
        "industries": ["relevant industry terms"]
      }}
      
      Focus on finding candidates who match the job requirements exactly.
    `);

    this.fallbackPrompt = PromptTemplate.fromTemplate(`
      The previous search returned {resultCount} results. We need at least 50 candidates.
      
      Current filters: {currentFilters}
      Job requirements: {jobDescription}
      
      Suggest which filters to remove or modify to get more results while maintaining quality.
      Return a JSON object with:
      {{
        "action": "remove_filter" or "modify_filter" or "broaden_search",
        "filterToRemove": "filter_name" or null,
        "filterToModify": "filter_name" or null,
        "newFilterValue": "new_value" or null,
        "reasoning": "explanation of the change"
      }}
    `);
  }
  async generateInitialFilters(jobDescription: JobDescription): Promise<SearchFilters> {
    // If no OpenAI API key, generate basic filters manually
    if (USE_MOCK_DATA || !this.llm) {
      return this.generateBasicFilters(jobDescription);
    }

    try {
      const chain = RunnableSequence.from([
        this.optimizationPrompt,
        this.llm,
        new StringOutputParser(),
      ]);

      const result = await chain.invoke({
        title: jobDescription.title,
        company: jobDescription.company,
        location: jobDescription.location,
        experienceLevel: jobDescription.experienceLevel,
        description: jobDescription.description,
        requirements: jobDescription.requirements.join(', '),
        skills: jobDescription.skills.join(', '),
      });

      const parsedResult = JSON.parse(result);
      
      // Convert AI suggestions to actual LinkedIn filter format
      const searchFilters = await this.convertToLinkedInFilters(parsedResult);
      return searchFilters;
    } catch (error) {
      console.error('Error generating initial filters:', error);
      // Fallback to basic filters
      return this.generateBasicFilters(jobDescription);
    }
  }

  private async generateBasicFilters(jobDescription: JobDescription): Promise<SearchFilters> {
    const filters: SearchFilters = {
      jobTitles: [],
      companies: [],
      locations: [],
      experienceLevels: [],
      industries: []
    };

    // Generate basic job title filters
    const jobTitleTerms = [
      jobDescription.title,
      ...jobDescription.title.split(' ').filter(word => word.length > 3)
    ];

    for (const term of jobTitleTerms.slice(0, 2)) {
      const suggestions = await getFilterSuggestions(term, 'jobTitle');
      if (suggestions.length > 0) {
        filters.jobTitles.push({
          id: suggestions[0].id,
          name: suggestions[0].name,
          type: 'jobTitle',
          include: true
        });
      }
    }

    // Generate location filters
    if (jobDescription.location && jobDescription.location !== 'Remote') {
      const locationSuggestions = await getFilterSuggestions(jobDescription.location, 'location');
      if (locationSuggestions.length > 0) {
        filters.locations.push({
          id: locationSuggestions[0].id,
          name: locationSuggestions[0].name,
          type: 'location',
          include: true
        });
      }
    }

    return filters;
  }
  async optimizeFilters(
    currentFilters: SearchFilters,
    jobDescription: JobDescription,
    currentResultCount: number
  ): Promise<SearchFilters> {
    if (currentResultCount >= 50) {
      return currentFilters; // No optimization needed
    }

    // If no OpenAI API key, use simple optimization logic
    if (USE_MOCK_DATA || !this.llm) {
      return this.simpleOptimizeFilters(currentFilters, currentResultCount);
    }

    try {
      const chain = RunnableSequence.from([
        this.fallbackPrompt,
        this.llm,
        new StringOutputParser(),
      ]);

      const result = await chain.invoke({
        resultCount: currentResultCount,
        currentFilters: JSON.stringify(currentFilters),
        jobDescription: JSON.stringify(jobDescription),
      });

      const optimization = JSON.parse(result);
      
      // Apply the optimization
      const optimizedFilters = await this.applyOptimization(currentFilters, optimization);
      return optimizedFilters;
    } catch (error) {
      console.error('Error optimizing filters:', error);
      return this.simpleOptimizeFilters(currentFilters, currentResultCount);
    }
  }

  private simpleOptimizeFilters(currentFilters: SearchFilters, currentResultCount: number): SearchFilters {
    const newFilters = { ...currentFilters };

    if (currentResultCount === 0) {
      // Remove all exclude filters first
      Object.keys(newFilters).forEach(key => {
        const filterArray = newFilters[key as keyof SearchFilters] as any[];
        newFilters[key as keyof SearchFilters] = filterArray.filter(f => f.include) as any;
      });
    } else if (currentResultCount < 20) {
      // Remove the most restrictive filters
      const allFilters = [
        ...newFilters.jobTitles,
        ...newFilters.companies,
        ...newFilters.locations,
        ...newFilters.experienceLevels,
        ...newFilters.industries
      ];

      if (allFilters.length > 1) {
        // Remove one random filter
        const filterToRemove = allFilters[Math.floor(Math.random() * allFilters.length)];
        Object.keys(newFilters).forEach(key => {
          const filterArray = newFilters[key as keyof SearchFilters] as any[];
          newFilters[key as keyof SearchFilters] = filterArray.filter(f => f.id !== filterToRemove.id) as any;
        });
      }
    }

    return newFilters;
  }

  private async convertToLinkedInFilters(aiSuggestions: any): Promise<SearchFilters> {
    const filters: SearchFilters = {
      jobTitles: [],
      companies: [],
      locations: [],
      experienceLevels: [],
      industries: []
    };

    // Convert job titles
    if (aiSuggestions.jobTitles) {
      for (const title of aiSuggestions.jobTitles) {
        const suggestions = await getFilterSuggestions(title, 'jobTitle');
        if (suggestions.length > 0) {
          filters.jobTitles.push({
            id: suggestions[0].id,
            name: suggestions[0].name,
            type: 'jobTitle',
            include: true
          });
        }
      }
    }

    // Convert locations
    if (aiSuggestions.locations) {
      for (const location of aiSuggestions.locations) {
        const suggestions = await getFilterSuggestions(location, 'location');
        if (suggestions.length > 0) {
          filters.locations.push({
            id: suggestions[0].id,
            name: suggestions[0].name,
            type: 'location',
            include: true
          });
        }
      }
    }

    // Convert companies (if specific companies are mentioned)
    if (aiSuggestions.companies) {
      for (const company of aiSuggestions.companies) {
        const suggestions = await getFilterSuggestions(company, 'company');
        if (suggestions.length > 0) {
          filters.companies.push({
            id: suggestions[0].id,
            name: suggestions[0].name,
            type: 'company',
            include: true
          });
        }
      }
    }

    return filters;
  }

  private async applyOptimization(
    currentFilters: SearchFilters,
    optimization: any
  ): Promise<SearchFilters> {
    const newFilters = { ...currentFilters };

    switch (optimization.action) {
      case 'remove_filter':
        if (optimization.filterToRemove) {
          const filterType = optimization.filterToRemove;
          const filterKey = `${filterType}s` as keyof SearchFilters;
          if (newFilters[filterKey] && Array.isArray(newFilters[filterKey])) {
            // Remove the least specific filter
            (newFilters[filterKey] as any[]).pop();
          }
        }
        break;

      case 'broaden_search':
        // Remove exclusion filters first
        Object.keys(newFilters).forEach(key => {
          const filterArray = newFilters[key as keyof SearchFilters] as any[];
          newFilters[key as keyof SearchFilters] = filterArray.filter(f => f.include) as any;
        });
        break;

      case 'modify_filter':
        // This would involve more complex logic to modify existing filters
        break;
    }

    return newFilters;
  }

  async searchWithOptimization(
    jobDescription: JobDescription,
    maxIterations: number = 5
  ): Promise<{ profiles: LinkedInProfile[], filters: SearchFilters, iterations: number }> {
    let currentFilters = await this.generateInitialFilters(jobDescription);
    let profiles: LinkedInProfile[] = [];
    let iterations = 0;

    while (iterations < maxIterations) {
      iterations++;
      
      try {
        // Search LinkedIn with current filters
        profiles = await searchLinkedInProfiles(currentFilters);
        
        console.log(`Iteration ${iterations}: Found ${profiles.length} profiles`);
        
        if (profiles.length >= 50) {
          break; // Success!
        }
        
        if (profiles.length === 0 && iterations === 1) {
          // No results on first try, try with more basic filters
          currentFilters = await this.generateFallbackFilters(jobDescription);
          continue;
        }
        
        // Optimize filters for next iteration
        currentFilters = await this.optimizeFilters(currentFilters, jobDescription, profiles.length);
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error in iteration ${iterations}:`, error);
        if (iterations === maxIterations) {
          throw error;
        }
      }
    }

    return { profiles, filters: currentFilters, iterations };
  }

  private async generateFallbackFilters(jobDescription: JobDescription): Promise<SearchFilters> {
    // Generate very basic filters that are more likely to return results
    const filters: SearchFilters = {
      jobTitles: [],
      companies: [],
      locations: [],
      experienceLevels: [],
      industries: []
    };

    // Try to get at least one location filter
    if (jobDescription.location && jobDescription.location !== 'Remote') {
      const locationSuggestions = await getFilterSuggestions(jobDescription.location, 'location');
      if (locationSuggestions.length > 0) {
        filters.locations.push({
          id: locationSuggestions[0].id,
          name: locationSuggestions[0].name,
          type: 'location',
          include: true
        });
      }
    }

    // Try to get a broader job title
    const jobTitleWords = jobDescription.title.split(' ');
    for (const word of jobTitleWords) {
      if (word.length > 3) { // Skip short words
        const suggestions = await getFilterSuggestions(word, 'jobTitle');
        if (suggestions.length > 0) {
          filters.jobTitles.push({
            id: suggestions[0].id,
            name: suggestions[0].name,
            type: 'jobTitle',
            include: true
          });
          break; // Just add one broader title
        }
      }
    }

    return filters;
  }
}
