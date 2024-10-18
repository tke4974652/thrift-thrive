import { OpenAI } from 'openai';

// Your OpenAI API key, make sure to store it securely
const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: openaiApiKey,
  dangerouslyAllowBrowser: true,
});

// Export the OpenAI instance for use in your application
export { openai };
