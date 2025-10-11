-- Create a security definer function to check if a user is an admin
-- This prevents infinite recursion by bypassing RLS when checking roles
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = 'admin'
  )
$$;

-- Drop the problematic recursive policies
DROP POLICY IF EXISTS "Admins can view all profiles (non-recursive)" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile (non-recursive)" ON public.profiles;

-- Create new non-recursive policies using the security definer function
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = id OR public.is_admin(auth.uid())
);

CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() = id OR public.is_admin(auth.uid())
)
WITH CHECK (
  auth.uid() = id OR public.is_admin(auth.uid())
);