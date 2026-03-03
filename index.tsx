import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import i18n from './src/i18n/config';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <React.Suspense fallback={<div className="h-screen w-full bg-background-dark flex items-center justify-center text-white font-bold uppercase tracking-widest">{i18n.t('common.loading')}</div>}>
      <App />
    </React.Suspense>
  </React.StrictMode>
);
