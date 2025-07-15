-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);

-- Create policies for document uploads
CREATE POLICY "Anyone can view documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can upload documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create documents table to store metadata
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  pages INTEGER DEFAULT 0,
  category TEXT DEFAULT 'Other',
  status TEXT DEFAULT 'processing',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on documents table
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies for documents table
CREATE POLICY "Anyone can view approved documents" 
ON public.documents 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Users can view their own documents" 
ON public.documents 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own documents" 
ON public.documents 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" 
ON public.documents 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all documents" 
ON public.documents 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "Admins can update any document" 
ON public.documents 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Create trigger for updating updated_at
CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();