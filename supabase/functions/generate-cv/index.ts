import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CVData {
  fullName: string;
  email: string;
  phone?: string;
  experience?: string;
  skills?: string;
  education?: string;
}

interface JobDetails {
  title: string;
  company: string;
  requirements?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cvData, jobDetails }: { cvData: CVData; jobDetails: JobDetails } = await req.json();

    if (!cvData.fullName || !cvData.email) {
      return new Response(JSON.stringify({ error: 'Name and email are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create a tailored prompt for CV generation
    const prompt = `Generate a professional CV/resume for a job application with the following details:

Personal Information:
- Name: ${cvData.fullName}
- Email: ${cvData.email}
- Phone: ${cvData.phone || 'Not provided'}

Job Application:
- Position: ${jobDetails.title}
- Company: ${jobDetails.company}
- Requirements: ${jobDetails.requirements || 'Not specified'}

Experience: ${cvData.experience || 'Please help fill in relevant experience based on the job requirements'}
Skills: ${cvData.skills || 'Please suggest relevant skills for this position'}
Education: ${cvData.education || 'Please suggest appropriate education background'}

Please create a well-structured, professional CV that:
1. Highlights relevant experience for the ${jobDetails.title} position
2. Includes appropriate skills that match the job requirements
3. Has a professional summary/objective
4. Is formatted in a clean, readable structure
5. If experience/skills/education are not provided, suggest realistic and relevant content for the position

Format the CV in markdown with clear sections and professional language.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional CV/resume writer. Create well-structured, professional CVs that highlight relevant qualifications and experience for specific job positions. Always format in markdown with clear sections.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedCV = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      generatedCV,
      cvData: {
        ...cvData,
        generatedContent: generatedCV
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-cv function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});