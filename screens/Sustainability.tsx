import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

const Sustainability: React.FC = () => {
  const { t } = useTranslation();

  const waterData = useMemo(() => [
    { month: t('sustainability.months.Ene'), continental: 0.6, desalada: 0.4 },
    { month: t('sustainability.months.Feb'), continental: 0.55, desalada: 0.45 },
    { month: t('sustainability.months.Mar'), continental: 0.5, desalada: 0.5 },
    { month: t('sustainability.months.Abr'), continental: 0.45, desalada: 0.55 },
    { month: t('sustainability.months.May'), continental: 0.4, desalada: 0.6 },
    { month: t('sustainability.months.Jun'), continental: 0.35, desalada: 0.65 },
    { month: t('sustainability.months.Jul'), continental: 0.3, desalada: 0.7 },
    { month: t('sustainability.months.Ago'), continental: 0.28, desalada: 0.72 },
    { month: t('sustainability.months.Sep'), continental: 0.25, desalada: 0.75 },
    { month: t('sustainability.months.Oct'), continental: 0.22, desalada: 0.78 },
    { month: t('sustainability.months.Nov'), continental: 0.2, desalada: 0.8 },
    { month: t('sustainability.months.Dic'), continental: 0.18, desalada: 0.82 },
  ], [t]);

  const kpis = [
    { label: t('sustainability.kpi_water'), val: "0.38", unit: t('sustainability.unit_water'), icon: "water_drop" },
    { label: t('sustainability.kpi_carbon'), val: "10.2k", unit: t('sustainability.unit_carbon'), icon: "co2" },
    { label: t('sustainability.kpi_rca'), val: "99.1%", unit: t('sustainability.unit_rca'), icon: "verified" },
    { label: t('sustainability.kpi_energy'), val: "85%", unit: t('sustainability.unit_energy'), icon: "bolt" }
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark">
      <header className="px-6 py-5 border-b border-card-dark bg-background-dark/80 backdrop-blur-md sticky top-0 z-10">
        <h2 className="text-2xl font-bold text-white tracking-tight uppercase">{t('sustainability.title')}</h2>
        <p className="text-slate-400 text-xs font-medium">{t('sustainability.subtitle')}</p>
      </header>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((item, i) => (
            <div key={i} className="bg-card-dark rounded-xl border border-border-dark p-6 flex items-center justify-between hover:border-primary/50 transition-colors shadow-lg">
              <div>
                <p className="text-text-secondary text-[10px] font-bold mb-1 uppercase tracking-widest">{item.label}</p>
                <h3 className="text-3xl font-bold text-white">{item.val} <span className="text-sm font-normal text-slate-400">{item.unit}</span></h3>
              </div>
              <div className="size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">{item.icon}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card-dark rounded-xl border border-border-dark p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">{t('sustainability.chart_water_title')}</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-[10px] text-text-secondary uppercase font-bold">
                <span className="size-2 bg-primary rounded-full"></span> {t('sustainability.legend_continental')}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-text-secondary uppercase font-bold">
                <span className="size-2 bg-emerald-500 rounded-full"></span> {t('sustainability.legend_desalinated')}
              </span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#324467" opacity={0.3} />
                <XAxis dataKey="month" stroke="#92a4c9" fontSize={12} axisLine={false} tickLine={false} tickFormatter={(value) => value} />
                <YAxis stroke="#92a4c9" fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #324467', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="continental" fill="#135bec" radius={[4, 4, 0, 0]} name={t('sustainability.bar_continental')} />
                <Bar dataKey="desalada" fill="#10b981" radius={[4, 4, 0, 0]} name={t('sustainability.bar_desalinated')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sustainability;
