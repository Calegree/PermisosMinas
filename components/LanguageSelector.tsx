import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
    const { i18n, t } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
            <button
                onClick={() => changeLanguage('es')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${i18n.language.startsWith('es')
                        ? 'bg-primary text-white shadow-md shadow-blue-900/40'
                        : 'text-slate-500 dark:text-text-secondary hover:bg-slate-200 dark:hover:bg-white/10'
                    }`}
            >
                ES
            </button>
            <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${i18n.language.startsWith('en')
                        ? 'bg-primary text-white shadow-md shadow-blue-900/40'
                        : 'text-slate-500 dark:text-text-secondary hover:bg-slate-200 dark:hover:bg-white/10'
                    }`}
            >
                EN
            </button>
        </div>
    );
};

export default LanguageSelector;
