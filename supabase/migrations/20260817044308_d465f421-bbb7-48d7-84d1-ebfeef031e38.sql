CREATE POLICY "Students upload their own pdfs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'pdfs' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Signed-in students read pdfs"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'pdfs');