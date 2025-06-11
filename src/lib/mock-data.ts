import { FilterSuggestion, LinkedInProfile } from '@/types';

export const mockFilterSuggestions: Record<string, FilterSuggestion[]> = {
  jobTitle: [
    { id: '1', name: 'Frontend Developer', type: 'jobTitle' },
    { id: '2', name: 'React Developer', type: 'jobTitle' },
    { id: '3', name: 'Software Engineer', type: 'jobTitle' },
    { id: '4', name: 'Full Stack Developer', type: 'jobTitle' },
    { id: '5', name: 'JavaScript Developer', type: 'jobTitle' },
  ],
  company: [
    { id: '1', name: 'Google', type: 'company' },
    { id: '2', name: 'Microsoft', type: 'company' },
    { id: '3', name: 'Meta', type: 'company' },
    { id: '4', name: 'Amazon', type: 'company' },
    { id: '5', name: 'Netflix', type: 'company' },
  ],
  location: [
    { id: '1', name: 'San Francisco, CA', type: 'location' },
    { id: '2', name: 'New York, NY', type: 'location' },
    { id: '3', name: 'Seattle, WA', type: 'location' },
    { id: '4', name: 'Austin, TX', type: 'location' },
    { id: '5', name: 'Remote', type: 'location' },
  ],
};

export const mockLinkedInProfiles: LinkedInProfile[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    headline: 'Senior Frontend Developer at Google | React & TypeScript Expert',
    location: 'San Francisco, CA',
    profileUrl: 'https://linkedin.com/in/sarah-johnson',
    experience: '5+ years',
    company: 'Google',
    skills: ['React', 'TypeScript', 'JavaScript', 'Next.js', 'Tailwind CSS', 'Node.js'],
    connections: 500
  },
  {
    id: '2',
    name: 'Michael Chen',
    headline: 'Full Stack Developer | JavaScript & Python | Building scalable web applications',
    location: 'New York, NY',
    profileUrl: 'https://linkedin.com/in/michael-chen',
    experience: '4+ years',
    company: 'Microsoft',
    skills: ['JavaScript', 'Python', 'React', 'Django', 'AWS', 'Docker'],
    connections: 750
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    headline: 'React Developer | Frontend Architecture | UI/UX Enthusiast',
    location: 'Austin, TX',
    profileUrl: 'https://linkedin.com/in/emma-rodriguez',
    experience: '3+ years',
    company: 'Meta',
    skills: ['React', 'Redux', 'JavaScript', 'CSS', 'Figma', 'GraphQL'],
    connections: 300
  },
  {
    id: '4',
    name: 'David Kim',
    headline: 'Senior Software Engineer | Full Stack Development | Team Lead',
    location: 'Seattle, WA',
    profileUrl: 'https://linkedin.com/in/david-kim',
    experience: '7+ years',
    company: 'Amazon',
    skills: ['JavaScript', 'React', 'Node.js', 'AWS', 'MongoDB', 'Leadership'],
    connections: 1200
  },
  {
    id: '5',
    name: 'Lisa Wang',
    headline: 'Frontend Developer | React & Vue.js | Performance Optimization Expert',
    location: 'Remote',
    profileUrl: 'https://linkedin.com/in/lisa-wang',
    experience: '4+ years',
    company: 'Netflix',
    skills: ['React', 'Vue.js', 'JavaScript', 'Webpack', 'Performance', 'Testing'],
    connections: 600
  },
  {
    id: '6',
    name: 'James Mitchell',
    headline: 'JavaScript Developer | Node.js & React | API Development',
    location: 'San Francisco, CA',
    profileUrl: 'https://linkedin.com/in/james-mitchell',
    experience: '5+ years',
    company: 'Stripe',
    skills: ['Node.js', 'React', 'JavaScript', 'PostgreSQL', 'REST APIs', 'GraphQL'],
    connections: 800
  },
  {
    id: '7',
    name: 'Rachel Green',
    headline: 'Senior Frontend Developer | React Native | Mobile & Web Expert',
    location: 'New York, NY',
    profileUrl: 'https://linkedin.com/in/rachel-green',
    experience: '6+ years',
    company: 'Airbnb',
    skills: ['React', 'React Native', 'JavaScript', 'iOS', 'Android', 'TypeScript'],
    connections: 950
  },
  {
    id: '8',
    name: 'Alex Thompson',
    headline: 'Full Stack Engineer | React & Python | Machine Learning Integration',
    location: 'Austin, TX',
    profileUrl: 'https://linkedin.com/in/alex-thompson',
    experience: '4+ years',
    company: 'Tesla',
    skills: ['React', 'Python', 'Machine Learning', 'Django', 'JavaScript', 'TensorFlow'],
    connections: 400
  },
  {
    id: '9',
    name: 'Sophie Brown',
    headline: 'Frontend Developer | Vue.js & React | Design System Expert',
    location: 'Seattle, WA',
    profileUrl: 'https://linkedin.com/in/sophie-brown',
    experience: '3+ years',
    company: 'Shopify',
    skills: ['Vue.js', 'React', 'JavaScript', 'Sass', 'Design Systems', 'Storybook'],
    connections: 350
  },
  {
    id: '10',
    name: 'Marcus Davis',
    headline: 'Software Engineer | React & Go | Cloud Architecture',
    location: 'Remote',
    profileUrl: 'https://linkedin.com/in/marcus-davis',
    experience: '5+ years',
    company: 'Uber',
    skills: ['React', 'Go', 'JavaScript', 'Kubernetes', 'Docker', 'Cloud'],
    connections: 700
  }
];

export function getMockFilterSuggestions(query: string, type: string): FilterSuggestion[] {
  const suggestions = mockFilterSuggestions[type] || [];
  return suggestions.filter(suggestion => 
    suggestion.name.toLowerCase().includes(query.toLowerCase())
  );
}

export function getMockLinkedInProfiles(filters?: any): LinkedInProfile[] {
  // Return a subset of profiles for demo purposes
  return mockLinkedInProfiles.slice(0, Math.floor(Math.random() * 8) + 3);
}
