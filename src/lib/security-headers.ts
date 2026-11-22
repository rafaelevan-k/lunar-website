/*
 * Security headers for every response (applied in next.config.ts).
 *
 * script-src keeps 'unsafe-inline': Next.js puts the page data in inline <script> tags, and the only
 * way to avoid that (a nonce) needs every page rendered per request, which the static site can't do.
 * See docs/ADR/ADR-0001. The risk stays small: the site has no forms, no user input, no third-party
 * scripts, and everything else is limited to this site's own origin.
 */
const isDev = process.env.NODE_ENV === "development";
const onVercel = Boolean(process.env.VERCEL);

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // Motion and Next set inline style attributes.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(onVercel ? ["upgrade-insecure-requests"] : []),
].join("; ");

export const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];
