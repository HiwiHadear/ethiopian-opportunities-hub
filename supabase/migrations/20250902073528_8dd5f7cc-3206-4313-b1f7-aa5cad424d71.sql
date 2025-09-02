-- Strengthen profiles table RLS policies to be more explicit
-- Drop existing policies and recreate with stronger security

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create more secure and explicit policies
CREATE POLICY "Authenticated users can view their own profile only"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles  
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "Authenticated users can update their own profile only"
ON public.profiles
FOR UPDATE  
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  -- Prevent users from changing their own role
  COALESCE(NEW.role, OLD.role) = OLD.role
);

CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated  
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
)
WITH CHECK (true);

-- Explicitly deny all access to anonymous users
CREATE POLICY "Deny anonymous access"
ON public.profiles
FOR ALL
TO anon
USING (false);

-- Add a comment for documentation
COMMENT ON TABLE public.profiles IS 'User profiles with email addresses - access restricted to authenticated users only (own profile) or admins (all profiles)';