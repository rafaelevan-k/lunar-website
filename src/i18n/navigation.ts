import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware Link and pathname: `href="/features"` becomes /en/features or /id/features.
export const { Link, usePathname, getPathname } = createNavigation(routing);
