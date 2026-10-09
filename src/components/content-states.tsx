import { LoaderCircle } from "lucide-react";
import { content } from "@/content/fr";

export function LoadingState() {
  return <div role="status" className="flex items-center gap-3 text-muted-foreground"><LoaderCircle aria-hidden="true" className="size-5 motion-safe:animate-spin" /><span>{content.loading}</span></div>;
}

export function ErrorMessage({ message = content.error }: { message?: string }) {
  return <p role="alert" className="text-destructive">{message}</p>;
}

export function UnavailableState() {
  return <p className="unavailable-message text-muted-foreground">{content.unavailable}</p>;
}