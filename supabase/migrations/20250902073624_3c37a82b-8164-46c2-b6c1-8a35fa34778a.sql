-- Strengthen job_applications RLS policies to prevent any potential data exposure

-- First, drop existing policies to recreate them with stronger authentication checks
DROP POLICY IF EXISTS "Users can view their own job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Users can create their own job applications" ON public.job_applications;  
DROP POLICY IF EXISTS "Users can update their own job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Admins can view all job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Admins can update job applications" ON public.job_applications;

-- Create strengthened policies with explicit authentication checks
CREATE POLICY "Users can view only their own job applications" 
ON public.job_applications 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

CREATE POLICY "Users can create their own job applications" 
ON public.job_applications 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

CREATE POLICY "Users can update only their own pending applications" 
ON public.job_applications 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id 
  AND status = 'pending'
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id 
  AND status = 'pending'
);

CREATE POLICY "Admins can view all job applications" 
ON public.job_applications 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can update any job application" 
ON public.job_applications 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Explicitly deny all access to anonymous users
CREATE POLICY "Deny anonymous access to job applications" 
ON public.job_applications 
FOR ALL 
TO anon
USING (false);

-- Add a policy to prevent any deletion attempts
CREATE POLICY "Prevent deletion of job applications" 
ON public.job_applications 
FOR DELETE 
TO authenticated
USING (false);