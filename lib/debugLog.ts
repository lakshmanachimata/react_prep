/** Logs only in the browser — avoids SSR/dev-server console memory growth. */
export function debugLog(...args: unknown[]) {
  if (typeof window === "undefined") return;
  console.log(...args);
}
