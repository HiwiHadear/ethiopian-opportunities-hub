import React, { useState } from 'react';
import { Search, MapPin, Calendar, Building, Briefcase, FileText, Bell, Users, TrendingUp, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PostTenderDialog from '@/components/PostTenderDialog';
import PostJobDialog from '@/components/PostJobDialog';
import PostCompanyDialog from '@/components/PostCompanyDialog';
import PostNewsDialog from '@/components/PostNewsDialog';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  console.log('Index component is rendering with editable samples and post options');
  
  const { toast } = useToast();
  
  const [featuredTenders, setFeaturedTenders] = useState([
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
  ]);

  const [latestJobs, setLatestJobs] = useState([
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
  ]);

  const [featuredCompanies, setFeaturedCompanies] = useState([
    { id: 1, name: "Ethiopian Airlines", sector: "Aviation", emoji: "🛫" },
    { id: 2, name: "Commercial Bank of Ethiopia", sector: "Banking", emoji: "🏦" },
    { id: 3, name: "Ethio Telecom", sector: "Telecommunications", emoji: "📱" },
    { id: 4, name: "Ethiopian Electric Utility", sector: "Energy", emoji: "⚡" }
  ]);

  const [newsItems, setNewsItems] = useState([
    {
      id: 1,
      title: "New Government Procurement Guidelines Released",
      date: "June 14, 2024",
      category: "Policy"
    },
    {
      id: 2,
      title: "Major Infrastructure Tenders Opening This Month",
      date: "June 12, 2024",
      category: "Tenders"
    },
    {
      id: 3,
      title: "Job Market Growth in Tech Sector",
      date: "June 10, 2024",
      category: "Jobs"
    }
  ]);

  const [editingTender, setEditingTender] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);
  const [editingNews, setEditingNews] = useState(null);
  
  const [selectedTender, setSelectedTender] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [tenderDetailsOpen, setTenderDetailsOpen] = useState(false);
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);

  const handleEditTender = (tenderId) => {
    setEditingTender(tenderId);
  };

  const handleSaveTender = (tenderId, updatedTender) => {
    setFeaturedTenders(prev => 
      prev.map(tender => 
        tender.id === tenderId ? { ...tender, ...updatedTender } : tender
      )
    );
    setEditingTender(null);
  };

  const handleEditJob = (jobId) => {
    setEditingJob(jobId);
  };

  const handleSaveJob = (jobId, updatedJob) => {
    setLatestJobs(prev => 
      prev.map(job => 
        job.id === jobId ? { ...job, ...updatedJob } : job
      )
    );
    setEditingJob(null);
  };

  const handleEditCompany = (companyId) => {
    setEditingCompany(companyId);
  };

  const handleSaveCompany = (companyId, updatedCompany) => {
    setFeaturedCompanies(prev => 
      prev.map(company => 
        company.id === companyId ? { ...company, ...updatedCompany } : company
      )
    );
    setEditingCompany(null);
  };

  const handleEditNews = (newsId) => {
    setEditingNews(newsId);
  };

  const handleSaveNews = (newsId, updatedNews) => {
    setNewsItems(prev => 
      prev.map(news => 
        news.id === newsId ? { ...news, ...updatedNews } : news
      )
    );
    setEditingNews(null);
  };

  const handleAddTender = (newTender) => {
    setFeaturedTenders(prev => [newTender, ...prev]);
  };

  const handleAddJob = (newJob) => {
    setLatestJobs(prev => [newJob, ...prev]);
  };

  const handleAddCompany = (newCompany) => {
    setFeaturedCompanies(prev => [...prev, newCompany]);
  };

  const handleAddNews = (newNews) => {
    setNewsItems(prev => [newNews, ...prev]);
  };

  const handleViewTenderDetails = (tender) => {
    setSelectedTender(tender);
    setTenderDetailsOpen(true);
  };

  const handleApplyToJob = (job) => {
    setSelectedJob(job);
    setJobDetailsOpen(true);
  };

  const handleJobApplication = () => {
    toast({
      title: "Application Submitted!",
      description: `Your application for ${selectedJob?.title} at ${selectedJob?.company} has been submitted successfully.`,
    });
    setJobDetailsOpen(false);
    setSelectedJob(null);
  };

  const EditableTenderCard = ({ tender }) => {
    const [editData, setEditData] = useState(tender);
    const isEditing = editingTender === tender.id;

    if (isEditing) {
      return (
        <div className="border rounded-lg p-4 bg-blue-50">
          <div className="space-y-3">
            <Input
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="Tender Title"
            />
            <Input
              value={editData.organization}
              onChange={(e) => setEditData({ ...editData, organization: e.target.value })}
              placeholder="Organization"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={editData.budget}
                onChange={(e) => setEditData({ ...editData, budget: e.target.value })}
                placeholder="Budget"
              />
              <Input
                value={editData.sector}
                onChange={(e) => setEditData({ ...editData, sector: e.target.value })}
                placeholder="Sector"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={editData.region}
                onChange={(e) => setEditData({ ...editData, region: e.target.value })}
                placeholder="Region"
              />
              <Input
                type="date"
                value={editData.deadline}
                onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleSaveTender(tender.id, editData)}>
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditingTender(null)}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900">{tender.title}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{tender.sector}</Badge>
            <Button size="sm" variant="ghost" onClick={() => handleEditTender(tender.id)}>
              <Edit className="w-4 h-4" />
            </Button>
          </div>
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
        <Button 
          size="sm" 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => handleViewTenderDetails(tender)}
        >
          View Details
        </Button>
      </div>
    );
  };

  const EditableJobCard = ({ job }) => {
    const [editData, setEditData] = useState(job);
    const isEditing = editingJob === job.id;

    if (isEditing) {
      return (
        <div className="border rounded-lg p-4 bg-indigo-50">
          <div className="space-y-3">
            <Input
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="Job Title"
            />
            <Input
              value={editData.company}
              onChange={(e) => setEditData({ ...editData, company: e.target.value })}
              placeholder="Company"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={editData.location}
                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                placeholder="Location"
              />
              <Input
                value={editData.type}
                onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                placeholder="Job Type"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={editData.salary}
                onChange={(e) => setEditData({ ...editData, salary: e.target.value })}
                placeholder="Salary Range"
              />
              <Input
                value={editData.posted}
                onChange={(e) => setEditData({ ...editData, posted: e.target.value })}
                placeholder="Posted"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleSaveJob(job.id, editData)}>
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditingJob(null)}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{job.type}</Badge>
            <Button size="sm" variant="ghost" onClick={() => handleEditJob(job.id)}>
              <Edit className="w-4 h-4" />
            </Button>
          </div>
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
        <Button 
          size="sm" 
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => handleApplyToJob(job)}
        >
          Apply Now
        </Button>
      </div>
    );
  };

  const EditableCompanyItem = ({ company }) => {
    const [editData, setEditData] = useState(company);
    const isEditing = editingCompany === company.id;

    if (isEditing) {
      return (
        <div className="p-3 rounded-lg bg-purple-50 border">
          <div className="space-y-2">
            <Input
              value={editData.emoji}
              onChange={(e) => setEditData({ ...editData, emoji: e.target.value })}
              placeholder="Emoji"
              className="w-20"
            />
            <Input
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              placeholder="Company Name"
            />
            <Input
              value={editData.sector}
              onChange={(e) => setEditData({ ...editData, sector: e.target.value })}
              placeholder="Sector"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleSaveCompany(company.id, editData)}>
                <Save className="w-3 h-3 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditingCompany(null)}>
                <X className="w-3 h-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{company.emoji}</div>
          <div>
            <div className="font-medium text-gray-900">{company.name}</div>
            <div className="text-sm text-gray-500">{company.sector}</div>
          </div>
        </div>
        <Button size="sm" variant="ghost" onClick={() => handleEditCompany(company.id)}>
          <Edit className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  const EditableNewsItem = ({ news }) => {
    const [editData, setEditData] = useState(news);
    const isEditing = editingNews === news.id;

    if (isEditing) {
      return (
        <div className="border-l-4 border-blue-500 pl-3 bg-blue-50 p-3 rounded">
          <div className="space-y-2">
            <Textarea
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="News Title"
              className="min-h-[60px]"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={editData.date}
                onChange={(e) => setEditData({ ...editData, date: e.target.value })}
              />
              <Input
                value={editData.category}
                onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                placeholder="Category"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleSaveNews(news.id, editData)}>
                <Save className="w-3 h-3 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditingNews(null)}>
                <X className="w-3 h-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="border-l-4 border-blue-500 pl-3 group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 text-sm">{news.title}</h4>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-500">{news.date}</span>
              <Badge variant="outline" className="text-xs">{news.category}</Badge>
            </div>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
            onClick={() => handleEditNews(news.id)}
          >
            <Edit className="w-3 h-3" />
          </Button>
        </div>
      </div>
    );
  };

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
              <PostTenderDialog onSubmit={handleAddTender} />
              <PostJobDialog onSubmit={handleAddJob} />
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
                  Latest Tenders (Editable)
                </CardTitle>
                <div className="flex gap-2">
                  <PostTenderDialog onSubmit={handleAddTender} />
                  <Button variant="outline" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {featuredTenders.map((tender) => (
                  <EditableTenderCard key={tender.id} tender={tender} />
                ))}
              </CardContent>
            </Card>

            {/* Latest Jobs */}
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />
                  Latest Jobs (Editable)
                </CardTitle>
                <div className="flex gap-2">
                  <PostJobDialog onSubmit={handleAddJob} />
                  <Button variant="outline" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {latestJobs.map((job) => (
                  <EditableJobCard key={job.id} job={job} />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Companies */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2 text-purple-600" />
                  Featured Companies (Editable)
                </CardTitle>
                <PostCompanyDialog onSubmit={handleAddCompany} />
              </CardHeader>
              <CardContent className="space-y-3">
                {featuredCompanies.map((company) => (
                  <EditableCompanyItem key={company.id} company={company} />
                ))}
              </CardContent>
            </Card>

            {/* News & Announcements */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  News & Announcements (Editable)
                </CardTitle>
                <PostNewsDialog onSubmit={handleAddNews} />
              </CardHeader>
              <CardContent className="space-y-3">
                {newsItems.map((news) => (
                  <EditableNewsItem key={news.id} news={news} />
                ))}
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
                <PostTenderDialog onSubmit={handleAddTender}>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Post a Tender
                  </Button>
                </PostTenderDialog>
                <PostJobDialog onSubmit={handleAddJob}>
                  <Button className="w-full justify-start" variant="outline">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Post a Job
                  </Button>
                </PostJobDialog>
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

      {/* Tender Details Modal */}
      <Dialog open={tenderDetailsOpen} onOpenChange={setTenderDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tender Details</DialogTitle>
          </DialogHeader>
          {selectedTender && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedTender.title}
                </h3>
                <p className="text-gray-600">{selectedTender.organization}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sector
                  </label>
                  <p className="text-gray-900">{selectedTender.sector}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Region
                  </label>
                  <p className="text-gray-900">{selectedTender.region}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget
                  </label>
                  <p className="text-green-600 font-semibold">{selectedTender.budget}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline
                  </label>
                  <p className="text-red-600 font-medium">{selectedTender.deadline}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                  This is a detailed description of the tender requirements. 
                  Please review all specifications and submit your proposal accordingly.
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Download Tender Document
                </Button>
                <Button variant="outline">
                  Save for Later
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Job Application Modal */}
      <Dialog open={jobDetailsOpen} onOpenChange={setJobDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Apply for Job</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedJob.title}
                </h3>
                <p className="text-gray-600">{selectedJob.company}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <p className="text-gray-900">{selectedJob.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type
                  </label>
                  <p className="text-gray-900">{selectedJob.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Range
                  </label>
                  <p className="text-green-600 font-semibold">{selectedJob.salary}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Posted
                  </label>
                  <p className="text-gray-600">{selectedJob.posted}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                  We are looking for a qualified candidate to join our team. 
                  This position offers excellent growth opportunities and competitive benefits.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <Textarea
                  placeholder="Write a brief cover letter explaining why you're interested in this position..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleJobApplication}
                >
                  Submit Application
                </Button>
                <Button variant="outline" onClick={() => setJobDetailsOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
