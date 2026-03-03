import React, { useState } from 'react';
import { sendMessage } from '../services/geminiService';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useTranslation } from 'react-i18next';

interface ReportRecord {
  id: string;
  scenario: string;
  scenarioKey: string;
  date: string;
  risk: string;
  delay: string;
  content: string;
}

const Reports: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedScenario, setSelectedScenario] = useState('Cierre de Faena Proyectado');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [currentRisk, setCurrentRisk] = useState("78.4");
  const [currentDelay, setCurrentDelay] = useState("42");
  const [reportHistory, setReportHistory] = useState<ReportRecord[]>([]);

  const cleanMarkdown = (text: string) => {
    return text
      .replace(/[#*|]/g, '')
      .replace(/(\r\n|\n|\r)/gm, " ")
      .trim();
  };

  const handleGenerateAIAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const mockRisk = (70 + Math.random() * 20).toFixed(1);
    const mockDelay = Math.floor(30 + Math.random() * 30).toString();
    setCurrentRisk(mockRisk);
    setCurrentDelay(mockDelay);

    try {
      const prompt = `${t('reports.prompt_expert')}: "${t(`reports.scenarios.${selectedScenario}`)}". ${t('reports.prompt_include')}`;

      const responseText = await sendMessage([{ role: 'user', text: prompt }], i18n.language);

      setAnalysisResult(responseText);

      const newRecord: ReportRecord = {
        id: `REP-${Math.floor(Math.random() * 10000)}`,
        scenario: t(`reports.scenarios.${selectedScenario}`),
        scenarioKey: selectedScenario,
        date: new Date().toLocaleString(i18n.language === 'es' ? 'es-CL' : 'en-US'),
        risk: mockRisk,
        delay: mockDelay,
        content: responseText
      };
      setReportHistory(prev => [newRecord, ...prev]);

    } catch (error) {
      console.error("Error al generar análisis:", error);
      setAnalysisResult(t('reports.export_error'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exportToPDF = (report?: ReportRecord) => {
    const doc = new jsPDF();
    const scenario = report ? report.scenario : t(`reports.scenarios.${selectedScenario}`);
    const date = report ? report.date : new Date().toLocaleString(i18n.language === 'es' ? 'es-CL' : 'en-US');
    const risk = report ? report.risk : currentRisk;
    const delay = report ? report.delay : currentDelay;
    const content = report ? report.content : (analysisResult || "");

    doc.setFontSize(20);
    doc.setTextColor(19, 91, 236);
    doc.text(t('reports.export_pdf_title'), 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(t('reports.export_platform'), 105, 28, { align: 'center' });

    autoTable(doc, {
      startY: 40,
      head: [[t('reports.export_param'), t('reports.export_detail')]],
      body: [
        [t('reports.export_scenario'), scenario],
        [t('reports.export_date'), date],
        [t('reports.export_risk'), `${risk}%`],
        [t('reports.export_delay'), `${delay} ${t('reports.unit_days')}`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [19, 91, 236] },
    });

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(t('reports.export_summary'), 15, (doc as any).lastAutoTable.finalY + 15);

    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    const splitText = doc.splitTextToSize(cleanMarkdown(content), 180);
    doc.text(splitText, 15, (doc as any).lastAutoTable.finalY + 25);

    const fileName = report ? `Report_${report.id}.pdf` : `Report_${selectedScenario.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
  };

  const exportToExcel = (report?: ReportRecord) => {
    const scenario = report ? report.scenario : t(`reports.scenarios.${selectedScenario}`);
    const data = [{
      [t('reports.export_scenario')]: scenario,
      [t('reports.export_date')]: report ? report.date : new Date().toLocaleString(i18n.language === 'es' ? 'es-CL' : 'en-US'),
      [t('reports.export_risk')]: report ? `${report.risk}%` : `${currentRisk}%`,
      [t('reports.export_delay')]: report ? `${report.delay} ${t('reports.unit_days')}` : `${currentDelay} ${t('reports.unit_days')}`,
      "IA Analysis": report ? report.content : (analysisResult || "")
    }];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Analysis");
    const fileName = report ? `Report_${report.id}.xlsx` : `Report_${selectedScenario.replace(/\s+/g, '_')}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const loadFromHistory = (report: ReportRecord) => {
    setAnalysisResult(report.content);
    setSelectedScenario(report.scenarioKey);
    setCurrentRisk(report.risk);
    setCurrentDelay(report.delay);
  };

  const scenarios = [
    'Cierre de Faena Proyectado',
    'Expansión Lixiviación 2025',
    'Cambio de Matriz Hídrica',
    'Plan de Desalinización Fase III'
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background-dark p-4 md:p-8 w-full">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">{t('reports.title')}</h2>
          <p className="text-text-secondary text-sm">{t('reports.subtitle')}</p>
        </header>

        <div className="grid grid-cols-12 gap-6 md:gap-8">
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-card-dark border border-border-dark rounded-2xl p-6 shadow-xl">
              <h3 className="font-bold text-lg text-white mb-6 uppercase tracking-widest">{t('reports.config_title')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-text-secondary uppercase mb-2">{t('reports.label_scenario')}</label>
                  <select
                    value={selectedScenario}
                    onChange={(e) => setSelectedScenario(e.target.value)}
                    className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-white text-sm focus:border-primary outline-none"
                  >
                    {scenarios.map(s => (
                      <option key={s} value={s}>{t(`reports.scenarios.${s}`)}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleGenerateAIAnalysis}
                  disabled={isAnalyzing}
                  className="w-full mt-6 bg-primary hover:bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all uppercase tracking-[0.1em] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      {t('common.processing')}
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-xl">auto_awesome</span>
                      {t('reports.btn_generate')}
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-card-dark border border-border-dark rounded-2xl p-6 shadow-xl overflow-hidden flex flex-col h-[300px] md:h-[400px]">
              <h3 className="font-bold text-lg text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">history</span>
                {t('reports.history_title')}
              </h3>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {reportHistory.length > 0 ? reportHistory.map((report) => (
                  <div
                    key={report.id}
                    className="p-3 bg-background-dark/50 border border-border-dark rounded-xl hover:border-primary/50 transition-all cursor-pointer group"
                    onClick={() => loadFromHistory(report)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-white text-xs font-bold truncate flex-1 pr-2">{report.scenario}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); exportToExcel(report); }}
                          className="text-text-secondary hover:text-green-500 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">table_view</span>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); exportToPDF(report); }}
                          className="text-text-secondary hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-text-secondary font-medium">{report.date}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[9px] px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded border border-red-500/10">{t('reports.kpi_risk').split(' ')[0][0]}: {report.risk}%</span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-orange-500/10 text-orange-400 rounded border border-orange-500/10">{t('reports.kpi_delay').split(' ')[0][0]}: {report.delay}d</span>
                    </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <span className="material-symbols-outlined text-4xl mb-2">folder_open</span>
                    <p className="text-xs uppercase font-bold tracking-widest text-text-secondary">{t('reports.history_empty')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: t('reports.kpi_risk'), val: isAnalyzing ? "--" : currentRisk, color: "text-red-400" },
                { label: t('reports.kpi_delay'), val: isAnalyzing ? "--" : currentDelay, unit: t('reports.unit_days'), color: "text-orange-400" },
                { label: t('reports.kpi_alerts'), val: isAnalyzing ? "--" : "03", color: "text-white" }
              ].map((stat, i) => (
                <div key={i} className="bg-card-dark p-6 rounded-2xl border border-border-dark text-center shadow-lg">
                  <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                  <p className={`text-3xl md:text-4xl font-black ${stat.color}`}>{stat.val}{stat.unit && <span className="text-sm font-normal ml-1">{stat.unit}</span>}</p>
                </div>
              ))}
            </div>

            <div className="bg-card-dark rounded-2xl border border-border-dark p-6 md:p-8 min-h-[400px] flex flex-col shadow-2xl overflow-hidden relative">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl text-primary">analytics</span>
                  </div>
                  <h4 className="text-white font-bold text-lg uppercase tracking-widest">
                    {analysisResult ? t('reports.card_title_result') : t('reports.card_title_default')}
                  </h4>
                </div>

                {analysisResult && !isAnalyzing && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => exportToExcel()}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">table_view</span>
                      Excel
                    </button>
                    <button
                      onClick={() => exportToPDF()}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                      PDF
                    </button>
                  </div>
                )}
              </div>

              {isAnalyzing ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="flex gap-2">
                    <div className="size-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="size-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="size-3 bg-primary rounded-full animate-bounce"></div>
                  </div>
                  <p className="text-text-secondary text-sm animate-pulse font-medium">{t('reports.ai_loading')}</p>
                </div>
              ) : analysisResult ? (
                <div className="flex-1 overflow-y-auto">
                  <div className="bg-background-dark/50 border border-border-dark p-6 rounded-xl">
                    <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap font-medium italic">
                      {analysisResult}
                    </p>
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span className="text-[10px] text-text-secondary font-bold uppercase">{t('reports.ai_footer')}</span>
                    <button
                      onClick={() => setAnalysisResult(null)}
                      className="text-xs text-primary font-bold hover:underline"
                    >
                      {t('reports.btn_new')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="size-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-border-dark">
                    <span className="material-symbols-outlined text-3xl text-slate-500">model_training</span>
                  </div>
                  <p className="text-text-secondary max-w-sm text-sm">
                    {t('reports.label_scenario')}: <span className="text-white font-bold">{t('reports.btn_generate')}</span>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;