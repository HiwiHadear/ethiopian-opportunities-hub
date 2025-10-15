import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

interface UserRole {
  role: 'admin' | 'moderator' | 'user';
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'moderator' | 'user'>('user');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setUserRole('user');
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        setProfile(profileData);

        // Fetch user role from user_roles table
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .order('role', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (roleError && roleError.code !== 'PGRST116') {
          throw roleError;
        }

        setUserRole(roleData?.role || 'user');
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  return { 
    profile, 
    loading, 
    error, 
    role: userRole,
    isAdmin: userRole === 'admin',
    isModerator: userRole === 'moderator'
  };
}