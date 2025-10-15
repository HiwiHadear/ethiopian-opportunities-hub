-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'moderator' THEN 2
      WHEN 'user' THEN 3
    END
  LIMIT 1
$$;

-- Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::app_role
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update existing RLS policies to use has_role function

-- Update profiles policies
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING ((auth.uid() = id) OR public.has_role(auth.uid(), 'admin'))
WITH CHECK ((auth.uid() = id) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING ((auth.uid() = id) OR public.has_role(auth.uid(), 'admin'));

-- Update jobs policies
DROP POLICY IF EXISTS "Admins can update any job" ON public.jobs;
DROP POLICY IF EXISTS "Admins can view all jobs" ON public.jobs;
DROP POLICY IF EXISTS "Only admins can create jobs" ON public.jobs;

CREATE POLICY "Admins can update any job"
ON public.jobs
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all jobs"
ON public.jobs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can create jobs"
ON public.jobs
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update companies policies
DROP POLICY IF EXISTS "Admins can update any company" ON public.companies;
DROP POLICY IF EXISTS "Admins can view all companies" ON public.companies;
DROP POLICY IF EXISTS "Only admins can create companies" ON public.companies;

CREATE POLICY "Admins can update any company"
ON public.companies
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all companies"
ON public.companies
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can create companies"
ON public.companies
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update tenders policies
DROP POLICY IF EXISTS "Admins can update any tender" ON public.tenders;
DROP POLICY IF EXISTS "Admins can view all tenders" ON public.tenders;
DROP POLICY IF EXISTS "Only admins can create tenders" ON public.tenders;

CREATE POLICY "Admins can update any tender"
ON public.tenders
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all tenders"
ON public.tenders
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can create tenders"
ON public.tenders
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update scholarships policies
DROP POLICY IF EXISTS "Admins can update any scholarship" ON public.scholarships;
DROP POLICY IF EXISTS "Admins can view all scholarships" ON public.scholarships;
DROP POLICY IF EXISTS "Only admins can create scholarships" ON public.scholarships;

CREATE POLICY "Admins can update any scholarship"
ON public.scholarships
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all scholarships"
ON public.scholarships
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can create scholarships"
ON public.scholarships
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update documents policies
DROP POLICY IF EXISTS "Admins can update any document" ON public.documents;
DROP POLICY IF EXISTS "Admins can view all documents" ON public.documents;

CREATE POLICY "Admins can update any document"
ON public.documents
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all documents"
ON public.documents
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update job_applications policies
DROP POLICY IF EXISTS "Admins can update any job application" ON public.job_applications;
DROP POLICY IF EXISTS "Admins can view all job applications" ON public.job_applications;

CREATE POLICY "Admins can update any job application"
ON public.job_applications
FOR UPDATE
TO authenticated
USING ((auth.uid() IS NOT NULL) AND public.has_role(auth.uid(), 'admin'))
WITH CHECK ((auth.uid() IS NOT NULL) AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all job applications"
ON public.job_applications
FOR SELECT
TO authenticated
USING ((auth.uid() IS NOT NULL) AND public.has_role(auth.uid(), 'admin'));

-- Update tender_applications policies
DROP POLICY IF EXISTS "Admins can update tender applications" ON public.tender_applications;
DROP POLICY IF EXISTS "Admins can view all tender applications" ON public.tender_applications;

CREATE POLICY "Admins can update tender applications"
ON public.tender_applications
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all tender applications"
ON public.tender_applications
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Drop old is_admin function if it exists
DROP FUNCTION IF EXISTS public.is_admin(UUID);
DROP FUNCTION IF EXISTS public.get_current_user_role();

-- Remove role column from profiles (after data migration)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;