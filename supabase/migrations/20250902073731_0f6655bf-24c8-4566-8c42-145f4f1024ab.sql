-- Strengthen job_applications RLS policies - handle existing policies properly

-- Update existing policies to add stronger authentication checks
CREATE OR REPLACE POLICY "Users can view only their own job applications" 
ON public.job_applications 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

CREATE OR REPLACE POLICY "Users can create their own job applications" 
ON public.job_applications 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

CREATE OR REPLACE POLICY "Users can update only their own pending applications" 
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

CREATE OR REPLACE POLICY "Admins can view all job applications" 
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

CREATE OR REPLACE POLICY "Admins can update any job application" 
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

-- Explicitly deny all access to anonymous users (create only if doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'job_applications' 
    AND policyname = 'Deny anonymous access to job applications'
  ) THEN
    CREATE POLICY "Deny anonymous access to job applications" 
    ON public.job_applications 
    FOR ALL 
    TO anon
    USING (false);
  END IF;
END
$$;