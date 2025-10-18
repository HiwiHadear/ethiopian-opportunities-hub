
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, FileText, Edit, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PostTenderDialog from '@/components/PostTenderDialog';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Tenders = () => {
  const { user } = useAuth();
  const { isAdmin } = useProfile();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingTender, setEditingTender] = useState(null);
  const [selectedTender, setSelectedTender] = useState(null);
  const [tenderDetailsOpen, setTenderDetailsOpen] = useState(false);

  // Fetch tenders from Supabase
  const fetchTenders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTenders(data || []);
    } catch (error) {
      console.error('Error fetching tenders:', error);
      toast.error('Failed to load tenders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenders();
  }, []);

  const handleEditTender = (tenderId) => {
    setEditingTender(tenderId);
  };

  const handleSaveTender = async (tenderId, updatedTender) => {
    try {
      const { error } = await supabase
        .from('tenders')
        .update({
          title: updatedTender.title,
          organization: updatedTender.organization,
          bid_guarantee: updatedTender.budget,
          deadline: updatedTender.deadline,
          sector: updatedTender.sector,
          region: updatedTender.region
        })
        .eq('id', tenderId);

      if (error) throw error;

      setTenders(prev => 
        prev.map(tender => 
          tender.id === tenderId ? { ...tender, ...updatedTender } : tender
        )
      );
      setEditingTender(null);
      toast.success('Tender updated successfully');
    } catch (error) {
      console.error('Error updating tender:', error);
      toast.error('Failed to update tender');
    }
  };

  const handleAddTender = async (newTender) => {
    try {
      const { data, error } = await supabase
        .from('tenders')
        .insert([{
          title: newTender.title,
          organization: newTender.organization,
          bid_guarantee: newTender.budget,
          opening_date: newTender.opening_date,
          deadline: newTender.deadline,
          sector: newTender.sector,
          region: newTender.region,
          description: newTender.description,
          requirements: newTender.requirements,
          posted_by: user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Tender posted successfully');
      fetchTenders();
    } catch (error) {
      console.error('Error adding tender:', error);
      toast.error('Failed to post tender');
    }
  };

  const handleViewTenderDetails = (tender) => {
    setSelectedTender(tender);
    setTenderDetailsOpen(true);
  };

  // Helper function to check if tender is expired
  const isTenderExpired = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    return deadlineDate < today;
  };

  const EditableTenderCard = ({ tender }) => {
    const [editData, setEditData] = useState(tender);
    const isEditing = editingTender === tender.id;
    const isExpired = isTenderExpired(tender.deadline);

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
      <div className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
        isExpired ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
      }`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900">{tender.title}</h3>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isExpired ? "destructive" : "secondary"}
              className={isExpired ? "bg-red-500 text-white" : ""}
            >
              {isExpired ? "EXPIRED" : tender.sector}
            </Badge>
            <Button size="sm" variant="ghost" onClick={() => handleEditTender(tender.id)}>
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-gray-600 mb-3">{tender.organization}</p>
        <div className="flex flex-wrap gap-4 text-sm mb-3">
          <span className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            {tender.region}
          </span>
          <span className={`flex items-center font-medium ${
            isExpired ? 'text-red-600' : 'text-green-600'
          }`}>
            <Calendar className="w-4 h-4 mr-1" />
            Deadline: {tender.deadline}
            {isExpired && <span className="ml-2 text-red-500 font-bold">EXPIRED</span>}
          </span>
          <span className="font-semibold text-green-600">
            Bid Guarantee: {tender.budget}
          </span>
        </div>
        <Button 
          size="sm" 
          className={isExpired ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
          onClick={() => handleViewTenderDetails(tender)}
          disabled={isExpired}
        >
          {isExpired ? "Expired" : "View Details"}
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
              <img 
                src="/lovable-uploads/c6863b9a-31ae-4e2f-87a6-19b9386abbdf.png" 
                alt="Geza Shekalo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-gray-900">Geza Shekalo</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/tenders" className="text-blue-600 font-medium">Tenders</Link>
              <Link to="/jobs" className="text-gray-700 hover:text-blue-600 transition-colors">Jobs</Link>
              <Link to="/companies" className="text-gray-700 hover:text-blue-600 transition-colors">Companies</Link>
              <Link to="/scholarships" className="text-gray-700 hover:text-blue-600 transition-colors">Scholarships</Link>
            </nav>

            <div className="flex items-center space-x-4">
              {user && isAdmin && (
                <>
                  <PostTenderDialog onSubmit={handleAddTender} />
                  <Link to="/admin">
                    <Button variant="secondary" size="sm">Admin Dashboard</Button>
                  </Link>
                </>
              )}
              {!user ? (
                <Link to="/auth">
                  <Button>Sign In</Button>
                </Link>
              ) : (
                <Button variant="outline" onClick={() => supabase.auth.signOut()}>
                  Sign Out
                </Button>
              )}
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
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading tenders...</p>
          </div>
        ) : tenders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No tenders available yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {tenders.map((tender) => (
              <EditableTenderCard 
                key={tender.id} 
                tender={{
                  ...tender,
                  budget: tender.bid_guarantee
                }} 
              />
            ))}
          </div>
        )}
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
                  <p className={`font-medium ${
                    isTenderExpired(selectedTender.deadline) ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {selectedTender.deadline}
                    {isTenderExpired(selectedTender.deadline) && 
                      <span className="ml-2 text-red-500 font-bold">EXPIRED</span>
                    }
                  </p>
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
