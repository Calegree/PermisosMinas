import React, { useState, useMemo, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

const initialSmaProbData = [
  { name: 'ENE 24', value: 10 },
  { name: 'FEB 24', value: 15 },
  { name: 'MAR 24', value: 25 },
  { name: 'ABR 24', value: 45 },
  { name: 'MAY 24', value: 65 },
  { name: 'JUN 24', value: 50 },
  { name: 'JUL 24', value: 40 },
  { name: 'AGO 24', value: 35 },
  { name: 'SEP 24', value: 55 },
  { name: 'OCT 24', value: 70 },
  { name: 'NOV 24', value: 60 },
  { name: 'DIC 24', value: 45 },
  { name: 'ENE 25', value: 30 },
  { name: 'FEB 25', value: 25 },
  { name: 'MAR 25', value: 40 },
  { name: 'ABR 25', value: 55 },
  { name: 'MAY 25', value: 75 },
  { name: 'JUN 25', value: 65 },
];

const PredictiveAnalysis: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [analysisType, setAnalysisType] = useState('predictive');

  const [delayRCA, setDelayRCA] = useState(15);
  const [delayPAS, setDelayPAS] = useState(0);
  const [delaySernageomin, setDelaySernageomin] = useState(30);
  const [delayDGA, setDelayDGA] = useState(10);
  const [delaySeremi, setDelaySeremi] = useState(5);
  const [delayConaf, setDelayConaf] = useState(20);
  const [delayVialidad, setDelayVialidad] = useState(12);
  const [delaySEC, setDelaySEC] = useState(8);
  const [delayCMN, setDelayCMN] = useState(25);

  const [isGenerating, setIsGenerating] = useState(false);
  const [riskScore, setRiskScore] = useState(78.4);
  const [pendingInspections, setPendingInspections] = useState(3);
  const [chartData, setChartData] = useState(initialSmaProbData);

  const totalDelay = useMemo(() =>
    delayRCA + delayPAS + delaySernageomin + delayDGA + delaySeremi + delayConaf + delayVialidad + delaySEC + delayCMN,
    [delayRCA, delayPAS, delaySernageomin, delayDGA, delaySeremi, delayConaf, delayVialidad, delaySEC, delayCMN]
  );

  const quickInsights = useMemo(() => [
    { text: t('predictive.insights.0'), color: "bg-orange-400" },
    { text: t('predictive.insights.1'), color: "bg-orange-400" },
    { text: t('predictive.insights.2'), color: "bg-red-400" },
    { text: t('predictive.insights.3'), color: "bg-blue-400" },
    { text: t('predictive.insights.4'), color: "bg-yellow-400" },
    { text: t('predictive.insights.5'), color: "bg-emerald-400" },
  ], [t]);

  const handleExportPDF = useCallback(() => {
    const reportDate = new Date().toLocaleString(i18n.language === 'es' ? 'es-CL' : 'en-US');
    const content = `
${t('predictive.export.title')}
==============================================
${t('calendar.export.generated_at')}: ${reportDate}

${t('predictive.export.summary_title')}
-----------------------------
${t('predictive.export.risk_score')}: ${riskScore}%
${t('predictive.export.total_delay')}: ${totalDelay} ${t('reports.unit_days')}
${t('predictive.export.pending_inspections')}: ${pendingInspections}

${t('predictive.export.sim_variables')}
------------------------------------------
- ${t('predictive.variables.rca')}: ${delayRCA} ${t('reports.unit_days')}
- ${t('predictive.variables.pas138')}: ${delayPAS} ${t('reports.unit_days')}
- ${t('predictive.variables.sernageomin')}: ${delaySernageomin} ${t('reports.unit_days')}
- ${t('predictive.variables.dga')}: ${delayDGA} ${t('reports.unit_days')}
- ${t('predictive.variables.seremi')}: ${delaySeremi} ${t('reports.unit_days')}
- ${t('predictive.variables.conaf')}: ${delayConaf} ${t('reports.unit_days')}
- ${t('predictive.variables.vialidad')}: ${delayVialidad} ${t('reports.unit_days')}
- ${t('predictive.variables.sec')}: ${delaySEC} ${t('reports.unit_days')}
- ${t('predictive.variables.cmn')}: ${delayCMN} ${t('reports.unit_days')}

${t('predictive.export.insights_alerts')}
-------------------
${quickInsights.map(i => `- ${i.text}`).join('\n')}

==============================================
${t('predictive.export.official_doc')}
${t('predictive.export.simulation_note')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Predictive_Analysis_${reportDate.replace(/[/:\s]/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }, [riskScore, totalDelay, pendingInspections, delayRCA, delayPAS, delaySernageomin, delayDGA, delaySeremi, delayConaf, delayVialidad, delaySEC, delayCMN, quickInsights, t, i18n.language]);

  const handleGenerateSimulation = useCallback(async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newRisk = 70 + Math.random() * 20;
    const newInspections = Math.floor(Math.random() * 15) + 5;
    const newChartData = chartData.map(item => ({
      ...item,
      value: Math.max(5, Math.min(95, item.value + (Math.random() * 20 - 10)))
    }));

    setRiskScore(parseFloat(newRisk.toFixed(1)));
    setPendingInspections(newInspections);
    setChartData(newChartData);
    setIsGenerating(false);
  }, [chartData]);

  const simulationVariables = [
    { label: t('predictive.variables.rca'), value: delayRCA, setter: setDelayRCA, color: "text-orange-400" },
    { label: t('predictive.variables.pas138'), value: delayPAS, setter: setDelayPAS, color: "text-primary" },
    { label: t('predictive.variables.sernageomin'), value: delaySernageomin, setter: setDelaySernageomin, color: "text-orange-400" },
    { label: t('predictive.variables.dga'), value: delayDGA, setter: setDelayDGA, color: "text-blue-400" },
    { label: t('predictive.variables.seremi'), value: delaySeremi, setter: setDelaySeremi, color: "text-emerald-400" },
    { label: t('predictive.variables.conaf'), value: delayConaf, setter: setDelayConaf, color: "text-yellow-400" },
    { label: t('predictive.variables.vialidad'), value: delayVialidad, setter: setDelayVialidad, color: "text-red-400" },
    { label: t('predictive.variables.sec'), value: delaySEC, setter: setDelaySEC, color: "text-purple-400" },
    { label: t('predictive.variables.cmn'), value: delayCMN, setter: setDelayCMN, color: "text-orange-400" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark p-6">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-[10px] text-text-secondary uppercase font-bold tracking-widest mb-2">
          <span>{t('dashboard.breadcrumb_start')}</span>
          <span>/</span>
          <span>Minera Los Andes</span>
          <span>/</span>
          <span className="text-primary">{t('sidebar.predictive')}</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">{t('predictive.title')}</h1>
            <p className="text-text-secondary text-sm">{t('predictive.subtitle')}</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-surface-dark-lighter/50 border border-border-dark px-4 py-2 rounded-lg text-xs font-bold text-white hover:bg-white/5 transition-colors">
              <span className="material-symbols-outlined text-[18px]">share</span>
              {t('predictive.btn_share')}
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 bg-surface-dark-lighter/50 border border-border-dark px-4 py-2 rounded-lg text-xs font-bold text-white hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              {t('predictive.btn_export_pdf')}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2">
          <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary">tune</span>
              <h3 className="font-bold text-white uppercase tracking-widest text-sm">{t('predictive.config_title')}</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest block mb-3">{t('predictive.label_type')}</label>
                <div className="space-y-2">
                  {[
                    { id: 'historic', label: t('predictive.types.historic'), icon: 'history' },
                    { id: 'predictive', label: t('predictive.types.predictive'), icon: 'trending_up' },
                    { id: 'impact', label: t('predictive.types.impact'), icon: 'account_tree' },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setAnalysisType(type.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${analysisType === type.id
                        ? 'bg-primary/10 border-primary text-white'
                        : 'bg-background-dark border-border-dark text-text-secondary hover:border-slate-500'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[18px]">{type.icon}</span>
                        <span className="text-xs font-bold tracking-tight">{type.label}</span>
                      </div>
                      <div className={`size-4 rounded-full border-2 flex items-center justify-center ${analysisType === type.id ? 'border-primary' : 'border-border-dark'}`}>
                        {analysisType === type.id && <div className="size-2 bg-primary rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest block mb-2">{t('predictive.label_unit')}</label>
                  <select className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-xs text-white outline-none focus:border-primary">
                    <option>{t('predictive.units_list.mine_f2')}</option>
                    <option>{t('predictive.units_list.mine_f3')}</option>
                    <option>{t('predictive.units_list.mine_port')}</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest block mb-2">{t('predictive.label_entity')}</label>
                  <select className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-xs text-white outline-none focus:border-primary">
                    <option>{t('predictive.entities_list.all')}</option>
                    <option>{t('predictive.entities_list.sma')}</option>
                    <option>{t('predictive.entities_list.sernageomin')}</option>
                    <option>{t('predictive.entities_list.dga')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest block mb-3">{t('predictive.label_horizon')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2.5 bg-primary/20 border border-primary rounded-lg text-white text-[10px] font-black uppercase">{t('predictive.horizons.6m')}</button>
                  <button className="py-2.5 bg-background-dark border border-border-dark rounded-lg text-text-secondary text-[10px] font-black uppercase hover:bg-white/5 transition-colors">{t('predictive.horizons.12m')}</button>
                </div>
              </div>

              <button
                onClick={handleGenerateSimulation}
                disabled={isGenerating}
                className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <span className="material-symbols-outlined text-[20px] icon-fill">bolt</span>
                )}
                {isGenerating ? t('predictive.btn_generating') : t('predictive.btn_simulate')}
              </button>
            </div>
          </div>

          <div className="bg-surface-dark border border-border-dark rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-orange-400">lightbulb</span>
              <h4 className="font-bold text-white uppercase tracking-widest text-[11px]">{t('predictive.insights_title')}</h4>
            </div>
            <ul className="space-y-4">
              {quickInsights.map((insight, idx) => (
                <li key={idx} className="flex gap-3">
                  <div className={`size-1.5 ${insight.color} rounded-full mt-1.5 shrink-0`} />
                  <p className="text-[11px] text-text-secondary leading-relaxed">{insight.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6 overflow-y-auto pr-2 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`bg-surface-dark border border-border-dark rounded-2xl p-5 relative overflow-hidden transition-all ${isGenerating ? 'opacity-50' : 'opacity-100'}`}>
              <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest mb-1">{t('predictive.kpi_risk_title')}</p>
              <div className="flex items-center gap-3">
                <h3 className="text-4xl font-black text-white">{isGenerating ? '...' : riskScore}</h3>
                {!isGenerating && (
                  <span className="bg-red-500/10 text-red-500 text-[10px] font-black px-2 py-1 rounded flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    +5%
                  </span>
                )}
              </div>
              <p className="text-[10px] text-text-secondary mt-2">{t('predictive.kpi_risk_desc')}</p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500/20">
                <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${riskScore}%` }} />
              </div>
            </div>
            <div className={`bg-surface-dark border border-border-dark rounded-2xl p-5 relative transition-all ${isGenerating ? 'opacity-50' : 'opacity-100'}`}>
              <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest mb-1">{t('predictive.kpi_delay_title')}</p>
              <div className="flex items-center gap-2">
                <h3 className="text-4xl font-black text-white">{isGenerating ? '...' : totalDelay}</h3>
                <span className="text-text-secondary text-sm">{t('reports.unit_days')}</span>
              </div>
              <p className="text-[10px] text-text-secondary mt-2">{t('predictive.kpi_delay_desc')}</p>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-border-dark/30">
                <span className="material-symbols-outlined text-[48px]">schedule</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500/20">
                <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${Math.min(totalDelay / 2, 100)}%` }} />
              </div>
            </div>
            <div className={`bg-surface-dark border border-border-dark rounded-2xl p-5 relative transition-all ${isGenerating ? 'opacity-50' : 'opacity-100'}`}>
              <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest mb-1">{t('predictive.kpi_inspections_title')}</p>
              <div className="flex items-center gap-3">
                <h3 className="text-4xl font-black text-white">{isGenerating ? '...' : pendingInspections.toString().padStart(2, '0')}</h3>
                {!isGenerating && <span className="text-primary text-[10px] font-bold uppercase">{t('predictive.kpi_inspections_proj')}</span>}
              </div>
              <p className="text-[10px] text-text-secondary mt-2">{t('predictive.kpi_inspections_desc')}</p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20">
                <div className="h-full bg-primary" style={{ width: '40%' }} />
              </div>
            </div>
          </div>

          <div className="bg-surface-dark border border-border-dark rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">{t('predictive.simulator_title')}</h3>
                <p className="text-sm text-text-secondary">{t('predictive.simulator_desc')}</p>
              </div>
              <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-[10px] font-black uppercase tracking-widest">
                {t('predictive.simulator_mode')}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-12">
              <div className="col-span-12 lg:col-span-5 grid grid-cols-1 gap-x-8 gap-y-6">
                {simulationVariables.map((v, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-white uppercase tracking-tight">{v.label}</span>
                      <span className={`${v.color} font-black text-xs`}>+{v.value} {t('reports.unit_days')}</span>
                    </div>
                    <input
                      type="range" min="0" max="90" value={v.value} onChange={(e) => v.setter(parseInt(e.target.value))}
                      className="w-full h-1 bg-background-dark rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                ))}
              </div>

              <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
                <div className="bg-background-dark/30 border border-border-dark rounded-xl p-6 relative min-h-[300px] flex flex-col">
                  <div className="flex justify-between text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-12 px-2">
                    <span>Q1 2024</span><span>Q2 2024</span><span>Q3 2024</span><span>Q4 2024</span><span>Q1 2025</span>
                  </div>

                  <div className="space-y-12 relative flex-1">
                    <div className="flex items-center gap-4">
                      <span className="text-[9px] font-bold text-text-secondary uppercase w-20 text-right">{t('predictive.gantt.baseline')}</span>
                      <div className="flex-1 h-1 bg-slate-700 rounded-full" />
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[9px] font-bold text-white uppercase w-20 text-right">{t('predictive.gantt.projection')}</span>
                      <div className="flex-1 h-4 flex relative">
                        <div className="h-full bg-primary rounded-l-md shadow-[0_0_15px_rgba(19,91,236,0.3)] transition-all duration-500" style={{ width: '45%' }}>
                          <span className="absolute inset-0 flex items-center justify-center text-[7px] font-black uppercase text-white/80">{t('predictive.gantt.task_civil')}</span>
                        </div>
                        <div className={`h-full bg-red-500/80 rounded-r-md border-l border-white/20 animate-pulse transition-all duration-500`} style={{ width: `${Math.min(totalDelay / 5, 55)}%` }}>
                          <span className="absolute inset-0 flex items-center justify-center text-[7px] font-black uppercase text-white">
                            <span className="material-symbols-outlined text-[10px] mr-1">warning</span>
                            {t('predictive.gantt.impact_label')}: {totalDelay} {t('reports.unit_days')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
                    <span className="material-symbols-outlined text-red-500 text-[20px]">info</span>
                    <div>
                      <p className="text-[11px] text-red-200 leading-tight">
                        {t('predictive.mitigation_warning', { days: totalDelay })}
                      </p>
                      <p className="text-[10px] text-red-300/60 mt-2 font-bold uppercase tracking-widest">{t('reports.kpi_alerts')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-white uppercase tracking-widest text-sm">{t('predictive.matrix_title')}</h4>
                <span className="material-symbols-outlined text-text-secondary cursor-pointer">more_horiz</span>
              </div>
              <p className="text-[10px] text-text-secondary font-medium uppercase mb-6">{t('predictive.matrix_desc')}</p>

              <div className="grid grid-cols-2 gap-3 aspect-square max-h-[300px] mx-auto">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-emerald-500 font-black text-sm uppercase mb-1">{t('predictive.matrix_levels.low')}</span>
                  <p className="text-[9px] text-text-secondary uppercase font-bold">{t('predictive.matrix_levels.low_desc')}</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-orange-500 font-black text-sm uppercase mb-1">{t('predictive.matrix_levels.medium')}</span>
                  <p className="text-[9px] text-text-secondary uppercase font-bold">{t('predictive.matrix_levels.medium_desc')}</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-yellow-500 font-black text-sm uppercase mb-1">{t('predictive.matrix_levels.medium_high')}</span>
                  <p className="text-[9px] text-text-secondary uppercase font-bold">{t('predictive.matrix_levels.medium_high_desc')}</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-red-500 font-black text-sm uppercase mb-1">{t('predictive.matrix_levels.critical')}</span>
                  <p className="text-[9px] text-text-secondary uppercase font-bold">{t('predictive.matrix_levels.critical_desc')}</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 shadow-xl flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="font-bold text-white uppercase tracking-widest text-sm">{t('predictive.chart_title')}</h4>
                  <p className="text-[10px] text-text-secondary font-medium mt-1">{t('predictive.chart_desc')}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-2 bg-primary rounded-full" />
                  <span className="text-[9px] font-bold text-text-secondary uppercase">{t('predictive.chart_trend')}</span>
                </div>
              </div>

              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -30, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#324467" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#92a4c9" fontSize={8} axisLine={false} tickLine={false} interval={0} angle={-45} textAnchor="end" />
                    <YAxis stroke="#92a4c9" fontSize={10} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1d24', border: '1px solid #324467', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                      cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    />
                    <Bar dataKey="value" fill="#135bec" radius={[2, 2, 0, 0]} barSize={15} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalysis;