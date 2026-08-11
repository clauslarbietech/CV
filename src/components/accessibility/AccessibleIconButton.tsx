import { Pressable, type PressableProps } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { MIN_TOUCH_TARGET } from "../../theme/a11y";
import { useTheme } from "../../theme/ThemeProvider";

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  hint?: string;
  onPress: PressableProps["onPress"];
  size?: number;
  active?: boolean;
  className?: string;
};

/**
 * Icon control with 44pt minimum touch target and VoiceOver / TalkBack labels.
 */
export default function AccessibleIconButton({
  icon,
  label,
  hint,
  onPress,
  size = 22,
  active = false,
  className = "",
}: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      onPress={onPress}
      hitSlop={8}
      className={`items-center justify-center rounded-full ${className}`}
      style={{
        minWidth: MIN_TOUCH_TARGET,
        minHeight: MIN_TOUCH_TARGET,
        backgroundColor: active ? `${colors.accent}40` : colors.elevated,
      }}
    >
      <MaterialIcons
        name={icon}
        size={size}
        color={active ? colors.accent : colors.text}
      />
    </Pressable>
  );
}
