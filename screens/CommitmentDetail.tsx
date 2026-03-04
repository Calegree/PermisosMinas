
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const CommitmentDetail: React.FC = () => {
  const { id } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <div className="p-8 lg:px-12 flex flex-col gap-8 max-w-7xl mx-auto w-full">
        <nav className="flex items-center gap-2 text-sm text-text-secondary">
          <Link to="/compromisos" className="hover:text-primary transition-colors">Compromisos</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-white font-medium">Detalle {id || 'C-204'}</span>
        </nav>

        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] font-bold uppercase tracking-wider border border-yellow-500/20">En Curso</span>
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">Ambiental</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
              {id === 'C-204' ? 'C-204: Control de Emisiones de Material Particulado' : `Compromiso ${id}`}
            </h1>
            <p className="text-text-secondary text-lg">RCA 254 - Proyecto Expansión Fase II</p>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white hover:bg-blue-600 transition-all font-bold text-sm shadow-lg shadow-blue-500/20"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            Editar Compromiso
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "calendar_today", label: "Fecha Inicio", val: "01 Ene 2024", color: "green" },
            { icon: "event_busy", label: "Fecha Límite", val: "15 Oct 2024", color: "red" },
            { icon: "hourglass_top", label: "Días Restantes", val: "24 días", color: "orange" },
            { icon: "shield", label: "Nivel de Riesgo", val: "Alto", color: "purple" }
          ].map((s, i) => (
            <div key={i} className="bg-surface-dark p-5 rounded-xl border border-border-dark">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-${s.color}-500/10 text-${s.color}-400`}>
                  <span className="material-symbols-outlined">{s.icon}</span>
                </div>
                <span className="text-xs font-medium text-text-secondary uppercase">{s.label}</span>
              </div>
              <p className={`text-2xl font-bold ${s.color === 'orange' ? 'text-orange-400' : 'text-white'}`}>{s.val}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden">
              <div className="px-6 py-4 bg-surface-dark-lighter border-b border-border-dark">
                <h3 className="font-bold text-lg text-white">Descripción del Compromiso</h3>
              </div>
              <div className="p-6">
                <div className="bg-background-dark p-5 rounded-lg border border-border-dark">
                  <p className="text-slate-300 leading-relaxed italic">
                    "La empresa deberá implementar medidas de humectación de caminos con una frecuencia mínima de 3 veces al día durante la fase de construcción, aumentando a 5 veces al día en periodos secos (Octubre-Marzo), para asegurar que las emisiones de material particulado no superen los límites establecidos en la normativa vigente."
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden">
              <div className="px-6 py-4 bg-surface-dark-lighter border-b border-border-dark">
                <h3 className="font-bold text-lg text-white">Evidencia Requerida</h3>
              </div>
              <div className="p-6">
                <div className="border-2 border-dashed border-border-dark rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-all cursor-pointer group">
                  <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                  </div>
                  <p className="text-sm font-bold text-white mb-1">Subir Verificador</p>
                  <p className="text-xs text-text-secondary">PDF, JPG o PNG hasta 20MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm">
          <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-border-dark flex justify-between items-center bg-surface-dark-lighter">
              <h3 className="text-white font-black uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit</span>
                Editar Compromiso
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-text-secondary hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Fecha Límite</label>
                  <input type="date" className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Estado Actual</label>
                  <select className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-primary">
                    <option>En Curso</option>
                    <option>Validado</option>
                    <option>Pendiente</option>
                    <option>Atrasado</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Nivel de Riesgo</label>
                  <select className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-primary">
                    <option>Alto</option>
                    <option>Medio</option>
                    <option>Bajo</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Descripción</label>
                  <textarea className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-primary min-h-[100px]" defaultValue={`"La empresa deberá implementar medidas de humectación..."`} />
                </div>
              </div>
              <div className="pt-6 border-t border-border-dark flex justify-end gap-4">
                <button onClick={() => setIsEditModalOpen(false)} className="px-6 py-2.5 rounded-lg border border-border-dark text-text-secondary text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all">Cancelar</button>
                <button onClick={() => setIsEditModalOpen(false)} className="px-8 py-2.5 rounded-lg bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitmentDetail;
