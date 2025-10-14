-- Safely add missing foreign keys for *_applications.user_id -> profiles.id
DO $$
BEGIN
  -- job_applications.user_id -> profiles.id
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE t.relname = 'job_applications' AND c.conname = 'job_applications_user_id_fkey'
  ) THEN
    ALTER TABLE public.job_applications
    ADD CONSTRAINT job_applications_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(id)
    ON DELETE CASCADE;
  END IF;

  -- tender_applications.user_id -> profiles.id
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE t.relname = 'tender_applications' AND c.conname = 'tender_applications_user_id_fkey'
  ) THEN
    ALTER TABLE public.tender_applications
    ADD CONSTRAINT tender_applications_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Helpful indexes for performance
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON public.job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_tender_applications_user_id ON public.tender_applications(user_id);