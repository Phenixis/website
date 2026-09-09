export type PortfolioRoute = {
  focused: string;
  selectedPostId: string | null;
  selectedProjectId: string | null;
  selectedSideQuestId: string | null;
};

export function parsePortfolioRoute(pathname: string): PortfolioRoute {
  if (pathname === "/writing") {
    return { focused: "blog", selectedPostId: null, selectedProjectId: null, selectedSideQuestId: null };
  }
  if (pathname.startsWith("/writing/")) {
    return {
      focused: "blog",
      selectedPostId: decodeURIComponent(pathname.slice("/writing/".length)),
      selectedProjectId: null,
      selectedSideQuestId: null,
    };
  }
  if (pathname === "/itinerary") {
    return { focused: "experiences", selectedPostId: null, selectedProjectId: null, selectedSideQuestId: null };
  }
  if (pathname === "/side-quests") {
    return { focused: "sidequests", selectedPostId: null, selectedProjectId: null, selectedSideQuestId: null };
  }
  if (pathname.startsWith("/side-quests/")) {
    return {
      focused: "sidequests",
      selectedPostId: null,
      selectedProjectId: null,
      selectedSideQuestId: decodeURIComponent(pathname.slice("/side-quests/".length)),
    };
  }
  if (pathname.startsWith("/projects/")) {
    return {
      focused: "projects",
      selectedPostId: null,
      selectedProjectId: decodeURIComponent(pathname.slice("/projects/".length)),
      selectedSideQuestId: null,
    };
  }
  return { focused: "projects", selectedPostId: null, selectedProjectId: null, selectedSideQuestId: null };
}
