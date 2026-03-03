
import React from 'react';
import { useParams, Link } from 'react-router-dom';

const PermissionDetail: React.FC = () => {
    const { id } = useParams();

    // En una app real, aquí buscaríamos los datos por id. Por ahora simulamos.
    const mockData = {
        id: id || "RCA-001",
        name: "Control de emisiones de polvo",
        ref: "RCA 245/2018",
        status: "PENDIENTE",
        authority: "SEREMI SALUD",
        contractor: "GESTIONA",
        gerencia: "Mina",
        period: "2024",
        responsible: "Juan Pérez",
        initials: "JP",
        deadline: "12 Oct 2024",
        tipo: "Ambiental",
        vigenciaAcotada: true
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APROBADO':
            case 'VALIDADO':
                return 'emerald';
            case 'RECHAZADO':
            case 'NO INICIADO':
            case 'DESISTIDO':
                return 'red';
            case 'EN TRÁMITE':
            case 'EN CURSO':
                return 'blue';
            case 'EN ELABORACIÓN':
                return 'amber';
            default:
                return 'slate';
        }
    };

    const statusColor = getStatusColor(mockData.status);

    return (
        <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#0f172a]">
            <div className="p-8 lg:px-12 flex flex-col gap-8 max-w-7xl mx-auto w-full">
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#64748b]">
                    <Link to="/permisos" className="hover:text-primary transition-colors">Permisos</Link>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="text-white">Ficha {mockData.id}</span>
                </nav>

                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-1.5 rounded-full bg-${statusColor}-500/10 text-${statusColor}-500 text-[10px] font-black uppercase tracking-widest border border-${statusColor}-500/30`}>
                                {mockData.status}
                            </span>
                            <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/30">
                                {mockData.tipo}
                            </span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight uppercase">
                            {mockData.id}: {mockData.name}
                        </h1>
                        <p className="text-[#64748b] text-lg italic">{mockData.ref}</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-hover transition-all font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-500/20">
                        <span className="material-symbols-outlined text-lg font-black">edit</span>
                        Editar Ficha
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { icon: "person", label: "Responsable", val: mockData.responsible, color: "blue" },
                        { icon: "event", label: "Vencimiento", val: mockData.deadline, color: "red" },
                        { icon: "apartment", label: "Autoridad", val: mockData.authority, color: "emerald" },
                        { icon: "shield", label: "Vigencia", val: mockData.vigenciaAcotada ? "Acotada" : "Indefinida", color: "purple" }
                    ].map((s, i) => (
                        <div key={i} className="bg-[#1e293b] p-6 rounded-xl border border-[#334155] shadow-sm hover:border-primary/30 transition-all">
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-lg bg-${s.color}-500/10 text-${s.color}-500`}>
                                    <span className="material-symbols-outlined text-lg font-black">{s.icon}</span>
                                </div>
                                <span className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">{s.label}</span>
                            </div>
                            <p className="text-xl font-black text-white">{s.val}</p>
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
                                        <p className="text-[9px] font-black text-[#64748b] uppercase tracking-widest">Gerencia</p>
                                        <p className="text-white font-bold">{mockData.gerencia}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-[#64748b] uppercase tracking-widest">Período</p>
                                        <p className="text-white font-bold">{mockData.period}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-[#64748b] uppercase tracking-widest">Contratista</p>
                                        <p className="text-white font-bold">{mockData.contractor}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-[#64748b] uppercase tracking-widest">Estado Actual</p>
                                        <p className={`text-${statusColor}-500 font-bold`}>{mockData.status}</p>
                                    </div>
                                </div>
                                <div className="bg-[#0f172a] p-6 rounded-lg border border-[#334155]">
                                    <p className="text-[#94a3b8] leading-relaxed italic text-sm">
                                        Este permiso corresponde a las obligaciones establecidas en la {mockData.ref}.
                                        El responsable {mockData.responsible} debe asegurar el cumplimiento de todas
                                        las medidas descritas antes del {mockData.deadline}.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden shadow-lg">
                            <div className="px-6 py-4 bg-[#0f172a]/50 border-b border-[#334155]">
                                <h3 className="font-black text-[11px] text-white uppercase tracking-widest">Documentación / Evidencia</h3>
                            </div>
                            <div className="p-8">
                                <div className="border-2 border-dashed border-[#334155] rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-all cursor-pointer group">
                                    <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                                    </div>
                                    <p className="text-[11px] font-black text-white mb-1 uppercase tracking-widest">Subir Documento</p>
                                    <p className="text-[9px] text-[#64748b] uppercase font-bold tracking-tight">PDF o Imágenes (Máx 20MB)</p>
                                </div>
                                <div className="mt-8 space-y-3">
                                    <p className="text-[9px] font-black text-[#64748b] uppercase tracking-widest">Archivos Recientes</p>
                                    <div className="flex items-center justify-between p-3 bg-[#0f172a] rounded border border-[#334155]">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-red-500 text-sm">picture_as_pdf</span>
                                            <span className="text-white text-[10px] font-bold">RCA_245_Firmada.pdf</span>
                                        </div>
                                        <span className="material-symbols-outlined text-[#64748b] text-sm">download</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PermissionDetail;
