-- Function to promote a user to admin (only callable by existing admins)
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the calling user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can promote users to admin';
  END IF;
  
  -- Update the target user's role to admin
  UPDATE public.profiles
  SET role = 'admin', updated_at = now()
  WHERE id = target_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

-- Function to demote an admin to regular user (only callable by admins)
CREATE OR REPLACE FUNCTION public.demote_admin_to_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the calling user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can demote other admins';
  END IF;
  
  -- Prevent self-demotion (optional safety measure)
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot demote yourself';
  END IF;
  
  -- Update the target user's role to user
  UPDATE public.profiles
  SET role = 'user', updated_at = now()
  WHERE id = target_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

-- Function to create the first admin user (can only be called once)
CREATE OR REPLACE FUNCTION public.create_first_admin(admin_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if any admin exists
  IF EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin') THEN
    RAISE EXCEPTION 'Admin users already exist. Use promote_user_to_admin function instead.';
  END IF;
  
  -- Update the user with matching email to admin
  UPDATE public.profiles
  SET role = 'admin', updated_at = now()
  WHERE email = admin_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No user found with email: %', admin_email;
  END IF;
END;
$$;

-- Add RLS policy to allow admins to update profiles (for role management)
CREATE POLICY "Admins can update any profile" ON public.profiles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);