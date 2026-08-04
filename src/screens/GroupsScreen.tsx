import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

export default function GroupsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-1 items-center justify-center px-8">
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-parchment">
          <MaterialIcons name="groups" size={32} color="#1E3A6E" />
        </View>
        <Text className="mb-2 text-xl font-bold text-teal-ink">
          Groups coming soon
        </Text>
        <Text className="text-center text-sm leading-5 text-parchment-ink/65">
          Family and church listening groups will live here. For now, start a
          story from Browse — each scene can be read aloud for kids who can’t
          read yet.
        </Text>
      </View>
    </SafeAreaView>
  );
}
