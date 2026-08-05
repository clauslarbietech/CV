import { Platform, Share } from "react-native";

export type JourneyInviteInput = {
  journeyTitle: string;
  booksLabel: string;
  bookId?: string;
  chapterNumber?: number;
};

function appBaseUrl(): string {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    const path = window.location.pathname.startsWith("/CV") ? "/CV/" : "/";
    return `${window.location.origin}${path}`;
  }
  return "https://clauslarbietech.github.io/CV/";
}

/** Build a join link others can open in the web preview / app. */
export function buildJourneyInviteUrl(input: JourneyInviteInput): string {
  const url = new URL(appBaseUrl());
  url.searchParams.set("invite", "1");
  url.searchParams.set("journey", input.journeyTitle);
  if (input.bookId) {
    url.searchParams.set("book", input.bookId);
  }
  if (input.chapterNumber) {
    url.searchParams.set("chapter", String(input.chapterNumber));
  }
  return url.toString();
}

export function buildJourneyInviteMessage(input: JourneyInviteInput): string {
  const link = buildJourneyInviteUrl(input);
  const chapterBit = input.chapterNumber
    ? ` We’re on chapter ${input.chapterNumber}.`
    : "";
  return (
    `Join me on “${input.journeyTitle} Together” in Anime Audio Bible — ${input.booksLabel}.${chapterBit} ` +
    `Let’s read and listen together!\n\n${link}`
  );
}

/**
 * Opens the native share sheet (iOS/Android) or Web Share API —
 * contacts, Messages, Copy, Notes, etc.
 */
export async function inviteToJourney(
  input: JourneyInviteInput
): Promise<{ shared: boolean }> {
  const message = buildJourneyInviteMessage(input);
  const url = buildJourneyInviteUrl(input);
  const title = `Join ${input.journeyTitle} Together`;

  try {
    if (
      Platform.OS === "web" &&
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      await navigator.share({ title, text: message, url });
      return { shared: true };
    }

    const result = await Share.share(
      Platform.OS === "ios"
        ? { message, url, title }
        : { message, title }
    );

    if (result.action === Share.sharedAction) {
      return { shared: true };
    }
    return { shared: false };
  } catch {
    // User dismissed the sheet or share unavailable.
    return { shared: false };
  }
}
