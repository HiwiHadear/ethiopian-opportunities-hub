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

CREATE POLICY "Authenticated users can update their own profile (no role changes)"
ON public.profiles
FOR UPDATE  
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated  
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- Explicitly deny all access to anonymous users
CREATE POLICY "Deny anonymous access"
ON public.profiles
FOR ALL
TO anon
USING (false);

-- Create a function to prevent regular users from changing their own role
CREATE OR REPLACE FUNCTION public.prevent_role_self_modification()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow admins to change any role
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RETURN NEW;
  END IF;
  
  -- Prevent non-admins from changing roles
  IF OLD.role != NEW.role THEN
    RAISE EXCEPTION 'Only administrators can modify user roles';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to enforce role modification rules
CREATE TRIGGER prevent_role_self_modification_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_self_modification();

-- Add a comment for documentation
COMMENT ON TABLE public.profiles IS 'User profiles with email addresses - access restricted to authenticated users only (own profile) or admins (all profiles)';