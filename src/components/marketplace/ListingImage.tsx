import { useQuery } from "@tanstack/react-query";
import { ImageIcon } from "lucide-react";

import { createSignedImageUrl } from "@/lib/marketplace";
import { cn } from "@/lib/utils";

interface ListingImageProps {
  path: string | null;
  alt: string;
  className?: string;
}

/** Private bucket images are shown through short-lived signed URLs. */
export function ListingImage({ path, alt, className }: ListingImageProps) {
  const { data } = useQuery({
    queryKey: ["marketplace-image", path],
    enabled: Boolean(path),
    staleTime: 5 * 60 * 1000,
    queryFn: () => createSignedImageUrl(path!),
  });

  return (
    <div className={cn("grid place-items-center overflow-hidden bg-muted", className)}>
      {data ? (
        <img src={data} alt={alt} className="size-full object-cover" loading="lazy" />
      ) : (
        <ImageIcon className="size-6 text-muted-foreground" aria-hidden="true" />
      )}
    </div>
  );
}
