import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { useAuthStore } from "@/stores/auth-store";

/** Reads auth state, kicking off initialization on first client render. */
export function useAuth() {
  const state = useAuthStore();

  useEffect(() => {
    void useAuthStore.getState().initialize();
  }, []);

  return state;
}

/**
 * For public auth screens: once initialization finishes, signed-in users are
 * sent to the dashboard instead of seeing login/register again.
 */
export function useRedirectIfAuthenticated() {
  const { initialized, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized && user) {
      void navigate({ to: "/home", replace: true });
    }
  }, [initialized, user, navigate]);

  return { initialized, isAuthenticated: Boolean(user) };
}
