import { pipeline } from "@huggingface/transformers";

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

let textGenerator: any = null;

export const initializeAI = async () => {
  if (!textGenerator) {
    try {
      textGenerator = await pipeline(
        "text-generation",
        "microsoft/DialoGPT-medium",
        { device: "cpu" }
      );
    } catch (error) {
      console.warn("Could not load AI model, using template generation");
    }
  }
  return textGenerator;
};

export const generateCV = async (cvData: CVData, jobDetails: JobDetails): Promise<string> => {
  // Template-based CV generation (always works, no AI needed)
  const generateTemplateCV = () => {
    const currentYear = new Date().getFullYear();
    
    return `# ${cvData.fullName}

**Email:** ${cvData.email}  
**Phone:** ${cvData.phone || 'Available upon request'}

---

## Professional Summary

Motivated professional seeking the ${jobDetails.title} position at ${jobDetails.company}. ${cvData.experience ? 'Bringing proven experience and expertise to contribute effectively to your team.' : 'Eager to apply my skills and knowledge to contribute to your organization\'s success.'}

---

## Experience

${cvData.experience || `**Relevant Experience for ${jobDetails.title}**
- Strong problem-solving and analytical skills
- Excellent communication and teamwork abilities  
- Adaptable and quick to learn new technologies
- Detail-oriented with focus on quality results`}

---

## Skills

${cvData.skills || `**Key Skills for ${jobDetails.title}:**
- Leadership and project management
- Communication and interpersonal skills
- Technical proficiency and adaptability
- Time management and organization
- Critical thinking and problem-solving`}

---

## Education

${cvData.education || `**Educational Background**
- Relevant coursework and certifications
- Continuous learning and professional development
- Strong academic foundation supporting career goals`}

---

## Why ${jobDetails.company}?

I am particularly interested in joining ${jobDetails.company} because of your reputation for excellence and innovation. This ${jobDetails.title} position aligns perfectly with my career goals and I am excited about the opportunity to contribute to your team's success.

---

*References available upon request*`;
  };

  try {
    // Try to use AI for enhancement if available
    await initializeAI();
    
    if (textGenerator) {
      // Use AI to enhance the template (basic enhancement)
      const baseCV = generateTemplateCV();
      
      // Simple AI enhancement - just return the template for now
      // The DialoGPT model isn't ideal for CV generation, so we'll use the template
      return baseCV;
    }
  } catch (error) {
    console.log("Using template generation (AI enhancement unavailable)");
  }
  
  // Fallback to template generation
  return generateTemplateCV();
};

export const downloadCV = (cvContent: string, fileName: string) => {
  const blob = new Blob([cvContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName.replace(/\s+/g, '_')}_CV.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};