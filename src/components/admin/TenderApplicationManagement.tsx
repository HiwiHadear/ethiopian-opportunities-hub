import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Clock, Search, FileText, Building2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const TenderApplicationManagement = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('tender_applications')
        .select(`
          *,
          tenders (
            title,
            organization,
            sector,
            bid_guarantee
          )
        `)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load tender applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const { error } = await supabase
        .from('tender_applications')
        .update({
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          admin_notes: adminNotes || null
        })
        .eq('id', applicationId);

      if (error) throw error;

      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId
            ? { ...app, status: newStatus, reviewed_at: new Date().toISOString(), admin_notes: adminNotes }
            : app
        )
      );

      toast({
        title: "Status Updated",
        description: `Tender application status changed to ${newStatus}`,
      });

      setDetailsOpen(false);
      setAdminNotes('');
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.tenders?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.tenders?.organization?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'reviewed':
        return <Badge className="bg-blue-100 text-blue-800"><Eye className="w-3 h-3 mr-1" />Reviewed</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Accepted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading applications...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Tender Applications Management
        </CardTitle>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search applications..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Tender</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Bid Amount</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <div>
                      <div>{application.company_name}</div>
                      <div className="text-sm text-gray-500">{application.company_email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{application.tenders?.title}</TableCell>
                <TableCell>{application.tenders?.organization}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-green-600" />
                    {formatCurrency(application.bid_amount)}
                  </div>
                </TableCell>
                <TableCell>{new Date(application.applied_at).toLocaleDateString()}</TableCell>
                <TableCell>{getStatusBadge(application.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedApplication(application);
                        setAdminNotes(application.admin_notes || '');
                        setDetailsOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredApplications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No tender applications found
          </div>
        )}

        {/* Application Details Modal */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tender Application Details</DialogTitle>
            </DialogHeader>
            {selectedApplication && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Company Information</h3>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Company Name</Label>
                        <p className="text-gray-900">{selectedApplication.company_name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Email</Label>
                        <p className="text-gray-900">{selectedApplication.company_email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Phone</Label>
                        <p className="text-gray-900">{selectedApplication.company_phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Applied Date</Label>
                        <p className="text-gray-900">{new Date(selectedApplication.applied_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Tender Information</h3>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Tender Title</Label>
                        <p className="text-gray-900">{selectedApplication.tenders?.title}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Organization</Label>
                        <p className="text-gray-900">{selectedApplication.tenders?.organization}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Sector</Label>
                        <p className="text-gray-900">{selectedApplication.tenders?.sector}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Current Status</Label>
                        {getStatusBadge(selectedApplication.status)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Bid Amount</Label>
                    <p className="text-lg font-semibold text-green-600">{formatCurrency(selectedApplication.bid_amount)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Required Bid Guarantee</Label>
                    <p className="text-gray-900">{selectedApplication.tenders?.bid_guarantee}</p>
                  </div>
                </div>

                {selectedApplication.proposal_document_url && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Proposal Document</Label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <a 
                        href={selectedApplication.proposal_document_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        View Proposal Document
                      </a>
                    </div>
                  </div>
                )}

                {selectedApplication.proposal_summary && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Proposal Summary</Label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedApplication.proposal_summary}</p>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="adminNotes" className="text-sm font-medium text-gray-700 mb-2 block">
                    Admin Notes
                  </Label>
                  <Textarea
                    id="adminNotes"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this application..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleStatusChange(selectedApplication.id, 'accepted')}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={selectedApplication.status === 'accepted'}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept Proposal
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(selectedApplication.id, 'rejected')}
                    variant="destructive"
                    disabled={selectedApplication.status === 'rejected'}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Proposal
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(selectedApplication.id, 'reviewed')}
                    variant="outline"
                    disabled={selectedApplication.status === 'reviewed'}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Mark as Reviewed
                  </Button>
                  <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TenderApplicationManagement;