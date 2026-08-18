import { FileText, Globe, HelpCircle, Youtube } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ResourceRow = Database["public"]["Tables"]["resources"]["Row"];
export type ResourceDbType = "notes" | "pyq" | "youtube" | "website";

export interface ResourceWithUploader extends ResourceRow {
  uploader_name: string;
}

export const RESOURCE_TYPE_META: Record<
  ResourceDbType,
  { label: string; icon: LucideIcon; isFile: boolean }
> = {
  notes: { label: "Notes", icon: FileText, isFile: true },
  pyq: { label: "PYQ", icon: HelpCircle, isFile: true },
  youtube: { label: "Video", icon: Youtube, isFile: false },
  website: { label: "Website", icon: Globe, isFile: false },
};

/** Chip filters shown on /resources map to database type values. */
export const TYPE_FILTERS = [
  { label: "All", value: "All" },
  { label: "Notes", value: "notes" },
  { label: "PYQs", value: "pyq" },
  { label: "Videos", value: "youtube" },
  { label: "Websites", value: "website" },
] as const;

export const MAX_PDF_BYTES = 10 * 1024 * 1024;

export const RESOURCE_MESSAGES = {
  loadFailed: "We couldn't load resources right now. Please try again.",
  detailFailed: "We couldn't load this resource. Please try again.",
  uploadFailed: "Upload failed. Please check your connection and try again.",
  fileType: "Only PDF files are allowed.",
  fileSize: "PDF must be 10 MB or smaller.",
  linkInvalid: "Enter a valid link starting with http:// or https://",
  signedUrlFailed: "We couldn't open this PDF. Please try again.",
} as const;

export function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function formatUploadDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface ListFilters {
  collegeId: string;
  department?: string | null;
  year?: string | null;
  semester?: string | null;
  subject?: string | null;
  type?: string;
}

/** Year/semester filters arrive as UI labels ("3rd Year"), stored as integers. */
export function parseYearLabel(label: string | null | undefined): number | null {
  if (!label) return null;
  const n = Number.parseInt(label, 10);
  return Number.isFinite(n) ? n : null;
}

export function parseSemesterLabel(label: string | null | undefined): number | null {
  if (!label) return null;
  const match = label.match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

const SELECT_WITH_UPLOADER = "*, profiles:uploader_id(full_name)";

type RawJoined = ResourceRow & { profiles: { full_name: string } | null };

function withUploader(rows: RawJoined[]): ResourceWithUploader[] {
  return rows.map(({ profiles, ...row }) => ({
    ...row,
    uploader_name: profiles?.full_name ?? "KRCT student",
  }));
}

export async function fetchResources(filters: ListFilters): Promise<ResourceWithUploader[]> {
  let query = supabase
    .from("resources")
    .select(SELECT_WITH_UPLOADER)
    .eq("college_id", filters.collegeId)
    .order("created_at", { ascending: false });

  if (filters.department) query = query.eq("department", filters.department);
  const year = parseYearLabel(filters.year);
  if (year) query = query.eq("year", year);
  const semester = parseSemesterLabel(filters.semester);
  if (semester) query = query.eq("semester", semester);
  if (filters.subject) query = query.eq("subject", filters.subject);
  if (filters.type && filters.type !== "All") query = query.eq("type", filters.type);

  const { data, error } = await query;
  if (error) throw new Error(RESOURCE_MESSAGES.loadFailed);
  return withUploader((data ?? []) as RawJoined[]);
}

export async function fetchSubjects(
  collegeId: string,
  department: string | null,
  year: string | null,
  semester: string | null,
): Promise<string[]> {
  let query = supabase.from("resources").select("subject").eq("college_id", collegeId);
  if (department) query = query.eq("department", department);
  const y = parseYearLabel(year);
  if (y) query = query.eq("year", y);
  const s = parseSemesterLabel(semester);
  if (s) query = query.eq("semester", s);

  const { data, error } = await query;
  if (error) throw new Error(RESOURCE_MESSAGES.loadFailed);
  return [...new Set((data ?? []).map((r) => r.subject))].sort((a, b) => a.localeCompare(b));
}

export async function fetchResource(id: string): Promise<ResourceWithUploader | null> {
  const { data, error } = await supabase
    .from("resources")
    .select(SELECT_WITH_UPLOADER)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(RESOURCE_MESSAGES.detailFailed);
  if (!data) return null;
  return withUploader([data as RawJoined])[0] ?? null;
}

export async function registerView(id: string): Promise<void> {
  await supabase.rpc("increment_resource_view", { _resource_id: id });
}

export async function registerDownload(id: string): Promise<void> {
  await supabase.rpc("increment_resource_download", { _resource_id: id });
}

export async function createSignedPdfUrl(filePath: string): Promise<string> {
  const { data, error } = await supabase.storage.from("pdfs").createSignedUrl(filePath, 300);
  if (error || !data?.signedUrl) throw new Error(RESOURCE_MESSAGES.signedUrlFailed);
  return data.signedUrl;
}

export interface CreateResourceInput {
  uploaderId: string;
  collegeId: string;
  type: ResourceDbType;
  department: string;
  year: number;
  semester: number;
  subject: string;
  title: string;
  description: string;
  file?: File | null;
  url?: string;
}

export async function createResource(input: CreateResourceInput): Promise<string> {
  let filePath: string | null = null;

  if (RESOURCE_TYPE_META[input.type].isFile) {
    const file = input.file;
    if (!file) throw new Error(RESOURCE_MESSAGES.fileType);
    if (file.type !== "application/pdf") throw new Error(RESOURCE_MESSAGES.fileType);
    if (file.size > MAX_PDF_BYTES) throw new Error(RESOURCE_MESSAGES.fileSize);

    const safeName = file.name.replace(/[^A-Za-z0-9._-]/g, "_");
    filePath = `${input.uploaderId}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(filePath, file, { contentType: "application/pdf", upsert: false });
    if (uploadError) throw new Error(RESOURCE_MESSAGES.uploadFailed);
  }

  const { data, error } = await supabase
    .from("resources")
    .insert({
      uploader_id: input.uploaderId,
      college_id: input.collegeId,
      type: input.type,
      department: input.department,
      year: input.year,
      semester: input.semester,
      subject: input.subject.trim(),
      title: input.title.trim(),
      description: input.description.trim() || null,
      file_path: filePath,
      url: filePath ? null : (input.url?.trim() ?? null),
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(RESOURCE_MESSAGES.uploadFailed);
  return data.id;
}
