import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface CalendarEvent {
  day: number;
  labelKey: string;
  color: 'blue' | 'emerald' | 'red' | 'yellow' | 'purple';
  gerencia: string;
  periodo: string;
}

const allEvents: CalendarEvent[] = [
  { day: 3, labelKey: "Auditoría Interna ISO", color: "blue", gerencia: "Servicios Generales", periodo: "2024" },
  { day: 10, labelKey: "Reporte MINSAL", color: "emerald", gerencia: "Planta de Procesos", periodo: "2024" },
  { day: 12, labelKey: "Vence: Monitoreo Agua", color: "red", gerencia: "Mina", periodo: "2024" },
  { day: 15, labelKey: "RCA: Control Polvo", color: "yellow", gerencia: "Mina", periodo: "2024" },
  { day: 18, labelKey: "Mesa Social Colla", color: "purple", gerencia: "Servicios Generales", periodo: "2024" },
  { day: 24, labelKey: "Reporte Sernageomin", color: "blue", gerencia: "Mina", periodo: "2024" },
  { day: 30, labelKey: "Cierre Trimestral SMA", color: "red", gerencia: "Planta de Procesos", periodo: "2024" },
  { day: 5, labelKey: "Inspección de Taludes", color: "yellow", gerencia: "Mina", periodo: "2025" },
  { day: 20, labelKey: "Mantención Planta Solar", color: "emerald", gerencia: "Servicios Generales", periodo: "2025" },
];

const Calendar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedGerencia, setSelectedGerencia] = useState('Todas');
  const [selectedPeriodo, setSelectedPeriodo] = useState('2024');

  const gerencias = [t('dashboard.gerencias.Todas'), t('dashboard.gerencias.Mina'), t('dashboard.gerencias.Planta de Procesos'), t('dashboard.gerencias.Servicios Generales')];
  const periodos = ['2023', '2024', '2025', '2026'];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      const matchGerencia = selectedGerencia === t('dashboard.gerencias.Todas') || t(`dashboard.gerencias.${event.gerencia}`) === selectedGerencia;
      const matchPeriodo = event.periodo === selectedPeriodo;
      return matchGerencia && matchPeriodo;
    });
  }, [selectedGerencia, selectedPeriodo, t]);

  const handleExportCalendar = useCallback(() => {
    const reportDate = new Date().toLocaleString(i18n.language === 'es' ? 'es-CL' : 'en-US');
    const content = `
${t('calendar.export.title')}
=======================================
${t('calendar.export.generated_at')}: ${reportDate}

${t('calendar.export.parameters')}:
-----------
${t('calendar.export.management')}: ${selectedGerencia}
${t('calendar.export.year')}: ${selectedPeriodo}

${t('calendar.export.scheduled_events')}:
--------------------
${filteredEvents.length > 0 ? filteredEvents.map(ev => `- ${t('calendar.export.day_prefix')} ${ev.day}: ${t(`calendar.events.${ev.labelKey}`)} (${t(`dashboard.gerencias.${ev.gerencia}`)})`).join('\n') : t('calendar.export.no_events')}

=======================================
${t('calendar.export.footer')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Calendar_${selectedGerencia}_${selectedPeriodo}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }, [selectedGerencia, selectedPeriodo, filteredEvents, t, i18n.language]);

  const colorStyles = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500",
    red: "bg-red-500/10 text-red-400 border-red-500",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500",
  };

  const dayNames = [
    t('calendar.days.DOM'),
    t('calendar.days.LUN'),
    t('calendar.days.MAR'),
    t('calendar.days.MIE'),
    t('calendar.days.JUE'),
    t('calendar.days.VIE'),
    t('calendar.days.SAB')
  ];

  const currentMonthName = t('calendar.months.October');

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark">
      <header className="px-8 py-6 pb-2 border-b border-border-dark bg-surface-dark/30">
        <div className="flex flex-col gap-6">
          <nav className="flex items-center text-sm font-medium text-text-secondary">
            <Link to="/" className="hover:text-primary transition-colors cursor-pointer uppercase tracking-widest text-[10px] font-black">{t('dashboard.breadcrumb_start')}</Link>
            <span className="mx-2">/</span>
            <span className="text-white uppercase tracking-widest text-[10px] font-black">{t('calendar.breadcrumb_calendar')}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-white text-3xl md:text-4xl font-black uppercase tracking-tight">{t('calendar.title')}</h2>
              <p className="text-text-secondary text-base mt-1 italic">{t('calendar.subtitle')}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest ml-1">{t('calendar.label_gerencia')}</label>
                <select
                  value={selectedGerencia}
                  onChange={(e) => setSelectedGerencia(e.target.value)}
                  className="bg-surface-dark border border-border-dark text-white rounded-lg px-3 py-1.5 text-xs focus:ring-primary focus:border-primary outline-none transition-all min-w-[150px] h-10 shadow-sm"
                >
                  {gerencias.map(g => <option key={g} value={g} className="bg-surface-dark">{g}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest ml-1">{t('calendar.label_annual')}</label>
                <select
                  value={selectedPeriodo}
                  onChange={(e) => setSelectedPeriodo(e.target.value)}
                  className="bg-surface-dark border border-border-dark text-white rounded-lg px-3 py-1.5 text-xs focus:ring-primary focus:border-primary outline-none transition-all min-w-[100px] h-10 shadow-sm"
                >
                  {periodos.map(p => <option key={p} value={p} className="bg-surface-dark">{p}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black text-transparent uppercase tracking-widest pointer-events-none">{t('calendar.label_action')}</label>
                <button
                  onClick={handleExportCalendar}
                  className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary hover:bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all uppercase tracking-widest"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>{t('calendar.btn_export')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8 flex-1 overflow-y-auto">
        <div className="flex flex-col bg-card-dark border border-border-dark rounded-2xl shadow-2xl overflow-hidden min-h-[600px] max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between p-6 border-b border-border-dark bg-surface-dark">
            <div>
              <h3 className="text-white text-xl font-bold uppercase tracking-widest">{currentMonthName} {selectedPeriodo}</h3>
              <p className="text-[10px] text-text-secondary font-bold uppercase mt-1">{t('calendar.viewing_events')}: {selectedGerencia}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"><span className="material-symbols-outlined">chevron_left</span></button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"><span className="material-symbols-outlined">chevron_right</span></button>
            </div>
          </div>
          <div className="grid grid-cols-7 border-b border-border-dark bg-surface-dark-lighter text-center py-3 text-[10px] font-black text-text-secondary tracking-[0.2em]">
            {dayNames.map(name => <div key={name}>{name}</div>)}
          </div>
          <div className="grid grid-cols-7 auto-rows-fr bg-background-dark flex-1">
            {days.map((day) => {
              const dayEvents = filteredEvents.filter(e => e.day === day);
              return (
                <div key={day} className="border-r border-b border-border-dark/30 p-3 text-text-secondary hover:bg-white/5 transition-colors relative min-h-[120px] group">
                  <span className="text-xs font-bold group-hover:text-white transition-colors">{day}</span>
                  <div className="mt-1 space-y-1">
                    {dayEvents.map((ev, idx) => {
                      const translatedLabel = t(`calendar.events.${ev.labelKey}`);
                      const translatedGerencia = t(`dashboard.gerencias.${ev.gerencia}`);
                      return (
                        <div
                          key={idx}
                          className={`text-[9px] font-black p-1.5 rounded border-l-4 uppercase shadow-sm ${colorStyles[ev.color]}`}
                          title={`${translatedLabel} - ${translatedGerencia}`}
                        >
                          <div className="truncate">{translatedLabel}</div>
                          <div className="text-[7px] opacity-60 truncate">{translatedGerencia}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;