
import React, { useState } from 'react';
import { Search, Building2, MapPin, Users, Eye, Edit, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PostCompanyDialog from '@/components/PostCompanyDialog';

const Companies = () => {
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "Ethiopian Airlines",
      industry: "Aviation",
      location: "Addis Ababa, Ethiopia",
      employees: "15,000+",
      description: "Ethiopia's flag carrier and largest airline, serving destinations across Africa, Asia, Europe, and the Americas.",
      verified: true,
      activeJobs: 12,
      activeTenders: 3
    },
    {
      id: 2,
      name: "Commercial Bank of Ethiopia",
      industry: "Banking & Finance",
      location: "Addis Ababa, Ethiopia",
      employees: "40,000+",
      description: "The largest commercial bank in Ethiopia, providing comprehensive banking services nationwide.",
      verified: true,
      activeJobs: 25,
      activeTenders: 8
    },
    {
      id: 3,
      name: "Ethio Telecom",
      industry: "Telecommunications",
      location: "Addis Ababa, Ethiopia",
      employees: "20,000+",
      description: "Leading telecommunications service provider in Ethiopia, offering mobile, internet, and digital services.",
      verified: true,
      activeJobs: 18,
      activeTenders: 5
    },
    {
      id: 4,
      name: "Ethiopian Electric Power",
      industry: "Energy & Utilities",
      location: "Addis Ababa, Ethiopia",
      employees: "25,000+",
      description: "State-owned electric utility company responsible for electricity generation, transmission, and distribution.",
      verified: false,
      activeJobs: 8,
      activeTenders: 12
    },
    {
      id: 5,
      name: "Dashen Bank",
      industry: "Banking & Finance",
      location: "Addis Ababa, Ethiopia",
      employees: "8,000+",
      description: "One of Ethiopia's leading private banks offering innovative banking solutions and services.",
      verified: true,
      activeJobs: 15,
      activeTenders: 2
    }
  ]);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyDetailsOpen, setCompanyDetailsOpen] = useState(false);

  const handleViewCompanyDetails = (company) => {
    setSelectedCompany(company);
    setCompanyDetailsOpen(true);
  };

  const handleAddCompany = (newCompany) => {
    setCompanies(prev => [newCompany, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TenderJob Portal</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-green-600 transition-colors">Home</Link>
              <Link to="/tenders" className="text-gray-700 hover:text-green-600 transition-colors">Tenders</Link>
              <Link to="/jobs" className="text-gray-700 hover:text-green-600 transition-colors">Jobs</Link>
              <Link to="/news" className="text-gray-700 hover:text-green-600 transition-colors">News</Link>
              <Link to="/companies" className="text-green-600 font-medium">Companies</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <PostCompanyDialog onSubmit={handleAddCompany} />
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Companies Directory</h1>
          <p className="text-gray-600">Discover leading companies and organizations across Ethiopia</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input 
                    placeholder="Search companies..." 
                    className="pl-10"
                  />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="aviation">Aviation</SelectItem>
                  <SelectItem value="banking">Banking & Finance</SelectItem>
                  <SelectItem value="telecom">Telecommunications</SelectItem>
                  <SelectItem value="energy">Energy & Utilities</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="addis-ababa">Addis Ababa</SelectItem>
                  <SelectItem value="dire-dawa">Dire Dawa</SelectItem>
                  <SelectItem value="mekelle">Mekelle</SelectItem>
                  <SelectItem value="bahir-dar">Bahir Dar</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-green-600 hover:bg-green-700">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {company.location}
                      </div>
                    </div>
                  </div>
                  {company.verified && (
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Badge variant="secondary">{company.industry}</Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {company.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {company.employees}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-blue-50 p-2 rounded text-center">
                      <div className="font-semibold text-blue-600">{company.activeJobs}</div>
                      <div className="text-blue-700">Active Jobs</div>
                    </div>
                    <div className="bg-green-50 p-2 rounded text-center">
                      <div className="font-semibold text-green-600">{company.activeTenders}</div>
                      <div className="text-green-700">Active Tenders</div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleViewCompanyDetails(company)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Company Details Modal */}
      <Dialog open={companyDetailsOpen} onOpenChange={setCompanyDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Company Details</DialogTitle>
          </DialogHeader>
          {selectedCompany && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedCompany.name}
                  </h3>
                  <p className="text-gray-600">{selectedCompany.industry}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectedCompany.location}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">About</h4>
                <p className="text-gray-600 leading-relaxed">
                  {selectedCompany.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Employees</h4>
                  <p className="text-gray-600">{selectedCompany.employees}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Status</h4>
                  {selectedCompany.verified ? (
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">Unverified</Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedCompany.activeJobs}</div>
                  <div className="text-blue-700">Active Jobs</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedCompany.activeTenders}</div>
                  <div className="text-green-700">Active Tenders</div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Link to="/jobs">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    View Jobs
                  </Button>
                </Link>
                <Link to="/tenders">
                  <Button variant="outline">
                    View Tenders
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Companies;
