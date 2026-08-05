import { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import AppTabBar from "../components/navigation/AppTabBar";
import type { RootStackParamList } from "../navigation/types";
import {
  loadProfile,
  saveProfile,
  type UserProfile,
} from "../services/userPreferences";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

export default function ProfileScreen({ navigation }: Props) {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [saved, setSaved] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void loadProfile().then(setProfile);
    }, [])
  );

  const save = () => {
    void saveProfile(profile).then((next) => {
      setProfile(next);
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-night-bg" edges={["top", "left", "right"]}>
      <View className="flex-1">
        <View className="flex-row items-center px-4 py-3">
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-night-elevated"
          >
            <MaterialIcons name="arrow-back" size={20} color="#F2F2F7" />
          </Pressable>
          <Text className="text-xl font-bold text-night-text">Profile</Text>
        </View>

        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
          <Text className="mb-4 text-sm text-night-muted">
            Keep it simple — first name, last name, and an email if you want
            (Apple ID email works too).
          </Text>

          <Text className="mb-1 text-xs font-bold uppercase tracking-wide text-ochre-soft">
            First name
          </Text>
          <TextInput
            value={profile.firstName}
            onChangeText={(firstName) =>
              setProfile((current) => ({ ...current, firstName }))
            }
            placeholder="First name"
            placeholderTextColor="#8E8E93"
            className="mb-3 rounded-2xl bg-night-elevated px-3 py-3 text-sm text-night-text"
            autoCapitalize="words"
          />

          <Text className="mb-1 text-xs font-bold uppercase tracking-wide text-ochre-soft">
            Last name
          </Text>
          <TextInput
            value={profile.lastName}
            onChangeText={(lastName) =>
              setProfile((current) => ({ ...current, lastName }))
            }
            placeholder="Last name"
            placeholderTextColor="#8E8E93"
            className="mb-3 rounded-2xl bg-night-elevated px-3 py-3 text-sm text-night-text"
            autoCapitalize="words"
          />

          <Text className="mb-1 text-xs font-bold uppercase tracking-wide text-ochre-soft">
            Email
          </Text>
          <TextInput
            value={profile.email}
            onChangeText={(email) =>
              setProfile((current) => ({ ...current, email }))
            }
            placeholder="you@email.com"
            placeholderTextColor="#8E8E93"
            className="mb-5 rounded-2xl bg-night-elevated px-3 py-3 text-sm text-night-text"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Pressable
            accessibilityRole="button"
            onPress={save}
            className="items-center rounded-full bg-terracotta py-3.5"
          >
            <Text className="text-sm font-bold text-white">
              {saved ? "Saved" : "Save profile"}
            </Text>
          </Pressable>
        </ScrollView>

        <AppTabBar activeTab="More" />
      </View>
    </SafeAreaView>
  );
}
