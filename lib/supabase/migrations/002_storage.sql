-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

-- Allow authenticated users to upload files
CREATE POLICY "Users can upload files" ON storage.objects
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND bucket_id = 'uploads');

-- Allow authenticated users to read files
CREATE POLICY "Users can read own files" ON storage.objects
  FOR SELECT USING (auth.uid() IS NOT NULL AND bucket_id = 'uploads');

-- Allow users to delete only their own files (folder name matches user ID)
CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1] AND bucket_id = 'uploads');
