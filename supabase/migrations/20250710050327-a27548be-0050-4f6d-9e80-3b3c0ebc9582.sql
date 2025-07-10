-- Create RLS policies for jobs
CREATE POLICY "Anyone can view approved jobs" 
ON public.jobs 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Users can create jobs" 
ON public.jobs 
FOR INSERT 
WITH CHECK (auth.uid() = posted_by);

CREATE POLICY "Users can update their own jobs" 
ON public.jobs 
FOR UPDATE 
USING (auth.uid() = posted_by);

CREATE POLICY "Admins can view all jobs" 
ON public.jobs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update any job" 
ON public.jobs 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create RLS policies for tenders
CREATE POLICY "Anyone can view approved tenders" 
ON public.tenders 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Users can create tenders" 
ON public.tenders 
FOR INSERT 
WITH CHECK (auth.uid() = posted_by);

CREATE POLICY "Users can update their own tenders" 
ON public.tenders 
FOR UPDATE 
USING (auth.uid() = posted_by);

CREATE POLICY "Admins can view all tenders" 
ON public.tenders 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update any tender" 
ON public.tenders 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create RLS policies for companies
CREATE POLICY "Anyone can view approved companies" 
ON public.companies 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Users can create companies" 
ON public.companies 
FOR INSERT 
WITH CHECK (auth.uid() = posted_by);

CREATE POLICY "Users can update their own companies" 
ON public.companies 
FOR UPDATE 
USING (auth.uid() = posted_by);

CREATE POLICY "Admins can view all companies" 
ON public.companies 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update any company" 
ON public.companies 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create RLS policies for job_applications
CREATE POLICY "Users can view their own job applications" 
ON public.job_applications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own job applications" 
ON public.job_applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job applications" 
ON public.job_applications 
FOR UPDATE 
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can view all job applications" 
ON public.job_applications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update job applications" 
ON public.job_applications 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create RLS policies for tender_applications
CREATE POLICY "Users can view their own tender applications" 
ON public.tender_applications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tender applications" 
ON public.tender_applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tender applications" 
ON public.tender_applications 
FOR UPDATE 
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can view all tender applications" 
ON public.tender_applications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update tender applications" 
ON public.tender_applications 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenders_updated_at
  BEFORE UPDATE ON public.tenders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tender_applications_updated_at
  BEFORE UPDATE ON public.tender_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_posted_by ON public.jobs(posted_by);
CREATE INDEX idx_jobs_created_at ON public.jobs(created_at DESC);

CREATE INDEX idx_tenders_status ON public.tenders(status);
CREATE INDEX idx_tenders_posted_by ON public.tenders(posted_by);
CREATE INDEX idx_tenders_created_at ON public.tenders(created_at DESC);
CREATE INDEX idx_tenders_deadline ON public.tenders(deadline);

CREATE INDEX idx_companies_status ON public.companies(status);
CREATE INDEX idx_companies_posted_by ON public.companies(posted_by);
CREATE INDEX idx_companies_created_at ON public.companies(created_at DESC);

CREATE INDEX idx_job_applications_user_id ON public.job_applications(user_id);
CREATE INDEX idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX idx_job_applications_status ON public.job_applications(status);
CREATE INDEX idx_job_applications_applied_at ON public.job_applications(applied_at DESC);

CREATE INDEX idx_tender_applications_user_id ON public.tender_applications(user_id);
CREATE INDEX idx_tender_applications_tender_id ON public.tender_applications(tender_id);
CREATE INDEX idx_tender_applications_status ON public.tender_applications(status);
CREATE INDEX idx_tender_applications_applied_at ON public.tender_applications(applied_at DESC);