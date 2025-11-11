
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface PostJobDialogProps {
  onSubmit: (job: any) => void;
}

const PostJobDialog = ({ onSubmit }: PostJobDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    job_type: '',
    description: '',
    requirements: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to post a job.",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          title: formData.title,
          company: formData.company,
          location: formData.location,
          salary: formData.salary,
          job_type: formData.job_type,
          description: formData.description,
          requirements: formData.requirements,
          posted_by: user.id,
          status: 'approved'
        }])
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job posted successfully!"
      });

      setFormData({
        title: '',
        company: '',
        location: '',
        salary: '',
        job_type: '',
        description: '',
        requirements: ''
      });
      setOpen(false);
      await onSubmit(data[0]);
    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Post Job
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post New Job</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}
          <div>
            <Label htmlFor="title">Job Title</Label>
            <p className="text-xs text-gray-500 mb-1">The position name (e.g., "Senior Software Engineer")</p>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Senior Software Engineer"
              required
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <p className="text-xs text-gray-500 mb-1">The name of the hiring organization</p>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="e.g., Ethiopian Airlines"
              required
              className={errors.company ? 'border-red-500' : ''}
            />
            {errors.company && <p className="text-sm text-red-500 mt-1">{errors.company}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <p className="text-xs text-gray-500 mb-1">City or region</p>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Addis Ababa"
                required
                className={errors.location ? 'border-red-500' : ''}
              />
              {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
            </div>
            <div>
              <Label htmlFor="job_type">Job Type</Label>
              <p className="text-xs text-gray-500 mb-1">Employment type</p>
              <Select onValueChange={(value) => setFormData({ ...formData, job_type: value })}>
                <SelectTrigger className={errors.job_type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
              {errors.job_type && <p className="text-sm text-red-500 mt-1">{errors.job_type}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="salary">Salary Range</Label>
            <p className="text-xs text-gray-500 mb-1">Monthly compensation range in ETB</p>
            <Input
              id="salary"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              placeholder="e.g., 35,000 - 45,000 ETB"
              required
              className={errors.salary ? 'border-red-500' : ''}
            />
            {errors.salary && <p className="text-sm text-red-500 mt-1">{errors.salary}</p>}
          </div>
          
          <div>
            <Label htmlFor="description">Job Description</Label>
            <p className="text-xs text-gray-500 mb-1">Overview of the role and responsibilities</p>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what the job entails, key responsibilities, and what makes it interesting..."
              rows={4}
              required
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
          </div>
          
          <div>
            <Label htmlFor="requirements">Requirements</Label>
            <p className="text-xs text-gray-500 mb-1">Qualifications and skills needed</p>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              placeholder="List required education, experience, skills, and qualifications..."
              rows={4}
              required
              className={errors.requirements ? 'border-red-500' : ''}
            />
            {errors.requirements && <p className="text-sm text-red-500 mt-1">{errors.requirements}</p>}
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Post Job'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostJobDialog;
