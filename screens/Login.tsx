import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('usuario@empresa.com');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="flex h-screen w-full font-sans bg-white overflow-hidden">
      {/* Panel Izquierdo: Branding Corporativo */}
      <div className="hidden lg:flex lg:w-[56%] bg-[#0052cc] relative overflow-hidden flex-col p-16 justify-between text-white">
        {/* Efectos de fondo con círculos abstractos */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full border border-white/10"></div>
        <div className="absolute bottom-[-15%] left-[5%] w-[400px] h-[400px] bg-white/5 rounded-full"></div>

        {/* Logo superior */}
        <div className="z-10 flex items-center">
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight leading-none">ValueStrategy</span>
            <span className="text-[10px] font-bold tracking-[0.2em] opacity-80 uppercase mt-1">Consulting</span>
          </div>
          <div className="h-10 w-[1.5px] bg-white/30 mx-6"></div>
          <span className="text-3xl font-black italic tracking-tighter">vsc</span>
        </div>

        {/* Textos centrales */}
        <div className="z-10 flex flex-col mb-20">
          <h1 className="text-[80px] font-black uppercase tracking-tight leading-[0.85]" dangerouslySetInnerHTML={{ __html: t('login.title_panel') }}>
          </h1>
          <div className="w-16 h-[1px] bg-white/50 mt-8 mb-8"></div>
          <p className="text-2xl font-light tracking-wide opacity-90 leading-relaxed">
            {t('login.subtitle_panel')}
          </p>
        </div>

        {/* Footer */}
        <div className="z-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] opacity-40">
            ValueStrategy Consulting © 2025
          </p>
        </div>
      </div>

      {/* Panel Derecho: Formulario de Login */}
      <div className="flex-1 bg-white flex items-center justify-center p-8 md:p-16 relative">
        <div className="absolute top-8 right-8">
          <LanguageSelector />
        </div>
        <div className="w-full max-w-md flex flex-col">
          <h2 className="text-[44px] font-black text-[#1a1a1a] mb-12 tracking-tight">{t('login.title_form')}</h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">{t('login.label_user')}</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f8faff] border-none rounded-2xl px-8 py-5 text-sm text-slate-600 focus:ring-2 focus:ring-blue-500/20 outline-none placeholder:text-slate-300 transition-all"
                  placeholder="usuario@empresa.com"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">{t('login.label_password')}</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#f8faff] border-none rounded-2xl px-8 py-5 text-sm text-slate-600 focus:ring-2 focus:ring-blue-500/20 outline-none placeholder:text-slate-300 transition-all"
                  placeholder="........"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0052cc] hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-4 text-base"
            >
              {t('login.btn_login')}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[11px] text-slate-400 font-medium">
              {t('login.support_text')} <a href="#" className="text-[#0052cc] font-bold hover:underline ml-1">{t('login.support_link')}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;