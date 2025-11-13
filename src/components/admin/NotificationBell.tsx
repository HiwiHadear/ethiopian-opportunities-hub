import React, { useState, useEffect } from 'react';
import { Bell, Briefcase, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'job' | 'tender';
  title: string;
  applicantName: string;
  timestamp: string;
  read: boolean;
}

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Fetch recent notifications on mount
    fetchRecentNotifications();

    // Set up real-time subscription for job applications
    const jobChannel = supabase
      .channel('job-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'job_applications'
        },
        async (payload) => {
          console.log('New job application received:', payload);
          
          // Fetch job details
          const { data: jobData } = await supabase
            .from('jobs')
            .select('title')
            .eq('id', payload.new.job_id)
            .single();

          if (jobData) {
            const newNotification: Notification = {
              id: payload.new.id,
              type: 'job',
              title: jobData.title,
              applicantName: payload.new.full_name || payload.new.email,
              timestamp: payload.new.applied_at,
              read: false,
            };

            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Trigger email notification
            fetch('https://qzjfbqirbxsqdwcbpsst.supabase.co/functions/v1/send-application-notification', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                applicationType: 'job',
                applicationId: payload.new.id,
                applicantName: payload.new.full_name || payload.new.email,
                title: jobData.title,
                appliedAt: payload.new.applied_at,
              }),
            }).catch(err => console.error('Failed to send notification:', err));
          }
        }
      )
      .subscribe();

    // Set up real-time subscription for tender applications
    const tenderChannel = supabase
      .channel('tender-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tender_applications'
        },
        async (payload) => {
          console.log('New tender application received:', payload);
          
          // Fetch tender details
          const { data: tenderData } = await supabase
            .from('tenders')
            .select('title')
            .eq('id', payload.new.tender_id)
            .single();

          if (tenderData) {
            const newNotification: Notification = {
              id: payload.new.id,
              type: 'tender',
              title: tenderData.title,
              applicantName: payload.new.company_name || payload.new.company_email,
              timestamp: payload.new.applied_at,
              read: false,
            };

            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Trigger email notification
            fetch('https://qzjfbqirbxsqdwcbpsst.supabase.co/functions/v1/send-application-notification', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                applicationType: 'tender',
                applicationId: payload.new.id,
                applicantName: payload.new.company_name || payload.new.company_email,
                title: tenderData.title,
                appliedAt: payload.new.applied_at,
              }),
            }).catch(err => console.error('Failed to send notification:', err));
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(jobChannel);
      supabase.removeChannel(tenderChannel);
    };
  }, []);

  const fetchRecentNotifications = async () => {
    try {
      // Fetch recent job applications
      const { data: jobApps } = await supabase
        .from('job_applications')
        .select(`
          id,
          full_name,
          email,
          applied_at,
          jobs (
            title
          )
        `)
        .order('applied_at', { ascending: false })
        .limit(10);

      // Fetch recent tender applications
      const { data: tenderApps } = await supabase
        .from('tender_applications')
        .select(`
          id,
          company_name,
          company_email,
          applied_at,
          tenders (
            title
          )
        `)
        .order('applied_at', { ascending: false })
        .limit(10);

      const jobNotifications: Notification[] = (jobApps || []).map(app => ({
        id: app.id,
        type: 'job' as const,
        title: app.jobs?.title || 'Unknown Job',
        applicantName: app.full_name || app.email,
        timestamp: app.applied_at,
        read: false,
      }));

      const tenderNotifications: Notification[] = (tenderApps || []).map(app => ({
        id: app.id,
        type: 'tender' as const,
        title: app.tenders?.title || 'Unknown Tender',
        applicantName: app.company_name || app.company_email,
        timestamp: app.applied_at,
        read: false,
      }));

      // Combine and sort by timestamp
      const allNotifications = [...jobNotifications, ...tenderNotifications]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 20);

      setNotifications(allNotifications);
      setUnreadCount(allNotifications.length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-96 p-0 bg-card z-50"
        sideOffset={8}
      >
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs h-auto py-1"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-[400px] bg-card">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <Bell className="w-12 h-12 mb-2 opacity-20" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer group ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      notification.type === 'job' 
                        ? 'bg-primary/10' 
                        : 'bg-secondary/10'
                    }`}>
                      {notification.type === 'job' ? (
                        <Briefcase className="w-4 h-4 text-primary" />
                      ) : (
                        <FileText className="w-4 h-4 text-secondary" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground mb-1">
                        New {notification.type === 'job' ? 'Job' : 'Tender'} Application
                      </p>
                      <p className="text-sm text-muted-foreground mb-1 truncate">
                        <span className="font-medium text-foreground">{notification.applicantName}</span>
                        {' '}applied for{' '}
                        <span className="font-medium text-foreground">{notification.title}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearNotification(notification.id);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>

                  {!notification.read && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
