import { z } from 'zod';

// Job validation schema
export const jobSchema = z.object({
  title: z.string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  company: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters')
    .trim(),
  location: z.string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be less than 100 characters')
    .trim(),
  salary: z.string()
    .min(1, 'Salary is required')
    .max(50, 'Salary must be less than 50 characters')
    .trim(),
  type: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship']),
  description: z.string().optional(),
  requirements: z.string().optional()
});

// Tender validation schema
export const tenderSchema = z.object({
  title: z.string()
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  organization: z.string()
    .min(2, 'Organization must be at least 2 characters')
    .max(100, 'Organization must be less than 100 characters')
    .trim(),
  budget: z.string()
    .min(1, 'Bid guarantee is required')
    .max(50, 'Bid guarantee must be less than 50 characters')
    .trim(),
  deadline: z.string()
    .min(1, 'Deadline is required')
    .refine((date) => {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, 'Deadline must be today or in the future'),
  sector: z.enum(['Construction', 'IT', 'Agriculture', 'Healthcare', 'Education']),
  region: z.enum(['Addis Ababa', 'Dire Dawa', 'Hawassa', 'Bahir Dar', 'Mekelle']),
  description: z.string().optional(),
  requirements: z.string().optional()
});

// Company validation schema
export const companySchema = z.object({
  name: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters')
    .trim(),
  sector: z.string()
    .min(2, 'Sector must be at least 2 characters')
    .max(50, 'Sector must be less than 50 characters')
    .trim(),
  emoji: z.string()
    .min(1, 'Emoji is required')
    .max(10, 'Emoji must be less than 10 characters')
    .trim(),
  industry: z.string().optional(),
  location: z.string().optional(),
  size: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  description: z.string().optional()
});

// Job application validation schema
export const jobApplicationSchema = z.object({
  full_name: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .trim(),
  email: z.string()
    .email('Invalid email address')
    .max(100, 'Email must be less than 100 characters')
    .trim()
    .toLowerCase(),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^[\+]?[0-9\s\-\(\)]*$/, 'Invalid phone number format')
    .optional(),
  cover_letter: z.string()
    .max(2000, 'Cover letter must be less than 2000 characters')
    .optional()
});

// Tender application validation schema
export const tenderApplicationSchema = z.object({
  company_name: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters')
    .trim(),
  company_email: z.string()
    .email('Invalid email address')
    .max(100, 'Email must be less than 100 characters')
    .trim()
    .toLowerCase(),
  company_phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^[\+]?[0-9\s\-\(\)]*$/, 'Invalid phone number format')
    .optional(),
  bid_amount: z.number()
    .min(0, 'Bid amount must be positive')
    .optional(),
  proposal_summary: z.string()
    .max(2000, 'Proposal summary must be less than 2000 characters')
    .optional()
});

// Sanitization function
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Sanitize object function
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T;
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value;
    }
  }
  return sanitized;
}