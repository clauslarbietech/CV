import { create } from 'zustand';

/**
 * Global FitLife logo splash — play on every open / return to the app.
 * Incrementing `generation` remounts the overlay fade-in.
 */
type LaunchSplashState = {
  generation: number;
  /** Bump so the root overlay plays the logo fade again. */
  requestSplash: () => void;
};

export const useLaunchSplashStore = create<LaunchSplashState>((set) => ({
  generation: 1,
  requestSplash: () => set((s) => ({ generation: s.generation + 1 })),
}));
