import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { sections } from "@/config/navigation";

describe("Lot 1 navigation", () => {
  it("keeps exactly the six requested sections in order", () => {
    expect(sections.map(({ path }) => path)).toEqual(["/", "/objectif", "/sources", "/sadaqa", "/parametres", "/compte"]);
  });
  it.each(["/", "/objectif", "/sources", "/sadaqa", "/parametres", "/compte"])("matches %s to its own page", (path) => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes(path).at(-1)?.routeId).toBe(path);
  });
});