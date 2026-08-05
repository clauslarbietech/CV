import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

export default function GroupsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-night-bg" edges={["top", "left", "right"]}>
      <View className="flex-1 items-center justify-center px-8">
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-night-card">
          <MaterialIcons name="groups" size={32} color="#F0D78C" />
        </View>
        <Text className="mb-2 text-xl font-bold text-night-text">
          Groups coming soon
        </Text>
        <Text className="text-center text-sm leading-5 text-night-muted">
          Family and church listening groups will live here. For now, start a
          story from Browse — each scene can be read aloud for kids who can’t
          read yet.
        </Text>
      </View>
    </SafeAreaView>
  );
}
