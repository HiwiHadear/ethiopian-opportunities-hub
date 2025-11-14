-- Create email_branding table
CREATE TABLE IF NOT EXISTS public.email_branding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#667eea',
  secondary_color TEXT NOT NULL DEFAULT '#764ba2',
  company_name TEXT NOT NULL DEFAULT 'Your Company',
  company_website TEXT,
  support_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_branding ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view email branding"
  ON public.email_branding
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can update email branding"
  ON public.email_branding
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert email branding"
  ON public.email_branding
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_email_branding_updated_at
  BEFORE UPDATE ON public.email_branding
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for email logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('email-logos', 'email-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for email logos
CREATE POLICY "Anyone can view email logos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'email-logos');

CREATE POLICY "Admins can upload email logos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'email-logos' 
    AND has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can update email logos"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'email-logos' 
    AND has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can delete email logos"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'email-logos' 
    AND has_role(auth.uid(), 'admin'::app_role)
  );

-- Insert default branding settings
INSERT INTO public.email_branding (company_name)
VALUES ('Your Company')
ON CONFLICT DO NOTHING;