-- Temporarily disable the role modification trigger
DROP TRIGGER IF EXISTS prevent_role_self_modification_trigger ON public.profiles;

-- Promote both users to admin
UPDATE public.profiles 
SET role = 'admin', updated_at = now() 
WHERE email IN ('zerai.gebresilassie@gmail.com', 'gss.zerai@gmail.com');

-- Re-enable the role modification trigger
CREATE TRIGGER prevent_role_self_modification_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_self_modification();