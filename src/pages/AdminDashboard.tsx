
import React, { useState } from 'react';
import { 
  Shield, Users, Briefcase, FileText, Bell, Building2, Settings, Search, 
  BarChart3, Plus, Home, ChevronDown, LogOut, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import TenderManagement from '@/components/admin/TenderManagement';
import JobManagement from '@/components/admin/JobManagement';
import CompanyManagement from '@/components/admin/CompanyManagement';
import { ScholarshipManagement } from '@/components/admin/ScholarshipManagement';
import NotificationCenter from '@/components/admin/NotificationCenter';
import JobApplicationManagement from '@/components/admin/JobApplicationManagement';
import TenderApplicationManagement from '@/components/admin/TenderApplicationManagement';

// Navigation items for the sidebar
const navigationItems = [
  { title: 'Dashboard', value: 'dashboard', icon: Home },
  { title: 'Jobs', value: 'jobs', icon: Briefcase },
  { title: 'Tenders', value: 'tenders', icon: FileText },
  { title: 'Scholarships', value: 'scholarships', icon: Users },
  { title: 'Companies', value: 'companies', icon: Building2 },
  { title: 'Job Applications', value: 'job-applications', icon: FileText },
  { title: 'Tender Applications', value: 'tender-applications', icon: FileText },
  { title: 'Reports & Analytics', value: 'analytics', icon: BarChart3 },
  { title: 'Settings', value: 'settings', icon: Settings },
];

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [stats] = useState({
    totalTenders: 125,
    totalJobs: 89,
    totalCompanies: 45,
    pendingApprovals: 12,
    registeredUsers: 234,
    activeScholarships: 67
  });

  const DashboardOverview = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Jobs Posted</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalJobs}</p>
              </div>
              <Briefcase className="w-12 h-12 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Tenders</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalTenders}</p>
              </div>
              <FileText className="w-12 h-12 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Scholarships Available</p>
                <p className="text-3xl font-bold text-foreground">{stats.activeScholarships}</p>
              </div>
              <Users className="w-12 h-12 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Registered Users</p>
                <p className="text-3xl font-bold text-foreground">{stats.registeredUsers}</p>
              </div>
              <Users className="w-12 h-12 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Companies</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalCompanies}</p>
              </div>
              <Building2 className="w-12 h-12 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                <p className="text-3xl font-bold text-foreground">{stats.pendingApprovals}</p>
              </div>
              <Bell className="w-12 h-12 text-destructive/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-auto p-4 flex flex-col gap-2" onClick={() => setActiveView('jobs')}>
              <Plus className="w-6 h-6" />
              <span>Add Job</span>
            </Button>
            <Button className="h-auto p-4 flex flex-col gap-2" onClick={() => setActiveView('tenders')}>
              <Plus className="w-6 h-6" />
              <span>Add Tender</span>
            </Button>
            <Button className="h-auto p-4 flex flex-col gap-2" onClick={() => setActiveView('scholarships')}>
              <Plus className="w-6 h-6" />
              <span>Add Scholarship</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <Briefcase className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">New job posted: Software Developer</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <FileText className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Tender application received</p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <Users className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">New user registered</p>
                <p className="text-xs text-muted-foreground">6 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'jobs':
        return <JobManagement />;
      case 'tenders':
        return <TenderManagement />;
      case 'companies':
        return <CompanyManagement />;
      case 'scholarships':
        return <ScholarshipManagement />;
      case 'job-applications':
        return <JobApplicationManagement />;
      case 'tender-applications':
        return <TenderApplicationManagement />;
      case 'notifications':
        return <NotificationCenter />;
      case 'analytics':
        return (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Reports & Analytics</h3>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <p className="text-muted-foreground">Admin settings coming soon...</p>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <Sidebar className="border-r">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Admin Panel</span>
            </div>
          </div>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.value}>
                      <SidebarMenuButton
                        onClick={() => setActiveView(item.value)}
                        isActive={activeView === item.value}
                        className="w-full justify-start"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation Bar */}
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 gap-4">
              <SidebarTrigger />
              
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search across content..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                    3
                  </Badge>
                </Button>

                {/* Admin Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Admin</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
