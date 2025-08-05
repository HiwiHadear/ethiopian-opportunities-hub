-- Create a security definer function to get user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop existing problematic policies if they exist
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all scholarships" ON scholarships;
DROP POLICY IF EXISTS "Admins can update any scholarship" ON scholarships;
DROP POLICY IF EXISTS "Only admins can create scholarships" ON scholarships;

-- Recreate profiles policies properly
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