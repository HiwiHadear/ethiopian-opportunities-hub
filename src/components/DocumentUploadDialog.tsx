import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface DocumentUploadDialogProps {
  onUploadComplete?: () => void;
  trigger?: React.ReactNode;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({ onUploadComplete, trigger }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const categories = [
    'History', 'Mathematics', 'Business', 'Science', 'Literature', 'Technology', 'Other'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file type (only allow PDFs and images)
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Please upload a PDF or image file (JPEG, PNG)");
        return;
      }
      
      // Check file size (max 50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        toast.error("File size must be less than 50MB");
        return;
      }
      
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleUpload = async () => {
    if (!user) {
      toast.error("Please sign in to upload documents");
      return;
    }

    if (!file || !title || !category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create file path with user ID
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      setUploadProgress(100);

      if (uploadError) {
        throw uploadError;
      }

      // Save document metadata to database
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          title,
          description,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          category,
          status: 'pending'
        });

      if (dbError) {
        throw dbError;
      }

      toast.success("Document uploaded successfully! It will be reviewed by admins.");
      
      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
      setCategory('');
      setIsOpen(false);
      
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload document. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a PDF or image file to add to the digital library. All uploads are reviewed by administrators.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* File Selection */}
          <div className="space-y-2">
            <Label htmlFor="file">File *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <Input
                id="file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {file && (
                <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>{file.name}</span>
                  <span>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
              disabled={isUploading}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory} disabled={isUploading}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the document"
              disabled={isUploading}
              rows={3}
            />
          </div>

          {/* Progress Bar */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Info */}
          <div className="flex items-start space-x-2 text-sm text-gray-600">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>Supported formats: PDF, JPEG, PNG. Max file size: 50MB. All uploads require admin approval.</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || !title || !category || isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;