-- Create a security definer function to get user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';

-- Drop all existing policies for profiles to recreate them properly
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Drop all existing policies for scholarships to recreate them properly
DROP POLICY IF EXISTS "Anyone can view approved scholarships" ON scholarships;
DROP POLICY IF EXISTS "Admins can view all scholarships" ON scholarships;
DROP POLICY IF EXISTS "Only admins can create scholarships" ON scholarships;
DROP POLICY IF EXISTS "Admins can update any scholarship" ON scholarships;

-- Recreate profiles policies properly using the security definer function
CREATE POLICY "Users can view their own profile" ON profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
FOR SELECT
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Users can update their own profile" ON profiles
FOR UPDATE
USING (auth.uid() = id);

-- Recreate scholarship policies using the security definer function
CREATE POLICY "Anyone can view approved scholarships" ON scholarships
FOR SELECT
USING (status = 'approved');

CREATE POLICY "Admins can view all scholarships" ON scholarships
FOR SELECT
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Only admins can create scholarships" ON scholarships
FOR INSERT
WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update any scholarship" ON scholarships
FOR UPDATE
USING (public.get_current_user_role() = 'admin');