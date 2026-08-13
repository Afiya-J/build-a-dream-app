import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
  AUTH_MESSAGES,
  normalizeRegistrationNumber,
  registrationNumberToEmail,
} from "@/lib/auth";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  initialize: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    console.error("[auth] failed to load profile", error.message);
    return null;
  }
  return data ?? null;
}

let subscribed = false;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,
  initialized: false,

  initialize: async () => {
    if (get().initialized) return;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session ?? null;

      if (session) {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user ?? null;
        const profile = user ? await fetchProfile(user.id) : null;

        if (profile && !profile.is_active) {
          await supabase.auth.signOut();
          set({ user: null, session: null, profile: null });
        } else {
          set({ user, session, profile });
        }
      }
    } catch (error) {
      console.error("[auth] initialization failed", error);
    } finally {
      set({ loading: false, initialized: true });
    }

    if (!subscribed) {
      subscribed = true;
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_OUT") {
          set({ user: null, session: null, profile: null });
          return;
        }
        if (event === "SIGNED_IN" || event === "USER_UPDATED" || event === "TOKEN_REFRESHED") {
          set({ session: session ?? null, user: session?.user ?? null });
          const userId = session?.user?.id;
          if (userId) {
            void fetchProfile(userId).then((profile) => set({ profile }));
          }
        }
      });
    }
  },

  refreshProfile: async () => {
    const userId = get().user?.id;
    if (!userId) return;
    set({ profile: await fetchProfile(userId) });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, profile: null });
  },
}));

/** Signs in with a registration number, enforcing the active-account rule. */
export async function signInWithRegistrationNumber(
  registrationNumber: string,
  password: string,
): Promise<{ error?: string }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: registrationNumberToEmail(registrationNumber),
    password,
  });

  if (error || !data.user) {
    return { error: AUTH_MESSAGES.invalidCredentials };
  }

  const profile = await fetchProfile(data.user.id);
  if (profile && !profile.is_active) {
    await supabase.auth.signOut();
    return { error: AUTH_MESSAGES.inactive };
  }

  useAuthStore.setState({
    user: data.user,
    session: data.session,
    profile,
    loading: false,
    initialized: true,
  });
  return {};
}

interface RegisterInput {
  fullName: string;
  registrationNumber: string;
  department: string;
  year: number;
  semester: number;
  password: string;
}

/** Creates the auth identity; the database trigger creates the student profile. */
export async function registerStudent(input: RegisterInput): Promise<{ error?: string }> {
  const registration_number = normalizeRegistrationNumber(input.registrationNumber);

  const { data, error } = await supabase.auth.signUp({
    email: registrationNumberToEmail(registration_number),
    password: input.password,
    options: {
      data: {
        full_name: input.fullName.trim(),
        registration_number,
        department: input.department,
        year: input.year,
        semester: input.semester,
      },
    },
  });

  if (error) {
    const raw = error.message.toLowerCase();
    if (
      raw.includes("already registered") ||
      raw.includes("already exists") ||
      raw.includes("duplicate")
    ) {
      return { error: AUTH_MESSAGES.duplicate };
    }
    return { error: AUTH_MESSAGES.generic };
  }

  if (!data.session || !data.user) {
    return { error: AUTH_MESSAGES.generic };
  }

  const profile = await fetchProfile(data.user.id);
  if (!profile) {
    await supabase.auth.signOut();
    return { error: AUTH_MESSAGES.generic };
  }

  useAuthStore.setState({
    user: data.user,
    session: data.session,
    profile,
    loading: false,
    initialized: true,
  });
  return {};
}
