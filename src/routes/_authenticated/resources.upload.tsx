import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/FieldError";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { formatSemester, formatYear } from "@/lib/auth";
import { DEPARTMENTS } from "@/lib/constants";
import {
  MAX_PDF_BYTES,
  RESOURCE_MESSAGES,
  RESOURCE_TYPE_META,
  createResource,
  isValidHttpUrl,
} from "@/lib/resources";
import type { ResourceDbType } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/resources/upload")({
  head: () => ({
    meta: [
      { title: "Upload a resource — CampusLife" },
      { name: "description", content: "Share your notes, question papers or useful links with other KRCT students." },
      { property: "og:title", content: "Upload a resource — CampusLife" },
      { property: "og:description", content: "Share your notes, question papers or useful links with other KRCT students." },
    ],
  }),
  component: ResourceUploadPage,
});

const YEAR_OPTIONS = [1, 2, 3, 4] as const;
const SEMESTERS_FOR_YEAR: Record<number, readonly number[]> = {
  1: [1, 2],
  2: [3, 4],
  3: [5, 6],
  4: [7, 8],
};
const TYPE_OPTIONS: ResourceDbType[] = ["notes", "pyq", "youtube", "website"];

interface Errors {
  type?: string;
  department?: string;
  year?: string;
  semester?: string;
  subject?: string;
  title?: string;
  file?: string;
  url?: string;
}

function ResourceUploadPage() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [type, setType] = useState<ResourceDbType | "">("");
  const [department, setDepartment] = useState(profile?.department ?? "");
  const [year, setYear] = useState(profile ? String(profile.year) : "");
  const [semester, setSemester] = useState(profile ? String(profile.semester) : "");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isFileType = type ? RESOURCE_TYPE_META[type].isFile : false;
  const semesterOptions = year ? (SEMESTERS_FOR_YEAR[Number(year)] ?? []) : [];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const next: Errors = {};
    if (!type) next.type = "Select a resource type";
    if (!department) next.department = "Select a department";
    if (!year) next.year = "Select a year";
    if (!semester) next.semester = "Select a semester";
    if (!subject.trim()) next.subject = "Subject is required";
    if (!title.trim()) next.title = "Title is required";

    if (type && isFileType) {
      if (!file) next.file = "Attach a PDF file";
      else if (file.type !== "application/pdf") next.file = RESOURCE_MESSAGES.fileType;
      else if (file.size > MAX_PDF_BYTES) next.file = RESOURCE_MESSAGES.fileSize;
    } else if (type) {
      if (!url.trim()) next.url = "Link is required";
      else if (!isValidHttpUrl(url)) next.url = RESOURCE_MESSAGES.linkInvalid;
    }

    setErrors(next);
    setFormError(null);
    if (Object.keys(next).length > 0) return;

    if (!user || !profile?.college_id) {
      setFormError(RESOURCE_MESSAGES.uploadFailed);
      return;
    }

    setSubmitting(true);
    try {
      const id = await createResource({
        uploaderId: user.id,
        collegeId: profile.college_id,
        type: type as ResourceDbType,
        department,
        year: Number(year),
        semester: Number(semester),
        subject,
        title,
        description,
        file,
        url,
      });
      await queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast.success("Resource uploaded");
      void navigate({ to: "/resources/$id", params: { id }, replace: true });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : RESOURCE_MESSAGES.uploadFailed);
      setSubmitting(false);
    }
  }

  return (
    <AppShell title="Upload a resource" backTo="/resources">
      <form
        className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card"
        onSubmit={handleSubmit}
      >
        <div className="space-y-1.5">
          <Label htmlFor="type">Resource type</Label>
          <Select
            value={type}
            onValueChange={(v) => setType(v as ResourceDbType)}
            disabled={submitting}
          >
            <SelectTrigger id="type" className="h-11">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((t) => (
                <SelectItem key={t} value={t}>
                  {RESOURCE_TYPE_META[t].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormError message={errors.type} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="department">Department</Label>
          <Select value={department} onValueChange={setDepartment} disabled={submitting}>
            <SelectTrigger id="department" className="h-11">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormError message={errors.department} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="year">Year</Label>
            <Select
              value={year}
              onValueChange={(v) => {
                setYear(v);
                setSemester("");
              }}
              disabled={submitting}
            >
              <SelectTrigger id="year" className="h-11">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {YEAR_OPTIONS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {formatYear(y)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormError message={errors.year} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="semester">Semester</Label>
            <Select
              value={semester}
              onValueChange={setSemester}
              disabled={!year || submitting}
            >
              <SelectTrigger id="semester" className="h-11">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                {semesterOptions.map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    {formatSemester(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormError message={errors.semester} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            className="h-11"
            placeholder="e.g. Operating Systems"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={submitting}
          />
          <FormError message={errors.subject} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            className="h-11"
            placeholder="e.g. Unit 3 handwritten notes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
          />
          <FormError message={errors.title} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
          />
        </div>

        {type ? (
          isFileType ? (
            <div className="space-y-1.5">
              <Label htmlFor="pdf">PDF file (max 10 MB)</Label>
              <Input
                id="pdf"
                type="file"
                accept="application/pdf"
                className="h-11 pt-2.5"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                disabled={submitting}
              />
              <FormError message={errors.file} />
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="url">
                {type === "youtube" ? "YouTube link" : "Website link"}
              </Label>
              <Input
                id="url"
                inputMode="url"
                className="h-11"
                placeholder="https://"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={submitting}
              />
              <FormError message={errors.url} />
            </div>
          )
        ) : null}

        <FormError message={formError} />

        <Button type="submit" className="h-11 w-full" disabled={submitting}>
          {submitting ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner size="sm" className="text-primary-foreground" />
              Uploading…
            </span>
          ) : (
            "Upload resource"
          )}
        </Button>
      </form>
    </AppShell>
  );
}
