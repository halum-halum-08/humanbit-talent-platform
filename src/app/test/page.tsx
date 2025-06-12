import { generateJobDescription } from '@/lib/openai';
import { JobDescription } from '@/types';

export default async function TestJobGenerator() {
  const testPrompts = [
    "I need a senior React developer for my startup",
    "Looking for a junior backend engineer for our fintech company", 
    "Need a data scientist with machine learning experience",
    "Hiring a mobile developer for iOS apps",
    "Looking for a DevOps engineer with AWS experience"
  ];
  const results: Array<{ prompt: string; job?: JobDescription; error?: string }> = [];
  for (const prompt of testPrompts) {
    try {
      const job = await generateJobDescription(prompt);
      results.push({ prompt, job });
    } catch (error) {
      results.push({ prompt, error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Job Description Generator Test</h1>
      
      {results.map((result, index) => (
        <div key={index} className="border p-4 rounded-lg">
          <h3 className="font-semibold text-blue-600 mb-2">
            Test {index + 1}: "{result.prompt}"
          </h3>
          
          {result.job ? (
            <div className="space-y-2">
              <p><strong>Title:</strong> {result.job.title}</p>
              <p><strong>Company:</strong> {result.job.company}</p>
              <p><strong>Location:</strong> {result.job.location}</p>
              <p><strong>Experience Level:</strong> {result.job.experienceLevel}</p>
              <p><strong>Job Type:</strong> {result.job.jobType}</p>
              <p><strong>Salary:</strong> {result.job.salary}</p>
              <p><strong>Skills:</strong> {result.job.skills.slice(0, 5).join(', ')}</p>
            </div>
          ) : (
            <p className="text-red-500">Error: {result.error}</p>
          )}
        </div>
      ))}
    </div>
  );
}
