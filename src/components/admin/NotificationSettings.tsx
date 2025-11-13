import React, { useState, useEffect } from 'react';
import { Bell, Mail, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';

const NotificationSettings = () => {
  const { toast } = useToast();
  const { profile } = useProfile();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    emailOnNewApplication: true,
    digestFrequency: 'none' as 'none' | 'daily' | 'weekly',
    digestTime: '09:00:00',
  });

  useEffect(() => {
    if (profile?.id) {
      fetchPreferences();
    }
  }, [profile?.id]);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', profile?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setPreferences({
          emailOnNewApplication: data.email_on_new_application,
          digestFrequency: data.digest_frequency as 'none' | 'daily' | 'weekly',
          digestTime: data.digest_time,
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load notification preferences",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: profile?.id,
          email_on_new_application: preferences.emailOnNewApplication,
          digest_frequency: preferences.digestFrequency,
          digest_time: preferences.digestTime,
        });

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save notification preferences",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading preferences...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Notification Settings</h2>
        <p className="text-muted-foreground">Manage how you receive application notifications</p>
      </div>

      {/* Instant Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <CardTitle>Instant Notifications</CardTitle>
          </div>
          <CardDescription>
            Receive an email immediately when a new application is submitted
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="instant-notifications" className="cursor-pointer">
              Email me for each new application
            </Label>
            <Switch
              id="instant-notifications"
              checked={preferences.emailOnNewApplication}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, emailOnNewApplication: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Digest Emails */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            <CardTitle>Digest Emails</CardTitle>
          </div>
          <CardDescription>
            Receive a summary of all new applications on a regular schedule
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="digest-frequency">Frequency</Label>
            <Select 
              value={preferences.digestFrequency} 
              onValueChange={(value: 'none' | 'daily' | 'weekly') =>
                setPreferences(prev => ({ ...prev, digestFrequency: value }))
              }
            >
              <SelectTrigger id="digest-frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Disabled</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly (Monday)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {preferences.digestFrequency === 'daily' && 'You will receive a summary every day'}
              {preferences.digestFrequency === 'weekly' && 'You will receive a summary every Monday'}
              {preferences.digestFrequency === 'none' && 'Digest emails are disabled'}
            </p>
          </div>

          {preferences.digestFrequency !== 'none' && (
            <div className="space-y-2">
              <Label htmlFor="digest-time" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Delivery Time
              </Label>
              <Select 
                value={preferences.digestTime} 
                onValueChange={(value) =>
                  setPreferences(prev => ({ ...prev, digestTime: value }))
                }
              >
                <SelectTrigger id="digest-time">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="06:00:00">6:00 AM</SelectItem>
                  <SelectItem value="09:00:00">9:00 AM</SelectItem>
                  <SelectItem value="12:00:00">12:00 PM</SelectItem>
                  <SelectItem value="15:00:00">3:00 PM</SelectItem>
                  <SelectItem value="18:00:00">6:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Email Address</CardTitle>
          <CardDescription>
            Notifications will be sent to your account email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{profile?.email}</span>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={savePreferences} disabled={saving}>
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;
