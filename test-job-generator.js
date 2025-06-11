// Test script for the enhanced job description generator
const fs = require('fs');
const path = require('path');

// Mock the TypeScript imports for testing
const generateMockJobDescription = (prompt) => {
  const lowerPrompt = prompt.toLowerCase();
  
  // Enhanced keyword detection with more variations
  const roleKeywords = {
    frontend: ['react', 'frontend', 'front-end', 'vue', 'angular', 'ui', 'ux'],
    backend: ['backend', 'back-end', 'api', 'server', 'database', 'node'],
    fullstack: ['fullstack', 'full-stack', 'full stack'],
    mobile: ['mobile', 'ios', 'android', 'react native', 'flutter'],
    devops: ['devops', 'infrastructure', 'cloud', 'aws', 'docker', 'kubernetes'],
    data: ['data', 'analyst', 'scientist', 'machine learning', 'ai', 'ml'],
    design: ['designer', 'design', 'ui/ux', 'figma', 'photoshop'],
    product: ['product manager', 'pm', 'product owner', 'scrum master'],
    qa: ['qa', 'quality', 'testing', 'test', 'automation'],
    security: ['security', 'cybersecurity', 'penetration', 'infosec']
  };

  const experienceKeywords = {
    junior: ['junior', 'entry', 'graduate', '0-2 years', 'new grad'],
    mid: ['mid', 'intermediate', '2-5 years', '3+ years'],
    senior: ['senior', '5+ years', '7+ years', 'lead', 'experienced'],
    principal: ['principal', 'staff', 'architect', '10+ years', 'expert']
  };

  const companyTypes = {
    startup: ['startup', 'early stage', 'series a', 'small team'],
    enterprise: ['enterprise', 'large', 'fortune', 'corporation'],
    fintech: ['fintech', 'financial', 'banking', 'payments'],
    healthcare: ['healthcare', 'medical', 'health tech', 'biotech'],
    ecommerce: ['ecommerce', 'e-commerce', 'retail', 'marketplace'],
    saas: ['saas', 'b2b', 'software as a service', 'platform']
  };

  // Determine role type
  let roleType = 'fullstack';
  for (const [type, keywords] of Object.entries(roleKeywords)) {
    if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
      roleType = type;
      break;
    }
  }

  // Determine experience level
  let experienceLevel = 'mid';
  for (const [level, keywords] of Object.entries(experienceKeywords)) {
    if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
      experienceLevel = level;
      break;
    }
  }

  // Determine company type
  let companyType = 'startup';
  for (const [type, keywords] of Object.entries(companyTypes)) {
    if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
      companyType = type;
      break;
    }
  }

  // Location detection
  const isRemote = lowerPrompt.includes('remote') || lowerPrompt.includes('work from home');
  const isHybrid = lowerPrompt.includes('hybrid');
  const hasLocation = /(?:in|at|located)\s+([a-z\s]+)/i.exec(prompt);
  
  let location = 'Remote';
  if (!isRemote) {
    if (isHybrid) {
      location = 'San Francisco, CA (Hybrid)';
    } else if (hasLocation) {
      location = hasLocation[1].trim();
    } else {
      const cities = ['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Boston, MA', 'Los Angeles, CA'];
      location = cities[Math.floor(Math.random() * cities.length)];
    }
  }

  // Job type detection
  let jobType = 'Full-time';
  if (lowerPrompt.includes('contract') || lowerPrompt.includes('contractor')) jobType = 'Contract';
  if (lowerPrompt.includes('part-time') || lowerPrompt.includes('part time')) jobType = 'Part-time';
  if (lowerPrompt.includes('freelance')) jobType = 'Freelance';
  if (lowerPrompt.includes('intern')) jobType = 'Internship';

  // Generate dynamic content based on role type
  const roleConfigs = {
    frontend: {
      titles: ['Frontend Developer', 'React Developer', 'UI Developer', 'Frontend Engineer'],
      skills: ['React', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Next.js', 'Tailwind CSS', 'Redux', 'Webpack'],
    },
    backend: {
      titles: ['Backend Developer', 'Server Engineer', 'API Developer', 'Backend Engineer'],
      skills: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Express', 'FastAPI', 'AWS', 'Docker'],
    },
    fullstack: {
      titles: ['Full Stack Developer', 'Software Engineer', 'Full Stack Engineer', 'Web Developer'],
      skills: ['JavaScript', 'Python', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Git'],
    },
    mobile: {
      titles: ['Mobile Developer', 'iOS Developer', 'Android Developer', 'React Native Developer'],
      skills: ['React Native', 'Swift', 'Kotlin', 'iOS SDK', 'Android SDK', 'Firebase', 'Redux', 'Git'],
    },
    data: {
      titles: ['Data Scientist', 'Data Analyst', 'ML Engineer', 'Data Engineer'],
      skills: ['Python', 'SQL', 'TensorFlow', 'Pandas', 'Scikit-learn', 'Jupyter', 'AWS', 'Statistics'],
    }
  };

  const config = roleConfigs[roleType] || roleConfigs.fullstack;
  
  // Experience level configurations
  const experienceConfigs = {
    junior: {
      levelText: 'Entry Level',
      salaryRange: '$70,000 - $95,000',
      seniorityPrefix: 'Junior'
    },
    mid: {
      levelText: 'Mid Level',
      salaryRange: '$95,000 - $130,000',
      seniorityPrefix: ''
    },
    senior: {
      levelText: 'Senior Level',
      salaryRange: '$130,000 - $180,000',
      seniorityPrefix: 'Senior'
    },
    principal: {
      levelText: 'Principal Level',
      salaryRange: '$180,000 - $250,000',
      seniorityPrefix: 'Principal'
    }
  };

  const expConfig = experienceConfigs[experienceLevel] || experienceConfigs.mid;

  // Company configurations
  const companyConfigs = {
    startup: {
      names: ['TechStart Innovations', 'Velocity Labs', 'NextGen Solutions', 'Catalyst Ventures'],
    },
    enterprise: {
      names: ['Global Tech Corporation', 'Enterprise Solutions Inc.', 'Fortune Systems', 'TechCorp International'],
    },
    fintech: {
      names: ['FinanceFlow', 'PaymentPro', 'CryptoTech', 'InvestSmart'],
    }
  };

  const companyConfig = companyConfigs[companyType] || companyConfigs.startup;
  const randomCompany = companyConfig.names[Math.floor(Math.random() * companyConfig.names.length)];
  const randomTitle = config.titles[Math.floor(Math.random() * config.titles.length)];

  // Add some randomness to make each generation unique
  const uniqueId = Math.random().toString(36).substring(7);

  return {
    title: expConfig.seniorityPrefix ? `${expConfig.seniorityPrefix} ${randomTitle}` : randomTitle,
    company: randomCompany,
    location,
    experienceLevel: expConfig.levelText,
    jobType,
    salary: expConfig.salaryRange,
    skills: config.skills,
    uniqueId // For testing purposes
  };
};

// Test different prompts
const testPrompts = [
  "I need a senior React developer for my startup",
  "Looking for a junior backend engineer for our fintech company",
  "Need a data scientist with machine learning experience",
  "Hiring a mobile developer for iOS apps",
  "Looking for a DevOps engineer with AWS experience",
  "Need a UI/UX designer for our healthcare app",
  "Hiring a product manager for our enterprise software",
  "Looking for a QA engineer with automation skills"
];

console.log('Testing Enhanced Job Description Generator\n');
console.log('=' .repeat(50));

testPrompts.forEach((prompt, index) => {
  console.log(`\nTest ${index + 1}: "${prompt}"`);
  console.log('-'.repeat(30));
  
  const result = generateMockJobDescription(prompt);
  console.log(`Title: ${result.title}`);
  console.log(`Company: ${result.company}`);
  console.log(`Location: ${result.location}`);
  console.log(`Experience: ${result.experienceLevel}`);
  console.log(`Job Type: ${result.jobType}`);
  console.log(`Salary: ${result.salary}`);
  console.log(`Skills: ${result.skills.slice(0, 3).join(', ')}...`);
  console.log(`Unique ID: ${result.uniqueId}`);
});

console.log('\n' + '='.repeat(50));
console.log('Testing complete! Each generation should be unique.');
