-- Fix the prevent_role_self_modification function to have explicit search_path
CREATE OR REPLACE FUNCTION public.prevent_role_self_modification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;