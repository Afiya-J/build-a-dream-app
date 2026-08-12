import { Link } from "@tanstack/react-router";
import { CalendarClock, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { MockEvent } from "@/data/mock";

export function EventPreviewCard({ event }: { event: MockEvent }) {
  return (
    <Link
      to="/events/$id"
      params={{ id: event.id }}
      className="flex w-64 shrink-0 flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-raised sm:w-72"
    >
      <Badge className="w-fit bg-accent text-accent-foreground hover:bg-accent">
        {event.category}
      </Badge>
      <h3 className="line-clamp-2 text-sm font-semibold text-foreground">{event.title}</h3>
      <dl className="space-y-1 text-xs text-muted-foreground">
        <div className="flex min-w-0 items-center gap-1.5">
          <CalendarClock className="size-3.5 shrink-0" aria-hidden="true" />
          <dt className="sr-only">Date</dt>
          <dd className="truncate">{event.date}</dd>
        </div>
        <div className="flex min-w-0 items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
          <dt className="sr-only">Venue</dt>
          <dd className="truncate">{event.venue}</dd>
        </div>
      </dl>
      <p className="text-xs font-medium text-amber-foreground">
        Registration closes {event.registrationDeadline}
      </p>
    </Link>
  );
}
