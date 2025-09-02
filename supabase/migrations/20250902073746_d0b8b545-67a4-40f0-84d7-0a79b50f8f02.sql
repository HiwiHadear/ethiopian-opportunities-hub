-- Strengthen job_applications RLS policies with explicit authentication checks

-- Drop existing policies and recreate with stronger checks
DROP POLICY "Users can view their own job applications" ON public.job_applications;
DROP POLICY "Users can create their own job applications" ON public.job_applications;  
DROP POLICY "Users can update their own job applications" ON public.job_applications;
DROP POLICY "Admins can view all job applications" ON public.job_applications;
DROP POLICY "Admins can update job applications" ON public.job_applications;

-- Create strengthened policies with explicit NULL checks and authenticated role restrictions
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