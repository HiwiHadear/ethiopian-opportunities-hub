
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, AlertTriangle } from 'lucide-react';
import { tenderSchema, sanitizeObject } from '@/lib/validation';
import { z } from 'zod';

interface PostTenderDialogProps {
  onSubmit: (tender: any) => void;
}

const PostTenderDialog = ({ onSubmit }: PostTenderDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    budget: '',
    opening_date: '',
    deadline: '',
    sector: '',
    region: '',
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
      // Sanitize input data
      const sanitizedData = sanitizeObject(formData);
      
      // Validate data
      const validatedData = tenderSchema.parse(sanitizedData);
      
      const newTender = {
        id: Date.now(),
        ...validatedData
      };
      
      await onSubmit(newTender);
      setFormData({
        title: '',
        organization: '',
        budget: '',
        opening_date: '',
        deadline: '',
        sector: '',
        region: '',
        description: '',
        requirements: ''
      });
      setOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: 'Failed to create tender. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Post Tender
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post New Tender</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}
          <div>
            <Label htmlFor="title">Tender Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
          </div>
          <div>
            <Label htmlFor="organization">Organization</Label>
            <Input
              id="organization"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              required
              className={errors.organization ? 'border-red-500' : ''}
            />
            {errors.organization && <p className="text-sm text-red-500 mt-1">{errors.organization}</p>}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="budget">Bid Guarantee</Label>
              <Input
                id="budget"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="e.g., 50,000,000 ETB"
                required
                className={errors.budget ? 'border-red-500' : ''}
              />
              {errors.budget && <p className="text-sm text-red-500 mt-1">{errors.budget}</p>}
            </div>
            <div>
              <Label htmlFor="opening_date">Opening Date</Label>
              <Input
                id="opening_date"
                type="date"
                value={formData.opening_date}
                onChange={(e) => setFormData({ ...formData, opening_date: e.target.value })}
                required
                className={errors.opening_date ? 'border-red-500' : ''}
              />
              {errors.opening_date && <p className="text-sm text-red-500 mt-1">{errors.opening_date}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              required
              className={errors.deadline ? 'border-red-500' : ''}
            />
            {errors.deadline && <p className="text-sm text-red-500 mt-1">{errors.deadline}</p>}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="sector">Sector</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, sector: value })}>
                <SelectTrigger className={errors.sector ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Construction">Construction</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Agriculture">Agriculture</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                </SelectContent>
              </Select>
              {errors.sector && <p className="text-sm text-red-500 mt-1">{errors.sector}</p>}
            </div>
            <div>
              <Label htmlFor="region">Region</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, region: value })}>
                <SelectTrigger className={errors.region ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Addis Ababa">Addis Ababa</SelectItem>
                  <SelectItem value="Dire Dawa">Dire Dawa</SelectItem>
                  <SelectItem value="Hawassa">Hawassa</SelectItem>
                  <SelectItem value="Bahir Dar">Bahir Dar</SelectItem>
                  <SelectItem value="Mekelle">Mekelle</SelectItem>
                </SelectContent>
              </Select>
              {errors.region && <p className="text-sm text-red-500 mt-1">{errors.region}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <p className="text-sm text-muted-foreground mb-1">Provide detailed information about the tender</p>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter tender description, scope of work, objectives..."
              className={errors.description ? 'border-red-500' : ''}
              rows={4}
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
          </div>
          <div>
            <Label htmlFor="requirements">Requirements</Label>
            <p className="text-sm text-muted-foreground mb-1">List eligibility criteria and required qualifications</p>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              placeholder="Enter requirements, qualifications, documents needed..."
              className={errors.requirements ? 'border-red-500' : ''}
              rows={4}
            />
            {errors.requirements && <p className="text-sm text-red-500 mt-1">{errors.requirements}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Post Tender'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostTenderDialog;
