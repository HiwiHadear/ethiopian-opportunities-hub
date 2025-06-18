
import React, { useState } from 'react';
import { Edit, Trash2, Eye, Search, Building2, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const CompanyManagement = () => {
  const { toast } = useToast();
  
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "Ethiopian Airlines",
      email: "hr@ethiopianairlines.com",
      phone: "+251-11-665-7777",
      industry: "Aviation",
      location: "Addis Ababa",
      verified: true,
      activeJobs: 5,
      activeTenders: 2
    },
    {
      id: 2,
      name: "Commercial Bank of Ethiopia",
      email: "recruitment@cbe.com.et",
      phone: "+251-11-551-5151",
      industry: "Banking",
      location: "Addis Ababa",
      verified: true,
      activeJobs: 8,
      activeTenders: 0
    },
    {
      id: 3,
      name: "Ethio Telecom",
      email: "careers@ethiotelecom.et",
      phone: "+251-11-515-5000",
      industry: "Telecommunications",
      location: "Addis Ababa",
      verified: false,
      activeJobs: 3,
      activeTenders: 1
    }
  ]);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleVerifyCompany = (companyId) => {
    setCompanies(prev => 
      prev.map(company => 
        company.id === companyId ? { ...company, verified: !company.verified } : company
      )
    );
    
    toast({
      title: "Verification Updated",
      description: "Company verification status has been updated.",
    });
  };

  const handleDeleteCompany = (companyId) => {
    setCompanies(prev => prev.filter(company => company.id !== companyId));
    toast({
      title: "Company Deleted",
      description: "The company has been permanently removed.",
      variant: "destructive"
    });
  };

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Management</CardTitle>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Active Posts</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{company.industry}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Mail className="w-3 h-3 mr-1" />
                      {company.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="w-3 h-3 mr-1" />
                      {company.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {company.verified ? (
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">Unverified</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>Jobs: {company.activeJobs}</div>
                    <div>Tenders: {company.activeTenders}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedCompany(company);
                        setDetailsOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={company.verified ? "secondary" : "default"}
                      onClick={() => handleVerifyCompany(company.id)}
                    >
                      {company.verified ? "Unverify" : "Verify"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteCompany(company.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Company Details Modal */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Company Details</DialogTitle>
            </DialogHeader>
            {selectedCompany && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold">{selectedCompany.name}</h3>
                    <p className="text-gray-600">{selectedCompany.industry}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900">{selectedCompany.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <p className="text-gray-900">{selectedCompany.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <p className="text-gray-900">{selectedCompany.location}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Verification Status
                    </label>
                    {selectedCompany.verified ? (
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">Unverified</Badge>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Active Jobs
                    </label>
                    <p className="text-gray-900">{selectedCompany.activeJobs}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Active Tenders
                    </label>
                    <p className="text-gray-900">{selectedCompany.activeTenders}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CompanyManagement;
