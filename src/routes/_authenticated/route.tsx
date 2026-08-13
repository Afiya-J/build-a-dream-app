import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { useAuthStore } from "@/stores/auth-store";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const store = useAuthStore.getState();
    await store.initialize();
    if (!useAuthStore.getState().user) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => <Outlet />,
});
