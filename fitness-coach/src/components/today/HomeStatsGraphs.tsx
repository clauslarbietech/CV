import { MissionDashboard, MissionDashboardProps } from '@/components/charts/MissionDashboard';

/** Ring-style compact dashboard for My Stuff / Progress. */
export function HomeStatsGraphs(props: MissionDashboardProps) {
  return <MissionDashboard {...props} />;
}

export type { MissionDashboardProps as HomeStatsGraphsProps };
