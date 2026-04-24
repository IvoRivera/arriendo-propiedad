import { NextResponse } from 'next/server';
import { supabasePublic } from '@/lib/supabase';

// Enable ISR (Incremental Static Regeneration) for this endpoint.
// It will revalidate data at most every 60 seconds, drastically reducing Supabase load.
export const revalidate = 60;

export async function GET() {
  try {
    // 1. Fetch Manual Blocks
    const { data: manualBlocks, error: manualError } = await supabasePublic
      .from('blocked_dates')
      .select('start_date, end_date');

    // 2. Fetch Confirmed Bookings
    const { data: confirmedBookings, error: bookingError } = await supabasePublic
      .from('booking_requests')
      .select('check_in, check_out')
      .eq('status', 'confirmed');

    if (manualError) throw manualError;
    if (bookingError) throw bookingError;

    const blockedDates: string[] = [];
    const bookedRanges: { from: string; to: string }[] = [];

    // Helper to safely format Date to YYYY-MM-DD
    const formatDate = (date: Date) => {
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (manualBlocks) {
      manualBlocks.forEach(range => {
        bookedRanges.push({
          from: range.start_date,
          to: range.end_date
        });
      });
    }

    if (confirmedBookings) {
      confirmedBookings.forEach(booking => {
        bookedRanges.push({
          from: booking.check_in,
          to: booking.check_out
        });
      });
    }

    // We can also compute exact single dates if needed by the frontend,
    // but returning ranges is often easier for react-day-picker.
    // For compliance with the user's explicit request, we'll populate both.
    
    bookedRanges.forEach(range => {
      // Parse dates safely treating them as UTC to avoid local timezone shifts
      const start = new Date(`${range.from}T12:00:00Z`);
      const end = new Date(`${range.to}T12:00:00Z`);
      const current = new Date(start);
      
      while (current <= end) {
        blockedDates.push(formatDate(current));
        current.setUTCDate(current.getUTCDate() + 1);
      }
    });

    // Remove duplicates
    const uniqueBlockedDates = Array.from(new Set(blockedDates));

    return NextResponse.json({
      success: true,
      data: {
        blockedDates: uniqueBlockedDates,
        bookedRanges: bookedRanges,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error('[AvailabilityAPI] Error fetching availability:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch availability' }, { status: 500 });
  }
}
