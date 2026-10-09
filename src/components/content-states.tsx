import { LoaderCircle } from "lucide-react";
import { content } from "@/content/fr";

export function LoadingState() {
  return <div role="status" className="flex items-center gap-3 text-muted-foreground"><LoaderCircle aria-hidden="true" className="size-5 motion-safe:animate-spin" /><span>{content.loading}</span></div>;
}

export function ErrorMessage({ message = content.error }: { message?: string }) {
  return <p role="alert" className="text-destructive">{message}</p>;
}

export function UnavailableState({ message = content.unavailable, className = "unavailable-message" }: { message?: string; className?: string }) {
  return <p className={`${className} text-muted-foreground`}>{message}</p>;
}