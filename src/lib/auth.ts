/**
 * Registration-number based identity helpers.
 *
 * The UI only ever asks for a registration number. Supabase Auth needs an
 * email, so we derive a deterministic internal identity that is never shown.
 */
const INTERNAL_EMAIL_DOMAIN = "campuslife.local";

export function normalizeRegistrationNumber(value: string): string {
  return value.trim().toUpperCase();
}

export function registrationNumberToEmail(value: string): string {
  return `${normalizeRegistrationNumber(value).replace(/[^A-Z0-9]/g, "")}@${INTERNAL_EMAIL_DOMAIN}`;
}

/** Turns a stored year integer into the existing UI label, e.g. 3 -> "3rd Year". */
export function formatYear(year: number): string {
  const suffix = year === 1 ? "st" : year === 2 ? "nd" : year === 3 ? "rd" : "th";
  return `${year}${suffix} Year`;
}

export function formatSemester(semester: number): string {
  return `Semester ${semester}`;
}

export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

export const AUTH_MESSAGES = {
  invalidCredentials: "Invalid registration number or password.",
  duplicate: "An account with this registration number already exists.",
  inactive:
    "Your CampusLife account has been deactivated. Please contact the administrator.",
  generic: "Something went wrong. Please try again.",
} as const;

/** Maps backend errors to friendly copy — raw Supabase errors never reach the UI. */
export function friendlyAuthError(error: unknown): string {
  const raw = (
    error && typeof error === "object" && "message" in error
      ? String((error as { message: unknown }).message)
      : ""
  ).toLowerCase();

  if (raw.includes("invalid login") || raw.includes("invalid credentials")) {
    return AUTH_MESSAGES.invalidCredentials;
  }
  if (
    raw.includes("already registered") ||
    raw.includes("already exists") ||
    raw.includes("duplicate key") ||
    raw.includes("user_already_exists")
  ) {
    return AUTH_MESSAGES.duplicate;
  }
  return AUTH_MESSAGES.generic;
}
