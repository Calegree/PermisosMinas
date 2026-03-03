import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AIChatBot from './components/AIChatBot';
import LanguageSelector from './components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import Dashboard from './screens/Dashboard';
import Commitments from './screens/Commitments';
import CommitmentDetail from './screens/CommitmentDetail';
import Permissions from './screens/Permissions';
import Sustainability from './screens/Sustainability';
import Social from './screens/Social';
import Calendar from './screens/Calendar';
import Reports from './screens/Reports';
import PredictiveAnalysis from './screens/PredictiveAnalysis';
import Login from './screens/Login';
import PermissionDetail from './screens/PermissionDetail';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t } = useTranslation();

  // Renderiza la pantalla de login si el usuario no ha iniciado sesión
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <HashRouter>
      <div className="flex flex-col lg:flex-row h-screen w-full bg-background-light dark:bg-background-dark overflow-hidden relative">
        {/* Botón Hamburguesa para Móvil */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-border-dark z-30">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary/20 text-primary">
              <span className="material-symbols-outlined text-[20px]">diamond</span>
            </div>
            <h1 className="text-sm font-bold dark:text-white">{t('common.app_name')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-600 dark:text-white"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>

        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/compromisos" element={<Commitments />} />
            <Route path="/compromisos/:id" element={<CommitmentDetail />} />
            <Route path="/permisos" element={<Permissions />} />
            <Route path="/permisos/:id" element={<PermissionDetail />} />
            <Route path="/sostenibilidad" element={<Sustainability />} />
            <Route path="/social" element={<Social />} />
            <Route path="/calendario" element={<Calendar />} />
            <Route path="/reportes" element={<Reports />} />
            <Route path="/analisis-predictivo" element={<PredictiveAnalysis />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <AIChatBot />
      </div>
    </HashRouter>
  );
};

export default App;