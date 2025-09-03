-- Promote the first user to admin
SELECT public.create_first_admin('zerai.gebresilassie@gmail.com');

-- Also promote the second user to admin  
UPDATE public.profiles 
SET role = 'admin', updated_at = now() 
WHERE email = 'gss.zerai@gmail.com';