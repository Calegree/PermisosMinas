import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LabelList } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { uploadPermitDocument } from '../services/apiAgent';

// Datos detallados con campos adicionales para soportar los filtros solicitados
const initialDocs = [
  { id: "RCA-001", name: "Control de emisiones de polvo", ref: "RCA 245/2018", status: "PENDIENTE", authority: "SEREMI SALUD", contractor: "GESTIONA", gerencia: "Mina", period: "2024", responsible: "Juan Pérez", initials: "JP", deadline: "12 Oct 2024", tipo: "Ambiental", vigenciaAcotada: true },
  { id: "C-204", name: "Control de Emisiones Material Particulado", ref: "RCA 254 - EXPANSIÓN FASE II", status: "EN CURSO", authority: "SEREMI SALUD", contractor: "DISEP", gerencia: "Planta de Procesos", period: "2024", responsible: "Maria Silva", initials: "MS", deadline: "15 Oct 2024", tipo: "Ambiental", vigenciaAcotada: false },
  { id: "BIO-09", name: "Monitoreo de fauna altoandina", ref: "EIA FAENA NORTE", status: "VALIDADO", authority: "SERNAGEOMIN", contractor: "SRK", gerencia: "Mina", period: "2024", responsible: "Carlos Ruiz", initials: "CR", deadline: "30 Nov 2024", tipo: "Biodiversidad", vigenciaAcotada: true },
  { id: "WAT-55", name: "Medición niveles freáticos pozo 4", ref: "RCA 112/2015", status: "PENDIENTE", authority: "DGA", contractor: "GESTIONA", gerencia: "Servicios Generales", period: "2024", responsible: "Ana Morales", initials: "AM", deadline: "02 Dec 2024", tipo: "Hídrico", vigenciaAcotada: false },
  { id: "SOC-12", name: "Programa becas escolares Colla", ref: "ACUERDO SOCIAL 2023", status: "EN CURSO", authority: "BBNN", contractor: "GESTIONA", gerencia: "Servicios Generales", period: "2025", responsible: "Roberto Díaz", initials: "RD", deadline: "15 Jan 2025", tipo: "Social", vigenciaAcotada: false },
  { id: "PRM-006", name: "Línea Alta Tensión", ref: "TE1-SEC", status: "APROBADO", authority: "SEC", contractor: "DISEP", gerencia: "Servicios Generales", period: "2024", responsible: "Juan Pérez", initials: "JP", deadline: "20 Dic 2024", tipo: "Eléctrico", vigenciaAcotada: false },
  { id: "PRM-007", name: "Campamento Base", ref: "DOM-CAT", status: "APROBADO", authority: "DOM", contractor: "GESTIONA", gerencia: "Servicios Generales", period: "2024", responsible: "Maria Silva", initials: "MS", deadline: "10 Ene 2025", tipo: "Edificación", vigenciaAcotada: false },
  { id: "PRM-008", name: "Planta Desaladora", ref: "RCA 009/2023", status: "EN ELABORACIÓN", authority: "SEREMI SALUD", contractor: "GDC", gerencia: "Planta de Procesos", period: "2024", responsible: "Carlos Ruiz", initials: "CR", deadline: "15 Mar 2025", tipo: "Industrial", vigenciaAcotada: true },
  { id: "PRM-009", name: "Manejo Residuos", ref: "SUSPEL", status: "APROBADO", authority: "SEREMI SALUD", contractor: "DISEP", gerencia: "Servicios Generales", period: "2024", responsible: "Ana Morales", initials: "AM", deadline: "22 Feb 2025", tipo: "Sanitario", vigenciaAcotada: false },
  { id: "PRM-010", name: "Polvorín Principal", ref: "SER-044", status: "APROBADO", authority: "SERNAGEOMIN", contractor: "SRK", gerencia: "Mina", period: "2024", responsible: "Roberto Díaz", initials: "RD", deadline: "30 Abr 2025", tipo: "Seguridad", vigenciaAcotada: false },
  { id: "PRM-011", name: "Obras Hidráulicas", ref: "PAS 156", status: "DESISTIDO", authority: "DGA", contractor: "GDC", gerencia: "Planta de Procesos", period: "2024", responsible: "Juan Pérez", initials: "JP", deadline: "05 May 2025", tipo: "Hídrico", vigenciaAcotada: false },
  { id: "PRM-012", name: "Cierre de Faena", ref: "RCA 300", status: "APROBADO", authority: "SERNAGEOMIN", contractor: "GESTIONA", gerencia: "Mina", period: "2024", responsible: "Maria Silva", initials: "MS", deadline: "12 Jun 2025", tipo: "Ambiental", vigenciaAcotada: true },
  { id: "PRM-013", name: "Bocatoma Río", ref: "DGA-11", status: "EN TRÁMITE", authority: "DGA", contractor: "MUTUAL", gerencia: "Servicios Generales", period: "2024", responsible: "Carlos Ruiz", initials: "CR", deadline: "20 Jul 2025", tipo: "Hídrico", vigenciaAcotada: false },
  { id: "PRM-014", name: "Subestación", ref: "SEC-99", status: "EN TRÁMITE", authority: "SEC", contractor: "MGFSN", gerencia: "Servicios Generales", period: "2024", responsible: "Ana Morales", initials: "AM", deadline: "15 Ago 2025", tipo: "Eléctrico", vigenciaAcotada: false },
  { id: "PRM-015", name: "Planta de Ácido", ref: "SER-88", status: "APROBADO", authority: "SEREMI SALUD", contractor: "ICV", gerencia: "Planta de Procesos", period: "2024", responsible: "Roberto Díaz", initials: "RD", deadline: "30 Sep 2025", tipo: "Industrial", vigenciaAcotada: false },
  { id: "PRM-016", name: "Camino Acceso", ref: "DOM-VIL", status: "NO INICIADO", authority: "DOM", contractor: "ENAEX", gerencia: "Servicios Generales", period: "2025", responsible: "Juan Pérez", initials: "JP", deadline: "10 Oct 2025", tipo: "Vial", vigenciaAcotada: false },
  { id: "PRM-017", name: "Taller Camiones", ref: "SER-01", status: "APROBADO", authority: "DOM", contractor: "GESTIONA", gerencia: "Mina", period: "2025", responsible: "Maria Silva", initials: "MS", deadline: "22 Nov 2025", tipo: "Edificación", vigenciaAcotada: false },
  { id: "PRM-018", name: "Casino Personal", ref: "SAN-12", status: "RECHAZADO", authority: "BBNN", contractor: "VECCHIOLA", gerencia: "Servicios Generales", period: "2024", responsible: "Carlos Ruiz", initials: "CR", deadline: "30 Dic 2024", tipo: "Sanitario", vigenciaAcotada: false },
  // NUEVOS PERMISOS DEMO (para llegar a 40+)
  { id: "PRM-019", name: "Sistema de Ventilación Mina", ref: "SEREMI-VNT", status: "EN TRÁMITE", authority: "SEREMI SALUD", contractor: "SRK", gerencia: "Mina", period: "2024", responsible: "Ana Morales", initials: "AM", deadline: "18 Feb 2025", tipo: "Seguridad", vigenciaAcotada: false },
  { id: "PRM-020", name: "Piscina de Relaves Fase 3", ref: "RCA 401/2020", status: "PENDIENTE", authority: "SERNAGEOMIN", contractor: "GESTIONA", gerencia: "Planta de Procesos", period: "2024", responsible: "Roberto Díaz", initials: "RD", deadline: "05 Mar 2025", tipo: "Ambiental", vigenciaAcotada: true },
  { id: "PRM-021", name: "Línea Transmisión 220kV", ref: "SEC-220", status: "APROBADO", authority: "SEC", contractor: "DISEP", gerencia: "Servicios Generales", period: "2024", responsible: "Juan Pérez", initials: "JP", deadline: "12 Apr 2025", tipo: "Eléctrico", vigenciaAcotada: false },
  { id: "PRM-022", name: "Extracción Agua Subterránea", ref: "DGA-502", status: "EN CURSO", authority: "DGA", contractor: "MUTUAL", gerencia: "Servicios Generales", period: "2024", responsible: "Maria Silva", initials: "MS", deadline: "25 May 2025", tipo: "Hídrico", vigenciaAcotada: false },
  { id: "PRM-023", name: "Depósito Combustibles", ref: "SEC-FL", status: "RECHAZADO", authority: "SEC", contractor: "ICV", gerencia: "Servicios Generales", period: "2024", responsible: "Carlos Ruiz", initials: "CR", deadline: "08 Jun 2025", tipo: "Industrial", vigenciaAcotada: false },
  { id: "PRM-024", name: "Centro Acopio Residuos Peligrosos", ref: "SUSPEL-024", status: "APROBADO", authority: "SEREMI SALUD", contractor: "GESTIONA", gerencia: "Servicios Generales", period: "2024", responsible: "Ana Morales", initials: "AM", deadline: "19 Jul 2025", tipo: "Sanitario", vigenciaAcotada: false },
  { id: "PRM-025", name: "Chancador Primario", ref: "RCA 254-CH", status: "VALIDADO", authority: "SEREMI SALUD", contractor: "SRK", gerencia: "Planta de Procesos", period: "2024", responsible: "Roberto Díaz", initials: "RD", deadline: "  01 Aug 2025", tipo: "Industrial", vigenciaAcotada: true },
  { id: "PRM-026", name: "Ruta de Evacuación Norte", ref: "DOM-REN", status: "EN ELABORACIÓN", authority: "DOM", contractor: "ENAEX", gerencia: "Mina", period: "2025", responsible: "Juan Pérez", initials: "JP", deadline: "14 Sep 2025", tipo: "Vial", vigenciaAcotada: false },
  { id: "PRM-027", name: "Programa Compensación Hídrica", ref: "DGA-COMP", status: "PENDIENTE", authority: "DGA", contractor: "GDC", gerencia: "Servicios Generales", period: "2025", responsible: "Maria Silva", initials: "MS", deadline: "27 Oct 2025", tipo: "Hídrico", vigenciaAcotada: true },
  { id: "PRM-028", name: "Estación Monitoreo Calidad Aire", ref: "SINCA-01", status: "APROBADO", authority: "SEREMI SALUD", contractor: "DISEP", gerencia: "Mina", period: "2025", responsible: "Carlos Ruiz", initials: "CR", deadline: "10 Nov 2025", tipo: "Ambiental", vigenciaAcotada: false },
  { id: "PRM-029", name: "Planta Tratamiento Aguas Servidas", ref: "DOM-PTAS", status: "EN TRÁMITE", authority: "DOM", contractor: "MUTUAL", gerencia: "Servicios Generales", period: "2025", responsible: "Ana Morales", initials: "AM", deadline: "23 Dec 2025", tipo: "Sanitario", vigenciaAcotada: false },
  { id: "PRM-030", name: "Corta Fase 4 Expansión", ref: "SERNAGEOMIN-C4", status: "NO INICIADO", authority: "SERNAGEOMIN", contractor: "SRK", gerencia: "Mina", period: "2025", responsible: "Roberto Díaz", initials: "RD", deadline: "05 Jan 2026", tipo: "Seguridad", vigenciaAcotada: true },
  { id: "PRM-031", name: "Red de Incendios Industrial", ref: "SEREMI-INC", status: "APROBADO", authority: "SEREMI SALUD", contractor: "ICV", gerencia: "Planta de Procesos", period: "2025", responsible: "Juan Pérez", initials: "JP", deadline: "18 Feb 2026", tipo: "Seguridad", vigenciaAcotada: false },
  { id: "PRM-032", name: "Reforzamiento Talud Oeste", ref: "GEOMIN-TLW", status: "EN CURSO", authority: "SERNAGEOMIN", contractor: "GESTIONA", gerencia: "Mina", period: "2025", responsible: "Maria Silva", initials: "MS", deadline: "03 Mar 2026", tipo: "Seguridad", vigenciaAcotada: false },
  { id: "PRM-033", name: "Sistema Solar Fotovoltaico 5MW", ref: "SEC-SOL5", status: "VALIDADO", authority: "SEC", contractor: "ENAEX", gerencia: "Servicios Generales", period: "2025", responsible: "Carlos Ruiz", initials: "CR", deadline: "16 Apr 2026", tipo: "Eléctrico", vigenciaAcotada: false },
  { id: "PRM-034", name: "Restauración Ecosistema Bofedal", ref: "CONAF-BOF", status: "PENDIENTE", authority: "SERNAGEOMIN", contractor: "GDC", gerencia: "Servicios Generales", period: "2025", responsible: "Ana Morales", initials: "AM", deadline: "29 May 2026", tipo: "Biodiversidad", vigenciaAcotada: true },
  { id: "PRM-035", name: "Ampliación Bodega Explosivos", ref: "DGMN-EXP2", status: "EN ELABORACIÓN", authority: "SERNAGEOMIN", contractor: "DISEP", gerencia: "Mina", period: "2025", responsible: "Roberto Díaz", initials: "RD", deadline: "11 Jun 2026", tipo: "Seguridad", vigenciaAcotada: false },
  { id: "PRM-036", name: "Monitoreo Arqueológico", ref: "CMN-ARQ", status: "APROBADO", authority: "BBNN", contractor: "SRK", gerencia: "Mina", period: "2025", responsible: "Juan Pérez", initials: "JP", deadline: "24 Jul 2026", tipo: "Patrimonio", vigenciaAcotada: false },
  { id: "PRM-037", name: "Actualización RCA Principal", ref: "RCA 245-UPD", status: "EN TRÁMITE", authority: "SEREMI SALUD", contractor: "MUTUAL", gerencia: "Planta de Procesos", period: "2025", responsible: "Maria Silva", initials: "MS", deadline: "06 Aug 2026", tipo: "Ambiental", vigenciaAcotada: true },
  { id: "PRM-038", name: "Acceso Alternativo Faena", ref: "VIAL-ACC2", status: "RECHAZADO", authority: "DOM", contractor: "ICV", gerencia: "Servicios Generales", period: "2025", responsible: "Carlos Ruiz", initials: "CR", deadline: "19 Sep 2026", tipo: "Vial", vigenciaAcotada: false },
  { id: "PRM-039", name: "Planta Osmosis Inversa", ref: "DGA-POI", status: "APROBADO", authority: "DGA", contractor: "GESTIONA", gerencia: "Planta de Procesos", period: "2025", responsible: "Ana Morales", initials: "AM", deadline: "02 Oct 2026", tipo: "Hídrico", vigenciaAcotada: false },
  { id: "PRM-040", name: "Centro Capacitación Trabajadores", ref: "SENCE-CAP", status: "VALIDADO", authority: "BBNN", contractor: "ENAEX", gerencia: "Servicios Generales", period: "2025", responsible: "Roberto Díaz", initials: "RD", deadline: "15 Nov 2026", tipo: "Social", vigenciaAcotada: false },
  { id: "PRM-041", name: "Impermeabilización Canales", ref: "DGA-IMP", status: "EN CURSO", authority: "DGA", contractor: "GDC", gerencia: "Servicios Generales", period: "2026", responsible: "Juan Pérez", initials: "JP", deadline: "28 Dec 2026", tipo: "Hídrico", vigenciaAcotada: false },
  { id: "PRM-042", name: "Plan Cierre Progresivo", ref: "SERNAGEOMIN-CLS", status: "PENDIENTE", authority: "SERNAGEOMIN", contractor: "SRK", gerencia: "Mina", period: "2026", responsible: "Maria Silva", initials: "MS", deadline: "10 Jan 2027", tipo: "Ambiental", vigenciaAcotada: true },
];

const COLORS: Record<string, string> = {
  'APROBADO': '#10b981',
  'VALIDADO': '#10b981',
  'EN TRÁMITE': '#3b82f6',
  'EN CURSO': '#3b82f6',
  'EN ELABORACIÓN': '#f59e0b',
  'PENDIENTE': '#64748b',
  'RECHAZADO': '#ef4444',
  'NO INICIADO': '#475569',
  'DESISTIDO': '#8b5cf6',
};

const categories = [
  "ESTATUS GESTIÓN DE PERMISOS",
  "PERMISOS EN TRÁMITE",
  "PERMISOS POR GERENCIAS",
  "PERMISOS SEGÚN ÁREAS",
  "PERMISOS SEGÚN AUTORIDAD",
  "PERMISOS SEGÚN CONTRATISTA",
  "PERMISOS SEGÚN TIPO",
  "CONTRATISTAS CON PENDIENTES",
  "PERMISOS CON VIGENCIA ACOTADA"
];

const Permissions: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Helper function to translate status values
  const translateStatus = (status: string): string => {
    const statusKey = status.replace(/ /g, '_').toUpperCase();
    return t(`status.${statusKey}`, status);
  };

  const [docs, setDocs] = useState(initialDocs);
  const [globalGerencia, setGlobalGerencia] = useState('Todas');
  const [globalPeriodo, setGlobalPeriodo] = useState('Todos');

  const categories = useMemo(() => [
    t('permissions.categories.ESTATUS GESTIÓN DE PERMISOS'),
    t('permissions.categories.PERMISOS EN TRÁMITE'),
    t('permissions.categories.PERMISOS POR GERENCIAS'),
    t('permissions.categories.PERMISOS SEGÚN ÁREAS'),
    t('permissions.categories.PERMISOS SEGÚN AUTORIDAD'),
    t('permissions.categories.PERMISOS SEGÚN CONTRATISTA'),
    t('permissions.categories.PERMISOS SEGÚN TIPO'),
    t('permissions.categories.CONTRATISTAS CON PENDIENTES'),
    t('permissions.categories.PERMISOS CON VIGENCIA ACOTADA')
  ], [t]);

  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [statusFilter, setStatusFilter] = useState(t('permissions.all_status'));
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para el nuevo permiso
  const [newPermit, setNewPermit] = useState({
    id: '',
    name: '',
    ref: '',
    status: 'PENDIENTE',
    authority: 'SEREMI SALUD',
    contractor: 'GESTIONA',
    gerencia: 'Mina',
    period: '2024',
    responsible: '',
    deadline: '',
    tipo: 'Ambiental',
    vigenciaAcotada: false
  });

  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [inferredFields, setInferredFields] = useState<Record<string, boolean>>({});

  const handleAutoFill = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoadingAI(true);
    setInferredFields({});

    try {
      const data = await uploadPermitDocument(file);

      const newFormValues = { ...newPermit };
      const newInferred: Record<string, boolean> = {};

      const mapField = (apiField: string, stateField: keyof typeof newPermit) => {
        if (data[apiField]) {
          let val = data[apiField].value;
          if (stateField === 'vigenciaAcotada') {
            val = val === true || val === 'true' || val === 'Verdadero' || val === 'True';
          }
          (newFormValues[stateField] as any) = val;
          newInferred[stateField] = data[apiField].is_inferred;
        }
      };

      mapField('nombre_permiso', 'name');
      mapField('referencia_legal', 'ref');
      mapField('autoridad_competente', 'authority');
      mapField('gerencia_responsable', 'gerencia');
      mapField('responsable', 'responsible');
      mapField('vencimiento', 'deadline');
      mapField('estado_gestion', 'status');
      mapField('tipo_permiso', 'tipo');
      mapField('contratista_sugerido', 'contractor');
      mapField('periodo', 'period');
      mapField('vigencia_acotada', 'vigenciaAcotada');

      setNewPermit(newFormValues);
      setInferredFields(newInferred);

    } catch (error) {
      alert("Error al procesar el documento con IA.");
    } finally {
      setIsLoadingAI(false);
      event.target.value = '';
    }
  };

  const getInputClass = (fieldName: string) => {
    const baseClass = "bg-[#0f172a] border text-white rounded-lg px-4 h-11 text-xs outline-none transition-all w-full ";
    if (inferredFields[fieldName]) {
      return baseClass + "border-amber-400 focus:ring-2 focus:ring-amber-500/50 shadow-[0_0_8px_rgba(251,191,36,0.3)]";
    }
    return baseClass + "border-[#334155] focus:ring-2 focus:ring-primary/50";
  };

  const AIHint = ({ field }: { field: string }) => {
    if (!inferredFields[field]) return null;
    return <span className="text-amber-500 text-[10px] font-bold mt-1 flex items-center gap-1">✨ Sugerencia de la IA</span>;
  };

  const handleSavePermit = () => {
    if (!newPermit.name || !newPermit.responsible) {
      alert("Por favor complete los campos obligatorios (Nombre y Responsable)");
      return;
    }

    const initials = newPermit.responsible
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const permitToAdd = {
      ...newPermit,
      id: newPermit.id || `PRM-${Math.floor(Math.random() * 1000)}`,
      initials: initials
    };

    setDocs(prev => [permitToAdd, ...prev]);
    setIsModalOpen(false);
    // Reset form
    setNewPermit({
      id: '',
      name: '',
      ref: '',
      status: 'PENDIENTE',
      authority: 'SEREMI SALUD',
      contractor: 'GESTIONA',
      gerencia: 'Mina',
      period: '2024',
      responsible: '',
      deadline: '',
      tipo: 'Ambiental',
      vigenciaAcotada: false
    });
    setInferredFields({});
  };

  // Sync activeCategory if language changes and the name doesn't match translated version
  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  // Lógica de filtrado dinámico aplicada a TODA la aplicación basada en los filtros superiores y de navegación
  const dataFiltradaGlobal = useMemo(() => {
    let filtered = docs.filter(d =>
      (globalGerencia === 'Todas' || d.gerencia === globalGerencia) &&
      (globalPeriodo === 'Todos' || d.period === globalPeriodo)
    );

    // Aplicar filtro por categoría seleccionada en la barra de navegación
    const isES = i18n.language === 'es';
    const categoryEn = i18n.language === 'en' ?
      Object.keys(t('permissions.categories', { returnObjects: true })).find(key => t(`permissions.categories.${key}`) === activeCategory)
      : activeCategory;

    // Normalize category for switch logic (using the property names from translation file as canonical)
    const canonicalCategory = Object.keys(t('permissions.categories', { lng: 'es', returnObjects: true })).find(key => t(`permissions.categories.${key}`, { lng: 'es' }) === activeCategory) || activeCategory;

    switch (canonicalCategory) {
      case "PERMISOS EN TRÁMITE":
        filtered = filtered.filter(d => ['EN TRÁMITE', 'EN ELABORACIÓN', 'EN CURSO', 'PENDIENTE'].includes(d.status));
        break;
      case "CONTRATISTAS CON PENDIENTES":
        filtered = filtered.filter(d => ['PENDIENTE', 'RECHAZADO', 'NO INICIADO'].includes(d.status));
        break;
      case "PERMISOS CON VIGENCIA ACOTADA":
        filtered = filtered.filter(d => d.vigenciaAcotada === true);
        break;
      default:
        break;
    }

    return filtered;
  }, [globalGerencia, globalPeriodo, activeCategory, docs, t, i18n.language]);

  const stats = useMemo(() => ({
    total: dataFiltradaGlobal.length,
    aprobados: dataFiltradaGlobal.filter(d => d.status === 'APROBADO' || d.status === 'VALIDADO').length,
    enTramite: dataFiltradaGlobal.filter(d => d.status === 'EN TRÁMITE' || d.status === 'EN ELABORACIÓN' || d.status === 'EN CURSO').length,
    criticos: dataFiltradaGlobal.filter(d => d.status === 'RECHAZADO' || d.status === 'NO INICIADO' || d.status === 'PENDIENTE').length,
  }), [dataFiltradaGlobal]);

  // Tooltip Personalizado con Detalles de Registros para los Gráficos
  const CustomDetailedTooltip = ({ active, payload, label, dataField }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const itemName = label || data.name;
      const itemValue = payload.reduce((acc: number, curr: any) => acc + (curr.value || 0), 0);

      const examples = dataFiltradaGlobal.filter(d => {
        if (dataField === 'status') return d.status === itemName;
        if (dataField === 'authority') return d.authority === itemName;
        if (dataField === 'contractor') return d.contractor === itemName;
        if (dataField === 'gerencia') return d.gerencia === itemName;
        return false;
      }).slice(0, 3);

      return (
        <div className="bg-[#1e293b] border border-[#334155] p-3 rounded shadow-2xl min-w-[200px] backdrop-blur-md">
          <p className="text-white text-[10px] font-black uppercase tracking-widest mb-2 border-b border-[#334155] pb-1">
            {itemName} <span className="text-primary ml-1">({itemValue})</span>
          </p>
          <div className="space-y-2">
            {payload.filter((p: any) => p.value > 0).map((p: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="size-1.5 rounded-full" style={{ backgroundColor: p.color || p.fill }} />
                  <span className="text-[8px] font-black text-white uppercase">{p.name || itemName}:</span>
                </div>
                <span className="text-[8px] font-black text-slate-300">{p.value}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-[#334155] mt-1">
              {examples.map((ex, idx) => (
                <div key={idx} className="flex flex-col gap-0.5 mb-1.5 last:mb-0">
                  <span className="text-white text-[9px] font-bold truncate max-w-[180px]">{ex.name}</span>
                  <span className="text-[#94a3b8] text-[7px] uppercase font-black">{ex.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const statusPieData = useMemo(() => {
    const counts: Record<string, number> = {};
    dataFiltradaGlobal.forEach(d => { counts[d.status] = (counts[d.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [dataFiltradaGlobal]);

  const authorityBarData = useMemo(() => {
    const aMap: Record<string, any> = {};
    dataFiltradaGlobal.forEach(d => {
      if (!aMap[d.authority]) aMap[d.authority] = { name: d.authority, total: 0 };
      aMap[d.authority][d.status] = (aMap[d.authority][d.status] || 0) + 1;
      aMap[d.authority].total += 1;
    });
    return Object.values(aMap).sort((a, b) => b.total - a.total);
  }, [dataFiltradaGlobal]);

  const gerenciaBarData = useMemo(() => {
    const gMap: Record<string, any> = {};
    dataFiltradaGlobal.forEach(d => {
      if (!gMap[d.gerencia]) gMap[d.gerencia] = { name: d.gerencia, total: 0 };
      gMap[d.gerencia][d.status] = (gMap[d.gerencia][d.status] || 0) + 1;
      gMap[d.gerencia].total += 1;
    });
    return Object.values(gMap);
  }, [dataFiltradaGlobal]);

  const contractorBarData = useMemo(() => {
    const cMap: Record<string, any> = {};
    dataFiltradaGlobal.forEach(d => {
      if (!cMap[d.contractor]) cMap[d.contractor] = { name: d.contractor, total: 0 };
      cMap[d.contractor][d.status] = (cMap[d.contractor][d.status] || 0) + 1;
      cMap[d.contractor].total += 1;
    });
    return Object.values(cMap).sort((a, b) => b.total - a.total).slice(0, 10);
  }, [dataFiltradaGlobal]);

  const docsForTable = useMemo(() => {
    if (statusFilter === 'Todos los Estados') return dataFiltradaGlobal;
    return dataFiltradaGlobal.filter(d => d.status === statusFilter.toUpperCase());
  }, [dataFiltradaGlobal, statusFilter]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#0f172a] pb-12">
      <header className="px-8 py-6 bg-[#0f172a] border-b border-[#1e293b]">
        <div className="flex flex-col gap-6">
          <nav className="flex items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <Link to="/" className="hover:text-primary transition-colors">{t('dashboard.breadcrumb_start')}</Link>
            <span className="mx-2 text-slate-700">/</span>
            <span className="text-white">{t('permissions.breadcrumb_permits')}</span>
          </nav>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div className="space-y-1">
              <h1 className="text-white text-3xl md:text-4xl font-black uppercase tracking-tight">{t('permissions.title')}</h1>
              <p className="text-[#64748b] text-sm italic">{t('permissions.subtitle')}</p>
            </div>
            <div className="flex flex-wrap items-end gap-3 w-full lg:w-auto">
              <div className="flex flex-col gap-1 min-w-[140px]">
                <label className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest ml-1">{t('permissions.label_gerencia')}</label>
                <select
                  value={globalGerencia}
                  onChange={(e) => setGlobalGerencia(e.target.value)}
                  className="bg-[#1e293b] border border-[#334155] text-white rounded px-3 h-10 text-xs focus:ring-1 focus:ring-primary outline-none shadow-inner"
                >
                  <option value="Todas">{t('dashboard.gerencias.Todas')}</option>
                  <option value="Mina">{t('dashboard.gerencias.Mina')}</option>
                  <option value="Planta de Procesos">{t('dashboard.gerencias.Planta de Procesos')}</option>
                  <option value="Servicios Generales">{t('dashboard.gerencias.Servicios Generales')}</option>
                </select>
              </div>
              <div className="flex flex-col gap-1 min-w-[100px]">
                <label className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest ml-1">{t('permissions.label_periodo')}</label>
                <select
                  value={globalPeriodo}
                  onChange={(e) => setGlobalPeriodo(e.target.value)}
                  className="bg-[#1e293b] border border-[#334155] text-white rounded px-3 h-10 text-xs focus:ring-1 focus:ring-primary outline-none shadow-inner"
                >
                  <option value="Todos">{t('dashboard.gerencias.Todas')}</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                </select>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-primary hover:bg-primary-hover text-white h-10 px-6 rounded font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                {t('permissions.btn_new')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-8 grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {[
          { label: t('permissions.kpi_total'), val: stats.total, color: "text-white" },
          { label: t('permissions.kpi_approved'), val: stats.aprobados, color: "text-emerald-500" },
          { label: t('permissions.kpi_in_progress'), val: stats.enTramite, color: "text-blue-500" },
          { label: t('permissions.kpi_critical'), val: stats.criticos, color: "text-red-500" }
        ].map((kpi, i) => (
          <div key={i} className="bg-[#1e293b]/40 border border-[#334155] rounded-xl p-8 hover:border-primary/50 transition-all shadow-sm group">
            <p className="text-[#94a3b8] text-[10px] font-black uppercase tracking-widest mb-4 group-hover:text-primary transition-colors">{kpi.label}</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-black ${kpi.color}`}>{kpi.val}</span>
              <span className="text-[#64748b] text-[11px] font-bold uppercase tracking-tighter">{t('permissions.units')}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="px-8 mt-10 space-y-8">
        <div className="bg-[#1e293b] p-1 rounded border border-[#334155] overflow-x-auto shadow-2xl">
          <div className="flex gap-1 min-w-max">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-3 text-[10px] font-black uppercase tracking-tight transition-all rounded ${activeCategory === cat ? 'bg-primary text-white shadow-xl' : 'text-[#94a3b8] hover:bg-white/5'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-[#1e293b] p-8 rounded border border-[#334155] h-[400px] flex flex-col shadow-lg">
            <h3 className="text-white text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm icon-fill">donut_large</span>
              {t('permissions.chart_status')}
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusPieData.map((e, i) => <Cell key={i} fill={COLORS[e.name] || '#475569'} />)}
                  </Pie>
                  <Tooltip content={<CustomDetailedTooltip dataField="status" />} />
                  <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#1e293b] p-8 rounded border border-[#334155] h-[400px] flex flex-col shadow-lg">
            <h3 className="text-white text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">balance</span>
              {t('permissions.chart_authority')}
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={authorityBarData} margin={{ left: 20, right: 30 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} fontWeight="bold" width={80} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} content={<CustomDetailedTooltip dataField="authority" />} />
                  <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }} />
                  {Object.keys(COLORS).map(status => (
                    <Bar key={status} dataKey={status} stackId="a" fill={COLORS[status]} barSize={20}>
                      <LabelList dataKey={status} position="center" fill="#fff" fontSize={8} fontWeight="black"
                        formatter={(val: number) => val > 0 ? val : ''} />
                    </Bar>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#1e293b] p-8 rounded border border-[#334155] h-[400px] flex flex-col shadow-lg">
            <h3 className="text-white text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">stacked_bar_chart</span>
              {t('permissions.chart_management')}
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gerenciaBarData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} axisLine={false} tickLine={false} fontWeight="bold" />
                  <YAxis stroke="#94a3b8" fontSize={9} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomDetailedTooltip dataField="gerencia" />} />
                  <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }} />
                  {Object.keys(COLORS).map(status => (
                    <Bar key={status} dataKey={status} stackId="a" fill={COLORS[status]} barSize={45}>
                      <LabelList dataKey={status} position="center" fill="#fff" fontSize={8} fontWeight="black"
                        formatter={(val: number) => val > 0 ? val : ''} />
                    </Bar>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#1e293b] p-8 rounded border border-[#334155] h-[400px] flex flex-col shadow-lg">
            <h3 className="text-white text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">engineering</span>
              {t('permissions.chart_contractor')}
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={contractorBarData} margin={{ left: 20, right: 30 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} fontWeight="bold" width={80} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} content={<CustomDetailedTooltip dataField="contractor" />} />
                  <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }} />
                  {Object.keys(COLORS).map(status => (
                    <Bar key={status} dataKey={status} stackId="a" fill={COLORS[status]} barSize={15}>
                      <LabelList dataKey={status} position="center" fill="#fff" fontSize={7} fontWeight="black"
                        formatter={(val: number) => val > 0 ? val : ''} />
                    </Bar>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded shadow-2xl overflow-hidden">
          <div className="p-8 bg-[#334155]/10 border-b border-[#334155] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined icon-fill">table_rows</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-white text-base font-black uppercase tracking-widest">{t('permissions.table_title')}</h3>
                <p className="text-[#94a3b8] text-[9px] font-black uppercase tracking-[0.2em]">{activeCategory}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest ml-1">{t('permissions.table_filter_status')}</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#0f172a] border border-[#334155] text-white rounded px-4 h-10 text-xs focus:ring-1 focus:ring-primary outline-none min-w-[200px]"
                >
                  <option value={t('permissions.all_status')}>{t('permissions.all_status')}</option>
                  {Object.keys(COLORS).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="text-right border-l border-[#334155] pl-6">
                <p className="text-[#94a3b8] text-[9px] font-black uppercase tracking-widest">{t('permissions.table_records')}</p>
                <p className="text-white text-3xl font-black">{docsForTable.length}</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#0f172a] border-b border-[#334155] text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">
                  <th className="p-5">{t('permissions.table_id')}</th>
                  <th className="p-5">{t('permissions.table_desc')}</th>
                  <th className="p-5">{t('permissions.table_responsible')}</th>
                  <th className="p-5">{t('permissions.table_period')}</th>
                  <th className="p-5">{t('permissions.table_deadline')}</th>
                  <th className="p-5">{t('permissions.table_status')}</th>
                  <th className="p-5 text-right font-black">{t('permissions.table_sheet')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                {docsForTable.length > 0 ? docsForTable.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-white/5 transition-all group cursor-pointer"
                    onClick={() => navigate(`/permisos/${doc.id}`)}
                  >
                    <td className="p-5 text-white text-[11px] font-black">{doc.id}</td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-white text-[13px] font-bold group-hover:text-primary transition-colors">{doc.name}</span>
                        <span className="text-[#64748b] text-[9px] font-black uppercase mt-1 tracking-tight">{doc.ref}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-[#1e293b] border border-[#334155] flex items-center justify-center text-[10px] text-primary font-black uppercase">
                          {doc.initials}
                        </div>
                        <span className="text-slate-300 text-[11px] font-bold">{doc.responsible}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="bg-[#0f172a] border border-[#334155] px-3 py-1.5 rounded text-[10px] text-slate-400 font-black uppercase">
                        {doc.period}
                      </span>
                    </td>
                    <td className="p-5 text-slate-300 text-[11px] font-medium">{doc.deadline}</td>
                    <td className="p-5">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border shadow-sm ${doc.status === 'APROBADO' || doc.status === 'VALIDADO' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' :
                        doc.status === 'RECHAZADO' || doc.status === 'NO INICIADO' ? 'bg-red-500/10 text-red-500 border-red-500/30' :
                          'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <span className="material-symbols-outlined text-[#334155] group-hover:text-white transition-all text-xl">arrow_right_alt</span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="p-20 text-center text-[#64748b] italic text-xs uppercase font-bold tracking-[0.2em]">
                      {t('permissions.no_records')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL NUEVO PERMISO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0f172a]/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-[#334155] flex justify-between items-center bg-[#0f172a]/50">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined font-black">add_circle</span>
                </div>
                <div>
                  <h3 className="text-white text-lg font-black uppercase tracking-tight">{t('permissions.modal_title')}</h3>
                  <p className="text-[#64748b] text-[10px] font-bold uppercase tracking-widest">{t('permissions.modal_subtitle')}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-3xl">close</span>
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* ASISTENTE IA UPLOAD */}
                <div className="md:col-span-2 pb-4 border-b border-[#334155]">
                  <div className="flex items-center gap-4 bg-primary/10 p-4 rounded-xl border border-primary/20">
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-bold flex items-center gap-2">
                        <span className="text-amber-400">✨</span> Asistente IA
                      </h4>
                      <p className="text-[#94a3b8] text-xs mt-1">Sube una RCA, Resolución o EIA para auto-completar este formulario.</p>
                    </div>
                    <div>
                      <input
                        type="file"
                        id="ai-upload-permit"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleAutoFill}
                        disabled={isLoadingAI}
                      />
                      <label
                        htmlFor="ai-upload-permit"
                        className={`cursor-pointer px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 border ${isLoadingAI ? 'bg-[#0f172a] text-slate-400 border-[#334155]' : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/30 shadow-lg shadow-amber-500/10'} `}
                      >
                        {isLoadingAI ? (
                          <>
                            <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                            Analizando...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-sm">auto_awesome</span>
                            Auto-completar
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* ID y NOMBRE */}
                <div className="space-y-4 md:col-span-2">
                  <div className="flex flex-col gap-1.5 relative">
                    <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['name'] ? "text-amber-500" : "text-[#94a3b8]")}>{t('permissions.label_name')}</label>
                    <input
                      type="text"
                      value={newPermit.name}
                      onChange={(e) => setNewPermit({ ...newPermit, name: e.target.value })}
                      placeholder={i18n.language === 'en' ? "e.g., Phase I Air Quality Monitoring" : "Ej: Monitoreo de Calidad de Aire Fase I"}
                      className={getInputClass('name')}
                    />
                    <AIHint field="name" />
                  </div>
                </div>

                {/* REFERENCIA y ESTADO */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['ref'] ? "text-amber-500" : "text-[#94a3b8]")}>{t('permissions.label_ref')}</label>
                  <input
                    type="text"
                    value={newPermit.ref}
                    onChange={(e) => setNewPermit({ ...newPermit, ref: e.target.value })}
                    placeholder="Ej: RCA 245/2018"
                    className={getInputClass('ref')}
                  />
                  <AIHint field="ref" />
                </div>
                <div className="flex flex-col gap-1.5 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['status'] ? "text-amber-500" : "text-[#94a3b8]")}>{t('permissions.label_status')}</label>
                  <select
                    value={newPermit.status}
                    onChange={(e) => setNewPermit({ ...newPermit, status: e.target.value })}
                    className={getInputClass('status')}
                  >
                    {Object.keys(COLORS).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <AIHint field="status" />
                </div>

                {/* AUTORIDAD y CONTRATISTA */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['authority'] ? "text-amber-500" : "text-[#94a3b8]")}>{t('permissions.label_authority')}</label>
                  <select
                    value={newPermit.authority}
                    onChange={(e) => setNewPermit({ ...newPermit, authority: e.target.value })}
                    className={getInputClass('authority')}
                  >
                    <option>SEREMI SALUD</option>
                    <option>SERNAGEOMIN</option>
                    <option>DGA</option>
                    <option>SEC</option>
                    <option>DOM</option>
                    <option>BBNN</option>
                    <option>SEA</option>
                  </select>
                  <AIHint field="authority" />
                </div>
                <div className="flex flex-col gap-1.5 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['contractor'] ? "text-amber-500" : "text-[#94a3b8]")}>{t('permissions.label_contractor')}</label>
                  <input
                    type="text"
                    value={newPermit.contractor}
                    onChange={(e) => setNewPermit({ ...newPermit, contractor: e.target.value })}
                    placeholder="Ej: GESTIONA, SRK, ICV"
                    className={getInputClass('contractor')}
                  />
                  <AIHint field="contractor" />
                </div>

                {/* GERENCIA y TIPO */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['gerencia'] ? "text-amber-500" : "text-[#94a3b8]")}>{t('common.management')}</label>
                  <select
                    value={newPermit.gerencia}
                    onChange={(e) => setNewPermit({ ...newPermit, gerencia: e.target.value })}
                    className={getInputClass('gerencia')}
                  >
                    <option value="Mina">{t('dashboard.gerencias.Mina')}</option>
                    <option value="Planta de Procesos">{t('dashboard.gerencias.Planta de Procesos')}</option>
                    <option value="Servicios Generales">{t('dashboard.gerencias.Servicios Generales')}</option>
                  </select>
                  <AIHint field="gerencia" />
                </div>
                <div className="flex flex-col gap-1.5 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['tipo'] ? "text-amber-500" : "text-[#94a3b8]")}>{t('permissions.label_type')}</label>
                  <select
                    value={newPermit.tipo}
                    onChange={(e) => setNewPermit({ ...newPermit, tipo: e.target.value })}
                    className={getInputClass('tipo')}
                  >
                    <option value="Ambiental">{i18n.language === 'en' ? 'Environmental' : 'Ambiental'}</option>
                    <option value="Biodiversidad">{i18n.language === 'en' ? 'Biodiversity' : 'Biodiversidad'}</option>
                    <option value="Hídrico">{i18n.language === 'en' ? 'Water' : 'Hídrico'}</option>
                    <option value="Social">{i18n.language === 'en' ? 'Social' : 'Social'}</option>
                    <option value="Eléctrico">{i18n.language === 'en' ? 'Electrical' : 'Eléctrico'}</option>
                    <option value="Edificación">{i18n.language === 'en' ? 'Building' : 'Edificación'}</option>
                    <option value="Industrial">{i18n.language === 'en' ? 'Industrial' : 'Industrial'}</option>
                    <option value="Sanitario">{i18n.language === 'en' ? 'Sanitary' : 'Sanitario'}</option>
                    <option value="Seguridad">{i18n.language === 'en' ? 'Security' : 'Seguridad'}</option>
                    <option value="Vial">{i18n.language === 'en' ? 'Road' : 'Vial'}</option>
                  </select>
                  <AIHint field="tipo" />
                </div>

                {/* RESPONSABLE y PERIODO */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['responsible'] ? "text-amber-500" : "text-[#94a3b8]")}>{t('permissions.label_responsible')}</label>
                  <input
                    type="text"
                    value={newPermit.responsible}
                    onChange={(e) => setNewPermit({ ...newPermit, responsible: e.target.value })}
                    placeholder={i18n.language === 'en' ? "Full Name" : "Nombre Completo"}
                    className={getInputClass('responsible')}
                  />
                  <AIHint field="responsible" />
                </div>
                <div className="flex flex-col gap-1.5 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['period'] ? "text-amber-500" : "text-[#94a3b8]")}>{t('permissions.label_periodo')}</label>
                  <select
                    value={newPermit.period}
                    onChange={(e) => setNewPermit({ ...newPermit, period: e.target.value })}
                    className={getInputClass('period')}
                  >
                    <option>2024</option>
                    <option>2025</option>
                    <option>2026</option>
                  </select>
                  <AIHint field="period" />
                </div>

                {/* VENCIMIENTO y VIGENCIA ACOTADA */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['deadline'] ? "text-amber-500" : "text-[#94a3b8]")}>{t('permissions.table_deadline')}</label>
                  <input
                    type="text"
                    value={newPermit.deadline}
                    onChange={(e) => setNewPermit({ ...newPermit, deadline: e.target.value })}
                    placeholder={i18n.language === 'en' ? "e.g., 15 Dec 2024" : "Ej: 15 Dic 2024"}
                    className={getInputClass('deadline')}
                  />
                  <AIHint field="deadline" />
                </div>
                <div className="flex items-center gap-4 pt-6 relative">
                  <button
                    onClick={() => setNewPermit({ ...newPermit, vigenciaAcotada: !newPermit.vigenciaAcotada })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-[10px] font-black uppercase tracking-widest ${inferredFields['vigenciaAcotada'] ? 'border-amber-400 bg-amber-500/10 text-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.3)]' :
                      newPermit.vigenciaAcotada
                        ? 'bg-primary/20 border-primary text-primary'
                        : 'bg-transparent border-[#334155] text-slate-500'
                      }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {newPermit.vigenciaAcotada ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                    {t('permissions.label_restricted')}
                  </button>
                  <p className="text-[9px] text-[#64748b] leading-tight flex-1 italic">{t('permissions.restricted_desc')}</p>
                  <div className="absolute top-1 left-2"><AIHint field="vigenciaAcotada" /></div>
                </div>
              </div>

              <div className="pt-8 border-t border-[#334155] flex gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-12 rounded-xl text-slate-400 font-black text-[11px] uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleSavePermit}
                  className="flex-[2] h-12 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                >
                  {t('permissions.btn_save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Permissions;