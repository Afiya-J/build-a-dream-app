CREATE TABLE public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id),
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('textbooks','reference_books','calculators','lab_equipment','stationery','engineering_tools','project_materials','other')),
  condition TEXT NOT NULL CHECK (condition IN ('new','like_new','good','fair')),
  price NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  is_free BOOLEAN NOT NULL DEFAULT false,
  collection_location TEXT,
  image_path TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available','sold','unavailable')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT free_listing_price_zero CHECK (NOT is_free OR price = 0)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketplace_listings TO authenticated;
GRANT ALL ON public.marketplace_listings TO service_role;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_marketplace_listings_feed ON public.marketplace_listings (college_id, status, created_at DESC);
CREATE INDEX idx_marketplace_listings_seller ON public.marketplace_listings (seller_id, created_at DESC);

CREATE POLICY "Read listings from own college" ON public.marketplace_listings
  FOR SELECT TO authenticated
  USING (college_id = (SELECT p.college_id FROM public.profiles p WHERE p.id = auth.uid()));
CREATE POLICY "Create own listings" ON public.marketplace_listings
  FOR INSERT TO authenticated
  WITH CHECK (
    seller_id = auth.uid()
    AND college_id = (SELECT p.college_id FROM public.profiles p WHERE p.id = auth.uid())
    AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_active)
  );
CREATE POLICY "Update own listings" ON public.marketplace_listings
  FOR UPDATE TO authenticated
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());
CREATE POLICY "Delete own listings" ON public.marketplace_listings
  FOR DELETE TO authenticated
  USING (seller_id = auth.uid());

CREATE TRIGGER update_marketplace_listings_updated_at
  BEFORE UPDATE ON public.marketplace_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.marketplace_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT no_self_conversation CHECK (buyer_id <> seller_id),
  UNIQUE (listing_id, buyer_id, seller_id)
);
GRANT SELECT, INSERT, UPDATE ON public.marketplace_conversations TO authenticated;
GRANT ALL ON public.marketplace_conversations TO service_role;
ALTER TABLE public.marketplace_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants read conversations" ON public.marketplace_conversations
  FOR SELECT TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Buyer creates conversation" ON public.marketplace_conversations
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = buyer_id
    AND buyer_id <> seller_id
    AND EXISTS (
      SELECT 1 FROM public.marketplace_listings l
      WHERE l.id = listing_id
        AND l.seller_id = marketplace_conversations.seller_id
        AND l.college_id = (SELECT p.college_id FROM public.profiles p WHERE p.id = auth.uid())
    )
  );

CREATE TRIGGER update_marketplace_conversations_updated_at
  BEFORE UPDATE ON public.marketplace_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.marketplace_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.marketplace_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL CHECK (btrim(message) <> '' AND length(message) <= 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.marketplace_messages TO authenticated;
GRANT ALL ON public.marketplace_messages TO service_role;
ALTER TABLE public.marketplace_messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_marketplace_messages_conversation ON public.marketplace_messages (conversation_id, created_at);

CREATE POLICY "Participants read messages" ON public.marketplace_messages
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.marketplace_conversations c
    WHERE c.id = conversation_id AND (auth.uid() = c.buyer_id OR auth.uid() = c.seller_id)
  ));
CREATE POLICY "Participants send messages" ON public.marketplace_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.marketplace_conversations c
      WHERE c.id = conversation_id AND (auth.uid() = c.buyer_id OR auth.uid() = c.seller_id)
    )
  );

CREATE POLICY "Read own marketplace images" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'marketplace-images');
CREATE POLICY "Upload own marketplace images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'marketplace-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Delete own marketplace images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'marketplace-images' AND (storage.foldername(name))[1] = auth.uid()::text);