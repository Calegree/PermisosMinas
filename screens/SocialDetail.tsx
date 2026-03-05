import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { uploadSocialDocument } from '../services/apiAgent';

const SocialDetail: React.FC = () => {
    const { id } = useParams();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const [inferredFields, setInferredFields] = useState<Record<string, boolean>>({});

    // Simulated data based on Social.tsx new fields
    const [mockData, setMockData] = useState({
        id: id || "SOC-001",
        community: "Comunidad Colla",
        type: "Infraestructura",
        status: "En Riesgo",
        date: "2024-10-15",
        description: "Construcción de sede social multipropósito con paneles solares",
        responsible: "Dirección de Relaciones Comunitarias"
    });

    const getStatusColor = (status: string) => {
        if (status === 'Al Día') return 'emerald';
        if (status === 'En Riesgo') return 'red';
        return 'slate';
    };

    const statusColor = getStatusColor(mockData.status);

    const handleAutoFill = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoadingAI(true);
        setInferredFields({});

        try {
            const data = await uploadSocialDocument(file);

            const newFormValues = { ...mockData };
            const newInferred: Record<string, boolean> = {};

            const mapField = (apiField: string, stateField: keyof typeof mockData) => {
                if (data[apiField]) {
                    (newFormValues[stateField] as any) = data[apiField].value;
                    newInferred[stateField] = data[apiField].is_inferred;
                }
            };

            mapField('compromiso', 'description');
            mapField('estado_sugerido', 'status');
            mapField('fecha_limite', 'date');
            mapField('responsables', 'responsible');

            setMockData(newFormValues);
            setInferredFields(newInferred);

        } catch (error) {
            alert("Error al procesar el documento con IA.");
        } finally {
            setIsLoadingAI(false);
            event.target.value = '';
        }
    };

    const getInputClass = (fieldName: string) => {
        const baseClass = "w-full bg-background-dark border rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-all ";
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
        <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#0f172a]">
            <div className="p-8 lg:px-12 flex flex-col gap-8 max-w-7xl mx-auto w-full">
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#64748b]">
                    <Link to="/social" className="hover:text-primary transition-colors">Social</Link>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="text-white">Detalle {mockData.id}</span>
                </nav>

                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-1.5 rounded-full bg-${statusColor}-500/10 text-${statusColor}-500 text-[10px] font-black uppercase tracking-widest border border-${statusColor}-500/30`}>
                                {mockData.status}
                            </span>
                            <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/30">
                                {mockData.type}
                            </span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight uppercase">
                            {mockData.id}: {mockData.community}
                        </h1>
                    </div>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-hover transition-all font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-500/20"
                    >
                        <span className="material-symbols-outlined text-lg font-black">edit</span>
                        Editar Compromiso
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { icon: "groups", label: "Comunidad", val: mockData.community, color: "blue" },
                        { icon: "event", label: "Fecha Límite", val: mockData.date, color: mockData.status === 'En Riesgo' ? "red" : "emerald" },
                        { icon: "assignment", label: "Tipo", val: mockData.type, color: "purple" }
                    ].map((s, i) => (
                        <div key={i} className="bg-[#1e293b] p-6 rounded-xl border border-[#334155] shadow-sm hover:border-primary/30 transition-all">
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-lg bg-${s.color}-500/10 text-${s.color}-500`}>
                                    <span className="material-symbols-outlined text-lg font-black">{s.icon}</span>
                                </div>
                                <span className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">{s.label}</span>
                            </div>
                            <p className="text-xl font-black text-white truncate" title={s.val}>{s.val}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden shadow-lg">
                            <div className="px-6 py-4 bg-[#0f172a]/50 border-b border-[#334155]">
                                <h3 className="font-black text-[11px] text-white uppercase tracking-widest">Información General</h3>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-[#64748b] uppercase tracking-widest">Responsables</p>
                                        <p className="text-white font-bold">{mockData.responsible}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-[#64748b] uppercase tracking-widest">Estado Actual</p>
                                        <p className={`text-${statusColor}-500 font-bold`}>{mockData.status}</p>
                                    </div>
                                </div>
                                <div className="bg-[#0f172a] p-6 rounded-lg border border-[#334155]">
                                    <h4 className="text-[9px] font-black text-[#64748b] uppercase tracking-widest mb-2">Compromiso Adquirido</h4>
                                    <p className="text-[#94a3b8] leading-relaxed italic text-sm">
                                        {mockData.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm">
                    <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-border-dark flex justify-between items-center bg-surface-dark-lighter">
                            <h3 className="text-white font-black uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">edit</span>
                                Editar Compromiso Social
                            </h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-text-secondary hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-8 pb-4">
                            <div className="flex items-center gap-4 bg-primary/10 p-4 rounded-xl border border-primary/20">
                                <div className="flex-1">
                                    <h4 className="text-white text-sm font-bold flex items-center gap-2">
                                        <span className="text-amber-400">✨</span> Asistente IA
                                    </h4>
                                    <p className="text-[#94a3b8] text-xs mt-1">Sube un Acta, Minuta o Convenio para actualizar este formulario.</p>
                                </div>
                                <div>
                                    <input
                                        type="file" id="ai-upload-social-edit" className="hidden" accept=".pdf,.doc,.docx"
                                        onChange={handleAutoFill} disabled={isLoadingAI}
                                    />
                                    <label
                                        htmlFor="ai-upload-social-edit"
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

                        <form className="p-8 pt-4 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 relative md:col-span-2">
                                    <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['community'] ? "text-amber-500" : "text-text-secondary")}>Comunidad</label>
                                    <input type="text" className={getInputClass('community')}
                                        value={mockData.community}
                                        onChange={e => setMockData({ ...mockData, community: e.target.value })}
                                        required />
                                    <AIHint field="community" />
                                </div>

                                <div className="space-y-2 relative">
                                    <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['type'] ? "text-amber-500" : "text-text-secondary")}>Tipo</label>
                                    <input type="text" className={getInputClass('type')}
                                        value={mockData.type}
                                        onChange={e => setMockData({ ...mockData, type: e.target.value })} />
                                    <AIHint field="type" />
                                </div>

                                <div className="space-y-2 relative">
                                    <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['date'] ? "text-amber-500" : "text-text-secondary")}>Vencimiento</label>
                                    <input type="date" className={getInputClass('date')}
                                        value={mockData.date}
                                        onChange={e => setMockData({ ...mockData, date: e.target.value })} />
                                    <AIHint field="date" />
                                </div>

                                <div className="space-y-2 relative">
                                    <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['status'] ? "text-amber-500" : "text-text-secondary")}>Estado</label>
                                    <select className={getInputClass('status')}
                                        value={mockData.status}
                                        onChange={e => setMockData({ ...mockData, status: e.target.value })}>
                                        {['Al Día', 'Pendiente', 'En Riesgo'].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <AIHint field="status" />
                                </div>

                                <div className="space-y-2 relative md:col-span-2">
                                    <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['description'] ? "text-amber-500" : "text-text-secondary")}>Compromiso Adquirido</label>
                                    <textarea className={getInputClass('description') + " min-h-[100px]"}
                                        value={mockData.description}
                                        onChange={e => setMockData({ ...mockData, description: e.target.value })}
                                        required />
                                    <AIHint field="description" />
                                </div>

                                <div className="space-y-2 relative md:col-span-2">
                                    <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['responsible'] ? "text-amber-500" : "text-text-secondary")}>Responsables</label>
                                    <input type="text" className={getInputClass('responsible')}
                                        value={mockData.responsible}
                                        onChange={e => setMockData({ ...mockData, responsible: e.target.value })} />
                                    <AIHint field="responsible" />
                                </div>
                            </div>
                            <div className="pt-8 border-t border-border-dark flex justify-end gap-4">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-2.5 rounded-lg border border-border-dark text-text-secondary text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all">Cancelar</button>
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-8 py-2.5 rounded-lg bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-primary-hover transition-all">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SocialDetail;
