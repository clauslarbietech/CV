import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MENU_ITEMS = [
  { id: "progress", label: "Progress & Favorites", icon: "📖" },
  { id: "settings", label: "Settings", icon: "⚙" },
  { id: "support", label: "Info & Support", icon: "?" },
  { id: "review", label: "Leave a Review", icon: "✎" },
  { id: "share", label: "Share the App", icon: "⇧" },
  { id: "store", label: "Store", icon: "BAG" },
  { id: "donate", label: "Donate", icon: "♡" },
] as const;

export default function MoreScreen() {
  const [open, setOpen] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-1 px-4 pt-4">
        <Text className="mb-2 text-xl font-bold text-teal-ink">More</Text>
        <Text className="mb-6 text-sm text-parchment-ink/65">
          Account tools, progress, and support — same menu pattern as Through the
          Word.
        </Text>

        <Pressable
          accessibilityRole="button"
          className="self-start rounded-full bg-terracotta px-5 py-3"
          onPress={() => setOpen(true)}
        >
          <Text className="text-sm font-bold text-white">Open menu</Text>
        </Pressable>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/45 px-6">
          <View className="w-full max-w-sm overflow-hidden rounded-3xl bg-white">
            <View className="items-end px-3 pt-3">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close menu"
                onPress={() => setOpen(false)}
                className="h-8 w-8 items-center justify-center rounded-full bg-black/5"
              >
                <Text className="text-base font-bold text-parchment-ink/70">×</Text>
              </Pressable>
            </View>
            <ScrollView>
              {MENU_ITEMS.map((item, index) => (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  className={`flex-row items-center px-5 py-4 ${
                    index < MENU_ITEMS.length - 1 ? "border-b border-black/5" : ""
                  }`}
                  onPress={() => setOpen(false)}
                >
                  <Text className="w-8 text-base text-parchment-ink">{item.icon}</Text>
                  <Text className="text-base font-bold text-parchment-ink">
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
