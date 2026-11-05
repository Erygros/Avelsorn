import { industryPages } from "./industries";
import { solutionPages } from "./solutions";
import { guidePages } from "./guides";
import { generalSearchPages } from "./general";
import { searchPagePath } from "./types";
export { searchHubs, searchPagePath, sectionFor } from "./types";
export type { SearchPage } from "./types";
export const searchPages = [
    ...industryPages,
    ...solutionPages,
    ...guidePages,
    ...generalSearchPages,
];
export const findSearchPage = (path: string) =>
    searchPages.find((page) => searchPagePath(page) === path);
