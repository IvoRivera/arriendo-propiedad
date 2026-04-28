'use client';

import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Edit2, 
  Zap, 
  Info,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Clock,
  TrendingUp,
  Settings,
  ArrowRight,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Simple Modal Component
const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2c2416]/20 backdrop-blur-[20px] animate-in fade-in duration-300">
      <div className="bg-[#faf7f2] rounded-xl w-full max-w-lg overflow-hidden shadow-[0_12px_32px_rgba(27,28,26,0.06)] border border-white/20">
        <div className="flex items-center justify-between p-8">
          <h3 className="text-2xl font-serif italic text-[#2c2416] tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 text-[#2c2416]/40 hover:text-[#2c2416] transition-colors">
            <Plus className="w-6 h-6 rotate-45" />
          </button>
        </div>
        <div className="px-8 pb-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function PricingAdminPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarData, setCalendarData] = useState<any[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isSeasonModalOpen, setIsSeasonModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [basePrice, setBasePrice] = useState<number>(0);

  // Form states
  const [bulkForm, setBulkForm] = useState({
    startDate: '',
    endDate: '',
    targetType: 'customRange',
    priceMode: 'fixed',
    value: '',
    name: '',
    priority: 999
  });

  const [seasonForm, setSeasonForm] = useState({
    id: null,
    name: '',
    startDate: '',
    endDate: '',
    priceWeek: '',
    priceWeekend: '',
    priority: 10
  });

  const [editingSeasonId, setEditingSeasonId] = useState<string | null>(null);
  const [editSeasonForm, setEditSeasonForm] = useState<any | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const monthStr = format(currentMonth, 'yyyy-MM');
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      toast.error('Sesión no encontrada. Por favor inicia sesión.');
      setIsLoading(false);
      return;
    }

    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const [pricingRes, holidaysRes, seasonsRes, configRes] = await Promise.all([
        fetch(`/api/admin/pricing/calendar?month=${monthStr}`, { headers }),
        fetch(`/api/admin/holidays?year=${format(currentMonth, 'yyyy')}`, { headers }),
        fetch('/api/admin/pricing/seasons', { headers }),
        supabase.from('system_config').select('value').eq('key', 'PROPERTY_RENT_VALUE').single()
      ]);

      const pricing = await pricingRes.json();
      const holidaysData = await holidaysRes.json();
      const seasonsData = await seasonsRes.json();
      const configData = configRes.data;
      
      if (configData) {
        setBasePrice(parseInt(configData.value.replace(/\D/g, '')));
      }
      
      // Debugging
      console.log('--- Debug: Pricing Data Loaded ---');
      console.log('Holidays count:', holidaysData?.length);
      console.log('First holiday:', holidaysData?.[0]);
      console.log('First day breakdown:', pricing?.breakdown?.[0]);
      
      setCalendarData(pricing?.breakdown || []);
      setHolidays(Array.isArray(holidaysData) ? holidaysData : []);
      setSeasons(Array.isArray(seasonsData) ? seasonsData : []);


      if (!pricingRes.ok) toast.error(pricing?.error || 'Error en calendario');
      if (!holidaysRes.ok) toast.error(holidaysData?.error || 'Error en feriados');
      if (!seasonsRes.ok) toast.error(seasonsData?.error || 'Error en temporadas');
    } catch (err) {
      toast.error('Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentMonth]);

  const handleApplyBulk = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    try {
      const res = await fetch('/api/admin/pricing/apply', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...bulkForm,
          value: Number(bulkForm.value)
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Ajuste aplicado: ${data.inserted} reglas creadas`);
        setIsBulkModalOpen(false);
        fetchData();
      } else {
        toast.error(data.error || 'Error al aplicar ajuste');
      }
    } catch (err) {
      toast.error('Error de red');
    }
  };

  const handleSaveDayOverride = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    try {
      const res = await fetch('/api/admin/pricing/apply', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          startDate: selectedDay.date,
          endDate: selectedDay.date,
          targetType: 'customRange',
          priceMode: 'fixed',
          value: Number(selectedDay.overridePrice),
          name: 'Manual Override',
          priority: 1000
        })
      });
      if (res.ok) {
        toast.success('Precio actualizado');
        setIsDayModalOpen(false);
        fetchData();
      }
    } catch (err) {
      toast.error('Error');
    }
  };

  const handleEditSeasonStart = (season: any) => {
    setEditingSeasonId(season.id);
    setEditSeasonForm({ ...season });
  };

  const handleEditSeasonCancel = () => {
    setEditingSeasonId(null);
    setEditSeasonForm(null);
  };

  const handleUpdateSeason = async () => {
    if (!editSeasonForm) return;
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    try {
      const res = await fetch('/api/admin/pricing/seasons', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: editSeasonForm.id,
          season_name: editSeasonForm.season_name,
          start_date: editSeasonForm.start_date,
          end_date: editSeasonForm.end_date,
          price_per_night: Number(editSeasonForm.price_per_night),
          weekend_price: editSeasonForm.weekend_price ? Number(editSeasonForm.weekend_price) : null
        })
      });

      if (res.ok) {
        toast.success('Regla actualizada');
        setEditingSeasonId(null);
        setEditSeasonForm(null);
        fetchData();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Error al actualizar');
      }
    } catch (err) {
      toast.error('Error de red');
    }
  };

  const handleDeleteSeason = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    try {
      const res = await fetch(`/api/admin/pricing/seasons?id=${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Regla eliminada');
        fetchData();
      }
    } catch (err) {
      toast.error('Error');
    }
  };

  const handleSaveSeason = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    try {
      const res = await fetch('/api/admin/pricing/apply', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          startDate: seasonForm.startDate,
          endDate: seasonForm.endDate,
          targetType: 'customRange',
          priceMode: 'fixed',
          value: Number(seasonForm.priceWeek),
          name: seasonForm.name,
          priority: Number(seasonForm.priority),
          weekend_price: seasonForm.priceWeekend ? Number(seasonForm.priceWeekend) : null
        })
      });
      if (res.ok) {
        toast.success('Temporada guardada');
        setIsSeasonModalOpen(false);
        fetchData();
      }
    } catch (err) {
      toast.error('Error');
    }
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#2c2416] p-4 md:p-12 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div className="space-y-6">
          <Link 
            href="/admin"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#2c2416]/40 hover:text-[#00628f] transition-colors group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Volver al Panel
          </Link>
          <h1 className="text-5xl md:text-6xl font-serif italic tracking-tight leading-tight">
            Gestión de <span className="text-[#00628f]">Precios</span>
          </h1>
          <p className="text-sm uppercase tracking-[0.2em] font-bold text-[#2c2416]/40">Control avanzado de temporadas y tarifas premium</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center gap-2 px-8 py-3 bg-[#f5f0e8] hover:bg-[#ebe5d9] text-[#2c2416] rounded-full font-semibold transition-all"
          >
            <Zap className="w-4 h-4 text-[#00628f]" />
            Ajuste Masivo
          </button>
          <button 
            onClick={() => {
              setSeasonForm({ id: null, name: '', startDate: '', endDate: '', priceWeek: '', priceWeekend: '', priority: 10 });
              setIsSeasonModalOpen(true);
            }}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#00628f] to-[#007cb3] hover:brightness-110 text-white rounded-full font-semibold transition-all shadow-lg shadow-blue-900/10"
          >
            <Plus className="w-4 h-4" />
            Nueva Temporada
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Main Calendar View */}
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-white rounded-xl p-8 md:p-10 shadow-[0_12px_32px_rgba(27,28,26,0.06)] border border-white/20">
            <div className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                <h2 className="text-3xl font-serif italic capitalize tracking-tight">
                  {format(currentMonth, 'MMMM yyyy', { locale: es })}
                </h2>
                <div className="w-12 h-0.5 bg-[#00628f]/20"></div>
              </div>
              <div className="flex gap-2 bg-[#f5f0e8] p-1 rounded-full">
                <button onClick={prevMonth} className="p-2 hover:bg-white rounded-full transition-all text-[#2c2416]/60 hover:text-[#2c2416]">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={nextMonth} className="p-2 hover:bg-white rounded-full transition-all text-[#2c2416]/60 hover:text-[#2c2416]">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-3">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-[#2c2416]/30 py-4 uppercase tracking-[0.2em]">{d}</div>
              ))}
              
              {/* Padding days */}
              {Array.from({ length: (parseISO(format(startOfMonth(currentMonth), 'yyyy-MM-01')).getDay() + 6) % 7 }).map((_, i) => (
                <div key={`pad-${i}`} className="aspect-square"></div>
              ))}

              {calendarData.map((day: any, i: number) => {
                const date = parseISO(day.date);
                const dateString = day.date; // YYYY-MM-DD
                
                // Look for holiday name in the holidays state - robust matching
                const holidayInfo = holidays.find(h => {
                  const hDate = typeof h.date === 'string' ? h.date.split('T')[0] : '';
                  return hDate === dateString;
                });
                
                const isHoliday = day.isHoliday || !!holidayInfo;
                const holidayName = holidayInfo?.name || (isHoliday ? 'Feriado' : '');
                
                // Differentiate bridge holidays (Fri, Mon, Weekend) from isolated ones (Tue, Wed, Thu)
                const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
                const isBridgeHoliday = isHoliday && (dayOfWeek === 1 || dayOfWeek === 5 || dayOfWeek === 6);
                
                return (
                  <div 
                    key={dateString}
                    onClick={() => {
                      setSelectedDay({ ...day, overridePrice: day.price });
                      setIsDayModalOpen(true);
                    }}
                    className={`
                      aspect-square p-3 rounded-xl border transition-all cursor-pointer group relative overflow-hidden
                      ${isHoliday 
                        ? isBridgeHoliday
                          ? 'bg-rose-300/90 border-rose-400 hover:bg-rose-400 shadow-[inset_0_0_20px_rgba(244,63,94,0.2)]' 
                          : 'bg-rose-100/60 border-rose-200 hover:bg-rose-200 shadow-[inset_0_0_20px_rgba(244,63,94,0.05)]'
                        : isToday(date) 
                          ? 'border-[#00628f] bg-[#00628f]/5' 
                          : 'border-transparent bg-[#f5f0e8]/50 hover:bg-[#f5f0e8]'}
                      ${day.isLongWeekend && !isHoliday ? 'ring-2 ring-purple-500/10 bg-purple-50/30' : ''}
                    `}
                  >
                    {/* Holiday Badge (Floating) */}
                    {isHoliday && (
                      <div className="absolute top-0 right-0 p-1">
                        <div title={holidayName} className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                      </div>
                    )}

                    {/* Day Number */}
                    <span className={`text-[10px] font-bold tracking-tighter ${
                      isHoliday 
                        ? isBridgeHoliday ? 'text-rose-900' : 'text-rose-500' 
                        : isToday(date) ? 'text-[#00628f]' : 'text-[#2c2416]/30'
                    }`}>
                      {format(date, 'd')}
                    </span>

                    {/* Price */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className={`text-base font-serif italic ${isHoliday ? 'text-rose-900 font-bold' : 'text-[#2c2416]'}`}>
                        ${(day.price / 1000).toFixed(0)}k
                      </div>
                    </div>

                    {/* Label/Badge for Holiday */}
                    {isHoliday && (
                      <div className="absolute bottom-1 left-2 right-2 truncate">
                        <span title={holidayName} className="text-[7px] font-bold uppercase tracking-tight text-rose-500/80 leading-none">
                          {holidayName}
                        </span>
                      </div>
                    )}

                    {/* Indicators for normal days */}
                    {!isHoliday && (
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        {day.isWeekend && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00628f]/40"></div>
                        )}
                        {day.isLongWeekend && (
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-400/40"></div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="mt-12 flex flex-wrap gap-8 pt-10 border-t border-[#f5f0e8] text-[10px] font-bold uppercase tracking-widest text-[#2c2416]/40">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div> 🔴 Feriado Puente
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-200"></div> 💗 Feriado Suelto
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500/40"></div> 🟣 Fin de semana largo (No feriado)
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00628f]"></div> 🔵 Fin de semana (Vie-Sáb)
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full border border-[#2c2416]/20"></div> ⚪ Día normal
              </div>
            </div>
          </div>

          {/* Seasonal Rules List */}
          <div className="space-y-8">
            <div className="space-y-1">
              <h3 className="text-3xl font-serif italic tracking-tight">Reglas de <span className="text-[#00628f]">Temporada</span></h3>
              <p className="text-[10px] text-[#2c2416]/40 uppercase tracking-[0.2em] font-bold">Listado de configuraciones activas</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-[0_12px_32px_rgba(27,28,26,0.06)] overflow-hidden border border-white/20">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-[#2c2416]/30 uppercase tracking-[0.2em] font-bold bg-[#f5f0e8]/50">
                    <th className="py-6 px-8">Nombre</th>
                    <th className="py-6 px-8">Periodo</th>
                    <th className="py-6 px-8">Base</th>
                    <th className="py-6 px-8">Finde</th>
                    <th className="py-6 px-8 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f0e8]">
                  {Array.isArray(seasons) && seasons.map(season => (
                    <tr key={season.id} className={`${editingSeasonId === season.id ? 'bg-[#00628f]/5' : 'hover:bg-[#f5f0e8]/30'} transition-colors group`}>
                      <td className="py-6 px-8">
                        {editingSeasonId === season.id ? (
                          <input 
                            type="text"
                            value={editSeasonForm?.season_name}
                            onChange={e => setEditSeasonForm({...editSeasonForm, season_name: e.target.value})}
                            className="w-full bg-white border border-[#f5f0e8] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#00628f]"
                          />
                        ) : (
                          <span className="font-semibold text-sm">{season.season_name}</span>
                        )}
                      </td>
                      <td className="py-6 px-8">
                        {editingSeasonId === season.id ? (
                          <div className="flex flex-col gap-1">
                            <input 
                              type="date"
                              value={editSeasonForm?.start_date}
                              onChange={e => setEditSeasonForm({...editSeasonForm, start_date: e.target.value})}
                              className="w-full bg-white border border-[#f5f0e8] rounded-lg px-2 py-1 text-[10px] outline-none"
                            />
                            <input 
                              type="date"
                              value={editSeasonForm?.end_date}
                              onChange={e => setEditSeasonForm({...editSeasonForm, end_date: e.target.value})}
                              className="w-full bg-white border border-[#f5f0e8] rounded-lg px-2 py-1 text-[10px] outline-none"
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-[#2c2416]/50">
                            {format(parseISO(season.start_date), 'dd MMM')} <ArrowRight className="inline w-3 h-3 mx-1 opacity-30" /> {format(parseISO(season.end_date), 'dd MMM')}
                          </span>
                        )}
                      </td>
                      <td className="py-6 px-8">
                        {editingSeasonId === season.id ? (
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-[#2c2416]/30">$</span>
                            <input 
                              type="number"
                              value={editSeasonForm?.price_per_night}
                              onChange={e => setEditSeasonForm({...editSeasonForm, price_per_night: e.target.value})}
                              className="w-full bg-white border border-[#f5f0e8] rounded-lg pl-5 pr-2 py-2 text-xs outline-none"
                            />
                          </div>
                        ) : (
                          <span className="font-serif italic text-lg">${(Number(season.price_per_night) / 1000).toFixed(0)}k</span>
                        )}
                      </td>
                      <td className="py-6 px-8">
                        {editingSeasonId === season.id ? (
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-[#2c2416]/30">$</span>
                            <input 
                              type="number"
                              value={editSeasonForm?.weekend_price || ''}
                              placeholder="Opcional"
                              onChange={e => setEditSeasonForm({...editSeasonForm, weekend_price: e.target.value})}
                              className="w-full bg-white border border-[#f5f0e8] rounded-lg pl-5 pr-2 py-2 text-xs outline-none"
                            />
                          </div>
                        ) : (
                          <span className="font-serif italic text-lg text-[#00628f]">
                            {season.weekend_price ? `$${(Number(season.weekend_price) / 1000).toFixed(0)}k` : '-'}
                          </span>
                        )}
                      </td>
                      <td className="py-6 px-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {editingSeasonId === season.id ? (
                            <>
                              <button 
                                onClick={handleUpdateSeason}
                                className="p-2 text-[#00628f] hover:bg-[#00628f]/10 rounded-full transition-all"
                                title="Guardar"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={handleEditSeasonCancel}
                                className="p-2 text-[#2c2416]/20 hover:text-[#2c2416] hover:bg-[#f5f0e8] rounded-full transition-all"
                                title="Cancelar"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleEditSeasonStart(season)}
                                className="p-2 text-[#2c2416]/20 hover:text-[#00628f] hover:bg-[#00628f]/5 rounded-full transition-all"
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteSeason(season.id)}
                                className="p-2 text-[#2c2416]/20 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar - Quick Actions & Info */}
        <div className="space-y-12">
          <div className="bg-white rounded-xl p-8 shadow-[0_12px_32px_rgba(27,28,26,0.06)] border border-white/20">
            <h3 className="text-xl font-serif italic mb-8 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-[#00628f]" />
              Resumen Tarifario
            </h3>
            <div className="space-y-6">
              <div className="p-6 bg-[#f5f0e8]/50 rounded-xl">
                <div className="text-[10px] text-[#2c2416]/40 uppercase tracking-widest font-bold mb-2">Precio Base (System)</div>
                <div className="text-3xl font-serif italic text-[#6b7c4a]">
                  ${(basePrice / 1000).toFixed(0)}k
                </div>
              </div>
              <div className="p-6 bg-[#f5f0e8]/50 rounded-xl">
                <div className="text-[10px] text-[#2c2416]/40 uppercase tracking-widest font-bold mb-2">Promedio Mensual</div>
                <div className="text-3xl font-serif italic">
                  ${(calendarData.reduce((a, b) => a + b.price, 0) / (calendarData.length || 1) / 1000).toFixed(1)}k
                </div>
              </div>
              <div className="p-6 bg-[#f5f0e8]/50 rounded-xl">
                <div className="text-[10px] text-[#2c2416]/40 uppercase tracking-widest font-bold mb-2">Máxima del Mes</div>
                <div className="text-3xl font-serif italic text-[#00628f]">
                  ${(Math.max(...(calendarData.map(d => d.price) || [0])) / 1000).toFixed(0)}k
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#00628f]/5 rounded-xl p-8 border border-[#00628f]/10">
            <h3 className="text-lg font-serif italic mb-4 text-[#00628f]">Editorial Note</h3>
            <p className="text-sm text-[#2c2416]/60 leading-relaxed italic">
              "El valor de la estadía debe reflejar el santuario que ofrecemos. La fluidez de los precios es el ritmo natural de la demanda."
            </p>
          </div>
        </div>
      </div>

      {/* Bulk Adjustment Modal */}
      <Modal isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)} title="Ajuste Masivo de Precios">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#2c2416]/40 ml-1 block">Desde</label>
              <input 
                type="date" 
                className="w-full bg-[#f5f0e8] rounded-xl px-5 py-3 focus:bg-white transition-all outline-none text-sm border-none shadow-inner"
                value={bulkForm.startDate}
                onChange={e => setBulkForm({...bulkForm, startDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#2c2416]/40 ml-1 block">Hasta</label>
              <input 
                type="date" 
                className="w-full bg-[#f5f0e8] rounded-xl px-5 py-3 focus:bg-white transition-all outline-none text-sm border-none shadow-inner"
                value={bulkForm.endDate}
                onChange={e => setBulkForm({...bulkForm, endDate: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#2c2416]/40 ml-1 block">Filtro de Aplicación</label>
            <select 
              className="w-full bg-[#f5f0e8] rounded-xl px-5 py-3 focus:bg-white transition-all outline-none text-sm border-none shadow-inner"
              value={bulkForm.targetType}
              onChange={e => setBulkForm({...bulkForm, targetType: e.target.value})}
            >
              <option value="customRange">Todo el rango seleccionado</option>
              <option value="weekends">Solo fines de semana (Vie-Dom)</option>
              <option value="holidays">Solo feriados detectados</option>
              <option value="longWeekends">Fines de semana largos (Puentes)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#2c2416]/40 ml-1 block">Tipo de Ajuste</label>
              <select 
                className="w-full bg-[#f5f0e8] rounded-xl px-5 py-3 focus:bg-white transition-all outline-none text-sm border-none shadow-inner"
                value={bulkForm.priceMode}
                onChange={e => setBulkForm({...bulkForm, priceMode: e.target.value})}
              >
                <option value="fixed">Precio Fijo (CLP)</option>
                <option value="percentage">Variación Porcentual (%)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#2c2416]/40 ml-1 block">Valor</label>
              <input 
                type="number" 
                placeholder={bulkForm.priceMode === 'fixed' ? '150000' : '20'}
                className="w-full bg-[#f5f0e8] rounded-xl px-5 py-3 focus:bg-white transition-all outline-none text-sm border-none shadow-inner"
                value={bulkForm.value}
                onChange={e => setBulkForm({...bulkForm, value: e.target.value})}
              />
            </div>
          </div>

          <button 
            onClick={handleApplyBulk}
            className="w-full py-4 bg-gradient-to-r from-[#00628f] to-[#007cb3] text-white font-semibold rounded-full hover:brightness-110 transition-all mt-6 shadow-lg shadow-blue-900/10"
          >
            Confirmar y Aplicar
          </button>
        </div>
      </Modal>

      {/* New Season Modal */}
      <Modal isOpen={isSeasonModalOpen} onClose={() => setIsSeasonModalOpen(false)} title={seasonForm.id ? 'Editar Temporada' : 'Nueva Temporada'}>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#2c2416]/40 ml-1 block">Nombre Descriptivo</label>
            <input 
              type="text" 
              placeholder="Ej: Temporada Alta Verano"
              className="w-full bg-[#f5f0e8] rounded-xl px-5 py-3 focus:bg-white transition-all outline-none text-sm border-none shadow-inner"
              value={seasonForm.name}
              onChange={e => setSeasonForm({...seasonForm, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#2c2416]/40 ml-1 block">Inicio</label>
              <input 
                type="date" 
                className="w-full bg-[#f5f0e8] rounded-xl px-5 py-3 focus:bg-white transition-all outline-none text-sm border-none shadow-inner"
                value={seasonForm.startDate}
                onChange={e => setSeasonForm({...seasonForm, startDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#2c2416]/40 ml-1 block">Término</label>
              <input 
                type="date" 
                className="w-full bg-[#f5f0e8] rounded-xl px-5 py-3 focus:bg-white transition-all outline-none text-sm border-none shadow-inner"
                value={seasonForm.endDate}
                onChange={e => setSeasonForm({...seasonForm, endDate: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#2c2416]/40 ml-1 block">Tarifa Semana</label>
              <input 
                type="number" 
                placeholder="160000"
                className="w-full bg-[#f5f0e8] rounded-xl px-5 py-3 focus:bg-white transition-all outline-none text-sm border-none shadow-inner font-serif italic"
                value={seasonForm.priceWeek}
                onChange={e => setSeasonForm({...seasonForm, priceWeek: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#2c2416]/40 ml-1 block">Tarifa Finde</label>
              <input 
                type="number" 
                placeholder="180000"
                className="w-full bg-[#f5f0e8] rounded-xl px-5 py-3 focus:bg-white transition-all outline-none text-sm border-none shadow-inner font-serif italic text-[#00628f]"
                value={seasonForm.priceWeekend}
                onChange={e => setSeasonForm({...seasonForm, priceWeekend: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#2c2416]/40 ml-1 block">Prioridad de Regla</label>
            <input 
              type="number" 
              className="w-full bg-[#f5f0e8] rounded-xl px-5 py-3 focus:bg-white transition-all outline-none text-sm border-none shadow-inner"
              value={seasonForm.priority}
              onChange={e => setSeasonForm({...seasonForm, priority: Number(e.target.value)})}
            />
          </div>

          <button 
            onClick={handleSaveSeason}
            className="w-full py-4 bg-gradient-to-r from-[#00628f] to-[#007cb3] text-white font-semibold rounded-full hover:brightness-110 transition-all mt-6 shadow-lg shadow-blue-900/10"
          >
            Guardar Configuración
          </button>
        </div>
      </Modal>

      {/* Day Detail Modal */}
      <Modal isOpen={isDayModalOpen} onClose={() => setIsDayModalOpen(false)} title="Detalle Diario">
        {selectedDay && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-[#f5f0e8] rounded-xl">
                <div className="text-[10px] text-[#2c2416]/40 uppercase tracking-widest font-bold mb-1">Actual</div>
                <div className="text-2xl font-serif italic">${selectedDay.price.toLocaleString()}</div>
              </div>
              <div className="p-6 bg-[#f5f0e8] rounded-xl">
                <div className="text-[10px] text-[#2c2416]/40 uppercase tracking-widest font-bold mb-1">Fuente</div>
                <div className="text-xs font-semibold leading-tight text-[#00628f]">{selectedDay.source}</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#2c2416]/40 ml-1 block">Sobrescribir para esta fecha (CLP)</label>
              <input 
                type="number" 
                className="w-full bg-[#f5f0e8] rounded-xl px-6 py-4 focus:bg-white transition-all outline-none text-3xl font-serif italic text-[#2c2416] border-none shadow-inner"
                value={selectedDay.overridePrice}
                onChange={e => setSelectedDay({...selectedDay, overridePrice: e.target.value})}
              />
            </div>

            <button 
              onClick={async () => {
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token;
                
                const res = await fetch('/api/admin/pricing/apply', {
                  method: 'POST',
                  headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    startDate: selectedDay.date,
                    endDate: selectedDay.date,
                    targetType: 'customRange',
                    priceMode: 'fixed',
                    value: Number(selectedDay.overridePrice),
                    name: 'Manual Override',
                    priority: 1000
                  })
                });
                if (res.ok) {
                  toast.success('Precio actualizado');
                  setIsDayModalOpen(false);
                  fetchData();
                }
              }}
              className="w-full py-4 bg-gradient-to-r from-[#00628f] to-[#007cb3] text-white font-semibold rounded-full hover:brightness-110 transition-all shadow-lg shadow-blue-900/10"
            >
              Confirmar Override
            </button>
          </div>
        )}
      </Modal>

    </div>
  );
}

