
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Search, Filter, CheckCircle, XCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PostJobDialog from '@/components/PostJobDialog';

const JobManagement = () => {
  const { toast } = useToast();
  
  const [jobs, setJobs] = useState([]);
  const [jobApplicationCounts, setJobApplicationCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedJob, setEditedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchJobsAndApplications();
  }, []);

  const fetchJobsAndApplications = async () => {
    try {
      setLoading(true);
      
      // Fetch all jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;

      // Fetch application counts for each job
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('job_applications')
        .select('job_id, status');

      if (applicationsError) throw applicationsError;

      // Count applications per job
      const counts = {};
      applicationsData.forEach(app => {
        if (!counts[app.job_id]) {
          counts[app.job_id] = { total: 0, pending: 0, approved: 0, rejected: 0 };
        }
        counts[app.job_id].total++;
        counts[app.job_id][app.status]++;
      });

      setJobs(jobsData || []);
      setJobApplicationCounts(counts);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', jobId);

      if (error) throw error;

      setJobs(prev => 
        prev.map(job => 
          job.id === jobId ? { ...job, status: newStatus } : job
        )
      );
      
      toast({
        title: "Status Updated",
        description: `Job status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update job status",
        variant: "destructive"
      });
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;

      setJobs(prev => prev.filter(job => job.id !== jobId));
      toast({
        title: "Job Deleted",
        description: "The job posting has been permanently removed.",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive"
      });
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
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

  const handleNewJob = async (jobData) => {
    await fetchJobsAndApplications();
    toast({
      title: "Job Created",
      description: "New job posting has been created successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Job Management</CardTitle>
          <PostJobDialog onSubmit={handleNewJob} />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search jobs..."
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
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Loading jobs...
                </TableCell>
              </TableRow>
            ) : filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No jobs found
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => {
                const appCount = jobApplicationCounts[job.id] || { total: 0, pending: 0 };
                return (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.salary || 'Not specified'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {appCount.total}
                        </Badge>
                        {appCount.pending > 0 && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            {appCount.pending} pending
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                     <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedJob(job);
                        setEditedJob(job);
                        setEditMode(false);
                        setDetailsOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedJob(job);
                        setEditedJob(job);
                        setEditMode(true);
                        setDetailsOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(job.id, 'approved')}
                      disabled={job.status === 'approved'}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(job.id, 'rejected')}
                      disabled={job.status === 'rejected'}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Job Details/Edit Modal */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Job' : 'Job Details'}</DialogTitle>
            </DialogHeader>
            {editedJob && (
              <div className="space-y-4">
                {editMode ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <Input
                        value={editedJob.title}
                        onChange={(e) => setEditedJob({...editedJob, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Company</label>
                      <Input
                        value={editedJob.company}
                        onChange={(e) => setEditedJob({...editedJob, company: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <Input
                          value={editedJob.location}
                          onChange={(e) => setEditedJob({...editedJob, location: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Salary</label>
                        <Input
                          value={editedJob.salary}
                          onChange={(e) => setEditedJob({...editedJob, salary: e.target.value})}
                        />
                      </div>
                       <div>
                         <label className="block text-sm font-medium mb-1">Type</label>
                         <Select 
                           value={editedJob.job_type} 
                           onValueChange={(value) => setEditedJob({...editedJob, job_type: value})}
                         >
                           <SelectTrigger>
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="full-time">Full-time</SelectItem>
                             <SelectItem value="part-time">Part-time</SelectItem>
                             <SelectItem value="contract">Contract</SelectItem>
                             <SelectItem value="internship">Internship</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea
                        value={editedJob.description || ''}
                        onChange={(e) => setEditedJob({...editedJob, description: e.target.value})}
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Requirements</label>
                      <Textarea
                        value={editedJob.requirements || ''}
                        onChange={(e) => setEditedJob({...editedJob, requirements: e.target.value})}
                        rows={4}
                      />
                    </div>
                     <div className="flex gap-2 justify-end">
                       <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                       <Button onClick={async () => {
                         try {
                           const { error } = await supabase
                             .from('jobs')
                             .update({
                               title: editedJob.title,
                               company: editedJob.company,
                               location: editedJob.location,
                               salary: editedJob.salary,
                               job_type: editedJob.job_type,
                               description: editedJob.description,
                               requirements: editedJob.requirements
                             })
                             .eq('id', editedJob.id);

                           if (error) throw error;

                           setJobs(prev => prev.map(j => j.id === editedJob.id ? editedJob : j));
                           toast({ title: "Job Updated", description: "Job has been updated successfully." });
                           setDetailsOpen(false);
                           setEditMode(false);
                         } catch (error) {
                           console.error('Error updating job:', error);
                           toast({
                             title: "Error",
                             description: "Failed to update job",
                             variant: "destructive"
                           });
                         }
                       }}>
                         Save Changes
                       </Button>
                     </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedJob.title}</h3>
                      <p className="text-gray-600">{selectedJob.company}</p>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                         <p className="text-gray-900">{selectedJob.location}</p>
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                         <p className="text-gray-900">{selectedJob.salary || 'Not specified'}</p>
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                         <p className="text-gray-900">{selectedJob.job_type}</p>
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                         {getStatusBadge(selectedJob.status)}
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Total Applications</label>
                         <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                           <Users className="w-3 h-3" />
                           {jobApplicationCounts[selectedJob.id]?.total || 0}
                         </Badge>
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Pending Applications</label>
                         <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 w-fit">
                           {jobApplicationCounts[selectedJob.id]?.pending || 0}
                         </Badge>
                       </div>
                     </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedJob.description || 'No description provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedJob.requirements || 'No requirements specified'}</p>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>
                      <Button onClick={() => setEditMode(true)}>Edit</Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default JobManagement;
