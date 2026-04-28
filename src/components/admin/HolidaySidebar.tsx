"use client";

import React from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface HolidaySidebarProps {
  holidays: { date: string, name: string }[];
  currentMonth: Date;
}

export const HolidaySidebar: React.FC<HolidaySidebarProps> = ({ holidays, currentMonth }) => {
  const currentMonthStr = format(currentMonth, 'MM');
  const currentYearStr = format(currentMonth, 'yyyy');

  const monthHolidays = holidays.filter(h => {
    const d = h.date; // YYYY-MM-DD
    return d.startsWith(`${currentYearStr}-${currentMonthStr}`);
  });

  return (
    <div className="w-full h-full bg-surface-container-low p-6 rounded-xl flex flex-col gap-6">
      <h3 className="font-serif italic text-2xl text-primary-container-highest">
        Feriados del Mes
      </h3>
      
      {monthHolidays.length === 0 ? (
        <p className="text-muted-foreground text-sm italic">
          No hay feriados registrados para este mes.
        </p>
      ) : (
        <ul className="space-y-4">
          {monthHolidays.map((holiday, idx) => (
            <li key={idx} className="flex flex-col gap-1 border-b border-surface-container-high pb-3 last:border-0">
              <span className="text-primary font-semibold text-sm">
                {format(parseISO(holiday.date), "EEEE d 'de' MMMM", { locale: es })}
              </span>
              <span className="text-foreground text-sm">
                {holiday.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
