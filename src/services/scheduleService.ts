
import { Json } from '@/integrations/supabase/types';
import { Schedule } from './types';

// Helper function to safely parse schedule data
export const parseScheduleData = (scheduleData: Json | null): Schedule[] => {
  if (!scheduleData) return [];
  
  try {
    // Handle different possible formats of the schedule data
    if (Array.isArray(scheduleData)) {
      // Validate that each item has the required fields for a Schedule
      return scheduleData.map(item => {
        // Safely access properties with type checking
        const scheduleItem = item as Record<string, any>;
        return {
          day: scheduleItem.day?.toString() || '',
          time_start: scheduleItem.time_start?.toString() || '',
          time_end: scheduleItem.time_end?.toString() || '',
          rhythm: scheduleItem.rhythm?.toString() || '',
          first_date: scheduleItem.first_date?.toString() || '',
          last_date: scheduleItem.last_date?.toString() || '',
          room: scheduleItem.room?.toString() || '',
          room_link: scheduleItem.room_link?.toString() || '',
        } as Schedule;
      });
    } else if (typeof scheduleData === 'string') {
      // Parse string JSON
      try {
        const parsed = JSON.parse(scheduleData);
        return Array.isArray(parsed) 
          ? parsed.map(item => ({
              day: item.day?.toString() || '',
              time_start: item.time_start?.toString() || '',
              time_end: item.time_end?.toString() || '',
              rhythm: item.rhythm?.toString() || '',
              first_date: item.first_date?.toString() || '',
              last_date: item.last_date?.toString() || '',
              room: item.room?.toString() || '',
              room_link: item.room_link?.toString() || '',
            } as Schedule))
          : [{
              day: parsed.day?.toString() || '',
              time_start: parsed.time_start?.toString() || '',
              time_end: parsed.time_end?.toString() || '',
              rhythm: parsed.rhythm?.toString() || '',
              first_date: parsed.first_date?.toString() || '',
              last_date: parsed.last_date?.toString() || '',
              room: parsed.room?.toString() || '',
              room_link: parsed.room_link?.toString() || '',
            } as Schedule];
      } catch (e) {
        console.error('Error parsing schedule string data:', e);
        return [];
      }
    } else if (scheduleData && typeof scheduleData === 'object') {
      // Single schedule object
      const scheduleItem = scheduleData as Record<string, any>;
      return [{
        day: scheduleItem.day?.toString() || '',
        time_start: scheduleItem.time_start?.toString() || '',
        time_end: scheduleItem.time_end?.toString() || '',
        rhythm: scheduleItem.rhythm?.toString() || '',
        first_date: scheduleItem.first_date?.toString() || '',
        last_date: scheduleItem.last_date?.toString() || '',
        room: scheduleItem.room?.toString() || '',
        room_link: scheduleItem.room_link?.toString() || '',
      } as Schedule];
    }
  } catch (e) {
    console.error('Error parsing schedule data:', e);
  }
  
  return [];
};
