-- Add explicit authentication checks to existing job_applications policies

-- Add explicit null check policy for anonymous users  
CREATE POLICY "Deny all access to anonymous users on job applications" 
ON public.job_applications 
FOR ALL 
TO anon
USING (false);

-- Add comment for security documentation
COMMENT ON TABLE public.job_applications IS 'Contains sensitive personal information (names, emails, phone, CV data) - restricted to authenticated users only (own applications) and admins (all applications)';

-- Create index for better performance on user lookups
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON public.job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);