-- Update RLS policies to only allow admins to create content

-- Drop existing user creation policies for tenders
DROP POLICY IF EXISTS "Users can create tenders" ON public.tenders;

-- Create new admin-only creation policy for tenders
CREATE POLICY "Only admins can create tenders" 
ON public.tenders 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Drop existing user creation policies for jobs
DROP POLICY IF EXISTS "Users can create jobs" ON public.jobs;

-- Create new admin-only creation policy for jobs
CREATE POLICY "Only admins can create jobs" 
ON public.jobs 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Drop existing user creation policies for companies
DROP POLICY IF EXISTS "Users can create companies" ON public.companies;

-- Create new admin-only creation policy for companies
CREATE POLICY "Only admins can create companies" 
ON public.companies 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Update user update policies to be admin-only as well
DROP POLICY IF EXISTS "Users can update their own tenders" ON public.tenders;
DROP POLICY IF EXISTS "Users can update their own jobs" ON public.jobs;
DROP POLICY IF EXISTS "Users can update their own companies" ON public.companies;