import { Modal, Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  journeyTitle: string;
  onClose: () => void;
  onInvite: () => void;
  onOpenJourney: () => void;
};

/**
 * Through-the-Word–style journey overflow menu with Invite.
 */
export default function JourneyMenuModal({
  visible,
  journeyTitle,
  onClose,
  onInvite,
  onOpenJourney,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/50" onPress={onClose}>
        <View className="flex-1 justify-end px-3 pb-8 pt-16">
          <Pressable
            onPress={(event) => event.stopPropagation?.()}
            className="overflow-hidden rounded-3xl bg-night-elevated"
          >
            <View className="flex-row items-center justify-between border-b border-night-border px-4 py-3">
              <Text
                className="flex-1 pr-3 text-base font-bold text-night-text"
                numberOfLines={1}
              >
                {journeyTitle} Together
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={onClose}
                className="h-8 w-8 items-center justify-center rounded-full bg-night-card"
              >
                <MaterialIcons name="close" size={18} color="#F2F2F7" />
              </Pressable>
            </View>

            <MenuRow
              icon="groups"
              label="Group details"
              onPress={() => {
                onClose();
                onOpenJourney();
              }}
            />
            <MenuRow
              icon="person-add"
              label="Invite"
              emphasize
              onPress={() => {
                onClose();
                onInvite();
              }}
            />
            <MenuRow
              icon="share"
              label="Share the journey"
              onPress={() => {
                onClose();
                onInvite();
              }}
            />
            <MenuRow
              icon="menu-book"
              label="Open journey"
              onPress={() => {
                onClose();
                onOpenJourney();
              }}
            />
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
  emphasize,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  emphasize?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="flex-row items-center border-b border-night-border/60 px-4 py-4"
    >
      <MaterialIcons
        name={icon}
        size={22}
        color={emphasize ? "#E4572E" : "#F2F2F7"}
      />
      <Text
        className={`ml-3 text-base font-semibold ${
          emphasize ? "text-terracotta" : "text-night-text"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
