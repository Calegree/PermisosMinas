import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const SocialDetail: React.FC = () => {
    const { id } = useParams();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Simulated data based on Social.tsx new fields
    const mockData = {
        id: id || "SOC-001",
        community: "Comunidad Colla",
        type: "Infraestructura",
        status: "En Riesgo",
        date: "2024-10-15",
        description: "Construcción de sede social multipropósito con paneles solares",
        responsible: "Dirección de Relaciones Comunitarias"
    };

    const getStatusColor = (status: string) => {
        if (status === 'Al Día') return 'emerald';
        if (status === 'En Riesgo') return 'red';
        return 'slate';
    };

    const statusColor = getStatusColor(mockData.status);

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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0f172a]/80 backdrop-blur-sm">
                    <div className="bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-[#334155] flex justify-between items-center bg-[#0f172a]/50">
                            <h3 className="text-white font-black uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">edit</span>
                                Editar Compromiso
                            </h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-[#64748b] hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">Comunidad</label>
                                    <input type="text" className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-primary" defaultValue={mockData.community} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">Estado</label>
                                    <select className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-primary" defaultValue={mockData.status}>
                                        <option>Al Día</option>
                                        <option>Pendiente</option>
                                        <option>En Riesgo</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">Vencimiento</label>
                                    <input type="date" className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-primary" defaultValue={mockData.date} />
                                </div>
                            </div>
                            <div className="pt-6 border-t border-[#334155] flex justify-end gap-4">
                                <button onClick={() => setIsEditModalOpen(false)} className="px-6 py-2.5 rounded-lg border border-[#334155] text-[#94a3b8] text-[11px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">Cancelar</button>
                                <button onClick={() => setIsEditModalOpen(false)} className="px-8 py-2.5 rounded-lg bg-primary text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-primary-hover transition-all">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SocialDetail;
