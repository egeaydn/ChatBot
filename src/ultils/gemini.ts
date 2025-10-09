export function buildGeminiEndpoint() {
    const key = process.env.NEXT_PUBLIC_GL_API_KEY;
    const project = process.env.NEXT_PUBLIC_GL_PROJECT_ID;
    const location = process.env.NEXT_PUBLIC_GL_LOCATION || 'us-central1';
    const model = process.env.NEXT_PUBLIC_GL_MODEL_ID || 'gemini-2.5-flash';
  
    if (!key || !project) {
      throw new Error('GL_API_KEY ve GL_PROJECT_ID tanımlı olmalı');
    }
  
    return `https://generativelanguage.googleapis.com/v1beta/projects/${project}/locations/${location}/publishers/google/models/${model}:generateContent?key=${key}`;
  }
  
  export function buildGeminiBody(prompt: string) {
    return {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };
  }