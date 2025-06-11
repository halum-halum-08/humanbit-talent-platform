import OpenAI from 'openai';
import { JobDescription } from '@/types';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const USE_MOCK_DATA = !OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here';

const openai = OPENAI_API_KEY && !USE_MOCK_DATA ? new OpenAI({
  apiKey: OPENAI_API_KEY,
}) : null;

// Enhanced mock job description generator with dynamic variations
function generateMockJobDescription(prompt: string): JobDescription {
  const lowerPrompt = prompt.toLowerCase();
  
  // Extract specific details from user input
  const extractSpecificDetails = (prompt: string) => {
    const details = {
      specificTitle: '',
      specificCompany: '',
      specificLocation: '',
      specificSkills: [] as string[],
      specificRequirements: [] as string[],
      specificYears: '',
      specificSalary: '',
      specificIndustry: ''
    };

    // Extract specific job title from common patterns
    const titlePatterns = [
      /(?:need|looking for|hiring|seeking)\s+(?:a\s+)?(?:senior\s+|junior\s+|mid-level\s+|lead\s+)?([\w\s]+?)(?:\s+developer|\s+engineer|\s+manager|\s+designer|\s+analyst|\s+specialist)/i,
      /(?:position|role)\s+(?:for|of)\s+(?:a\s+)?(?:senior\s+|junior\s+|mid-level\s+|lead\s+)?([\w\s]+?)(?:\s+developer|\s+engineer|\s+manager|\s+designer|\s+analyst|\s+specialist)/i
    ];
    
    for (const pattern of titlePatterns) {
      const match = prompt.match(pattern);
      if (match && match[1]) {
        details.specificTitle = match[1].trim();
        break;
      }
    }

    // Extract company information
    const companyPatterns = [
      /(?:at|for)\s+(?:a\s+|an\s+|our\s+)?(startup|fintech|healthcare|enterprise|saas|ecommerce|tech)\s+company/i,
      /(?:company|organization|firm)\s+(?:called\s+|named\s+)?([\w\s]+)/i
    ];
    
    for (const pattern of companyPatterns) {
      const match = prompt.match(pattern);
      if (match && match[1]) {
        details.specificCompany = match[1].trim();
        break;
      }
    }

    // Extract location
    const locationPatterns = [
      /(?:in|located in|based in|from)\s+([\w\s,]+?)(?:\s|$|\.|,)/i,
      /(?:remote|work from home|distributed|anywhere)/i
    ];
    
    for (const pattern of locationPatterns) {
      const match = prompt.match(pattern);
      if (match) {
        if (pattern.source.includes('remote')) {
          details.specificLocation = 'Remote';
        } else if (match[1]) {
          details.specificLocation = match[1].trim();
        }
        break;
      }
    }

    // Extract years of experience
    const yearsPatterns = [
      /(\d+)[\+\-\s]*years?\s+(?:of\s+)?experience/i,
      /(\d+)[\+\-\s]*yrs?\s+(?:of\s+)?experience/i,
      /experience\s+(?:of\s+)?(\d+)[\+\-\s]*years?/i
    ];
    
    for (const pattern of yearsPatterns) {
      const match = prompt.match(pattern);
      if (match && match[1]) {
        details.specificYears = `${match[1]}+ years`;
        break;
      }
    }

    // Extract salary information
    const salaryPatterns = [
      /salary\s+(?:of\s+|range\s+)?[\$]?(\d+(?:,\d+)?(?:k|000)?)\s*(?:to|\-)\s*[\$]?(\d+(?:,\d+)?(?:k|000)?)/i,
      /[\$](\d+(?:,\d+)?(?:k|000)?)\s*(?:to|\-)\s*[\$]?(\d+(?:,\d+)?(?:k|000)?)/i
    ];
    
    for (const pattern of salaryPatterns) {
      const match = prompt.match(pattern);
      if (match && match[1] && match[2]) {
        details.specificSalary = `$${match[1]} - $${match[2]}`;
        break;
      }
    }

    // Extract specific skills mentioned in the prompt
    const commonSkills = [
      'React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'PHP',
      'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQL',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform',
      'Git', 'CI/CD', 'Jenkins', 'GitHub Actions',
      'Figma', 'Sketch', 'Adobe', 'Photoshop', 'Illustrator',
      'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy',
      'REST API', 'GraphQL', 'Microservices', 'Agile', 'Scrum',
      'HTML', 'CSS', 'SASS', 'Tailwind', 'Bootstrap'
    ];

    details.specificSkills = commonSkills.filter(skill => 
      lowerPrompt.includes(skill.toLowerCase()) || 
      prompt.toLowerCase().includes(skill.toLowerCase().replace(/[.-]/g, ''))
    );

    return details;
  };

  const userDetails = extractSpecificDetails(prompt);
  
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
    junior: ['junior', 'entry', 'graduate', '0-2 years', 'new grad', '1 year', '2 years'],
    mid: ['mid', 'intermediate', '2-5 years', '3+ years', '3 years', '4 years', '5 years'],
    senior: ['senior', '5+ years', '7+ years', 'lead', 'experienced', '6 years', '7 years', '8 years'],
    principal: ['principal', 'staff', 'architect', '10+ years', 'expert', '9 years', '10 years']
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
  
  let location = userDetails.specificLocation || 'Remote';
  if (!userDetails.specificLocation) {
    if (!isRemote) {
      if (isHybrid) {
        location = 'San Francisco, CA (Hybrid)';
      } else {
        const cities = ['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Boston, MA', 'Los Angeles, CA'];
        location = cities[Math.floor(Math.random() * cities.length)];
      }
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
      requirements: [
        'Strong proficiency in React and modern JavaScript',
        'Experience with responsive web design and CSS frameworks',
        'Knowledge of state management libraries (Redux, Zustand)',
        'Familiarity with build tools and bundlers',
        'Understanding of web accessibility standards'
      ]
    },
    backend: {
      titles: ['Backend Developer', 'Server Engineer', 'API Developer', 'Backend Engineer'],
      skills: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Express', 'FastAPI', 'AWS', 'Docker'],
      requirements: [
        'Experience with server-side programming languages',
        'Strong knowledge of database design and optimization',
        'Experience building RESTful APIs and microservices',
        'Knowledge of cloud platforms and deployment',
        'Understanding of security best practices'
      ]
    },
    fullstack: {
      titles: ['Full Stack Developer', 'Software Engineer', 'Full Stack Engineer', 'Web Developer'],
      skills: ['JavaScript', 'Python', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Git'],
      requirements: [
        'Experience with both frontend and backend development',
        'Proficiency in modern web frameworks',
        'Knowledge of database design and management',
        'Experience with cloud services and deployment',
        'Strong problem-solving and debugging skills'
      ]
    },
    mobile: {
      titles: ['Mobile Developer', 'iOS Developer', 'Android Developer', 'React Native Developer'],
      skills: ['React Native', 'Swift', 'Kotlin', 'iOS SDK', 'Android SDK', 'Firebase', 'Redux', 'Git'],
      requirements: [
        'Experience with mobile app development',
        'Knowledge of platform-specific guidelines',
        'Experience with app store deployment',
        'Understanding of mobile UI/UX principles',
        'Performance optimization for mobile devices'
      ]
    },
    devops: {
      titles: ['DevOps Engineer', 'Cloud Engineer', 'Infrastructure Engineer', 'Site Reliability Engineer'],
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux', 'Python', 'Monitoring'],
      requirements: [
        'Experience with cloud infrastructure and deployment',
        'Knowledge of containerization and orchestration',
        'Experience with CI/CD pipelines',
        'Strong scripting and automation skills',
        'Understanding of monitoring and logging systems'
      ]
    },
    data: {
      titles: ['Data Scientist', 'Data Analyst', 'ML Engineer', 'Data Engineer'],
      skills: ['Python', 'SQL', 'TensorFlow', 'Pandas', 'Scikit-learn', 'Jupyter', 'AWS', 'Statistics'],
      requirements: [
        'Strong background in statistics and mathematics',
        'Experience with data analysis and visualization',
        'Knowledge of machine learning algorithms',
        'Proficiency in Python and SQL',
        'Experience with data pipeline development'
      ]
    },
    design: {
      titles: ['UI/UX Designer', 'Product Designer', 'Visual Designer', 'Design Lead'],
      skills: ['Figma', 'Adobe Creative Suite', 'Sketch', 'Prototyping', 'User Research', 'Design Systems'],
      requirements: [
        'Strong portfolio demonstrating design skills',
        'Experience with design tools and prototyping',
        'Understanding of user-centered design principles',
        'Knowledge of design systems and style guides',
        'Experience conducting user research'
      ]
    },
    product: {
      titles: ['Product Manager', 'Senior Product Manager', 'Product Owner', 'Product Lead'],
      skills: ['Product Strategy', 'Agile', 'Scrum', 'Analytics', 'User Research', 'Roadmapping'],
      requirements: [
        'Experience in product management and strategy',
        'Strong analytical and problem-solving skills',
        'Experience with agile development methodologies',
        'Excellent communication and leadership skills',
        'Data-driven approach to decision making'
      ]
    },
    qa: {
      titles: ['QA Engineer', 'Test Engineer', 'SDET', 'Quality Assurance Specialist'],
      skills: ['Test Automation', 'Selenium', 'Jest', 'Cypress', 'API Testing', 'Performance Testing'],
      requirements: [
        'Experience with manual and automated testing',
        'Knowledge of testing frameworks and tools',
        'Understanding of software development lifecycle',
        'Experience with bug tracking and test management',
        'Strong attention to detail and analytical skills'
      ]
    },
    security: {
      titles: ['Security Engineer', 'Cybersecurity Analyst', 'InfoSec Engineer', 'Penetration Tester'],
      skills: ['Security Frameworks', 'Penetration Testing', 'SIEM', 'Vulnerability Assessment', 'Python'],
      requirements: [
        'Strong knowledge of cybersecurity principles',
        'Experience with security tools and frameworks',
        'Understanding of network and application security',
        'Knowledge of compliance standards',
        'Experience with incident response'
      ]
    }
  };

  const config = roleConfigs[roleType as keyof typeof roleConfigs] || roleConfigs.fullstack;
  
  // Experience level configurations
  const experienceConfigs = {
    junior: {
      levelText: 'Entry Level',
      yearsText: userDetails.specificYears || '0-2 years',
      salaryRange: userDetails.specificSalary || '$70,000 - $95,000',
      seniorityPrefix: 'Junior'
    },
    mid: {
      levelText: 'Mid Level',
      yearsText: userDetails.specificYears || '3-5 years',
      salaryRange: userDetails.specificSalary || '$95,000 - $130,000',
      seniorityPrefix: ''
    },
    senior: {
      levelText: 'Senior Level',
      yearsText: userDetails.specificYears || '5+ years',
      salaryRange: userDetails.specificSalary || '$130,000 - $180,000',
      seniorityPrefix: 'Senior'
    },
    principal: {
      levelText: 'Principal Level',
      yearsText: userDetails.specificYears || '8+ years',
      salaryRange: userDetails.specificSalary || '$180,000 - $250,000',
      seniorityPrefix: 'Principal'
    }
  };

  const expConfig = experienceConfigs[experienceLevel as keyof typeof experienceConfigs] || experienceConfigs.mid;

  // Company configurations
  const companyConfigs = {
    startup: {
      names: ['TechStart Innovations', 'Velocity Labs', 'NextGen Solutions', 'Catalyst Ventures'],
      description: 'fast-growing startup'
    },
    enterprise: {
      names: ['Global Tech Corporation', 'Enterprise Solutions Inc.', 'Fortune Systems', 'TechCorp International'],
      description: 'established enterprise company'
    },
    fintech: {
      names: ['FinanceFlow', 'PaymentPro', 'CryptoTech', 'InvestSmart'],
      description: 'innovative fintech company'
    },
    healthcare: {
      names: ['HealthTech Solutions', 'MedicalAI', 'CareConnect', 'BioDx Systems'],
      description: 'healthcare technology company'
    },
    ecommerce: {
      names: ['ShopTech', 'MarketPlace Pro', 'RetailFlow', 'CommerceNext'],
      description: 'e-commerce platform'
    },
    saas: {
      names: ['CloudSoft', 'PlatformPro', 'SaaS Solutions', 'TechService'],
      description: 'SaaS technology company'
    }
  };

  const companyConfig = companyConfigs[companyType as keyof typeof companyConfigs] || companyConfigs.startup;
  const randomCompany = userDetails.specificCompany || companyConfig.names[Math.floor(Math.random() * companyConfig.names.length)];
  
  // Use specific title from user input if available
  let finalTitle = '';
  if (userDetails.specificTitle) {
    finalTitle = expConfig.seniorityPrefix ? `${expConfig.seniorityPrefix} ${userDetails.specificTitle}` : userDetails.specificTitle;
  } else {
    const randomTitle = config.titles[Math.floor(Math.random() * config.titles.length)];
    finalTitle = expConfig.seniorityPrefix ? `${expConfig.seniorityPrefix} ${randomTitle}` : randomTitle;
  }

  // Merge user-specified skills with role-based skills
  const finalSkills = userDetails.specificSkills.length > 0 
    ? [...new Set([...userDetails.specificSkills, ...config.skills.slice(0, 4)])]
    : config.skills;

  // Add some randomness to make each generation unique
  const uniqueId = Math.random().toString(36).substring(7);

  return {
    title: finalTitle,
    company: randomCompany,
    location,
    experienceLevel: expConfig.levelText,
    jobType,
    salary: expConfig.salaryRange,
    description: `We are seeking a talented ${finalTitle} to join our ${companyConfig.description}. Based on your requirements: "${prompt.substring(0, 150)}${prompt.length > 150 ? '...' : ''}", this role offers an excellent opportunity to work with cutting-edge technologies and make a significant impact. [ID: ${uniqueId}]`,
    requirements: [
      `${expConfig.yearsText} of experience in ${roleType} development`,
      ...config.requirements.slice(0, 3),
      'Strong problem-solving skills and attention to detail',
      'Excellent communication and teamwork abilities'
    ],
    responsibilities: [
      `Develop and maintain high-quality ${roleType} applications`,
      'Collaborate with designers, product managers, and other engineers',
      'Write clean, maintainable, and well-documented code',
      'Participate in code reviews and provide constructive feedback',
      'Contribute to technical decisions and architecture discussions',
      experienceLevel === 'senior' || experienceLevel === 'principal' 
        ? 'Mentor junior developers and lead technical initiatives'
        : 'Learn from senior team members and grow technical skills'
    ],
    skills: finalSkills,
    benefits: [
      'Competitive salary and equity package',
      'Comprehensive health, dental, and vision insurance',
      isRemote ? 'Fully remote work environment' : 'Flexible work arrangements',
      '401(k) retirement plan with company matching',
      'Professional development budget and learning opportunities',
      companyType === 'startup' ? 'Stock options and growth opportunities' : 'Comprehensive PTO policy'
    ]
  };
}

export async function generateJobDescription(prompt: string): Promise<JobDescription> {
  // Log the incoming prompt for debugging
  console.log('📝 Generating job description for prompt:', prompt);
  console.log('🔧 Using mock data:', USE_MOCK_DATA);
  
  // If no valid OpenAI API key, return mock data
  if (USE_MOCK_DATA) {
    console.log('⚠️  Using mock data for job description generation - OpenAI API key not configured');
    const mockResult = generateMockJobDescription(prompt);
    console.log('✅ Mock job description generated:', mockResult.title, 'at', mockResult.company);
    return new Promise(resolve => 
      setTimeout(() => resolve(mockResult), 1500)
    );
  }

  if (!openai) {
    console.log('❌ OpenAI client not initialized, falling back to mock data');
    return generateMockJobDescription(prompt);
  }

  try {
    console.log('🤖 Attempting to generate job description with OpenAI...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using the more reliable and cost-effective model
      messages: [
        {
          role: "system",
          content: `You are an expert HR professional and talent acquisition specialist. Generate a comprehensive job description based on the user's requirements. Return the response as a JSON object with the following structure:
          {
            "title": "Job Title",
            "company": "Company Name (if not provided, use 'Your Company')",
            "location": "Location (if not provided, use 'Remote')",
            "experienceLevel": "Entry Level/Mid Level/Senior Level/Executive",
            "jobType": "Full-time/Part-time/Contract/Freelance",
            "salary": "Salary range (optional)",
            "description": "Detailed job description",
            "requirements": ["requirement1", "requirement2", ...],
            "responsibilities": ["responsibility1", "responsibility2", ...],
            "skills": ["skill1", "skill2", ...],
            "benefits": ["benefit1", "benefit2", ...] (optional)
          }`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const jobDescription: JobDescription = JSON.parse(content);
    console.log('✅ OpenAI job description generated successfully:', jobDescription.title);
    return jobDescription;
  } catch (error) {
    console.error('❌ Error generating job description:', error);
    
    // Fallback to mock data if OpenAI fails
    console.log('🔄 Falling back to mock data due to OpenAI error');
    return generateMockJobDescription(prompt);
  }
}

export async function optimizeSearchFilters(jobDescription: JobDescription): Promise<string[]> {
  // If no valid OpenAI API key, return mock search terms
  if (USE_MOCK_DATA) {
    const mockTerms = [
      jobDescription.title,
      ...jobDescription.skills.slice(0, 3),
      jobDescription.experienceLevel,
      jobDescription.location
    ].filter(Boolean);
    
    return new Promise(resolve => 
      setTimeout(() => resolve(mockTerms), 500)
    );
  }

  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert in LinkedIn talent acquisition. Based on the job description provided, generate optimized search terms for finding the best candidates. Focus on:
          1. Job titles and variations
          2. Key skills and technologies
          3. Industry terms
          4. Experience levels
          5. Company types
          
          Return a JSON array of search terms that would be most effective for LinkedIn searches.`
        },
        {
          role: "user",
          content: `Job Description: ${JSON.stringify(jobDescription)}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const result = JSON.parse(content);
    return result.searchTerms || [];
  } catch (error) {
    console.error('Error optimizing search filters:', error);
    
    // Fallback to basic terms derived from job description
    const fallbackTerms = [
      jobDescription.title,
      ...jobDescription.skills.slice(0, 3),
      jobDescription.experienceLevel
    ].filter(Boolean);
    
    return fallbackTerms;
  }
}
