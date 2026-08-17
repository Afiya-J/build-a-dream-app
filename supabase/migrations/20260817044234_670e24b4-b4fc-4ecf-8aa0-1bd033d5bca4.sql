CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  uploader_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  department TEXT NOT NULL,
  year INTEGER NOT NULL,
  semester INTEGER NOT NULL,
  subject TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('notes','pyq','youtube','website')),
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  url TEXT,
  download_count INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT resources_payload_check CHECK (
    (type IN ('notes','pyq') AND file_path IS NOT NULL AND url IS NULL)
    OR (type IN ('youtube','website') AND url IS NOT NULL AND file_path IS NULL)
  )
);

CREATE INDEX resources_college_filter_idx ON public.resources (college_id, department, year, semester);

GRANT SELECT, INSERT ON public.resources TO authenticated;
GRANT ALL ON public.resources TO service_role;

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students read resources from their college"
ON public.resources FOR SELECT TO authenticated
USING (college_id = (SELECT p.college_id FROM public.profiles p WHERE p.id = auth.uid()));

CREATE POLICY "Students create their own resources"
ON public.resources FOR INSERT TO authenticated
WITH CHECK (
  uploader_id = auth.uid()
  AND college_id = (SELECT p.college_id FROM public.profiles p WHERE p.id = auth.uid())
  AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_active)
);

CREATE TRIGGER update_resources_updated_at
BEFORE UPDATE ON public.resources
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.increment_resource_view(_resource_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.resources r
  SET view_count = r.view_count + 1
  WHERE r.id = _resource_id
    AND r.college_id = (SELECT p.college_id FROM public.profiles p WHERE p.id = auth.uid());
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_resource_download(_resource_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.resources r
  SET download_count = r.download_count + 1
  WHERE r.id = _resource_id
    AND r.college_id = (SELECT p.college_id FROM public.profiles p WHERE p.id = auth.uid());
END;
$$;

REVOKE ALL ON FUNCTION public.increment_resource_view(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.increment_resource_download(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.increment_resource_view(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_resource_download(UUID) TO authenticated;