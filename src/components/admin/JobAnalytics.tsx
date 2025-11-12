import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Briefcase, CheckCircle, Clock } from 'lucide-react';

interface ApplicationTrend {
  date: string;
  applications: number;
}

interface PopularJob {
  title: string;
  company: string;
  applications: number;
}

interface StatusDistribution {
  name: string;
  value: number;
}

const JobAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [applicationTrends, setApplicationTrends] = useState<ApplicationTrend[]>([]);
  const [popularJobs, setPopularJobs] = useState<PopularJob[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<StatusDistribution[]>([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    acceptedApplications: 0,
    pendingApplications: 0,
    successRate: 0,
  });

  useEffect(() => {
    fetchAnalyticsData();

    // Set up real-time subscription for job applications
    const channel = supabase
      .channel('analytics-applications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_applications'
        },
        () => {
          console.log('Analytics: Job application change detected, refreshing data...');
          fetchAnalyticsData();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Fetch all job applications with job details
      const { data: applications, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs (
            id,
            title,
            company
          )
        `)
        .order('applied_at', { ascending: true });

      if (error) throw error;

      if (applications) {
        // Calculate application trends by date
        const trendMap = new Map<string, number>();
        applications.forEach((app) => {
          const date = new Date(app.applied_at).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          });
          trendMap.set(date, (trendMap.get(date) || 0) + 1);
        });
        
        const trends = Array.from(trendMap.entries())
          .map(([date, applications]) => ({ date, applications }))
          .slice(-14); // Last 14 days

        setApplicationTrends(trends);

        // Calculate most popular jobs
        const jobMap = new Map<string, { title: string; company: string; count: number }>();
        applications.forEach((app) => {
          if (app.jobs) {
            const key = app.jobs.id;
            const existing = jobMap.get(key);
            if (existing) {
              existing.count++;
            } else {
              jobMap.set(key, {
                title: app.jobs.title,
                company: app.jobs.company,
                count: 1,
              });
            }
          }
        });

        const popular = Array.from(jobMap.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 8)
          .map((job) => ({
            title: job.title.length > 25 ? job.title.substring(0, 25) + '...' : job.title,
            company: job.company,
            applications: job.count,
          }));

        setPopularJobs(popular);

        // Calculate status distribution
        const statusMap = new Map<string, number>();
        applications.forEach((app) => {
          statusMap.set(app.status, (statusMap.get(app.status) || 0) + 1);
        });

        const distribution = Array.from(statusMap.entries()).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
        }));

        setStatusDistribution(distribution);

        // Calculate stats
        const total = applications.length;
        const accepted = applications.filter((app) => app.status === 'accepted').length;
        const pending = applications.filter((app) => app.status === 'pending').length;
        const successRate = total > 0 ? Math.round((accepted / total) * 100) : 0;

        setStats({
          totalApplications: total,
          acceptedApplications: accepted,
          pendingApplications: pending,
          successRate,
        });
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Job Analytics & Reports</h1>
        <p className="text-muted-foreground">Track application trends and success metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalApplications}</p>
              </div>
              <Briefcase className="w-12 h-12 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                <p className="text-3xl font-bold text-foreground">{stats.acceptedApplications}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500/60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-3xl font-bold text-foreground">{stats.pendingApplications}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-500/60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-3xl font-bold text-foreground">{stats.successRate}%</p>
              </div>
              <TrendingUp className="w-12 h-12 text-primary/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Application Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Application Trends (Last 14 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={applicationTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="applications" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
                name="Applications"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Popular Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Most Popular Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={popularJobs} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  type="category" 
                  dataKey="title" 
                  width={150}
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '11px' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar 
                  dataKey="applications" 
                  fill="hsl(var(--primary))" 
                  radius={[0, 4, 4, 0]}
                  name="Applications"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Application Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Application Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              {statusDistribution.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Rate by Job */}
      {popularJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularJobs.slice(0, 5).map((job, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.company}</p>
                  </div>
                  <Badge variant="secondary" className="ml-4">
                    {job.applications} applications
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobAnalytics;
