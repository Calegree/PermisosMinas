import React, { useState, useMemo, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { KPIData, Permit } from '../types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Datos base para las alertas con campo de gerencia para filtrado
const allCriticalPermits: (Permit & { gerencia: string })[] = [
  { id: '1', name: "Extracción Aguas", dept: "DGA - Pozo Norte", date: "12 Oct 2024", status: "Crítico", color: "red", gerencia: "Mina" },
  { id: '2', name: "Botadero Estéril", dept: "Sernageomin", date: "15 Nov 2024", status: "Atención", color: "yellow", gerencia: "Mina" },
  { id: '3', name: "Planta Chancado", dept: "Seremi Salud", date: "20 Jun 2025", status: "Vigente", color: "green", gerencia: "Planta de Procesos" },
  { id: '4', name: "Depósito Relaves", dept: "Sernageomin", date: "05 Dec 2024", status: "Atención", color: "yellow", gerencia: "Planta de Procesos" },
  { id: '5', name: "Emisiones Fundición", dept: "SMA", date: "30 Sep 2024", status: "Crítico", color: "red", gerencia: "Planta de Procesos" },
  { id: '6', name: "Uso de Suelo", dept: "SAG", date: "12 Mar 2025", status: "Vigente", color: "green", gerencia: "Servicios Generales" },
  { id: '7', name: "Permiso Edificación", dept: "Dirección Obras", date: "18 Jan 2025", status: "Pendiente", color: "blue", gerencia: "Servicios Generales" },
  { id: '8', name: "Descarga Efluentes", dept: "DGA", date: "22 Oct 2024", status: "Crítico", color: "red", gerencia: "Servicios Generales" },
  { id: '9', name: "Cierre de Faena", dept: "Sernageomin", date: "30 Nov 2026", status: "Vigente", color: "green", gerencia: "Mina" },
];

const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedGerencia, setSelectedGerencia] = useState('Todas');
  const [selectedAnual, setSelectedAnual] = useState('2024');

  const gerencias = ['Todas', 'Mina', 'Planta de Procesos', 'Servicios Generales'];
  const periodos = ['2023', '2024', '2025', '2026'];

  // Filtrado dinámico de alertas según Gerencia
  const filteredPermits = useMemo(() => {
    return selectedGerencia === 'Todas'
      ? allCriticalPermits
      : allCriticalPermits.filter(p => p.gerencia === selectedGerencia);
  }, [selectedGerencia]);

  // KPIs dinámicos simulados según filtros
  const dynamicKPIs = useMemo(() => {
    // Generamos variaciones basadas en la selección para que el usuario note el cambio
    const seed = (selectedGerencia.length + parseInt(selectedAnual)) % 10;
    const baseCompliance = 90 + (seed % 9);
    const baseFindings = 0.5 + (seed * 0.1);
    const baseTime = 30 + (seed * 2);
    const baseCritical = 10 + seed;

    return [
      { title: t('dashboard.kpi_compliance'), icon: "trending_up", val: `${baseCompliance.toFixed(1)}%`, sub: `+${(seed / 2).toFixed(1)}% ${t('dashboard.kpi_vs_month')}`, color: "green" },
      { title: t('dashboard.kpi_findings'), icon: "trending_down", val: baseFindings.toFixed(1), sub: `-${(seed / 10).toFixed(1)} ${t('dashboard.kpi_vs_month')}`, color: "green", desc: i18n.language === 'en' ? "Findings per inspection" : "Hallazgos por inspección" },
      { title: t('dashboard.kpi_tramitation'), icon: "timer_off", val: `${baseTime} ${i18n.language === 'en' ? 'Days' : 'Días'}`, sub: `-12% ${t('dashboard.kpi_vs_month')}`, color: "green", desc: `${t('dashboard.kpi_goal')}: 50 ${i18n.language === 'en' ? 'days' : 'días'}` },
      { title: t('dashboard.kpi_critical'), icon: "warning", val: baseCritical.toString(), sub: `${Math.floor(seed / 3)} ${t('dashboard.kpi_at_risk')}`, color: "orange", special: true }
    ] as KPIData[];
  }, [selectedGerencia, selectedAnual, t, i18n.language]);

  // Datos de gráfico dinámicos simulados
  const dynamicChartData = useMemo(() => {
    const seed = (selectedGerencia.length + parseInt(selectedAnual)) % 5;
    const months = i18n.language === 'en'
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      : ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    return months.map((month, i) => ({
      name: month,
      findings: 2.1 + seed * 0.1 // Just simpler reproduction of logic
    })).map((item, idx) => {
      // Replicating original logic exactly for variety
      const originalValues = [2.1, 1.8, 2.5, 1.5, 1.3, 1.2, 1.1, 1.4, 1.0, 0.9, 0.8, 0.7];
      const modifiers = [0.1, 0.2, -0.1, 0.1, -0.05, 0.15, 0.1, -0.2, 0.05, 0.1, -0.1, 0.05];
      return {
        name: item.name,
        findings: originalValues[idx] + (modifiers[idx] * seed)
      };
    });
  }, [selectedGerencia, selectedAnual, i18n.language]);

  const handleExportPDF = useCallback(() => {
    const reportDate = new Date().toLocaleString();
    const isEn = i18n.language === 'en';
    const content = `
${isEn ? 'PERMIT MASTERY - STRATEGIC SUMMARY REPORT' : 'PERMIT MASTERY - REPORTE DE RESUMEN ESTRATÉGICO'}
==============================================
${isEn ? 'Generated on' : 'Generado el'}: ${reportDate}

${isEn ? 'FILTER PARAMETERS' : 'PARAMETROS DE FILTRADO'}:
-----------------------
${isEn ? 'Management' : 'Gerencia'}: ${t(`dashboard.gerencias.${selectedGerencia}`)}
${isEn ? 'Period' : 'Periodo'}: ${selectedAnual}

${isEn ? 'COMPLIANCE KPIs' : 'KPIs DE CUMPLIMIENTO'}:
---------------------
${dynamicKPIs.map(kpi => `- ${kpi.title}: ${kpi.val} (${kpi.sub})`).join('\n')}

${isEn ? 'ALERTS AND CRITICAL PERMITS' : 'ALERTAS Y PERMISOS CRÍTICOS'}:
----------------------------
${filteredPermits.map(p => `[${p.status.toUpperCase()}] ${p.name}
  ${isEn ? 'Entity' : 'Entidad'}: ${p.dept}
  ${isEn ? 'Expiration' : 'Vencimiento'}: ${p.date}`).join('\n\n')}

==============================================
${isEn ? 'Official regulatory tracking document.' : 'Documento oficial de seguimiento regulatorio.'}
Permit Mastery Platform v3.0
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${isEn ? 'Strategic_Summary' : 'Resumen_Estrategico'}_${selectedGerencia.replace(/\s+/g, '_')}_${selectedAnual}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }, [selectedGerencia, selectedAnual, dynamicKPIs, filteredPermits, i18n.language, t]);

  const colorClasses: Record<string, string> = {
    green: "bg-green-500/10 text-green-500",
    red: "bg-red-500/10 text-red-500",
    orange: "bg-orange-500/10 text-orange-500",
    purple: "bg-purple-500/10 text-purple-500",
    blue: "bg-blue-500/10 text-blue-500",
    yellow: "bg-yellow-500/10 text-yellow-500"
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto w-full">
      <header className="px-4 md:px-8 py-4 md:py-6 pb-2">
        <div className="flex flex-col gap-4 md:gap-6">
          <nav className="flex items-center text-[10px] font-black text-slate-500 dark:text-text-secondary uppercase tracking-widest">
            <span className="hover:text-primary transition-colors cursor-pointer">{t('dashboard.breadcrumb_start')}</span>
            <span className="mx-2">/</span>
            <span className="text-slate-900 dark:text-white">{t('dashboard.title')}</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">{t('dashboard.title')}</h2>
              <p className="text-slate-500 dark:text-text-secondary text-sm md:text-base italic">{t('dashboard.subtitle')}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
                <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest ml-1">{t('dashboard.gerencia')}</label>
                <select
                  value={selectedGerencia}
                  onChange={(e) => setSelectedGerencia(e.target.value)}
                  className="bg-surface-dark border border-border-dark text-white rounded-lg px-3 py-1.5 text-xs focus:ring-primary focus:border-primary outline-none transition-all h-10 shadow-sm"
                >
                  {gerencias.map(g => <option key={g} value={g} className="bg-surface-dark">{t(`dashboard.gerencias.${g}`)}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1 flex-1 min-w-[80px]">
                <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest ml-1">{t('dashboard.annual')}</label>
                <select
                  value={selectedAnual}
                  onChange={(e) => setSelectedAnual(e.target.value)}
                  className="bg-surface-dark border border-border-dark text-white rounded-lg px-3 py-1.5 text-xs focus:ring-primary focus:border-primary outline-none transition-all h-10 shadow-sm"
                >
                  {periodos.map(p => <option key={p} value={p} className="bg-surface-dark">{p}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1 w-full sm:w-auto">
                <label className="text-[9px] font-black text-transparent uppercase tracking-widest hidden sm:block">Acción</label>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary hover:bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all uppercase tracking-widest w-full sm:w-auto"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>{t('dashboard.export')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 md:px-8 py-4 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dynamicKPIs.map((kpi, idx) => (
            <div key={idx} className="flex flex-col gap-1 p-5 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <p className="text-slate-500 dark:text-text-secondary text-[10px] font-black uppercase tracking-widest">{kpi.title}</p>
                <span className={`p-1.5 rounded-lg ${colorClasses[kpi.color] || 'bg-slate-500/10'}`}>
                  <span className="material-symbols-outlined text-[20px]">{kpi.icon}</span>
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{kpi.val}</h3>
                <span className={`text-[10px] font-black uppercase ${kpi.color === 'red' ? 'text-red-500' : 'text-green-500'}`}>{kpi.sub}</span>
              </div>
              {kpi.special ? (
                <div className="flex gap-1 mt-4">
                  <div className="h-1.5 flex-[0.7] rounded-full bg-green-500"></div>
                  <div className="h-1.5 flex-[0.2] rounded-full bg-yellow-500"></div>
                  <div className="h-1.5 flex-[0.1] rounded-full bg-red-500"></div>
                </div>
              ) : (
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mt-4 overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: '85%' }}></div>
                </div>
              )}
              {kpi.desc && <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tight">{kpi.desc}</p>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 flex flex-col rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-sm h-[350px] md:h-[450px]">
            <div className="p-4 md:p-6 border-b border-slate-200 dark:border-border-dark flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('dashboard.chart_title')}</h3>
                <p className="text-xs text-slate-500 dark:text-text-secondary">{t('dashboard.chart_subtitle')}</p>
              </div>
            </div>
            <div className="p-2 md:p-4 flex-1 w-full overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dynamicChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFindings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#135bec" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#135bec" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#324467" opacity={0.3} />
                  <XAxis dataKey="name" stroke="#92a4c9" fontSize={10} tickLine={false} axisLine={false} fontWeight="bold" />
                  <YAxis stroke="#92a4c9" fontSize={10} tickLine={false} axisLine={false} fontWeight="bold" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1d24', border: '1px solid #324467', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                    labelStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="findings" stroke="#135bec" fillOpacity={1} fill="url(#colorFindings)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-sm overflow-hidden h-[400px] md:h-[450px]">
            <div className="p-4 md:p-6 border-b border-slate-200 dark:border-border-dark">
              <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('dashboard.alerts_title')}</h3>
              <p className="text-xs text-slate-500 dark:text-text-secondary">{t('dashboard.alerts_subtitle')}</p>
            </div>
            <div className="flex-1 overflow-y-auto w-full">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/80 backdrop-blur-sm text-[10px] font-black text-slate-500 dark:text-text-secondary z-10 uppercase tracking-widest">
                  <tr>
                    <th className="px-4 py-3">{t('dashboard.table_permit')}</th>
                    <th className="px-4 py-3">{t('dashboard.table_status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredPermits.length > 0 ? filteredPermits.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-black dark:text-white leading-tight">{row.name}</span>
                          <span className="text-[9px] font-bold text-slate-500 uppercase mt-1">{row.dept}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${row.status === 'Crítico' || row.status === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            row.status === 'Atención' || row.status === 'Attention' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                              row.status === 'Pendiente' || row.status === 'Pending' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                'bg-green-500/10 text-green-500 border-green-500/20'
                          }`}>
                          {row.status === 'Crítico' && i18n.language === 'en' ? 'Critical' :
                            row.status === 'Atención' && i18n.language === 'en' ? 'Attention' :
                              row.status === 'Pendiente' && i18n.language === 'en' ? 'Pending' :
                                row.status === 'Vigente' && i18n.language === 'en' ? 'Active' : row.status}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={2} className="px-4 py-8 text-center text-slate-500 italic text-xs">{t('dashboard.no_alerts')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-border-dark text-center bg-slate-50/50 dark:bg-slate-800/50">
              <Link to="/permisos" className="text-[10px] font-black text-primary hover:text-primary-hover transition-colors uppercase tracking-[0.2em]">{t('dashboard.view_all')}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;