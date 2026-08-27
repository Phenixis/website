export type PortfolioRoute = {
  focused: string;
  selectedPostId: string | null;
  selectedProjectId: string | null;
};

export function parsePortfolioRoute(pathname: string): PortfolioRoute {
  if (pathname === "/writing") {
    return { focused: "blog", selectedPostId: null, selectedProjectId: null };
  }
  if (pathname.startsWith("/writing/")) {
    return {
      focused: "blog",
      selectedPostId: decodeURIComponent(pathname.slice("/writing/".length)),
      selectedProjectId: null,
    };
  }
  if (pathname === "/itinerary") {
    return { focused: "experiences", selectedPostId: null, selectedProjectId: null };
  }
  if (pathname.startsWith("/projects/")) {
    return {
      focused: "projects",
      selectedPostId: null,
      selectedProjectId: decodeURIComponent(pathname.slice("/projects/".length)),
    };
  }
  return { focused: "projects", selectedPostId: null, selectedProjectId: null };
}
