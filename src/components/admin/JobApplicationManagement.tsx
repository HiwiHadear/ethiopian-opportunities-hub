import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Clock, Search, Filter, FileText, User, Mail, Send, Loader2, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type ApplicationStatus = 'accepted' | 'rejected' | 'under_review' | 'shortlisted' | 'interview_scheduled';

const JobApplicationManagement = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [adminNotes, setAdminNotes] = useState('');
  
  // Email dialog state
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailStatus, setEmailStatus] = useState<ApplicationStatus>('accepted');
  const [sendEmail, setSendEmail] = useState(true);
  const [customMessage, setCustomMessage] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewLocation, setInterviewLocation] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs (
            title,
            company,
            location
          )
        `)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load job applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const openEmailDialog = (status: ApplicationStatus) => {
    setEmailStatus(status);
    setSendEmail(true);
    setCustomMessage('');
    setNextSteps('');
    setInterviewDate('');
    setInterviewLocation('');
    setEmailDialogOpen(true);
  };

  const handleStatusChangeWithEmail = async () => {
    if (!selectedApplication) return;
    
    setSendingEmail(true);
    
    try {
      // Update the status in the database
      const { error: updateError } = await supabase
        .from('job_applications')
        .update({
          status: emailStatus,
          reviewed_at: new Date().toISOString(),
          admin_notes: adminNotes || null
        })
        .eq('id', selectedApplication.id);

      if (updateError) throw updateError;

      // Send email if checkbox is checked
      if (sendEmail) {
        const { error: emailError } = await supabase.functions.invoke('send-status-update', {
          body: {
            applicationType: 'job',
            applicationId: selectedApplication.id,
            newStatus: emailStatus,
            customMessage: customMessage || undefined,
            nextSteps: nextSteps ? nextSteps.split('\n').filter(s => s.trim()) : undefined,
            interviewDate: interviewDate || undefined,
            interviewLocation: interviewLocation || undefined,
          }
        });

        if (emailError) {
          console.error('Email error:', emailError);
          toast({
            title: "Status Updated",
            description: `Status changed to ${emailStatus}, but email failed to send.`,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Status Updated & Email Sent",
            description: `Application status changed to ${emailStatus} and notification email sent.`,
          });
        }
      } else {
        toast({
          title: "Status Updated",
          description: `Application status changed to ${emailStatus}`,
        });
      }

      // Update local state
      setApplications(prev =>
        prev.map(app =>
          app.id === selectedApplication.id
            ? { ...app, status: emailStatus, reviewed_at: new Date().toISOString(), admin_notes: adminNotes }
            : app
        )
      );

      setEmailDialogOpen(false);
      setDetailsOpen(false);
      setAdminNotes('');
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const { error } = await supabase
        .from('job_applications')
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
        description: `Application status changed to ${newStatus}`,
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
      app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobs?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobs?.company?.toLowerCase().includes(searchTerm.toLowerCase());
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

  if (loading) {
    return <div className="flex justify-center p-8">Loading applications...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Job Applications Management
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
              <TableHead>Applicant</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Company</TableHead>
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
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <div>{application.full_name}</div>
                      <div className="text-sm text-gray-500">{application.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{application.jobs?.title}</TableCell>
                <TableCell>{application.jobs?.company}</TableCell>
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
            No job applications found
          </div>
        )}

        {/* Application Details Modal */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Job Application Details</DialogTitle>
            </DialogHeader>
            {selectedApplication && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Applicant Information</h3>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                        <p className="text-gray-900">{selectedApplication.full_name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Email</Label>
                        <p className="text-gray-900">{selectedApplication.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Phone</Label>
                        <p className="text-gray-900">{selectedApplication.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Applied Date</Label>
                        <p className="text-gray-900">{new Date(selectedApplication.applied_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Job Information</h3>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Position</Label>
                        <p className="text-gray-900">{selectedApplication.jobs?.title}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Company</Label>
                        <p className="text-gray-900">{selectedApplication.jobs?.company}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Location</Label>
                        <p className="text-gray-900">{selectedApplication.jobs?.location}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Current Status</Label>
                        {getStatusBadge(selectedApplication.status)}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedApplication.cover_letter && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Cover Letter</Label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedApplication.cover_letter}</p>
                    </div>
                  </div>
                )}

                {selectedApplication.cv_data && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">CV Information</Label>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      {Object.entries(selectedApplication.cv_data).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                          <span>{String(value)}</span>
                        </div>
                      ))}
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

                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button
                    onClick={() => openEmailDialog('accepted')}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={selectedApplication.status === 'accepted'}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept
                  </Button>
                  <Button
                    onClick={() => openEmailDialog('rejected')}
                    variant="destructive"
                    disabled={selectedApplication.status === 'rejected'}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => openEmailDialog('shortlisted')}
                    className="bg-amber-600 hover:bg-amber-700"
                    disabled={selectedApplication.status === 'shortlisted'}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Shortlist
                  </Button>
                  <Button
                    onClick={() => openEmailDialog('interview_scheduled')}
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={selectedApplication.status === 'interview_scheduled'}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Interview
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

        {/* Email Confirmation Dialog */}
        <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                {emailStatus === 'accepted' && 'Accept Application'}
                {emailStatus === 'rejected' && 'Reject Application'}
                {emailStatus === 'shortlisted' && 'Shortlist Application'}
                {emailStatus === 'interview_scheduled' && 'Schedule Interview'}
                {emailStatus === 'under_review' && 'Mark Under Review'}
              </DialogTitle>
              <DialogDescription>
                Update application status and optionally send an email notification to the applicant.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sendEmail" 
                  checked={sendEmail} 
                  onCheckedChange={(checked) => setSendEmail(checked as boolean)} 
                />
                <Label htmlFor="sendEmail" className="text-sm font-medium cursor-pointer">
                  Send email notification to applicant
                </Label>
              </div>

              {sendEmail && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="customMessage">Custom Message (Optional)</Label>
                    <Textarea
                      id="customMessage"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Add a personalized message to include in the email..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nextSteps">Next Steps (Optional, one per line)</Label>
                    <Textarea
                      id="nextSteps"
                      value={nextSteps}
                      onChange={(e) => setNextSteps(e.target.value)}
                      placeholder="Enter each next step on a new line..."
                      className="min-h-[80px]"
                    />
                  </div>

                  {emailStatus === 'interview_scheduled' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="interviewDate" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Interview Date & Time
                        </Label>
                        <Input
                          id="interviewDate"
                          value={interviewDate}
                          onChange={(e) => setInterviewDate(e.target.value)}
                          placeholder="e.g., Monday, January 15, 2024 at 10:00 AM"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="interviewLocation" className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Interview Location
                        </Label>
                        <Input
                          id="interviewLocation"
                          value={interviewLocation}
                          onChange={(e) => setInterviewLocation(e.target.value)}
                          placeholder="e.g., 123 Business St, Suite 400 or Video Call Link"
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEmailDialogOpen(false)} disabled={sendingEmail}>
                Cancel
              </Button>
              <Button 
                onClick={handleStatusChangeWithEmail} 
                disabled={sendingEmail}
                className={
                  emailStatus === 'accepted' ? 'bg-green-600 hover:bg-green-700' :
                  emailStatus === 'rejected' ? 'bg-red-600 hover:bg-red-700' :
                  emailStatus === 'shortlisted' ? 'bg-amber-600 hover:bg-amber-700' :
                  emailStatus === 'interview_scheduled' ? 'bg-purple-600 hover:bg-purple-700' :
                  ''
                }
              >
                {sendingEmail ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {sendEmail ? 'Update & Send Email' : 'Update Status'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default JobApplicationManagement;