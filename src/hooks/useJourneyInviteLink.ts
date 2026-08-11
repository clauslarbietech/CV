import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import type { NavigationContainerRef } from "@react-navigation/native";

import { JOURNEYS } from "../data/library";
import type { RootStackParamList } from "../navigation/types";
import {
  acceptJourneyInvite,
  parseInviteSearchParams,
} from "../services/journeyInvite";

/**
 * When someone opens an invite link (?invite=1&group=…), join the journey group
 * and navigate to the invited chapter on web.
 */
export function useJourneyInviteLink(
  navigationRef: NavigationContainerRef<RootStackParamList> | null,
  navigationReady: boolean
) {
  const handledRef = useRef(false);

  useEffect(() => {
    if (
      handledRef.current ||
      !navigationReady ||
      Platform.OS !== "web" ||
      typeof window === "undefined"
    ) {
      return;
    }

    const parsed = parseInviteSearchParams(window.location.search);
    if (!parsed || !navigationRef?.isReady()) {
      return;
    }

    handledRef.current = true;

    const journey = JOURNEYS.find(
      (item) =>
        item.title === parsed.journeyTitle ||
        item.bookIds.includes(parsed.bookId ?? "")
    );

    void acceptJourneyInvite(
      parsed,
      journey?.booksLabel ?? "Bible journey"
    ).then(() => {
      if (parsed.bookId && parsed.chapterNumber) {
        navigationRef.navigate("ChapterPlayer", {
          bookId: parsed.bookId,
          chapterNumber: parsed.chapterNumber,
          autoPlay: false,
        });
      } else if (journey) {
        navigationRef.navigate("JourneyDetail", { journeyId: journey.id });
      }

      const cleanPath = window.location.pathname;
      window.history.replaceState({}, "", cleanPath);
    });
  }, [navigationReady, navigationRef]);
}
