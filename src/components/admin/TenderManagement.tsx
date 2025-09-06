
import React, { useState } from 'react';
import { Edit, Trash2, Eye, Search, Filter, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import PostTenderDialog from '@/components/PostTenderDialog';

const TenderManagement = () => {
  const { toast } = useToast();
  
  const [tenders, setTenders] = useState([
    {
      id: 1,
      title: "Construction of New Government Office Building",
      organization: "Ministry of Urban Development",
      budget: "50,000,000 ETB",
      deadline: "2024-07-15",
      sector: "Construction",
      region: "Addis Ababa",
      status: "approved",
      postedBy: "gov_ministry_001"
    },
    {
      id: 2,
      title: "IT Infrastructure Development Project",
      organization: "Ethiopian Electric Utility",
      budget: "25,000,000 ETB",
      deadline: "2024-07-20",
      sector: "IT",
      region: "Dire Dawa",
      status: "pending",
      postedBy: "eeu_admin"
    },
    {
      id: 3,
      title: "Agricultural Equipment Supply",
      organization: "Ministry of Agriculture",
      budget: "15,000,000 ETB",
      deadline: "2024-07-25",
      sector: "Agriculture",
      region: "Hawassa",
      status: "rejected",
      postedBy: "agri_ministry"
    }
  ]);

  const [selectedTender, setSelectedTender] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleStatusChange = (tenderId, newStatus) => {
    setTenders(prev => 
      prev.map(tender => 
        tender.id === tenderId ? { ...tender, status: newStatus } : tender
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Tender status changed to ${newStatus}`,
    });
  };

  const handleDeleteTender = (tenderId) => {
    setTenders(prev => prev.filter(tender => tender.id !== tenderId));
    toast({
      title: "Tender Deleted",
      description: "The tender has been permanently removed.",
      variant: "destructive"
    });
  };

  const filteredTenders = tenders.filter(tender => {
    const matchesSearch = tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tender.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tender.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleNewTender = (tenderData) => {
    const newTender = {
      id: Math.max(...tenders.map(t => t.id)) + 1,
      ...tenderData,
      budget: tenderData.bid_guarantee,
      status: "pending",
      postedBy: "admin"
    };
    
    setTenders(prev => [newTender, ...prev]);
    toast({
      title: "Tender Created",
      description: "New tender has been created successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tender Management</CardTitle>
          <PostTenderDialog onSubmit={handleNewTender} />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search tenders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Bid Guarantee</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTenders.map((tender) => (
              <TableRow key={tender.id}>
                <TableCell className="font-medium">{tender.title}</TableCell>
                <TableCell>{tender.organization}</TableCell>
                <TableCell>{tender.budget}</TableCell>
                <TableCell>{tender.deadline}</TableCell>
                <TableCell>{getStatusBadge(tender.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedTender(tender);
                        setDetailsOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(tender.id, 'approved')}
                      disabled={tender.status === 'approved'}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(tender.id, 'rejected')}
                      disabled={tender.status === 'rejected'}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteTender(tender.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Tender Details Modal */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tender Details</DialogTitle>
            </DialogHeader>
            {selectedTender && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{selectedTender.title}</h3>
                  <p className="text-gray-600">{selectedTender.organization}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bid Guarantee
                    </label>
                    <p className="text-gray-900">{selectedTender.budget}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deadline
                    </label>
                    <p className="text-gray-900">{selectedTender.deadline}</p>
                  </div>
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
                      Posted By
                    </label>
                    <p className="text-gray-900">{selectedTender.postedBy}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    {getStatusBadge(selectedTender.status)}
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

export default TenderManagement;
