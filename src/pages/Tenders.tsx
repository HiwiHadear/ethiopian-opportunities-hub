
import React, { useState } from 'react';
import { Search, MapPin, Calendar, FileText, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PostTenderDialog from '@/components/PostTenderDialog';

const Tenders = () => {
  const [tenders, setTenders] = useState([
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
    },
    {
      id: 4,
      title: "Road Construction Project",
      organization: "Ethiopian Roads Authority",
      budget: "80,000,000 ETB",
      deadline: "2024-08-01",
      sector: "Construction",
      region: "Bahir Dar"
    },
    {
      id: 5,
      title: "Hospital Equipment Procurement",
      organization: "Ministry of Health",
      budget: "30,000,000 ETB",
      deadline: "2024-07-30",
      sector: "Healthcare",
      region: "Mekelle"
    }
  ]);

  const [editingTender, setEditingTender] = useState(null);
  const [selectedTender, setSelectedTender] = useState(null);
  const [tenderDetailsOpen, setTenderDetailsOpen] = useState(false);

  const handleEditTender = (tenderId) => {
    setEditingTender(tenderId);
  };

  const handleSaveTender = (tenderId, updatedTender) => {
    setTenders(prev => 
      prev.map(tender => 
        tender.id === tenderId ? { ...tender, ...updatedTender } : tender
      )
    );
    setEditingTender(null);
  };

  const handleAddTender = (newTender) => {
    setTenders(prev => [newTender, ...prev]);
  };

  const handleViewTenderDetails = (tender) => {
    setSelectedTender(tender);
    setTenderDetailsOpen(true);
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
            Bid Guarantee: {tender.budget}
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
              <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
              <a href="/tenders" className="text-blue-600 font-medium">Tenders</a>
              <a href="/jobs" className="text-gray-700 hover:text-blue-600 transition-colors">Jobs</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Companies</a>
              <a href="/library" className="text-gray-700 hover:text-blue-600 transition-colors">Digital Library</a>
            </nav>

            <div className="flex items-center space-x-4">
              <PostTenderDialog onSubmit={handleAddTender} />
              <Button>Sign In</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Government Tenders</h1>
          <p className="text-gray-600">Browse and apply for government and private sector tenders in Ethiopia</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input 
                    placeholder="Search tenders..." 
                    className="pl-10"
                  />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="it">IT</SelectItem>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="addis-ababa">Addis Ababa</SelectItem>
                  <SelectItem value="dire-dawa">Dire Dawa</SelectItem>
                  <SelectItem value="hawassa">Hawassa</SelectItem>
                  <SelectItem value="bahir-dar">Bahir Dar</SelectItem>
                  <SelectItem value="mekelle">Mekelle</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tenders List */}
        <div className="grid gap-6">
          {tenders.map((tender) => (
            <EditableTenderCard key={tender.id} tender={tender} />
          ))}
        </div>
      </div>

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
                    Bid Guarantee
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
    </div>
  );
};

export default Tenders;
