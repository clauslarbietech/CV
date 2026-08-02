import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GroupsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-1 items-center justify-center px-8">
        <Text className="mb-2 text-xl font-bold text-teal-ink">Groups</Text>
        <Text className="text-center text-sm leading-5 text-parchment-ink/65">
          Through the Word–style listening groups are coming next. For now, use
          voice reflections on each chapter to capture what God is teaching you.
        </Text>
      </View>
    </SafeAreaView>
  );
}
