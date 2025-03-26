
import { Schedule, ScheduleItem } from "@/services/types";

// Type guard to check if schedule item is the old format (Schedule)
export const isOldScheduleFormat = (item: ScheduleItem | Schedule): item is Schedule => {
  return 'first_date' in item && 'last_date' in item;
};
