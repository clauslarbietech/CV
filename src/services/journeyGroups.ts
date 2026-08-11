import AsyncStorage from "@react-native-async-storage/async-storage";

import { getDeviceId } from "./deviceId";

const GROUPS_KEY = "journey:groups:v1";
const INVITES_KEY = "journey:invites-sent:v1";

export type JourneyGroupMember = {
  deviceId: string;
  displayName: string;
  joinedAt: string;
  /** Set when this member arrived via an invite link. */
  viaInvite?: boolean;
};

export type JourneyGroup = {
  id: string;
  journeyTitle: string;
  booksLabel: string;
  bookId?: string;
  createdAt: string;
  createdByDeviceId: string;
  members: JourneyGroupMember[];
};

export type SentInvite = {
  id: string;
  groupId: string;
  journeyTitle: string;
  booksLabel: string;
  bookId?: string;
  chapterNumber?: number;
  sentAt: string;
  /** Opens the invite link locally counts as a join on this device. */
  acceptedLocally?: boolean;
};

async function readGroups(): Promise<JourneyGroup[]> {
  try {
    const raw = await AsyncStorage.getItem(GROUPS_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as JourneyGroup[];
  } catch {
    return [];
  }
}

async function writeGroups(groups: JourneyGroup[]): Promise<void> {
  await AsyncStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
}

async function readSentInvites(): Promise<SentInvite[]> {
  try {
    const raw = await AsyncStorage.getItem(INVITES_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as SentInvite[];
  } catch {
    return [];
  }
}

async function writeSentInvites(invites: SentInvite[]): Promise<void> {
  await AsyncStorage.setItem(INVITES_KEY, JSON.stringify(invites));
}

function newId(): string {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `grp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function listJourneyGroups(): Promise<JourneyGroup[]> {
  return readGroups();
}

export async function getJourneyGroup(groupId: string): Promise<JourneyGroup | null> {
  const groups = await readGroups();
  return groups.find((group) => group.id === groupId) ?? null;
}

/** Reuse an existing group for the same journey title or create a new one. */
export async function getOrCreateJourneyGroup(input: {
  journeyTitle: string;
  booksLabel: string;
  bookId?: string;
}): Promise<JourneyGroup> {
  const deviceId = await getDeviceId();
  const groups = await readGroups();
  const existing = groups.find(
    (group) =>
      group.journeyTitle === input.journeyTitle &&
      group.booksLabel === input.booksLabel
  );

  if (existing) {
    const hasSelf = existing.members.some((member) => member.deviceId === deviceId);
    if (!hasSelf) {
      existing.members.push({
        deviceId,
        displayName: "You",
        joinedAt: new Date().toISOString(),
      });
      await writeGroups(groups);
    }
    return existing;
  }

  const created: JourneyGroup = {
    id: newId(),
    journeyTitle: input.journeyTitle,
    booksLabel: input.booksLabel,
    bookId: input.bookId,
    createdAt: new Date().toISOString(),
    createdByDeviceId: deviceId,
    members: [
      {
        deviceId,
        displayName: "You",
        joinedAt: new Date().toISOString(),
      },
    ],
  };

  await writeGroups([created, ...groups]);
  return created;
}

export async function joinJourneyGroup(input: {
  groupId: string;
  journeyTitle: string;
  booksLabel: string;
  bookId?: string;
  viaInvite?: boolean;
}): Promise<JourneyGroup> {
  const deviceId = await getDeviceId();
  const groups = await readGroups();
  let group = groups.find((item) => item.id === input.groupId);

  if (!group) {
    group = {
      id: input.groupId,
      journeyTitle: input.journeyTitle,
      booksLabel: input.booksLabel,
      bookId: input.bookId,
      createdAt: new Date().toISOString(),
      createdByDeviceId: deviceId,
      members: [],
    };
    groups.unshift(group);
  }

  const already = group.members.some((member) => member.deviceId === deviceId);
  if (!already) {
    group.members.push({
      deviceId,
      displayName: input.viaInvite ? "Reading partner" : "You",
      joinedAt: new Date().toISOString(),
      viaInvite: input.viaInvite,
    });
  }

  await writeGroups(groups);
  return group;
}

export async function recordInviteSent(input: {
  groupId: string;
  journeyTitle: string;
  booksLabel: string;
  bookId?: string;
  chapterNumber?: number;
}): Promise<SentInvite> {
  const invites = await readSentInvites();
  const entry: SentInvite = {
    id: newId(),
    groupId: input.groupId,
    journeyTitle: input.journeyTitle,
    booksLabel: input.booksLabel,
    bookId: input.bookId,
    chapterNumber: input.chapterNumber,
    sentAt: new Date().toISOString(),
  };
  await writeSentInvites([entry, ...invites]);
  return entry;
}

export async function listSentInvites(): Promise<SentInvite[]> {
  return readSentInvites();
}

/** Mark that someone opened your invite link (simulated locally when testing the link). */
export async function markInviteAccepted(groupId: string): Promise<void> {
  const invites = await readSentInvites();
  let changed = false;
  for (const invite of invites) {
    if (invite.groupId === groupId && !invite.acceptedLocally) {
      invite.acceptedLocally = true;
      changed = true;
    }
  }
  if (changed) {
    await writeSentInvites(invites);
  }
}

export function groupMemberCount(group: JourneyGroup): number {
  return group.members.length;
}
