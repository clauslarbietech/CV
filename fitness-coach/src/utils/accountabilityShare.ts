import { Linking, Platform, Share } from 'react-native';

/**
 * Opens the device SMS composer when a phone is saved; otherwise falls back
 * to the system share sheet (Messages, WhatsApp, Mail, etc.).
 */
export async function textOrShareProgress(args: {
  phone?: string | null;
  message: string;
}): Promise<'sms' | 'share'> {
  const digits = (args.phone ?? '').replace(/[^\d+]/g, '');
  if (digits.length >= 7) {
    const body = encodeURIComponent(args.message);
    // iOS uses &body=, Android often uses ?body=
    const url =
      Platform.OS === 'ios'
        ? `sms:${digits}&body=${body}`
        : `sms:${digits}?body=${body}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        return 'sms';
      }
    } catch {
      // fall through to share
    }
  }
  await Share.share({ message: args.message });
  return 'share';
}

export function buildProgramProgressMessage(args: {
  userName: string;
  buddyName?: string;
  programName: string;
  day: number;
  totalDays: number;
  completedDays: number;
  currentFrame?: string;
  goalFrame?: string;
  currentWeightKg?: number;
  goalWeightKg?: number;
}): string {
  const pct =
    args.totalDays > 0
      ? Math.round((args.completedDays / args.totalDays) * 100)
      : 0;
  const hi = args.buddyName ? `Hey ${args.buddyName} — ` : '';
  const lines = [
    `${hi}${args.userName} here with a FitLife check-in.`,
    `Program: ${args.programName}`,
    `Day ${args.day} of ${args.totalDays} · ${args.completedDays} workouts done (${pct}%).`,
  ];
  if (args.currentFrame && args.goalFrame) {
    lines.push(`Body vision: ${args.currentFrame} → ${args.goalFrame}`);
  }
  if (args.currentWeightKg != null || args.goalWeightKg != null) {
    lines.push(
      `Weight: ${args.currentWeightKg != null ? `${args.currentWeightKg} kg` : '—'} → goal ${args.goalWeightKg != null ? `${args.goalWeightKg} kg` : '—'}`,
    );
  }
  lines.push('Keep me honest — thanks for being my accountability buddy.');
  return lines.join('\n');
}
