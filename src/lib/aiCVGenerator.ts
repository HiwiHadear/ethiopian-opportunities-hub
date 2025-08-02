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
  // Enhanced template-based CV generation
  const generateTemplateCV = () => {
    const currentYear = new Date().getFullYear();
    
    return `# ${cvData.fullName}

**Email:** ${cvData.email}  
**Phone:** ${cvData.phone || 'Available upon request'}  
**LinkedIn:** www.linkedin.com/in/${cvData.fullName.toLowerCase().replace(/\s+/g, '-')}  
**Location:** Available for relocation

---

## Professional Summary

${cvData.experience ? 
  `Experienced professional with a proven track record of success seeking the ${jobDetails.title} position at ${jobDetails.company}. Throughout my career, I have demonstrated exceptional ability to deliver results, lead teams, and drive innovation in fast-paced environments. My expertise spans multiple domains including strategic planning, project management, and technical implementation. I am passionate about contributing to organizational growth while continuously developing my skills and knowledge base.

Key achievements include successful project deliveries, team leadership experiences, and consistent performance improvements. I bring a unique combination of technical expertise and business acumen that enables me to bridge the gap between complex technical solutions and business objectives. My collaborative approach and strong communication skills have consistently enabled me to work effectively with cross-functional teams and stakeholders at all levels.` 
: 
  `Motivated and results-driven professional seeking to launch my career as ${jobDetails.title} at ${jobDetails.company}. While early in my professional journey, I bring fresh perspectives, strong foundational knowledge, and an unwavering commitment to excellence. My academic background and project experiences have equipped me with essential skills in problem-solving, critical thinking, and collaborative teamwork.

I am particularly drawn to opportunities that challenge me to grow professionally while making meaningful contributions to organizational success. My eagerness to learn, combined with strong work ethic and attention to detail, positions me well to quickly become a valuable team member. I thrive in environments that encourage innovation and continuous learning.`}

---

## Professional Experience

${cvData.experience || `### Relevant Project Experience & Internships

**Academic/Personal Projects (${currentYear - 2} - Present)**
- Led multiple team-based projects demonstrating leadership and collaboration skills
- Developed comprehensive solutions using modern technologies and methodologies
- Consistently delivered projects on time while maintaining high quality standards
- Collaborated with diverse teams to achieve common goals and objectives
- Demonstrated strong analytical and problem-solving capabilities through complex assignments

**Technical Skills Development**
- Gained hands-on experience with industry-standard tools and technologies
- Completed intensive coursework in relevant areas including project management, data analysis, and technical implementation
- Participated in workshops, seminars, and professional development activities
- Maintained current knowledge of industry trends and best practices
- Applied theoretical knowledge to practical, real-world scenarios

**Leadership & Communication Experience**
- Served in various leadership roles during academic and extracurricular activities
- Organized and coordinated team meetings, events, and project deliverables
- Developed strong presentation and communication skills through various speaking opportunities
- Mentored junior colleagues and provided guidance on technical and professional matters
- Built strong relationships with peers, instructors, and industry professionals`}

---

## Core Competencies & Skills

${cvData.skills || `### Technical Skills
- **Project Management:** Agile methodologies, Scrum, Kanban, timeline management, resource allocation
- **Data Analysis:** Statistical analysis, data visualization, reporting, trend identification
- **Software Proficiency:** Microsoft Office Suite, Google Workspace, project management tools
- **Communication:** Technical writing, presentation development, stakeholder management
- **Research & Development:** Market research, competitive analysis, process improvement

### Professional Skills
- **Leadership:** Team building, motivation, delegation, performance management, conflict resolution
- **Strategic Thinking:** Problem identification, solution development, risk assessment, decision making
- **Customer Focus:** Customer service excellence, relationship building, needs assessment
- **Adaptability:** Change management, learning agility, flexibility, resilience
- **Quality Assurance:** Attention to detail, process optimization, continuous improvement

### Industry-Specific Skills for ${jobDetails.title}
- Understanding of industry standards and best practices relevant to ${jobDetails.title}
- Knowledge of regulatory requirements and compliance standards
- Experience with industry-specific software and tools
- Awareness of current market trends and future developments
- Commitment to professional development and certification maintenance`}

---

## Education & Professional Development

${cvData.education || `### Academic Background
**Bachelor's Degree in Relevant Field**  
*University Name* | *Graduation Year*
- Relevant coursework: Advanced topics directly applicable to ${jobDetails.title} role
- Academic achievements: Dean's List, Honor Society membership, academic scholarships
- Capstone project: Comprehensive project demonstrating practical application of learned concepts
- GPA: 3.5+ (if applicable)

### Certifications & Training
- **Professional Certifications:** Industry-relevant certifications pursued or in progress
- **Online Learning:** Coursera, edX, LinkedIn Learning courses in relevant technologies
- **Workshops & Seminars:** Regular participation in professional development activities
- **Conference Attendance:** Industry conferences and networking events

### Continuous Learning Initiatives
- **Current Studies:** Ongoing pursuit of advanced certifications and specialized training
- **Professional Memberships:** Active participation in relevant professional associations
- **Skill Development:** Regular engagement with new technologies and methodologies
- **Knowledge Sharing:** Contributing to professional communities and knowledge bases`}

---

## Notable Achievements & Projects

### Key Accomplishments
- **Academic Excellence:** Maintained high academic standards while developing practical skills
- **Project Success:** Successfully completed multiple complex projects with measurable outcomes
- **Leadership Recognition:** Acknowledged for leadership capabilities in various settings
- **Innovation Contribution:** Contributed innovative ideas and solutions to team projects
- **Professional Growth:** Demonstrated continuous improvement and skill development

### Relevant Projects
- **Project Management Initiative:** Led cross-functional team to deliver results within tight deadlines
- **Process Improvement Study:** Identified and implemented efficiency improvements saving time and resources
- **Technology Implementation:** Successfully integrated new technologies to enhance productivity
- **Research & Analysis:** Conducted comprehensive research resulting in actionable recommendations
- **Customer Service Excellence:** Maintained high customer satisfaction ratings through effective service delivery

---

## Why ${jobDetails.company}?

I am particularly excited about the opportunity to join ${jobDetails.company} as ${jobDetails.title} for several compelling reasons:

**Company Reputation & Values:** ${jobDetails.company} has established itself as a leader in the industry with a strong commitment to innovation, quality, and customer satisfaction. These values align perfectly with my professional philosophy and career aspirations.

**Growth Opportunities:** The ${jobDetails.title} position offers an ideal platform for professional development and career advancement. I am eager to contribute to ${jobDetails.company}'s continued success while growing my skills and expertise in a dynamic environment.

**Cultural Fit:** From my research, ${jobDetails.company}'s collaborative culture and commitment to employee development resonates strongly with my work style and professional goals. I thrive in environments that encourage teamwork, innovation, and continuous learning.

**Industry Impact:** ${jobDetails.company}'s position in the market and commitment to making a positive impact aligns with my desire to work for an organization that makes a meaningful difference in the industry and community.

**Role Alignment:** The ${jobDetails.title} position perfectly matches my skills, interests, and career trajectory. I am confident that my background and enthusiasm will enable me to make valuable contributions from day one while continuing to grow professionally.

---

## Additional Information

**Languages:** English (Native/Fluent), [Additional languages as applicable]  
**Volunteer Experience:** Active community involvement demonstrating commitment to social responsibility  
**Interests:** Professional interests that complement career goals and demonstrate well-rounded personality  
**Availability:** Immediate availability with flexibility for training and onboarding requirements  

---

*References and detailed work samples available upon request*  
*Portfolio and additional documentation can be provided during interview process*`;
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