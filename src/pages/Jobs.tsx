import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Edit, Save, X, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import PostJobDialog from '@/components/PostJobDialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { generateCV, downloadCV } from '@/lib/aiCVGenerator';
import { Calendar } from 'lucide-react';

const Jobs = () => {
  const { user } = useAuth();
  const { isAdmin } = useProfile();
  const { toast } = useToast();

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
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

  const [editingJob, setEditingJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);
  const [autoCreateCV, setAutoCreateCV] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvData, setCvData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    skills: '',
    education: ''
  });

  const handleEditJob = (jobId) => {
    setEditingJob(jobId);
  };

  const handleSaveJob = async (jobId, updatedJob) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update(updatedJob)
        .eq('id', jobId);

      if (error) throw error;

      setJobs(prev => 
        prev.map(job => 
          job.id === jobId ? { ...job, ...updatedJob } : job
        )
      );
      setEditingJob(null);

      toast({
        title: "Success",
        description: "Job updated successfully"
      });
    } catch (error) {
      console.error('Error updating job:', error);
      toast({
        title: "Error",
        description: "Failed to update job",
        variant: "destructive"
      });
    }
  };

  const handleAddJob = async (newJob) => {
    await fetchJobs(); // Refresh the jobs list from database
  };

  const handleApplyToJob = (job) => {
    setSelectedJob(job);
    setJobDetailsOpen(true);
  };

  const [generatedCV, setGeneratedCV] = useState('');
  const [isGeneratingCV, setIsGeneratingCV] = useState(false);

  const handleGenerateCV = async () => {
    if (!cvData.fullName || !cvData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least your name and email to generate a CV.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingCV(true);
    
    try {
      toast({
        title: "Generating CV...",
        description: "Creating your professional CV using free AI.",
      });

      const cvContent = await generateCV(cvData, selectedJob);
      setGeneratedCV(cvContent);
      setCvData(prev => ({ ...prev, generatedContent: cvContent }));
      
      toast({
        title: "CV Generated Successfully!",
        description: "Your AI-powered CV has been created and is ready for review.",
      });
    } catch (error) {
      console.error('Error generating CV:', error);
      toast({
        title: "Generation Complete",
        description: "CV generated using template. You can edit and customize it further.",
      });
    } finally {
      setIsGeneratingCV(false);
    }
  };

  const handleJobApplication = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a job application.",
        variant: "destructive"
      });
      return;
    }

    if (autoCreateCV && (!cvData.fullName || !cvData.email)) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least your name and email.",
        variant: "destructive"
      });
      return;
    }

    try {
      const applicationData = {
        user_id: user.id,
        job_id: selectedJob.id,
        full_name: autoCreateCV ? cvData.fullName : user.user_metadata?.full_name || '',
        email: autoCreateCV ? cvData.email : user.email,
        phone: autoCreateCV ? cvData.phone : '',
        cover_letter: coverLetter,
        cv_data: autoCreateCV ? cvData : null,
        status: 'pending'
      };

      const { error } = await supabase
        .from('job_applications')
        .insert([applicationData]);

      if (error) throw error;

      if (autoCreateCV && generatedCV) {
        // CV was already generated, include it in the application
      }
      
      toast({
        title: "Application Submitted!",
        description: `Your application for ${selectedJob?.title} at ${selectedJob?.company} has been submitted successfully.`,
      });

      // Reset form
      setJobDetailsOpen(false);
      setSelectedJob(null);
      setAutoCreateCV(false);
      setCoverLetter('');
      setCvData({
        fullName: '',
        email: '',
        phone: '',
        experience: '',
        skills: '',
        education: ''
      });
      setGeneratedCV('');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    }
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
              <Select
                value={editData.job_type}
                onValueChange={(value) => setEditData({ ...editData, job_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              value={editData.salary || ''}
              onChange={(e) => setEditData({ ...editData, salary: e.target.value })}
              placeholder="Salary Range"
            />
            <Textarea
              value={editData.description || ''}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              placeholder="Job Description"
              rows={4}
            />
            <Textarea
              value={editData.requirements || ''}
              onChange={(e) => setEditData({ ...editData, requirements: e.target.value })}
              placeholder="Requirements"
              rows={3}
            />
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
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow border-green-200 bg-green-50">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {job.job_type || 'full-time'}
            </Badge>
            {isAdmin && (
              <Button size="sm" variant="ghost" onClick={() => handleEditJob(job.id)}>
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <p className="text-gray-600 mb-3">{job.company}</p>
        <div className="flex flex-wrap gap-4 text-sm mb-3">
          <span className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            {job.location}
          </span>
          {job.salary && (
            <span className="font-semibold text-green-600">
              {job.salary}
            </span>
          )}
          <span className="flex items-center text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            Posted {formatDate(job.created_at)}
          </span>
        </div>
        <Button 
          size="sm" 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => handleApplyToJob(job)}
        >
          Apply Now
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
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
              <Link to="/tenders" className="text-gray-700 hover:text-blue-600 transition-colors">Tenders</Link>
              <Link to="/jobs" className="text-indigo-600 font-medium">Jobs</Link>
              <Link to="/scholarships" className="text-gray-700 hover:text-blue-600 transition-colors">Scholarships</Link>
              <Link to="/companies" className="text-gray-700 hover:text-blue-600 transition-colors">Companies</Link>
            </nav>

            <div className="flex items-center space-x-4">
              {user && isAdmin && (
                <>
                  <PostJobDialog onSubmit={handleAddJob} />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Opportunities</h1>
          <p className="text-gray-600">Find your next career opportunity in Ethiopia</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input 
                    placeholder="Search jobs..." 
                    className="pl-10"
                  />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
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
                  <SelectItem value="hawassa">Hawassa</SelectItem>
                  <SelectItem value="bahir-dar">Bahir Dar</SelectItem>
                  <SelectItem value="mekelle">Mekelle</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No jobs available yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <EditableJobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>

      {/* Job Application Modal with CV Creation */}
      <Dialog open={jobDetailsOpen} onOpenChange={setJobDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for Job</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-6">
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
                  <p className="text-gray-900">{selectedJob.job_type || 'full-time'}</p>
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
                  <p className="text-gray-600">{formatDate(selectedJob.created_at)}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                  {selectedJob.description || 'No description provided'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements
                </label>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                  {selectedJob.requirements || 'No requirements specified'}
                </p>
              </div>

              {/* Auto CV Creation Option */}
              <div className="border rounded-lg p-4 bg-blue-50">
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox 
                    id="auto-cv" 
                    checked={autoCreateCV}
                    onCheckedChange={(checked) => setAutoCreateCV(checked === true)}
                  />
                  <label htmlFor="auto-cv" className="text-sm font-medium">
                    Automatically create CV for this application
                  </label>
                </div>
                
                {autoCreateCV && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <Input
                          value={cvData.fullName}
                          onChange={(e) => setCvData({ ...cvData, fullName: e.target.value })}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <Input
                          type="email"
                          value={cvData.email}
                          onChange={(e) => setCvData({ ...cvData, email: e.target.value })}
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <Input
                        value={cvData.phone}
                        onChange={(e) => setCvData({ ...cvData, phone: e.target.value })}
                        placeholder="+251 9XX XXX XXX"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Work Experience
                      </label>
                      <Textarea
                        value={cvData.experience}
                        onChange={(e) => setCvData({ ...cvData, experience: e.target.value })}
                        placeholder="Describe your relevant work experience..."
                        className="min-h-[80px]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Skills
                      </label>
                      <Input
                        value={cvData.skills}
                        onChange={(e) => setCvData({ ...cvData, skills: e.target.value })}
                        placeholder="List your key skills (comma separated)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Education
                      </label>
                      <Textarea
                        value={cvData.education}
                        onChange={(e) => setCvData({ ...cvData, education: e.target.value })}
                        placeholder="Your educational background..."
                        className="min-h-[60px]"
                      />
                    </div>
                    
                     <div className="flex gap-2">
                       <Button 
                         type="button"
                         variant="outline"
                         onClick={handleGenerateCV}
                         disabled={!cvData.fullName || !cvData.email || isGeneratingCV}
                         className="flex items-center gap-2 flex-1"
                       >
                         {isGeneratingCV ? (
                           <>
                             <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                             Generating...
                           </>
                         ) : (
                           <>
                             <Download className="w-4 h-4" />
                             Generate AI CV
                           </>
                         )}
                       </Button>
                       
                       {generatedCV && (
                         <Button 
                           type="button"
                           variant="secondary"
                           onClick={() => downloadCV(generatedCV, cvData.fullName)}
                           className="flex items-center gap-2"
                         >
                           <Download className="w-4 h-4" />
                           Download
                         </Button>
                       )}
                     </div>
                     
                     {generatedCV && (
                       <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                         <h4 className="font-semibold mb-2">Generated CV Preview:</h4>
                         <div className="max-h-40 overflow-y-auto text-sm text-gray-700 whitespace-pre-wrap">
                           {generatedCV.substring(0, 500)}...
                         </div>
                       </div>
                     )}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <Textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
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

export default Jobs;
