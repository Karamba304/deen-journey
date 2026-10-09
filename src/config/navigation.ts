import { BookOpen, HeartHandshake, House, Settings2, Target, UserRound } from "lucide-react";
import { content } from "@/content/fr";

export const sections = [
  { label: content.pages.home.title, path: "/", icon: House },
  { label: content.pages.goal.title, path: "/objectif", icon: Target },
  { label: content.pages.sources.title, path: "/sources", icon: BookOpen },
  { label: content.pages.sadaqa.title, path: "/sadaqa", icon: HeartHandshake },
  { label: content.pages.settings.title, path: "/parametres", icon: Settings2 },
  { label: content.pages.account.title, path: "/compte", icon: UserRound },
] as const;