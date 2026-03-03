import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const Social: React.FC = () => {
  const { t } = useTranslation();

  const socialCommitments = useMemo(() => [
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
  ], [t]);

  const stats = [
    { label: t('social.kpi_active'), val: 312 },
    { label: t('social.kpi_risk'), val: 24 },
    { label: t('social.kpi_investment'), val: "$1.2M" },
    { label: t('social.kpi_alerts'), val: 2 }
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background-dark p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">{t('social.title')}</h1>
          <p className="text-text-secondary mt-1">{t('social.subtitle')}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-surface-dark border border-border-dark p-5 rounded-xl">
              <p className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white">{stat.val}</h3>
            </div>
          ))}
        </div>

        <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-border-dark">
            <h3 className="text-white font-bold text-lg uppercase tracking-tight">{t('social.table_title')}</h3>
          </div>
          <table className="w-full text-left text-sm text-white">
            <thead className="bg-surface-dark-lighter">
              <tr className="text-text-secondary border-b border-border-dark font-bold uppercase text-[10px] tracking-widest">
                <th className="p-4">{t('social.table_community')}</th>
                <th className="p-4">{t('social.table_type')}</th>
                <th className="p-4">{t('social.table_deadline')}</th>
                <th className="p-4">{t('social.table_status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark">
              {socialCommitments.map((sc, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold">{sc.community}</td>
                  <td className="p-4 text-slate-300">{sc.type}</td>
                  <td className="p-4 text-slate-300">{sc.date}</td>
                  <td className="p-4">
                    <span className={`font-bold ${sc.status === t('social.status_risk') ? 'text-red-400' :
                      sc.status === t('social.status_ontime') ? 'text-emerald-400' : 'text-slate-400'
                      }`}>
                      {sc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Social;
