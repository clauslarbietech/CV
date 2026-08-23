/** Session gate so the FitLife logo fade-in runs once per cold start. */

let shownThisSession = false;

export function wasLaunchSplashShown(): boolean {
  return shownThisSession;
}

export function markLaunchSplashShown(): void {
  shownThisSession = true;
}

/** Replay intro / sign-out should show the logo fade again. */
export function resetLaunchSplash(): void {
  shownThisSession = false;
}
