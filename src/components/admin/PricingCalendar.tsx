"use client";

import React, { useState } from 'react';
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  addMonths, 
  subMonths,
  isSameMonth,
  isFriday,
  isSaturday,
  isSunday,
  parseISO
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SeasonalPricing } from '@/types/pricing';
import { HolidaySidebar } from './HolidaySidebar';
import { isDateHoliday, isLongWeekend, toISODate } from '@/lib/date-utils';

interface PricingCalendarProps {
  seasonalPrices: SeasonalPricing[];
  holidays: { date: string, name: string }[];
  basePrice: number;
}

export const PricingCalendar: React.FC<PricingCalendarProps> = ({ 
  seasonalPrices, 
  holidays, 
  basePrice 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const holidaysSet = new Set(holidays.map(h => h.date));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Helper to find the best rule for a date
  const getDayDetails = (day: Date) => {
    const dateStr = toISODate(day);
    const isHoliday = isDateHoliday(day, holidaysSet);
    const isBridge = isLongWeekend(day, holidaysSet);
    const isWkd = isFriday(day) || isSaturday(day) || isSunday(day);

    // Find matching rules
    const matches = seasonalPrices.filter(rule => {
      const start = rule.start_date;
      const end = rule.end_date;
      return dateStr >= start && dateStr <= end;
    }).sort((a, b) => b.priority - a.priority);

    const bestRule = matches[0];
    let price = basePrice;
    let source = "Base";
    let ruleColor = "";

    if (bestRule) {
      const stdPrice = Number(bestRule.price_per_night);
      const wkdPrice = bestRule.weekend_price !== null ? Number(bestRule.weekend_price) : stdPrice;
      const isActualWkd = isFriday(day) || isSaturday(day); // Pricing engine logic
      
      price = isActualWkd ? wkdPrice : stdPrice;
      source = bestRule.season_name;
      // Soft, non-saturated color based on priority or index
      // Using a subtle primary tint for active rules
      ruleColor = "bg-primary/10"; 
    }

    return { price, source, isHoliday, isBridge, isWkd, ruleColor };
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      {/* Calendar Grid */}
      <div className="flex-1 bg-surface-container rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="font-serif italic text-3xl text-primary lowercase tracking-tight">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-surface-container-high transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-primary" />
            </button>
            <button 
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-surface-container-high transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-surface-container-highest rounded-xl overflow-hidden border border-surface-container-highest shadow-inner">
          {/* Weekday Headers */}
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
            <div key={day} className="bg-surface-container-low py-3 text-center text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em]">
              {day}
            </div>
          ))}

          {/* Days */}
          {calendarDays.map((day, idx) => {
            const isOutsideMonth = !isSameMonth(day, monthStart);
            const { price, source, isHoliday, isBridge, isWkd, ruleColor } = getDayDetails(day);
            
            return (
              <div 
                key={idx}
                className={`
                  min-h-[110px] p-2 flex flex-col gap-1 transition-all duration-300 group
                  ${isOutsideMonth ? 'bg-surface/50 opacity-30' : 'bg-surface-container-low'}
                  ${isWkd && !isOutsideMonth ? 'bg-surface-container' : ''}
                  ${isBridge && !isOutsideMonth ? 'bg-primary/[0.03]' : ''}
                  ${ruleColor && !isOutsideMonth ? 'ring-1 ring-inset ring-primary/20' : ''}
                  ${isHoliday && !isOutsideMonth ? 'bg-primary/5' : ''}
                `}
              >
                <div className="flex justify-between items-start">
                  {isHoliday && !isOutsideMonth && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  )}
                  <span className={`text-sm font-medium ml-auto ${isHoliday ? 'text-primary font-bold' : ''}`}>
                    {format(day, 'd')}
                  </span>
                </div>
                
                {!isOutsideMonth && (
                  <div className="mt-auto flex flex-col items-end">
                    <span className="text-[9px] text-primary/40 uppercase font-bold tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                      {source}
                    </span>
                    <span className={`text-sm font-semibold ${ruleColor ? 'text-primary' : 'text-foreground/70'}`}>
                      ${price.toLocaleString()}
                    </span>
                    {isBridge && (
                      <span className="text-[8px] text-primary font-bold uppercase tracking-widest mt-0.5">
                        Puente
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Holiday Sidebar */}
      <div className="lg:w-80">
        <HolidaySidebar holidays={holidays} currentMonth={currentMonth} />
      </div>
    </div>
  );
};
