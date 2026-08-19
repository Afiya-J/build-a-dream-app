import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ListingRow = Database["public"]["Tables"]["marketplace_listings"]["Row"];
export type ConversationRow = Database["public"]["Tables"]["marketplace_conversations"]["Row"];
export type MessageRow = Database["public"]["Tables"]["marketplace_messages"]["Row"];

export interface ListingWithSeller extends ListingRow {
  seller_name: string;
}

export const CATEGORIES = [
  { value: "textbooks", label: "Textbooks" },
  { value: "reference_books", label: "Reference Books" },
  { value: "calculators", label: "Calculators" },
  { value: "lab_equipment", label: "Lab Equipment" },
  { value: "stationery", label: "Stationery" },
  { value: "engineering_tools", label: "Engineering Tools" },
  { value: "project_materials", label: "Project Materials" },
  { value: "other", label: "Other" },
] as const;

export const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "like_new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
] as const;

export const STATUS_LABELS: Record<string, string> = {
  available: "Available",
  sold: "Sold",
  unavailable: "Unavailable",
};

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const MARKET_MESSAGES = {
  loadFailed: "We couldn't load listings right now. Please try again.",
  detailFailed: "We couldn't load this listing. Please try again.",
  createFailed: "We couldn't publish your listing. Please try again.",
  updateFailed: "We couldn't update this listing. Please try again.",
  imageType: "Only JPG, PNG or WEBP images are allowed.",
  imageSize: "Image must be 5 MB or smaller.",
  imageFailed: "We couldn't load this image.",
  chatFailed: "We couldn't open this conversation. Please try again.",
  sendFailed: "Your message wasn't sent. Please try again.",
} as const;

export function categoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? "Other";
}

export function conditionLabel(value: string): string {
  return CONDITIONS.find((c) => c.value === value)?.label ?? value;
}

export function formatPrice(listing: Pick<ListingRow, "is_free" | "price">): string {
  if (listing.is_free) return "Free";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(listing.price));
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const SELECT_WITH_SELLER = "*, profiles:seller_id(full_name)";
type RawJoined = ListingRow & { profiles: { full_name: string } | null };

function withSeller(rows: RawJoined[]): ListingWithSeller[] {
  return rows.map(({ profiles, ...row }) => ({
    ...row,
    seller_name: profiles?.full_name ?? "KRCT student",
  }));
}

export interface ListingFilters {
  collegeId: string;
  search?: string;
  category?: string | null;
  condition?: string | null;
  priceMode?: "all" | "free" | "paid";
}

export async function fetchListings(filters: ListingFilters): Promise<ListingWithSeller[]> {
  let query = supabase
    .from("marketplace_listings")
    .select(SELECT_WITH_SELLER)
    .eq("college_id", filters.collegeId)
    .eq("status", "available")
    .order("created_at", { ascending: false });

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.condition) query = query.eq("condition", filters.condition);
  if (filters.priceMode === "free") query = query.eq("is_free", true);
  if (filters.priceMode === "paid") query = query.eq("is_free", false);

  const term = filters.search?.trim();
  if (term) {
    const safe = term.replace(/[%,()]/g, " ");
    query = query.or(
      `title.ilike.%${safe}%,description.ilike.%${safe}%,category.ilike.%${safe}%`,
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(MARKET_MESSAGES.loadFailed);
  return withSeller((data ?? []) as RawJoined[]);
}

export async function fetchMyListings(sellerId: string): Promise<ListingWithSeller[]> {
  const { data, error } = await supabase
    .from("marketplace_listings")
    .select(SELECT_WITH_SELLER)
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(MARKET_MESSAGES.loadFailed);
  return withSeller((data ?? []) as RawJoined[]);
}

export async function fetchListing(id: string): Promise<ListingWithSeller | null> {
  const { data, error } = await supabase
    .from("marketplace_listings")
    .select(SELECT_WITH_SELLER)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(MARKET_MESSAGES.detailFailed);
  if (!data) return null;
  return withSeller([data as RawJoined])[0] ?? null;
}

export async function createSignedImageUrl(path: string): Promise<string | null> {
  const { data } = await supabase.storage
    .from("marketplace-images")
    .createSignedUrl(path, 600);
  return data?.signedUrl ?? null;
}

export function validateImage(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return MARKET_MESSAGES.imageType;
  if (file.size > MAX_IMAGE_BYTES) return MARKET_MESSAGES.imageSize;
  return null;
}

export interface CreateListingInput {
  sellerId: string;
  collegeId: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  isFree: boolean;
  price: number;
  collectionLocation: string;
  image: File | null;
}

export async function createListing(input: CreateListingInput): Promise<string> {
  let imagePath: string | null = null;

  if (input.image) {
    const ext = input.image.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${input.sellerId}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("marketplace-images")
      .upload(path, input.image, { contentType: input.image.type });
    if (uploadError) throw new Error(MARKET_MESSAGES.createFailed);
    imagePath = path;
  }

  const { data, error } = await supabase
    .from("marketplace_listings")
    .insert({
      seller_id: input.sellerId,
      college_id: input.collegeId,
      title: input.title.trim(),
      description: input.description.trim() || null,
      category: input.category,
      condition: input.condition,
      is_free: input.isFree,
      price: input.isFree ? 0 : input.price,
      collection_location: input.collectionLocation.trim() || null,
      image_path: imagePath,
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(MARKET_MESSAGES.createFailed);
  return data.id;
}

export async function updateListingStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from("marketplace_listings")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(MARKET_MESSAGES.updateFailed);
}

/** Finds or creates the single conversation for this buyer + listing. */
export async function openConversation(
  listingId: string,
  buyerId: string,
  sellerId: string,
): Promise<string> {
  const { data: existing } = await supabase
    .from("marketplace_conversations")
    .select("id")
    .eq("listing_id", listingId)
    .eq("buyer_id", buyerId)
    .maybeSingle();
  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("marketplace_conversations")
    .insert({ listing_id: listingId, buyer_id: buyerId, seller_id: sellerId })
    .select("id")
    .single();
  if (error || !data) throw new Error(MARKET_MESSAGES.chatFailed);
  return data.id;
}

export interface ConversationSummary {
  id: string;
  listing_id: string;
  listing_title: string;
  other_name: string;
  updated_at: string;
}

export async function fetchConversations(userId: string): Promise<ConversationSummary[]> {
  const { data, error } = await supabase
    .from("marketplace_conversations")
    .select(
      "id, listing_id, buyer_id, seller_id, updated_at, marketplace_listings:listing_id(title), buyer:buyer_id(full_name), seller:seller_id(full_name)",
    )
    .order("updated_at", { ascending: false });
  if (error) throw new Error(MARKET_MESSAGES.chatFailed);

  type Raw = {
    id: string;
    listing_id: string;
    buyer_id: string;
    seller_id: string;
    updated_at: string;
    marketplace_listings: { title: string } | null;
    buyer: { full_name: string } | null;
    seller: { full_name: string } | null;
  };

  return ((data ?? []) as Raw[]).map((row) => ({
    id: row.id,
    listing_id: row.listing_id,
    listing_title: row.marketplace_listings?.title ?? "Listing",
    other_name:
      (row.buyer_id === userId ? row.seller?.full_name : row.buyer?.full_name) ?? "Student",
    updated_at: row.updated_at,
  }));
}

export interface ConversationDetail extends ConversationSummary {
  buyer_id: string;
  seller_id: string;
}

export async function fetchConversation(
  id: string,
  userId: string,
): Promise<ConversationDetail | null> {
  const { data, error } = await supabase
    .from("marketplace_conversations")
    .select(
      "id, listing_id, buyer_id, seller_id, updated_at, marketplace_listings:listing_id(title), buyer:buyer_id(full_name), seller:seller_id(full_name)",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(MARKET_MESSAGES.chatFailed);
  if (!data) return null;

  const row = data as unknown as {
    id: string;
    listing_id: string;
    buyer_id: string;
    seller_id: string;
    updated_at: string;
    marketplace_listings: { title: string } | null;
    buyer: { full_name: string } | null;
    seller: { full_name: string } | null;
  };

  return {
    id: row.id,
    listing_id: row.listing_id,
    buyer_id: row.buyer_id,
    seller_id: row.seller_id,
    listing_title: row.marketplace_listings?.title ?? "Listing",
    other_name:
      (row.buyer_id === userId ? row.seller?.full_name : row.buyer?.full_name) ?? "Student",
    updated_at: row.updated_at,
  };
}

export async function fetchMessages(conversationId: string): Promise<MessageRow[]> {
  const { data, error } = await supabase
    .from("marketplace_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(MARKET_MESSAGES.chatFailed);
  return data ?? [];
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  message: string,
): Promise<void> {
  const text = message.trim().slice(0, 2000);
  if (!text) throw new Error(MARKET_MESSAGES.sendFailed);
  const { error } = await supabase
    .from("marketplace_messages")
    .insert({ conversation_id: conversationId, sender_id: senderId, message: text });
  if (error) throw new Error(MARKET_MESSAGES.sendFailed);
  await supabase
    .from("marketplace_conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);
}
