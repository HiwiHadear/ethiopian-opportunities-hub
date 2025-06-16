
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface PostCompanyDialogProps {
  onSubmit: (company: any) => void;
}

const PostCompanyDialog = ({ onSubmit }: PostCompanyDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    emoji: '🏢'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCompany = {
      id: Date.now(),
      ...formData
    };
    onSubmit(newCompany);
    setFormData({
      name: '',
      sector: '',
      emoji: '🏢'
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Company
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="emoji">Emoji</Label>
            <Input
              id="emoji"
              value={formData.emoji}
              onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
              placeholder="🏢"
              className="w-20"
              required
            />
          </div>
          <div>
            <Label htmlFor="name">Company Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="sector">Sector</Label>
            <Input
              id="sector"
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full">Add Company</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostCompanyDialog;
