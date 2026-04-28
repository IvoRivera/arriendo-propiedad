"use client";

import React, { useState } from 'react';
import { 
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
  isSaturday
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Star, Zap, Info } from 'lucide-react';
import { SeasonalPricing } from '@/types/pricing';
import { HolidaySidebar } from './HolidaySidebar';
import { isLongWeekend, toISODate } from '@/lib/date-utils';

interface PricingCalendarProps {
  seasonalPrices: SeasonalPricing[];
  holidays: { date: string, name: string }[];
  basePrice: number;
  onDateSelect?: (date: string) => void;
  onRangeSelect?: (start: string, end: string) => void;
}

export const PricingCalendar: React.FC<PricingCalendarProps> = ({ 
  seasonalPrices, 
  holidays, 
  basePrice,
  onDateSelect,
  onRangeSelect
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dragStart, setDragStart] = useState<string | null>(null);
  const [dragEnd, setDragEnd] = useState<string | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const holidaysSet = new Set(holidays.map(h => h.date));
  const holidayNames = Object.fromEntries(holidays.map(h => [h.date, h.name]));

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

  const handleMouseDown = (date: string) => {
    setDragStart(date);
    setDragEnd(date);
  };

  const handleMouseEnter = (date: string) => {
    if (dragStart) setDragEnd(date);
    setHoveredDate(date);
  };

  const handleMouseUp = () => {
    if (dragStart && dragEnd) {
      const start = dragStart < dragEnd ? dragStart : dragEnd;
      const end = dragStart < dragEnd ? dragEnd : dragStart;
      if (start === end) {
        onDateSelect?.(start);
      } else {
        onRangeSelect?.(start, end);
      }
    }
    setDragStart(null);
    setDragEnd(null);
  };

  const isInSelection = (date: string) => {
    if (!dragStart || !dragEnd) return false;
    const start = dragStart < dragEnd ? dragStart : dragEnd;
    const end = dragStart < dragEnd ? dragEnd : dragStart;
    return date >= start && date <= end;
  };

  const getDayDetails = (day: Date) => {
    const dateStr = toISODate(day);
    const holidayName = holidayNames[dateStr];
    const isHoliday = !!holidayName;
    const isBridge = isLongWeekend(day, holidaysSet);

    const matches = seasonalPrices.filter(rule => {
      return dateStr >= rule.start_date && dateStr <= rule.end_date;
    }).sort((a, b) => b.priority - a.priority);

    const bestRule = matches[0];
    let price = basePrice;
    let source = "Base";
    let ruleColor = "";
    let ruleBorderColor = "";

    if (bestRule) {
      const stdPrice = Number(bestRule.price_per_night);
      const wkdPrice = bestRule.weekend_price !== null ? Number(bestRule.weekend_price) : stdPrice;
      const isActualWkd = isFriday(day) || isSaturday(day);
      
      price = isActualWkd ? wkdPrice : stdPrice;
      source = bestRule.season_name;
      const baseColor = bestRule.color_hex || '#D9C2A3';
      ruleColor = `${baseColor}1a`; // 10% opacity
      ruleBorderColor = baseColor;
    }

    return { price, source, isHoliday, holidayName, isBridge, ruleColor, ruleBorderColor };
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 w-full select-none bg-sand-light p-6 rounded-[40px] border border-sand-dark/50 shadow-sm">
      {/* Calendar Viewport */}
      <div className="flex-1 min-w-0 max-w-[1200px] mx-auto xl:mx-0">
        <div className="flex items-center justify-between mb-8 px-4">
          <h2 className="font-serif italic text-4xl text-primary-navy lowercase tracking-tight capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </h2>
          <div className="flex gap-3">
            <button 
              onClick={prevMonth}
              className="p-3 rounded-2xl bg-white border border-sand-dark text-primary-navy hover:bg-sand-light transition-all shadow-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextMonth}
              className="p-3 rounded-2xl bg-white border border-sand-dark text-primary-navy hover:bg-sand-light transition-all shadow-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto pb-4 scrollbar-hide">
          <div className="min-w-[800px] grid grid-cols-7 gap-px bg-sand-dark rounded-[32px] overflow-hidden border border-sand-dark shadow-xl">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
              <div key={day} className="bg-sand-light py-5 text-center text-[10px] font-bold text-sand-dark uppercase tracking-[0.2em] mix-blend-multiply">
                {day}
              </div>
            ))}

            {calendarDays.map((day, idx) => {
              const isOutsideMonth = !isSameMonth(day, monthStart);
              const dateStr = toISODate(day);
              const { price, source, isHoliday, holidayName, isBridge, ruleColor, ruleBorderColor } = getDayDetails(day);
              const isSelected = isInSelection(dateStr);
              const isHovered = hoveredDate === dateStr;

              return (
                <div 
                  key={idx}
                  onMouseDown={() => !isOutsideMonth && handleMouseDown(dateStr)}
                  onMouseEnter={() => !isOutsideMonth && handleMouseEnter(dateStr)}
                  onMouseUp={handleMouseUp}
                  style={{ 
                    backgroundColor: !isOutsideMonth ? (isSelected ? '#00285515' : ruleColor || '#ffffff') : '#f8f5f0',
                  }}
                  className={`
                    aspect-[1.1] min-h-[140px] p-4 flex flex-col transition-all duration-300 relative group
                    ${isOutsideMonth ? 'opacity-40' : 'cursor-crosshair hover:z-10'}
                    ${isSelected ? 'ring-inset ring-2 ring-primary-navy' : ''}
                    ${isHovered && !isOutsideMonth ? 'shadow-2xl scale-[1.02] z-20' : ''}
                  `}
                >
                  {/* Top Bar: Number & Holiday Icon */}
                  <div className="flex justify-between items-start mb-2">
                    <span className={`
                      text-sm font-semibold 
                      ${isOutsideMonth ? 'text-[#c2bcaf]' : isHoliday ? 'text-primary-navy scale-110' : 'text-sand-dark'}
                      transition-transform duration-300
                    `}>
                      {format(day, 'd')}
                    </span>
                    {isHoliday && !isOutsideMonth && (
                      <div className="bg-primary-navy/5 p-1 rounded-lg">
                        <Star className="w-3 h-3 text-primary-navy fill-primary-navy/20" />
                      </div>
                    )}
                  </div>
                  
                  {/* Content: Season Label & Price */}
                  {!isOutsideMonth && (
                    <div className="flex-1 flex flex-col justify-between gap-1">
                      {/* Season Label (Glassmorphism) */}
                      <div className={`
                        hidden md:flex items-center gap-1.5 px-2 py-1 rounded-full 
                        backdrop-blur-sm bg-white/40 border border-white/20 shadow-sm
                        transition-all duration-500 group-hover:bg-white/60
                        max-w-full
                      `}>
                        <div 
                          className="w-1.5 h-1.5 rounded-full shrink-0" 
                          style={{ backgroundColor: ruleBorderColor || '#9a8a78' }} 
                        />
                        <span className="text-[9px] font-bold text-[#4a453e] uppercase tracking-tighter truncate">
                          {source}
                        </span>
                      </div>

                      {/* Price Section */}
                      <div className="flex flex-col items-end overflow-hidden">
                        <span className="text-xl font-serif italic text-primary-navy leading-none mb-1 truncate w-full text-right">
                          ${price.toLocaleString()}
                        </span>
                        
                        {/* Mobile Indicator */}
                        <div className="md:hidden">
                          <Info className="w-3 h-3 text-primary-navy/30" />
                        </div>

                        {/* Bridge Tag */}
                        {isBridge && (
                          <div className="flex items-center gap-1 bg-primary-navy/5 px-2 py-0.5 rounded-full border border-primary-navy/10 mt-1">
                            <Zap className="w-2.5 h-2.5 text-primary-navy fill-primary-navy" />
                            <span className="text-[8px] text-primary-navy font-bold uppercase tracking-tighter">Puente</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tooltip on Hover */}
                  {isHovered && !isOutsideMonth && (holidayName || source !== "Base") && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-primary-navy text-white text-[10px] font-medium rounded-xl shadow-2xl z-50 whitespace-nowrap animate-in fade-in zoom-in duration-200">
                      <div className="flex items-center gap-2">
                        {isHoliday && <Star className="w-3 h-3 fill-white" />}
                        {holidayName || source}
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-primary-navy" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lateral Info */}
      <div className="xl:w-72 shrink-0 h-fit lg:sticky lg:top-8 bg-white/50 backdrop-blur-md rounded-[32px] p-6 border border-sand-dark shadow-sm">
        <h3 className="text-sm font-bold text-primary-navy uppercase tracking-widest mb-6 border-b border-sand-dark pb-4">
          Feriados del Mes
        </h3>
        <HolidaySidebar holidays={holidays} currentMonth={currentMonth} />
      </div>
    </div>
  );
};
