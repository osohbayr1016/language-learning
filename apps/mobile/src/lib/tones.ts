export function getToneColor(tone: number): string {
  switch (tone) {
    case 1:
      return '#EF4444'; // Red - Flat
    case 2:
      return '#F59E0B'; // Amber - Rising
    case 3:
      return '#10B981'; // Green - Dipping
    case 4:
      return '#3B82F6'; // Blue - Falling
    default:
      return '#6B7280'; // Gray - Neutral
  }
}

export function parseTones(tonesStr: string): number[] {
  try {
    return JSON.parse(tonesStr);
  } catch {
    return [];
  }
}
