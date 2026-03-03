import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const activePage = location.pathname;

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  const navItems = [
    { id: 'dashboard', label: t('sidebar.dashboard'), icon: 'dashboard', path: '/' },
    { id: 'permissions', label: t('sidebar.permissions'), icon: 'description', path: '/permisos' },
    { id: 'commitments', label: t('sidebar.commitments'), icon: 'check_circle', path: '/compromisos' },
    { id: 'compliance', label: t('sidebar.sustainability'), icon: 'fact_check', path: '/sostenibilidad' },
    { id: 'social', label: t('sidebar.social'), icon: 'groups', path: '/social' },
    { id: 'calendar', label: t('sidebar.calendar'), icon: 'calendar_month', path: '/calendario' },
    { id: 'reports', label: t('sidebar.reports'), icon: 'analytics', path: '/reportes' },
    { id: 'predictive', label: t('sidebar.predictive_analysis'), icon: 'online_prediction', path: '/analisis-predictivo' },
  ];

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 w-72 flex-shrink-0 flex flex-col border-r border-slate-200 dark:border-border-dark bg-white dark:bg-background-dark h-full z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 pb-2">
          <div className="flex items-center justify-between lg:justify-start gap-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center size-10 rounded-lg bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-[24px]">diamond</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-base font-bold leading-none dark:text-white">{t('common.app_name')}</h1>
                <p className="text-slate-500 dark:text-text-secondary text-xs font-normal mt-1">{t('common.mining_management')}</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden text-slate-500">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activePage === item.path || (item.path !== '/' && activePage.startsWith(item.path));
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive
                    ? 'bg-primary text-white shadow-lg shadow-blue-900/50'
                    : 'text-slate-600 dark:text-text-secondary hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                >
                  <span className={`material-symbols-outlined text-[22px] ${!isActive && 'group-hover:text-primary transition-colors'}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-200 dark:border-border-dark space-y-4">
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-border-dark hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-slate-500">language</span>
              <span className="text-xs font-medium dark:text-white">{t('sidebar.language')}</span>
            </div>
            <span className="text-[10px] font-bold uppercase bg-primary/10 text-primary px-1.5 py-0.5 rounded">
              {i18n.language.toUpperCase()}
            </span>
          </button>

          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-cover bg-center shrink-0" style={{ backgroundImage: 'url("https://picsum.photos/seed/user/100/100")' }}></div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-sm font-medium truncate dark:text-white">Roberto Díaz</p>
              <p className="text-xs text-slate-500 dark:text-text-secondary truncate">Director de Medio Ambiente</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;