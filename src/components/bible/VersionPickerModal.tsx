import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { BibleVersion } from "@youversion/platform-core";
import {
  loadCollectedVersionIds,
  toggleCollectedVersionId,
} from "../../services/biblePreferences";
import {
  POPULAR_YOUVERSION_IDS,
  hasYouVersionAppKey,
  listEnglishBibleVersions,
} from "../../services/youversionService";
import { readerColors } from "../../theme/readerColors";
import type { BibleSource } from "../../types/bibleSource";

export type { BibleSource };

type Props = {
  visible: boolean;
  selected: BibleSource;
  onClose: () => void;
  onSelect: (source: BibleSource) => void;
};

type Row =
  | { type: "header"; id: string; title: string }
  | { type: "esv"; id: "esv" }
  | { type: "version"; id: string; version: BibleVersion };

/**
 * Version picker with:
 * - Crossway ESV (local API)
 * - Collected / popular YouVersion versions (NIV, BSB, … when licensed)
 * - Full English catalog from the Bible API + search
 */
export default function VersionPickerModal({
  visible,
  selected,
  onClose,
  onSelect,
}: Props) {
  const { height } = useWindowDimensions();
  const [versions, setVersions] = useState<BibleVersion[]>([]);
  const [collected, setCollected] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      return;
    }

    let cancelled = false;
    setQuery("");
    setLoading(true);
    setError(null);

    void (async () => {
      const savedCollected = await loadCollectedVersionIds();
      if (!cancelled) {
        setCollected(savedCollected);
      }

      if (!hasYouVersionAppKey()) {
        if (!cancelled) {
          setVersions([]);
          setLoading(false);
        }
        return;
      }

      try {
        const items = await listEnglishBibleVersions({ forceRefresh: true });
        if (!cancelled) {
          setVersions(items);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load YouVersion Bible versions."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [visible]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = (version: BibleVersion) => {
      if (!q) {
        return true;
      }
      const hay = [
        version.abbreviation,
        version.localized_abbreviation,
        version.title,
        version.localized_title,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    };

    const byId = new Map(versions.map((version) => [version.id, version]));
    const popularOrder: number[] = [
      POPULAR_YOUVERSION_IDS.NIV,
      POPULAR_YOUVERSION_IDS.BSB,
      POPULAR_YOUVERSION_IDS.ASV,
      POPULAR_YOUVERSION_IDS.WEBUS,
    ];

    const collectedVersions = collected
      .map((id) => byId.get(id))
      .filter((item): item is BibleVersion => Boolean(item && matches(item)));

    const popularVersions = popularOrder
      .map((id) => byId.get(id))
      .filter(
        (item): item is BibleVersion =>
          Boolean(item && matches(item) && !collected.includes(item.id))
      );

    const rest = versions.filter(
      (version) =>
        matches(version) &&
        !collected.includes(version.id) &&
        !popularOrder.includes(version.id)
    );

    const next: Row[] = [{ type: "esv", id: "esv" }];

    if (collectedVersions.length) {
      next.push({ type: "header", id: "h-collected", title: "My versions" });
      for (const version of collectedVersions) {
        next.push({ type: "version", id: `c-${version.id}`, version });
      }
    }

    if (popularVersions.length) {
      next.push({ type: "header", id: "h-popular", title: "Popular" });
      for (const version of popularVersions) {
        next.push({ type: "version", id: `p-${version.id}`, version });
      }
    }

    if (hasYouVersionAppKey() && !loading) {
      next.push({
        type: "header",
        id: "h-all",
        title: rest.length || versions.length ? "All English versions" : "YouVersion",
      });
      for (const version of rest) {
        next.push({ type: "version", id: `a-${version.id}`, version });
      }
    }

    return next;
  }, [collected, loading, query, versions]);

  const isSelected = (source: BibleSource) => {
    if (source.kind !== selected.kind) {
      return false;
    }
    if (source.kind === "esv") {
      return true;
    }
    return (
      selected.kind === "youversion" && source.versionId === selected.versionId
    );
  };

  const onToggleCollect = async (versionId: number) => {
    const next = await toggleCollectedVersionId(versionId);
    setCollected(next);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/55">
        <View
          className="rounded-t-3xl px-4 pb-8 pt-3"
          style={{
            maxHeight: height * 0.78,
            backgroundColor: readerColors.surface,
          }}
        >
          <View className="mb-3 items-center">
            <View
              className="mb-3 h-1 w-10 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
            />
            <View className="w-full flex-row items-center justify-between">
              <Text
                className="text-lg font-bold"
                style={{ color: readerColors.text }}
              >
                Bible version
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close version picker"
                onPress={onClose}
                className="h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: readerColors.elevated }}
              >
                <MaterialIcons name="close" size={20} color={readerColors.text} />
              </Pressable>
            </View>
          </View>

          {hasYouVersionAppKey() ? (
            <View
              className="mb-3 flex-row items-center rounded-2xl px-3"
              style={{ backgroundColor: readerColors.elevated }}
            >
              <MaterialIcons name="search" size={20} color={readerColors.faint} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search NIV, BSB, ASV…"
                placeholderTextColor={readerColors.faint}
                className="ml-2 flex-1 py-3 text-base"
                style={{ color: readerColors.text }}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>
          ) : null}

          {!hasYouVersionAppKey() ? (
            <Text
              className="mb-3 px-1 text-xs leading-4"
              style={{ color: readerColors.secondary }}
            >
              Add your YouVersion App Key to pull NIV, BSB, and other licensed
              versions from the Bible API. ESV below still works with the
              Crossway key.
            </Text>
          ) : null}

          {loading ? (
            <View className="items-center py-8">
              <ActivityIndicator color={readerColors.accent} />
              <Text
                className="mt-2 text-sm"
                style={{ color: readerColors.secondary }}
              >
                Loading Bible versions…
              </Text>
            </View>
          ) : error ? (
            <Text
              className="mb-3 px-1 text-xs leading-4"
              style={{ color: readerColors.warn }}
            >
              {error}
            </Text>
          ) : (
            <FlatList
              data={rows}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                if (item.type === "header") {
                  return (
                    <Text
                      className="mb-2 mt-3 text-xs font-bold uppercase tracking-[2px]"
                      style={{ color: readerColors.faint }}
                    >
                      {item.title}
                    </Text>
                  );
                }

                if (item.type === "esv") {
                  const source: BibleSource = {
                    kind: "esv",
                    abbreviation: "ESV",
                  };
                  const active = isSelected(source);
                  return (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => {
                        onSelect(source);
                        onClose();
                      }}
                      className="mb-2 flex-row items-center rounded-2xl px-3 py-3"
                      style={{
                        backgroundColor: active
                          ? readerColors.elevated
                          : "rgba(255,255,255,0.04)",
                      }}
                    >
                      <View
                        className="mr-3 h-10 w-10 items-center justify-center rounded-full"
                        style={{ backgroundColor: readerColors.elevated }}
                      >
                        <Text
                          className="text-xs font-bold"
                          style={{ color: readerColors.text }}
                        >
                          ESV
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text
                          className="text-base font-bold"
                          style={{ color: readerColors.text }}
                        >
                          English Standard Version
                        </Text>
                        <Text
                          className="text-xs"
                          style={{ color: readerColors.secondary }}
                        >
                          Crossway API
                        </Text>
                      </View>
                      {active ? (
                        <MaterialIcons
                          name="check"
                          size={22}
                          color={readerColors.accent}
                        />
                      ) : null}
                    </Pressable>
                  );
                }

                const version = item.version;
                const source: BibleSource = {
                  kind: "youversion",
                  versionId: version.id,
                  abbreviation:
                    version.localized_abbreviation || version.abbreviation,
                };
                const active = isSelected(source);
                const saved = collected.includes(version.id);

                return (
                  <View
                    className="mb-2 flex-row items-center rounded-2xl px-2 py-2"
                    style={{
                      backgroundColor: active
                        ? readerColors.elevated
                        : "rgba(255,255,255,0.04)",
                    }}
                  >
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Select ${source.abbreviation}`}
                      onPress={() => {
                        onSelect(source);
                        onClose();
                      }}
                      className="flex-1 flex-row items-center px-1 py-1"
                    >
                      <View
                        className="mr-3 h-10 w-10 items-center justify-center rounded-full"
                        style={{ backgroundColor: readerColors.elevated }}
                      >
                        <Text
                          className="text-[10px] font-bold"
                          style={{ color: readerColors.text }}
                        >
                          {source.abbreviation.slice(0, 4)}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text
                          className="text-base font-bold"
                          style={{ color: readerColors.text }}
                        >
                          {version.localized_title || version.title}
                        </Text>
                        <Text
                          className="text-xs"
                          style={{ color: readerColors.secondary }}
                          numberOfLines={1}
                        >
                          {version.abbreviation}
                          {version.id === POPULAR_YOUVERSION_IDS.NIV
                            ? " · requires license"
                            : ""}
                        </Text>
                      </View>
                      {active ? (
                        <MaterialIcons
                          name="check"
                          size={22}
                          color={readerColors.accent}
                        />
                      ) : null}
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={
                        saved
                          ? `Remove ${source.abbreviation} from my versions`
                          : `Save ${source.abbreviation} to my versions`
                      }
                      onPress={() => {
                        void onToggleCollect(version.id);
                      }}
                      className="h-10 w-10 items-center justify-center"
                      hitSlop={8}
                    >
                      <MaterialIcons
                        name={saved ? "star" : "star-border"}
                        size={22}
                        color={saved ? readerColors.highlight : readerColors.faint}
                      />
                    </Pressable>
                  </View>
                );
              }}
              ListEmptyComponent={
                hasYouVersionAppKey() ? (
                  <Text
                    className="px-1 py-6 text-sm"
                    style={{ color: readerColors.secondary }}
                  >
                    No versions matched. Accept licenses in the YouVersion
                    Platform portal, then reopen this picker.
                  </Text>
                ) : null
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
