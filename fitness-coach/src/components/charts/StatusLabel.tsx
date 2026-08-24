import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { useTheme } from '@/theme';

import { MetricStatus } from './ringChartUtils';

type StatusLabelProps = {
  status: MetricStatus;
  label?: string;
};

const DEFAULT_LABEL: Record<MetricStatus, string> = {
  good: 'Good',
  normal: 'Normal',
  low: 'Low',
  high: 'High',
};

export function StatusLabel({ status, label }: StatusLabelProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        text: {
          fontSize: 13,
          fontWeight: '700',
        },
      }),
    [],
  );

  const color =
    status === 'good'
      ? colors.accentText
      : status === 'normal'
        ? colors.actionText
        : colors.warning;

  return (
    <Text style={[styles.text, { color }]}>
      {label ?? DEFAULT_LABEL[status]}
    </Text>
  );
}
