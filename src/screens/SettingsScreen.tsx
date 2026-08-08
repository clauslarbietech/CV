import { useEffect, useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import AccessibleIconButton from "../components/accessibility/AccessibleIconButton";
import VoicePickerModal from "../components/bible/VoicePickerModal";
import AppTabBar from "../components/navigation/AppTabBar";
import type { RootStackParamList } from "../navigation/types";
import {
  formatSpeechRate,
  listSpeechVoices,
  loadSpeechPreferences,
  saveSpeechRate,
  saveSpeechVoiceId,
  SPEECH_RATES,
} from "../services/speechPreferences";
import { useTheme } from "../theme/ThemeProvider";

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

function SettingRow({
  label,
  hint,
  value,
  onChange,
  trackOff,
  thumb,
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (next: boolean) => void;
  trackOff: string;
  thumb: string;
}) {
  return (
    <View className="mb-3 flex-row items-center rounded-2xl border border-night-border bg-night-card px-4 py-3">
      <View className="flex-1 pr-3">
        <Text className="text-base font-bold text-night-text">{label}</Text>
        <Text className="mt-0.5 text-xs text-night-muted">{hint}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: trackOff, true: "#E4572E" }}
        thumbColor={thumb}
        accessibilityLabel={label}
        accessibilityHint={hint}
        accessibilityRole="switch"
      />
    </View>
  );
}

export default function SettingsScreen({ navigation }: Props) {
  const {
    nightMode,
    largerText,
    reduceMotion,
    highContrast,
    setNightMode,
    setLargerText,
    setReduceMotion,
    setHighContrast,
    colors,
  } = useTheme();
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [voiceId, setVoiceId] = useState<string | null>(null);
  const [voiceLabel, setVoiceLabel] = useState("System default");
  const [speechRate, setSpeechRate] = useState(0.85);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const prefs = await loadSpeechPreferences();
      if (cancelled) {
        return;
      }
      setVoiceId(prefs.voiceId);
      setSpeechRate(prefs.rate);
      if (!prefs.voiceId) {
        setVoiceLabel("System default");
        return;
      }
      const voices = await listSpeechVoices();
      const match = voices.find((voice) => voice.identifier === prefs.voiceId);
      setVoiceLabel(match?.name ?? "Custom voice");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SafeAreaView
      className="flex-1 bg-night-bg"
      edges={["top", "left", "right"]}
      style={{ backgroundColor: colors.bg }}
    >
      <View className="flex-1">
        <View className="flex-row items-center px-4 py-3">
          <AccessibleIconButton
            icon="arrow-back"
            label="Go back"
            onPress={() => navigation.goBack()}
            className="mr-1"
          />
          <Text className="text-xl font-bold text-night-text">Settings</Text>
        </View>

        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <Text className="mb-2 text-xs font-bold uppercase tracking-[2px] text-terracotta">
            Display
          </Text>
          <SettingRow
            label="Night mode"
            hint="On = dark charcoal screens. Off = white background and light surfaces."
            value={nightMode}
            onChange={setNightMode}
            trackOff={colors.border}
            thumb={colors.text}
          />

          <Text className="mb-2 mt-4 text-xs font-bold uppercase tracking-[2px] text-terracotta">
            Accessibility
          </Text>
          <Text className="mb-3 text-xs leading-5 text-night-muted">
            Supports Section 508 / WCAG: larger text, reduced motion, high contrast,
            and screen reader labels on controls.
          </Text>
          <SettingRow
            label="Larger text"
            hint="Increases reading size in Bible and chapter views."
            value={largerText}
            onChange={setLargerText}
            trackOff={colors.border}
            thumb={colors.text}
          />
          <SettingRow
            label="Reduce motion"
            hint="Minimizes cover, Ken-Burns, and decorative animation."
            value={reduceMotion}
            onChange={setReduceMotion}
            trackOff={colors.border}
            thumb={colors.text}
          />
          <SettingRow
            label="High contrast"
            hint="Stronger text and border contrast (WCAG AA)."
            value={highContrast}
            onChange={setHighContrast}
            trackOff={colors.border}
            thumb={colors.text}
          />

          <Text className="mb-2 mt-4 text-xs font-bold uppercase tracking-[2px] text-terracotta">
            Narration
          </Text>
          <Text className="mb-3 text-xs leading-5 text-night-muted">
            Pick a built-in device voice for Bible read-aloud and the Guide
            player. Default reading pace can also be set here.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose narrator voice"
            className="mb-3 flex-row items-center rounded-2xl border border-night-border bg-night-card px-4 py-4"
            onPress={() => setVoiceOpen(true)}
          >
            <MaterialIcons name="record-voice-over" size={22} color={colors.accent} />
            <View className="ml-3 flex-1">
              <Text className="text-base font-bold text-night-text">Voice</Text>
              <Text className="text-xs text-night-muted" numberOfLines={1}>
                {voiceLabel}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={colors.soft} />
          </Pressable>
          <View className="mb-3 rounded-2xl border border-night-border bg-night-card px-4 py-3">
            <Text className="mb-2 text-base font-bold text-night-text">
              Default pace · {formatSpeechRate(speechRate)}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {SPEECH_RATES.map((rate) => {
                const selected = Math.abs(rate - speechRate) < 0.01;
                return (
                  <Pressable
                    key={rate}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => {
                      setSpeechRate(rate);
                      void saveSpeechRate(rate);
                    }}
                    className={`rounded-full px-3 py-2 ${
                      selected ? "bg-terracotta" : "bg-night-elevated"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        selected ? "text-white" : "text-night-text"
                      }`}
                    >
                      {formatSpeechRate(rate)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            className="mt-4 flex-row items-center rounded-2xl border border-night-border bg-night-card px-4 py-4"
            onPress={() => navigation.navigate("Profile")}
          >
            <MaterialIcons name="person" size={22} color={colors.highlight} />
            <View className="ml-3 flex-1">
              <Text className="text-base font-bold text-night-text">Profile</Text>
              <Text className="text-xs text-night-muted">
                Name and email for your portfolio
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={colors.soft} />
          </Pressable>
        </ScrollView>

        <AppTabBar activeTab="More" />
      </View>

      <VoicePickerModal
        visible={voiceOpen}
        selectedVoiceId={voiceId}
        onClose={() => setVoiceOpen(false)}
        onSelect={(nextId, nextName) => {
          setVoiceId(nextId);
          setVoiceLabel(nextName ?? "System default");
          void saveSpeechVoiceId(nextId);
        }}
      />
    </SafeAreaView>
  );
}
