import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { BibleVersion } from "@youversion/platform-core";
import {
  hasYouVersionAppKey,
  listEnglishBibleVersions,
} from "../../services/youversionService";

export type BibleSource =
  | { kind: "youversion"; versionId: number; abbreviation: string }
  | { kind: "esv"; abbreviation: "ESV" };

type Props = {
  visible: boolean;
  selected: BibleSource;
  onClose: () => void;
  onSelect: (source: BibleSource) => void;
};

/**
 * YouVersion-style version picker.
 * Lists Platform Bible versions (when App Key is set) plus Crossway ESV.
 */
export default function VersionPickerModal({
  visible,
  selected,
  onClose,
  onSelect,
}: Props) {
  const { height } = useWindowDimensions();
  const [versions, setVersions] = useState<BibleVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      return;
    }
    if (!hasYouVersionAppKey()) {
      setVersions([]);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    void listEnglishBibleVersions()
      .then((items) => {
        if (!cancelled) {
          setVersions(items);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load YouVersion Bible versions."
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [visible]);

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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/55">
        <View
          className="rounded-t-3xl bg-[#1C1C1E] px-4 pb-8 pt-3"
          style={{ maxHeight: height * 0.72 }}
        >
          <View className="mb-3 items-center">
            <View className="mb-3 h-1 w-10 rounded-full bg-white/25" />
            <View className="w-full flex-row items-center justify-between">
              <Text className="text-lg font-bold text-white">Bible version</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close version picker"
                onPress={onClose}
                className="h-9 w-9 items-center justify-center rounded-full bg-white/10"
              >
                <MaterialIcons name="close" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              onSelect({ kind: "esv", abbreviation: "ESV" });
              onClose();
            }}
            className={`mb-2 flex-row items-center rounded-2xl px-3 py-3 ${
              isSelected({ kind: "esv", abbreviation: "ESV" })
                ? "bg-white/15"
                : "bg-white/5"
            }`}
          >
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <Text className="text-xs font-bold text-white">ESV</Text>
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-white">
                English Standard Version
              </Text>
              <Text className="text-xs text-white/50">
                Crossway API · separate key
              </Text>
            </View>
            {isSelected({ kind: "esv", abbreviation: "ESV" }) ? (
              <MaterialIcons name="check" size={22} color="#E4572E" />
            ) : null}
          </Pressable>

          {!hasYouVersionAppKey() ? (
            <Text className="mt-2 px-1 text-xs leading-4 text-white/45">
              Add EXPO_PUBLIC_YOUVERSION_APP_KEY from platform.youversion.com to
              unlock more versions (BSB, NIV when licensed, and others).
            </Text>
          ) : loading ? (
            <View className="items-center py-8">
              <ActivityIndicator color="#E4572E" />
              <Text className="mt-2 text-sm text-white/55">
                Loading YouVersion versions…
              </Text>
            </View>
          ) : error ? (
            <Text className="mt-2 px-1 text-xs leading-4 text-[#F3A07A]">
              {error}
            </Text>
          ) : (
            <FlatList
              data={versions}
              keyExtractor={(item) => String(item.id)}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <Text className="mb-2 mt-3 text-xs font-bold uppercase tracking-[2px] text-white/40">
                  YouVersion Platform
                </Text>
              }
              renderItem={({ item }) => {
                const source: BibleSource = {
                  kind: "youversion",
                  versionId: item.id,
                  abbreviation:
                    item.localized_abbreviation || item.abbreviation,
                };
                const active = isSelected(source);
                return (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      onSelect(source);
                      onClose();
                    }}
                    className={`mb-2 flex-row items-center rounded-2xl px-3 py-3 ${
                      active ? "bg-white/15" : "bg-white/5"
                    }`}
                  >
                    <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white/10">
                      <Text className="text-[10px] font-bold text-white">
                        {source.abbreviation.slice(0, 4)}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-bold text-white">
                        {item.localized_title || item.title}
                      </Text>
                      <Text className="text-xs text-white/50" numberOfLines={1}>
                        {item.abbreviation}
                        {item.language_tag ? ` · ${item.language_tag}` : ""}
                      </Text>
                    </View>
                    {active ? (
                      <MaterialIcons name="check" size={22} color="#E4572E" />
                    ) : null}
                  </Pressable>
                );
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
