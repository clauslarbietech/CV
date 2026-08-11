import { Platform } from "react-native";

import { BRAND } from "../content/brand";
import {
  getOrCreateJourneyGroup,
  joinJourneyGroup,
  markInviteAccepted,
  recordInviteSent,
} from "./journeyGroups";

export type JourneyInviteInput = {
  journeyTitle: string;
  booksLabel: string;
  bookId?: string;
  chapterNumber?: number;
  /** Reuse an existing group when inviting the same journey. */
  groupId?: string;
};

export type JourneyInviteResult = {
  shared: boolean;
  groupId: string;
  url: string;
};

function appBaseUrl(): string {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    const path = window.location.pathname.startsWith("/CV") ? "/CV/" : "/";
    return `${window.location.origin}${path}`;
  }
  return "https://clauslarbietech.github.io/CV/";
}

/** Build a join link others can open in the web preview / app. */
export function buildJourneyInviteUrl(input: JourneyInviteInput & { groupId: string }): string {
  const url = new URL(appBaseUrl());
  url.searchParams.set("invite", "1");
  url.searchParams.set("group", input.groupId);
  url.searchParams.set("journey", input.journeyTitle);
  if (input.bookId) {
    url.searchParams.set("book", input.bookId);
  }
  if (input.chapterNumber) {
    url.searchParams.set("chapter", String(input.chapterNumber));
  }
  return url.toString();
}

export function buildJourneyInviteMessage(
  input: JourneyInviteInput & { groupId: string }
): string {
  const link = buildJourneyInviteUrl(input);
  const chapterBit = input.chapterNumber
    ? ` We’re on chapter ${input.chapterNumber}.`
    : "";
  return (
    `Join me on “${input.journeyTitle} Together” in ${BRAND.inviteAppLabel} — ${input.booksLabel}.${chapterBit} ` +
    `Let’s read and listen together!\n\n${link}`
  );
}

/**
 * Opens the native share sheet (iOS/Android) or Web Share API —
 * contacts, Messages, Copy, Notes, etc.
 * Creates or reuses a journey group and records the invite when shared.
 */
export async function inviteToJourney(
  input: JourneyInviteInput
): Promise<JourneyInviteResult> {
  const group =
    input.groupId
      ? await joinJourneyGroup({
          groupId: input.groupId,
          journeyTitle: input.journeyTitle,
          booksLabel: input.booksLabel,
          bookId: input.bookId,
        })
      : await getOrCreateJourneyGroup({
          journeyTitle: input.journeyTitle,
          booksLabel: input.booksLabel,
          bookId: input.bookId,
        });

  const payload = { ...input, groupId: group.id };
  const message = buildJourneyInviteMessage(payload);
  const url = buildJourneyInviteUrl(payload);
  const title = `Join ${input.journeyTitle} Together`;

  try {
    if (
      Platform.OS === "web" &&
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      await navigator.share({ title, text: message, url });
      await recordInviteSent({
        groupId: group.id,
        journeyTitle: input.journeyTitle,
        booksLabel: input.booksLabel,
        bookId: input.bookId,
        chapterNumber: input.chapterNumber,
      });
      return { shared: true, groupId: group.id, url };
    }

    const { Share } = await import("react-native");
    const result = await Share.share(
      Platform.OS === "ios"
        ? { message, url, title }
        : { message, title }
    );

    if (result.action === Share.sharedAction) {
      await recordInviteSent({
        groupId: group.id,
        journeyTitle: input.journeyTitle,
        booksLabel: input.booksLabel,
        bookId: input.bookId,
        chapterNumber: input.chapterNumber,
      });
      return { shared: true, groupId: group.id, url };
    }
    return { shared: false, groupId: group.id, url };
  } catch {
    return { shared: false, groupId: group.id, url };
  }
}

export type ParsedInviteParams = {
  groupId: string;
  journeyTitle: string;
  bookId?: string;
  chapterNumber?: number;
};

export function parseInviteSearchParams(
  search: string
): ParsedInviteParams | null {
  const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
  if (params.get("invite") !== "1") {
    return null;
  }
  const groupId = params.get("group");
  const journeyTitle = params.get("journey");
  if (!groupId || !journeyTitle) {
    return null;
  }
  const bookId = params.get("book") ?? undefined;
  const chapterRaw = params.get("chapter");
  const chapterNumber = chapterRaw ? Number(chapterRaw) : undefined;
  return {
    groupId,
    journeyTitle,
    bookId: bookId || undefined,
    chapterNumber:
      chapterNumber && Number.isFinite(chapterNumber) ? chapterNumber : undefined,
  };
}

/** Accept an invite from a deep link or query string. */
export async function acceptJourneyInvite(
  params: ParsedInviteParams,
  booksLabel = "Bible journey"
): Promise<{ groupId: string }> {
  await joinJourneyGroup({
    groupId: params.groupId,
    journeyTitle: params.journeyTitle,
    booksLabel,
    bookId: params.bookId,
    viaInvite: true,
  });
  await markInviteAccepted(params.groupId);
  return { groupId: params.groupId };
}
