import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface PostScholarshipDialogProps {
  children: React.ReactNode;
  onScholarshipCreated?: () => void;
}

export const PostScholarshipDialog = ({ children, onScholarshipCreated }: PostScholarshipDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    level: "",
    field: "",
    amount: "",
    deadline: "",
    location: "",
    application_url: "",
    description: "",
    requirements: [""],
    benefits: [""]
  });

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, ""]
    }));
  };

  const removeRequirement = (index: number) => {
    if (formData.requirements.length > 1) {
      setFormData(prev => ({
        ...prev,
        requirements: prev.requirements.filter((_, i) => i !== index)
      }));
    }
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, ""]
    }));
  };

  const removeBenefit = (index: number) => {
    if (formData.benefits.length > 1) {
      setFormData(prev => ({
        ...prev,
        benefits: prev.benefits.filter((_, i) => i !== index)
      }));
    }
  };

  const updateBenefit = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) => i === index ? value : benefit)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("scholarships").insert({
        title: formData.title,
        organization: formData.organization,
        level: formData.level,
        field: formData.field,
        amount: formData.amount,
        deadline: formData.deadline,
        location: formData.location,
        application_url: formData.application_url,
        description: formData.description,
        requirements: formData.requirements.filter(req => req.trim() !== ""),
        benefits: formData.benefits.filter(benefit => benefit.trim() !== ""),
        posted_by: user.id
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Scholarship posted successfully!",
      });

      setFormData({
        title: "",
        organization: "",
        level: "",
        field: "",
        amount: "",
        deadline: "",
        location: "",
        application_url: "",
        description: "",
        requirements: [""],
        benefits: [""]
      });
      
      setOpen(false);
      onScholarshipCreated?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to post scholarship",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post New Scholarship</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="organization">Organization *</Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="level">Level *</Label>
              <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="masters">Master's</SelectItem>
                  <SelectItem value="postgraduate">Postgraduate</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="field">Field of Study *</Label>
              <Input
                id="field"
                value={formData.field}
                onChange={(e) => setFormData(prev => ({ ...prev, field: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="e.g., $5,000 per year, Full funding"
                required
              />
            </div>
            <div>
              <Label htmlFor="deadline">Deadline *</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="application_url">Application URL *</Label>
              <Input
                id="application_url"
                type="url"
                value={formData.application_url}
                onChange={(e) => setFormData(prev => ({ ...prev, application_url: e.target.value }))}
                placeholder="https://example.com/apply"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label>Requirements</Label>
            {formData.requirements.map((requirement, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Input
                  value={requirement}
                  onChange={(e) => updateRequirement(index, e.target.value)}
                  placeholder="Enter requirement"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeRequirement(index)}
                  disabled={formData.requirements.length === 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addRequirement}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Requirement
            </Button>
          </div>

          <div>
            <Label>Benefits</Label>
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Input
                  value={benefit}
                  onChange={(e) => updateBenefit(index, e.target.value)}
                  placeholder="Enter benefit"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeBenefit(index)}
                  disabled={formData.benefits.length === 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addBenefit}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Benefit
            </Button>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post Scholarship"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};