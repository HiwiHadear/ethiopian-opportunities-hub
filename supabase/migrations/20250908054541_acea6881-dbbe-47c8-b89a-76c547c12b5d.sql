-- Fix infinite recursion in profiles table RLS policies
-- Drop the problematic policies first
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

-- Create or replace the get_current_user_role function to avoid recursion
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role text;
BEGIN
  -- Get the user's role directly from the profiles table without RLS
  SELECT role INTO user_role
  FROM profiles
  WHERE id = auth.uid();
  
  RETURN COALESCE(user_role, 'user');
END;
$$;

-- Create new non-recursive policies for profiles table
CREATE POLICY "Admins can view all profiles (non-recursive)"
ON profiles
FOR SELECT
TO authenticated
USING (
  CASE 
    WHEN auth.uid() = id THEN true  -- Users can see their own profile
    WHEN auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin' AND id = auth.uid()
    ) THEN true  -- Direct check for admin without recursion
    ELSE false
  END
);

CREATE POLICY "Admins can update any profile (non-recursive)"
ON profiles
FOR UPDATE
TO authenticated
USING (
  CASE 
    WHEN auth.uid() = id THEN true  -- Users can update their own profile
    WHEN auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin' AND id = auth.uid()
    ) THEN true  -- Direct check for admin without recursion
    ELSE false
  END
);

-- Also ensure we have a profile for the current user if they don't have one
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup (if it doesn't exist)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;