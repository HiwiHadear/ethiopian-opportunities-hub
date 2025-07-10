
import React, { useState } from 'react';
import { Shield, Users, Briefcase, FileText, Bell, Building2, Settings, Search, Filter, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import TenderManagement from '@/components/admin/TenderManagement';
import JobManagement from '@/components/admin/JobManagement';
import CompanyManagement from '@/components/admin/CompanyManagement';
import NotificationCenter from '@/components/admin/NotificationCenter';
import JobApplicationManagement from '@/components/admin/JobApplicationManagement';
import TenderApplicationManagement from '@/components/admin/TenderApplicationManagement';

const AdminDashboard = () => {
  const [stats] = useState({
    totalTenders: 125,
    totalJobs: 89,
    totalCompanies: 45,
    pendingApprovals: 12
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Admin Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="destructive" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tenders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTenders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Briefcase className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Companies</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCompanies}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bell className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="tenders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="tenders" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Tenders
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Companies
            </TabsTrigger>
            <TabsTrigger value="job-applications" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Job Apps
            </TabsTrigger>
            <TabsTrigger value="tender-applications" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Tender Apps
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tenders">
            <TenderManagement />
          </TabsContent>

          <TabsContent value="jobs">
            <JobManagement />
          </TabsContent>

          <TabsContent value="companies">
            <CompanyManagement />
          </TabsContent>

          <TabsContent value="job-applications">
            <JobApplicationManagement />
          </TabsContent>

          <TabsContent value="tender-applications">
            <TenderApplicationManagement />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationCenter />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
