import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

const MENU_ITEMS: {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}[] = [
  { id: "progress", label: "Progress & Favorites", icon: "auto-stories" },
  { id: "settings", label: "Settings", icon: "settings" },
  { id: "support", label: "Info & Support", icon: "help-outline" },
  { id: "review", label: "Leave a Review", icon: "rate-review" },
  { id: "share", label: "Share the App", icon: "ios-share" },
  { id: "store", label: "Store", icon: "shopping-bag" },
  { id: "donate", label: "Donate", icon: "favorite-border" },
];

export default function MoreScreen() {
  const [open, setOpen] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-night-bg" edges={["top", "left", "right"]}>
      <View className="flex-1 px-4 pt-4">
        <Text className="mb-2 text-xl font-bold text-night-text">More</Text>
        <Text className="mb-6 text-sm text-night-muted">
          Progress, settings, and support — open when you need them.
        </Text>

        <Pressable
          accessibilityRole="button"
          className="self-start flex-row items-center rounded-full bg-terracotta px-5 py-3"
          onPress={() => setOpen(true)}
        >
          <MaterialIcons name="menu" size={18} color="#FFFFFF" />
          <Text className="ml-2 text-sm font-bold text-white">Open menu</Text>
        </Pressable>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/45 px-6">
          <View className="w-full max-w-sm overflow-hidden rounded-3xl bg-night-card">
            <View className="items-end px-3 pt-3">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close menu"
                onPress={() => setOpen(false)}
                className="h-8 w-8 items-center justify-center rounded-full bg-night-elevated"
              >
                <MaterialIcons name="close" size={18} color="#F5F5F7" />
              </Pressable>
            </View>
            <ScrollView>
              {MENU_ITEMS.map((item, index) => (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  className={`flex-row items-center px-5 py-4 ${
                    index < MENU_ITEMS.length - 1 ? "border-b border-night-border" : ""
                  }`}
                  onPress={() => setOpen(false)}
                >
                  <MaterialIcons
                    name={item.icon}
                    size={22}
                    color="#F5F5F7"
                    style={{ width: 28 }}
                  />
                  <Text className="text-base font-bold text-night-text">
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
