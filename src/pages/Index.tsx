
import React from 'react';
import { Search, MapPin, Calendar, Building, Briefcase, FileText, Bell, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Index = () => {
  console.log('Index component is rendering');
  
  const featuredTenders = [
    {
      id: 1,
      title: "Construction of New Government Office Building",
      organization: "Ministry of Urban Development",
      budget: "50,000,000 ETB",
      deadline: "2024-07-15",
      sector: "Construction",
      region: "Addis Ababa"
    },
    {
      id: 2,
      title: "IT Infrastructure Development Project",
      organization: "Ethiopian Electric Utility",
      budget: "25,000,000 ETB",
      deadline: "2024-07-20",
      sector: "IT",
      region: "Dire Dawa"
    },
    {
      id: 3,
      title: "Agricultural Equipment Supply",
      organization: "Ministry of Agriculture",
      budget: "15,000,000 ETB",
      deadline: "2024-07-25",
      sector: "Agriculture",
      region: "Hawassa"
    }
  ];

  const latestJobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "Ethiopian Airlines",
      location: "Addis Ababa",
      salary: "35,000 - 45,000 ETB",
      type: "Full-time",
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "Project Manager",
      company: "Commercial Bank of Ethiopia",
      location: "Addis Ababa",
      salary: "40,000 - 55,000 ETB",
      type: "Full-time",
      posted: "1 day ago"
    },
    {
      id: 3,
      title: "Marketing Specialist",
      company: "Ethio Telecom",
      location: "Bahir Dar",
      salary: "25,000 - 35,000 ETB",
      type: "Full-time",
      posted: "3 days ago"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TenderJob Portal</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Tenders</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Jobs</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Companies</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">News</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="outline" className="hidden sm:flex">
                <Bell className="w-4 h-4 mr-2" />
                Alerts
              </Button>
              <Button>Sign In</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find <span className="text-blue-600">Tenders</span> & <span className="text-indigo-600">Jobs</span>
            <br />in Ethiopia
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Your comprehensive platform for government tenders, private sector opportunities, and career advancement in Ethiopia.
          </p>

          {/* Search Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input 
                    placeholder="Search tenders, jobs, or companies..." 
                    className="pl-10 h-12 text-lg"
                  />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-48 h-12">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="tenders">Tenders</SelectItem>
                  <SelectItem value="jobs">Jobs</SelectItem>
                  <SelectItem value="companies">Companies</SelectItem>
                </SelectContent>
              </Select>
              <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700">
                Search
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2,500+</div>
              <div className="text-gray-600">Active Tenders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">8,200+</div>
              <div className="text-gray-600">Job Listings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">1,200+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">50,000+</div>
              <div className="text-gray-600">Registered Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Latest Tenders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Latest Tenders
                </CardTitle>
                <Button variant="outline" size="sm">View All</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {featuredTenders.map((tender) => (
                  <div key={tender.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{tender.title}</h3>
                      <Badge variant="secondary">{tender.sector}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{tender.organization}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {tender.region}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Deadline: {tender.deadline}
                      </span>
                      <span className="font-semibold text-green-600">
                        Budget: {tender.budget}
                      </span>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      View Details
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Latest Jobs */}
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />
                  Latest Jobs
                </CardTitle>
                <Button variant="outline" size="sm">View All</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {latestJobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
                      <Badge variant="outline">{job.type}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{job.company}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="font-semibold text-green-600">
                        {job.salary}
                      </span>
                      <span>{job.posted}</span>
                    </div>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                      Apply Now
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Companies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2 text-purple-600" />
                  Featured Companies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-2xl">🛫</div>
                  <div>
                    <div className="font-medium text-gray-900">Ethiopian Airlines</div>
                    <div className="text-sm text-gray-500">Aviation</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-2xl">🏦</div>
                  <div>
                    <div className="font-medium text-gray-900">Commercial Bank of Ethiopia</div>
                    <div className="text-sm text-gray-500">Banking</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-2xl">📱</div>
                  <div>
                    <div className="font-medium text-gray-900">Ethio Telecom</div>
                    <div className="text-sm text-gray-500">Telecommunications</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <div className="font-medium text-gray-900">Ethiopian Electric Utility</div>
                    <div className="text-sm text-gray-500">Energy</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* News & Announcements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  News & Announcements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-3">
                  <h4 className="font-medium text-gray-900 text-sm">New Government Procurement Guidelines Released</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">June 14, 2024</span>
                    <Badge variant="outline" className="text-xs">Policy</Badge>
                  </div>
                </div>
                <div className="border-l-4 border-blue-500 pl-3">
                  <h4 className="font-medium text-gray-900 text-sm">Major Infrastructure Tenders Opening This Month</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">June 12, 2024</span>
                    <Badge variant="outline" className="text-xs">Tenders</Badge>
                  </div>
                </div>
                <div className="border-l-4 border-blue-500 pl-3">
                  <h4 className="font-medium text-gray-900 text-sm">Job Market Growth in Tech Sector</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">June 10, 2024</span>
                    <Badge variant="outline" className="text-xs">Jobs</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Register as Company
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Post a Tender
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Post a Job
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Bell className="w-4 h-4 mr-2" />
                  Set Up Alerts
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">TenderJob Portal</span>
              </div>
              <p className="text-gray-400">
                Your trusted platform for tenders and jobs in Ethiopia.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Job Seekers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Create Profile</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Upload CV</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Job Alerts</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Companies</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Post Tenders</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Post Jobs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Find Candidates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Company Profile</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 TenderJob Portal. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400">🇪🇹 English</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-400 cursor-pointer hover:text-white transition-colors">አማርኛ</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
