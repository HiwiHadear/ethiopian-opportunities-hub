-- Enable realtime for tender_applications table
ALTER TABLE public.tender_applications REPLICA IDENTITY FULL;

-- Add the table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.tender_applications;