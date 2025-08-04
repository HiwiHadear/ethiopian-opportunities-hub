-- Create scholarships table
CREATE TABLE public.scholarships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  level TEXT NOT NULL,
  field TEXT NOT NULL,
  amount TEXT NOT NULL,
  deadline DATE NOT NULL,
  location TEXT NOT NULL,
  application_url TEXT NOT NULL,
  description TEXT,
  requirements TEXT[],
  benefits TEXT[],
  posted_by UUID,
  status TEXT NOT NULL DEFAULT 'approved',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

-- Create policies for scholarships
CREATE POLICY "Anyone can view approved scholarships" 
ON public.scholarships 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Admins can view all scholarships" 
ON public.scholarships 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "Only admins can create scholarships" 
ON public.scholarships 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "Admins can update any scholarship" 
ON public.scholarships 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_scholarships_updated_at
BEFORE UPDATE ON public.scholarships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();