import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { uploadSocialDocument } from '../services/apiAgent';

interface SocialCommitment {
  community: string;
  type: string;
  status: string;
  date: string;
  description?: string;
  responsible?: string;
}

const Social: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [socialCommitments, setSocialCommitments] = useState<SocialCommitment[]>(() => [
    { community: 'Comunidad Colla', type: 'Infraestructura', status: t('social.status_risk'), date: `Oct 2024` },
    { community: 'Consejo Diaguita', type: 'Becas', status: t('social.status_ontime'), date: `Nov 2024` },
    { community: 'Asoc. Regantes', type: 'Agua', status: t('social.status_ontime'), date: `Dic 2024` },
    { community: 'Sindicato Pirquineros', type: 'Capacitación', status: t('social.status_pending'), date: `Ene 2025` },
    { community: 'Cooperativa Agrícola', type: 'Equipamiento', status: t('social.status_ontime'), date: `Feb 2025` },
    { community: 'Club Adulto Mayor', type: 'Sedes', status: t('social.status_risk'), date: `Nov 2024` },
    { community: 'Junta de Vecinos El Boldo', type: 'Iluminación', status: t('social.status_pending'), date: `Dic 2024` },
    { community: 'Agrupación Mujeres Emprendedoras', type: 'Fondo Concursable', status: t('social.status_ontime'), date: `Mar 2025` },
    { community: 'Pueblos Originarios Atacameños', type: 'Patrimonio', status: t('social.status_ontime'), date: `Jun 2025` },
    { community: 'Sindicato de Pescadores', type: 'Desalinización', status: t('social.status_risk'), date: `Sep 2024` },
    { community: 'Cuerpo de Bomberos', type: 'Donación', status: t('social.status_ontime'), date: `Oct 2024` },
    { community: 'Escuela Rural G-45', type: 'Conectividad', status: t('social.status_pending'), date: `Nov 2024` },
  ]);

  const stats = [
    { label: t('social.kpi_active'), val: 312 },
    { label: t('social.kpi_risk'), val: 24 },
    { label: t('social.kpi_investment'), val: "$1.2M" },
    { label: t('social.kpi_alerts'), val: 2 }
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSocial, setNewSocial] = useState({
    community: '',
    type: 'Infraestructura',
    date: '',
    status: t('social.status_pending'),
    description: '',
    responsible: ''
  });

  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [inferredFields, setInferredFields] = useState<Record<string, boolean>>({});

  const handleAutoFill = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoadingAI(true);
    setInferredFields({});

    try {
      const data = await uploadSocialDocument(file);

      const newFormValues = { ...newSocial };
      const newInferred: Record<string, boolean> = {};

      const mapField = (apiField: string, stateField: keyof typeof newSocial) => {
        if (data[apiField]) {
          (newFormValues[stateField] as any) = data[apiField].value;
          newInferred[stateField] = data[apiField].is_inferred;
        }
      };

      mapField('compromiso', 'description');
      mapField('estado_sugerido', 'status');
      mapField('fecha_limite', 'date');
      mapField('responsables', 'responsible');

      setNewSocial(newFormValues);
      setInferredFields(newInferred);

    } catch (error) {
      alert("Error al procesar el documento con IA.");
    } finally {
      setIsLoadingAI(false);
      event.target.value = '';
    }
  };

  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocial.community) return;

    setSocialCommitments(prev => [newSocial, ...prev]);
    setIsModalOpen(false);
    setNewSocial({
      community: '',
      type: 'Infraestructura',
      date: '',
      status: t('social.status_pending'),
      description: '',
      responsible: ''
    });
    setInferredFields({});
  };

  const getInputClass = (fieldName: string) => {
    const baseClass = "w-full bg-surface-dark border rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-all ";
    if (inferredFields[fieldName]) {
      return baseClass + "border-amber-400 focus:ring-primary shadow-[0_0_8px_rgba(251,191,36,0.3)] text-amber-50";
    }
    return baseClass + "border-border-dark focus:border-primary";
  };

  const AIHint = ({ field }: { field: string }) => {
    if (!inferredFields[field]) return null;
    return <span className="text-amber-500 text-[10px] font-bold mt-1 flex items-center gap-1">✨ Sugerencia de la IA</span>;
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background-dark p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">{t('social.title')}</h1>
            <p className="text-text-secondary mt-1">{t('social.subtitle')}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 h-10 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>{i18n.language === 'en' ? 'New Commitment' : 'Nuevo Compromiso'}</span>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-surface-dark border border-border-dark p-5 rounded-xl shadow-sm">
              <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-white text-2xl font-black">{stat.val}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-border-dark bg-surface-dark-lighter flex justify-between items-center">
            <h3 className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">list_alt</span>
              {t('social.table_title')}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-background-dark/50 border-b border-border-dark text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                  <th className="p-4">{t('social.table_community')}</th>
                  <th className="p-4">{t('social.table_type')}</th>
                  <th className="p-4">Compromiso</th>
                  <th className="p-4">Responsables</th>
                  <th className="p-4">{t('social.table_deadline')}</th>
                  <th className="p-4">{t('social.table_status')}</th>
                  <th className="p-4 text-right">Ficha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark">
                {socialCommitments.map((sc, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => navigate(`/social/SOC-${String(i + 1).padStart(3, '0')}`)}>
                    <td className="p-4 font-bold max-w-[150px] truncate">{sc.community}</td>
                    <td className="p-4 text-slate-300 max-w-[120px] truncate">{sc.type}</td>
                    <td className="p-4 text-slate-300 max-w-[300px] truncate" title={sc.description}>{sc.description || '-'}</td>
                    <td className="p-4 text-slate-300 max-w-[200px] truncate" title={sc.responsible}>{sc.responsible || '-'}</td>
                    <td className="p-4 text-slate-300 whitespace-nowrap">{sc.date}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${sc.status === t('social.status_ontime') ? 'bg-green-500/10 text-emerald-400 border-green-500/20' :
                        sc.status === t('social.status_risk') ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                        {sc.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">arrow_forward_ios</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm">
          <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-border-dark flex justify-between items-center bg-surface-dark-lighter">
              <h3 className="text-white font-black uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_circle</span>
                {i18n.language === 'en' ? 'New Social Commitment' : 'Nuevo Compromiso Social'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-text-secondary hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-8 pb-4">
              <div className="flex items-center gap-4 bg-primary/10 p-4 rounded-xl border border-primary/20">
                <div className="flex-1">
                  <h4 className="text-white text-sm font-bold flex items-center gap-2">
                    <span className="text-amber-400">✨</span> Asistente IA
                  </h4>
                  <p className="text-[#94a3b8] text-xs mt-1">Sube un Acta, Minuta o Convenio para extraer los datos automáticamente.</p>
                </div>
                <div>
                  <input
                    type="file" id="ai-upload-social" className="hidden" accept=".pdf,.doc,.docx"
                    onChange={handleAutoFill} disabled={isLoadingAI}
                  />
                  <label
                    htmlFor="ai-upload-social"
                    className={`cursor-pointer px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 border ${isLoadingAI ? 'bg-background-dark text-slate-400 border-border-dark' : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/30 shadow-lg shadow-amber-500/10'} `}
                  >
                    {isLoadingAI ? (
                      <><span className="material-symbols-outlined animate-spin text-sm">sync</span>Analizando...</>
                    ) : (
                      <><span className="material-symbols-outlined text-sm">auto_awesome</span>Auto-completar</>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveSocial} className="p-8 pt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-2 relative md:col-span-2">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['community'] ? "text-amber-500" : "text-text-secondary")}>{t('social.table_community')}</label>
                  <input
                    type="text" required value={newSocial.community}
                    onChange={e => setNewSocial({ ...newSocial, community: e.target.value })}
                    placeholder={i18n.language === 'en' ? "Community Name" : "Nombre de la Comunidad"}
                    className={getInputClass('community')}
                  />
                  <AIHint field="community" />
                </div>

                <div className="space-y-2 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['type'] ? "text-amber-500" : "text-text-secondary")}>{t('social.table_type')}</label>
                  <input
                    type="text" value={newSocial.type}
                    onChange={e => setNewSocial({ ...newSocial, type: e.target.value })}
                    placeholder="Ej: Infraestructura, Becas..."
                    className={getInputClass('type')}
                  />
                  <AIHint field="type" />
                </div>

                <div className="space-y-2 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['date'] ? "text-amber-500" : "text-text-secondary")}>{t('social.table_deadline')}</label>
                  <input
                    type="date" value={newSocial.date}
                    onChange={e => setNewSocial({ ...newSocial, date: e.target.value })}
                    className={getInputClass('date')}
                  />
                  <AIHint field="date" />
                </div>

                <div className="space-y-2 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['status'] ? "text-amber-500" : "text-text-secondary")}>{t('social.table_status')}</label>
                  <select
                    value={newSocial.status}
                    onChange={e => setNewSocial({ ...newSocial, status: e.target.value })}
                    className={getInputClass('status')}
                  >
                    {[t('social.status_ontime'), t('social.status_pending'), t('social.status_risk')].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <AIHint field="status" />
                </div>

                <div className="space-y-2 relative md:col-span-2">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['description'] ? "text-amber-500" : "text-text-secondary")}>Compromiso</label>
                  <textarea
                    required value={newSocial.description}
                    onChange={e => setNewSocial({ ...newSocial, description: e.target.value })}
                    placeholder="Detalle del compromiso social..."
                    className={getInputClass('description') + " min-h-[100px]"}
                  />
                  <AIHint field="description" />
                </div>

                <div className="space-y-2 relative md:col-span-2">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['responsible'] ? "text-amber-500" : "text-text-secondary")}>Responsables</label>
                  <input
                    type="text" value={newSocial.responsible}
                    onChange={e => setNewSocial({ ...newSocial, responsible: e.target.value })}
                    placeholder="Ej: SCM El Abra, CONADI..."
                    className={getInputClass('responsible')}
                  />
                  <AIHint field="responsible" />
                </div>

              </div>
              <div className="pt-8 border-t border-border-dark flex justify-end gap-4">
                <button
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg border border-border-dark text-text-secondary text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-lg bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-primary-hover transition-all"
                >
                  {i18n.language === 'en' ? 'Save' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Social;
