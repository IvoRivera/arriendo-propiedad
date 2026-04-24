import { supabasePublic } from './supabase';

/**
 * Availability Service
 * Aggregates all sources of blocked dates (Manual blocks + Confirmed bookings)
 */

export interface BlockedDateRange {
  from: Date;
  to: Date;
}

export async function getLiveBlockedDates(): Promise<Date[]> {
  const blockedDates: Date[] = [];

  try {
    // 1. Fetch Manual Blocks
    const { data: manualBlocks, error: manualError } = await supabasePublic
      .from('blocked_dates')
      .select('start_date, end_date');

    if (!manualError && manualBlocks) {
      manualBlocks.forEach(range => {
        const start = new Date(range.start_date);
        const end = new Date(range.end_date);
        let current = new Date(start);
        
        while (current <= end) {
          blockedDates.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
      });
    }

    // 2. Fetch Confirmed Bookings
    const { data: confirmedBookings, error: bookingError } = await supabasePublic
      .from('booking_requests')
      .select('check_in, check_out')
      .eq('status', 'confirmed');

    if (!bookingError && confirmedBookings) {
      confirmedBookings.forEach(booking => {
        const start = new Date(booking.check_in);
        const end = new Date(booking.check_out);
        let current = new Date(start);
        
        // We block every night of the stay
        // Usually, check_out morning is available for check_in afternoon
        // But for simplicity in this boutique setup, we block both ends
        while (current <= end) {
          blockedDates.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
      });
    }

    return blockedDates;
  } catch (err) {
    console.error('[AvailabilityService] Error fetching blocked dates:', err);
    return [];
  }
}
