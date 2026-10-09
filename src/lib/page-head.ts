import { APP_NAME } from "@/config/app";
import { content, type PageKey } from "@/content/fr";

export function pageHead(key: PageKey) {
  const page = content.pages[key];
  const title = key === "home" ? APP_NAME : `${page.title} — ${APP_NAME}`;
  return { meta: [
    { title },
    { name: "description", content: page.description },
    { property: "og:title", content: `${page.title} — ${APP_NAME}` },
    { property: "og:description", content: page.description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] };
}