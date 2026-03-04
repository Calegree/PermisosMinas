import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LabelList } from 'recharts';
import { Commitment } from '../types';
import { uploadCommitmentDocument } from '../services/apiAgent';

const COLORS_STATUS = {
  'Validado': '#10b981',
  'En Curso': '#3b82f6',
  'Pendiente': '#f59e0b',
  'Atrasado': '#ef4444'
};

// Mock inicial extendido
const initialCommitments: (Commitment & { area?: string, autoridad?: string, contratista?: string, tipo?: string, vigenciaAcotada?: boolean, gerencia: string, periodo: string })[] = [
  { id: 'RCA-001', description: 'Control de emisiones de polvo', source: 'RCA 245/2018', responsible: 'Juan Pérez', deadline: '12 Oct 2024', status: 'Pendiente', area: 'Mina', autoridad: 'SMA', contratista: 'ICV', tipo: 'Ambiental', gerencia: 'Mina', periodo: '2024' },
  { id: 'C-204', description: 'Control de Emisiones Material Particulado', source: 'RCA 254 - Expansión Fase II', responsible: 'Maria Silva', deadline: '15 Oct 2024', status: 'En Curso', area: 'Planta', autoridad: 'SEREMI', contratista: 'VECCHIOLA', tipo: 'Ambiental', gerencia: 'Planta de Procesos', periodo: '2024' },
  { id: 'BIO-09', description: 'Monitoreo de fauna altoandina', source: 'EIA Faena Norte', responsible: 'Carlos Ruiz', deadline: '30 Nov 2024', status: 'Validado', area: 'Mina', autoridad: 'SAG', contratista: 'GEOTECNIA', tipo: 'Biodiversidad', vigenciaAcotada: true, gerencia: 'Mina', periodo: '2024' },
  { id: 'WAT-55', description: 'Medición niveles freáticos pozo 4', source: 'RCA 112/2015', responsible: 'Ana Morales', deadline: '02 Dec 2024', status: 'Pendiente', area: 'Suministro', autoridad: 'DGA', contratista: 'TECNORECURSOS', tipo: 'Hídrico', gerencia: 'Servicios Generales', periodo: '2024' },
  { id: 'SOC-12', description: 'Programa becas escolares Colla', source: 'Acuerdo Social 2023', responsible: 'Roberto Díaz', deadline: '15 Jan 2025', status: 'En Curso', area: 'Comunidades', autoridad: 'MINVU', contratista: 'GESTIONA', tipo: 'Social', gerencia: 'Servicios Generales', periodo: '2025' },
  { id: 'RCA-005', description: 'Gestión de residuos industriales peligrosos', source: 'RCA 012/2020', responsible: 'Juan Pérez', deadline: '20 Dec 2024', status: 'Validado', area: 'Planta', autoridad: 'SMA', contratista: 'RESITER', tipo: 'Ambiental', gerencia: 'Planta de Procesos', periodo: '2024' },
  { id: 'PAS-08', description: 'Plan de cierre de faena fase 1', source: 'SERNAGEOMIN 445', responsible: 'Carlos Ruiz', deadline: '10 Jan 2025', status: 'En Curso', area: 'Mina', autoridad: 'SERNAGEOMIN', contratista: 'SRK', tipo: 'Normativo', gerencia: 'Mina', periodo: '2025' },
  { id: 'WAT-60', description: 'Construcción de canales de contorno', source: 'RCA 112/2015', responsible: 'Maria Silva', deadline: '05 Nov 2024', status: 'Atrasado', area: 'Mina', autoridad: 'DGA', contratista: 'ICV', tipo: 'Hídrico', gerencia: 'Mina', periodo: '2024' },
  { id: 'BIO-15', description: 'Rescate y relocalización de cactáceas', source: 'RCA 254-2018', responsible: 'Ana Morales', deadline: '22 Oct 2024', status: 'Validado', area: 'Exploración', autoridad: 'CONAF', contratista: 'GEOTECNIA', tipo: 'Biodiversidad', gerencia: 'Servicios Generales', periodo: '2024' },
  { id: 'SOC-22', description: 'Mesa de diálogo comunidad Calama', source: 'Convenio Marco', responsible: 'Roberto Díaz', deadline: '18 Dec 2024', status: 'Pendiente', area: 'RSE', autoridad: 'Gobernación', contratista: 'INTERNA', tipo: 'Social', gerencia: 'Servicios Generales', periodo: '2024' },
  { id: 'SEC-01', description: 'Mantenimiento preventivo subestación', source: 'Norma Eléctrica SEC', responsible: 'Juan Pérez', deadline: '30 Nov 2024', status: 'Validado', area: 'Energía', autoridad: 'SEC', contratista: 'ABB', tipo: 'Normativo', gerencia: 'Servicios Generales', periodo: '2024' },
  { id: 'RCA-088', description: 'Monitoreo de calidad de aire estación 1', source: 'RCA 245/2018', responsible: 'Maria Silva', deadline: '15 Nov 2024', status: 'En Curso', area: 'Mina', autoridad: 'SMA', contratista: 'SGS', tipo: 'Ambiental', gerencia: 'Mina', periodo: '2024' },
  { id: 'WAT-09', description: 'Reporte trimestral extracciones DGA', source: 'RCA 012/2020', responsible: 'Ana Morales', deadline: '05 Oct 2024', status: 'Atrasado', area: 'Suministro', autoridad: 'DGA', contratista: 'INTERNA', tipo: 'Hídrico', gerencia: 'Planta de Procesos', periodo: '2024' },
  { id: 'SEG-44', description: 'Simulacro de emergencia química', source: 'DS 132 Seg. Minera', responsible: 'Carlos Ruiz', deadline: '12 Dec 2024', status: 'Pendiente', area: 'Planta', autoridad: 'SERNAGEOMIN', contratista: 'MUTUAL', tipo: 'Normativo', gerencia: 'Planta de Procesos', periodo: '2024' },
  { id: 'RCA-112', description: 'Protección de sitios arqueológicos área A', source: 'RCA 156/2019', responsible: 'Roberto Díaz', deadline: '25 Jan 2025', status: 'En Curso', area: 'Patrimonio', autoridad: 'CMN', contratista: 'ARQSOL', tipo: 'Normativo', gerencia: 'Servicios Generales', periodo: '2025' }
];

const Commitments: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [allCommitments, setAllCommitments] = useState(initialCommitments);

  const categories = useMemo(() => [
    t('commitments.categories.ESTATUS GESTIÓN DE COMPROMISOS'),
    t('commitments.categories.COMPROMISOS EN TRÁMITE'),
    t('commitments.categories.COMPROMISOS POR GERENCIAS'),
    t('commitments.categories.COMPROMISOS SEGÚN ÁREAS'),
    t('commitments.categories.COMPROMISOS SEGÚN AUTORIDAD'),
    t('commitments.categories.COMPROMISOS SEGÚN CONTRATISTA'),
    t('commitments.categories.COMPROMISOS SEGÚN TIPO'),
    t('commitments.categories.CONTRATISTAS CON PENDIENTES'),
    t('commitments.categories.COMPROMISOS CON VIGENCIA ACOTADA')
  ], [t]);

  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedGerencia, setSelectedGerencia] = useState('Todas');
  const [selectedPeriodo, setSelectedPeriodo] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState(t('commitments.all_status'));
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  // Form state for new commitment
  const [newCommitment, setNewCommitment] = useState({
    id: '',
    description: '',
    source: '',
    responsible: '',
    deadline: '',
    status: 'Pendiente' as Commitment['status'],
    area: '',
    autoridad: '',
    contratista: '',
    tipo: 'Ambiental',
    vigenciaAcotada: false,
    gerencia: 'Mina',
    periodo: '2024'
  });

  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [inferredFields, setInferredFields] = useState<Record<string, boolean>>({});

  const handleAutoFill = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoadingAI(true);
    setInferredFields({});

    try {
      const data = await uploadCommitmentDocument(file);

      const newFormValues = { ...newCommitment };
      const newInferred: Record<string, boolean> = {};

      const mapField = (apiField: string, stateField: keyof typeof newCommitment) => {
        if (data[apiField]) {
          let val = data[apiField].value;
          if (stateField === 'vigenciaAcotada') {
            val = val === true || val === 'true' || val === 'Verdadero' || val === 'True' || val === 'true';
          }
          (newFormValues[stateField] as any) = val;
          newInferred[stateField] = data[apiField].is_inferred;
        }
      };

      mapField('id_compromiso', 'id');
      mapField('descripcion_compromiso', 'description');
      mapField('origen_fuente', 'source');
      mapField('tipo_compromiso', 'tipo');
      mapField('gerencia_responsable', 'gerencia');
      mapField('area_instalacion', 'area');
      mapField('empresa_contratista', 'contratista');
      mapField('responsable', 'responsible');
      mapField('estado_inicial', 'status');
      mapField('autoridad_fiscalizadora', 'autoridad');
      mapField('vigencia_acotada', 'vigenciaAcotada');
      mapField('fecha_vencimiento', 'deadline');

      setNewCommitment(newFormValues);
      setInferredFields(newInferred);

    } catch (error) {
      alert("Error al procesar el documento con IA.");
    } finally {
      setIsLoadingAI(false);
      event.target.value = '';
    }
  };

  const getInputClass = (fieldName: string, isTextArea = false) => {
    const baseClass = `w-full bg-background-dark border rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-all ${isTextArea ? 'min-h-[100px]' : ''} `;
    if (inferredFields[fieldName]) {
      return baseClass + "border-amber-400 focus:ring-primary shadow-[0_0_8px_rgba(251,191,36,0.3)] text-amber-50";
    }
    return baseClass + "border-border-dark focus:border-primary";
  };

  const AIHint = ({ field }: { field: string }) => {
    if (!inferredFields[field]) return null;
    return <span className="text-amber-500 text-[10px] font-bold mt-1 flex items-center gap-1">✨ Sugerencia de la IA</span>;
  };

  const gerencias = ['Todas', 'Mina', 'Planta de Procesos', 'Servicios Generales'];
  const periodos = ['Todos', '2024', '2025', '2026'];
  const statuses = ['Validado', 'En Curso', 'Pendiente', 'Atrasado'];

  const baseFiltered = useMemo(() => {
    let result = [...allCommitments];

    const canonicalCategory = Object.keys(t('commitments.categories', { lng: 'es', returnObjects: true })).find(key => t(`commitments.categories.${key}`, { lng: 'es' }) === activeCategory) || activeCategory;

    switch (canonicalCategory) {
      case "COMPROMISOS EN TRÁMITE":
        result = result.filter(c => c.status === 'En Curso' || c.status === 'Pendiente');
        break;
      case "CONTRATISTAS CON PENDIENTES":
        result = result.filter(c => c.status === 'Atrasado' || c.status === 'Pendiente');
        break;
      case "COMPROMISOS CON VIGENCIA ACOTADA":
        result = result.filter(c => c.vigenciaAcotada);
        break;
    }

    if (selectedGerencia !== 'Todas') {
      result = result.filter(c => c.gerencia === selectedGerencia);
    }

    if (selectedPeriodo !== 'Todos') {
      result = result.filter(c => c.periodo === selectedPeriodo);
    }

    return result;
  }, [allCommitments, activeCategory, selectedGerencia, selectedPeriodo, t]);

  const docsForTable = useMemo(() => {
    if (selectedStatus === t('commitments.all_status')) return baseFiltered;
    return baseFiltered.filter(c => c.status === selectedStatus);
  }, [baseFiltered, selectedStatus, t]);

  const stats = useMemo(() => ({
    total: baseFiltered.length,
    cumplidos: baseFiltered.filter(c => c.status === 'Validado').length,
    enTramite: baseFiltered.filter(c => c.status === 'En Curso').length,
    pendientes: baseFiltered.filter(c => c.status === 'Pendiente' || c.status === 'Atrasado').length,
  }), [baseFiltered]);

  const statusPieData = useMemo(() => {
    const counts: Record<string, number> = {};
    baseFiltered.forEach(c => { counts[c.status] = (counts[c.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [baseFiltered]);

  const authorityBarData = useMemo(() => {
    const aMap: Record<string, any> = {};
    baseFiltered.forEach(d => {
      const auth = d.autoridad || 'N/A';
      if (!aMap[auth]) aMap[auth] = { name: auth, total: 0 };
      aMap[auth][d.status] = (aMap[auth][d.status] || 0) + 1;
      aMap[auth].total += 1;
    });
    return Object.values(aMap).sort((a, b) => b.total - a.total);
  }, [baseFiltered]);

  const gerenciaBarData = useMemo(() => {
    const gMap: Record<string, any> = {};
    baseFiltered.forEach(d => {
      if (!gMap[d.gerencia]) gMap[d.gerencia] = { name: d.gerencia, total: 0 };
      gMap[d.gerencia][d.status] = (gMap[d.gerencia][d.status] || 0) + 1;
      gMap[d.gerencia].total += 1;
    });
    return Object.values(gMap);
  }, [baseFiltered]);

  const typeBarData = useMemo(() => {
    const tMap: Record<string, any> = {};
    baseFiltered.forEach(d => {
      const tipo = d.tipo || 'N/A';
      if (!tMap[tipo]) tMap[tipo] = { name: tipo, total: 0 };
      tMap[tipo][d.status] = (tMap[tipo][d.status] || 0) + 1;
      tMap[tipo].total += 1;
    });
    return Object.values(tMap).sort((a, b) => b.total - a.total);
  }, [baseFiltered]);

  // Tooltip Personalizado con Detalles de Registros para los Gráficos
  const CustomDetailedTooltip = ({ active, payload, label, dataField }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const itemName = label || data.name;
      const itemValue = payload.reduce((acc: number, curr: any) => acc + (curr.value || 0), 0);

      const examples = baseFiltered.filter(d => {
        if (dataField === 'status') return d.status === itemName;
        if (dataField === 'autoridad') return d.autoridad === itemName;
        if (dataField === 'gerencia') return d.gerencia === itemName;
        if (dataField === 'tipo') return d.tipo === itemName;
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
                  <span className="text-white text-[9px] font-bold truncate max-w-[180px]">{ex.description}</span>
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

  const handleSaveCommitment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommitment.id || !newCommitment.description) return;

    setAllCommitments(prev => [...prev, newCommitment]);
    setIsModalOpen(false);
    // Reset form
    setNewCommitment({
      id: '',
      description: '',
      source: '',
      responsible: '',
      deadline: '',
      status: 'Pendiente',
      area: '',
      autoridad: '',
      contratista: '',
      tipo: 'Ambiental',
      vigenciaAcotada: false,
      gerencia: 'Mina',
      periodo: '2024'
    });
    setInferredFields({});
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      <header className="p-6 pb-2">
        <div className="flex gap-2 mb-4 items-center text-sm">
          <Link to="/" className="text-text-secondary font-medium hover:text-white uppercase tracking-wider">{t('dashboard.breadcrumb_start')}</Link>
          <span className="text-text-secondary">/</span>
          <span className="text-white font-medium uppercase tracking-wider">{t('commitments.breadcrumb_commitments')}</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-white text-3xl font-black uppercase tracking-tight">{t('commitments.title')}</h2>
            <p className="text-text-secondary mt-1 text-sm italic">{t('commitments.subtitle')}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest ml-1">{t('commitments.label_gerencia')}</label>
              <select
                value={selectedGerencia}
                onChange={(e) => setSelectedGerencia(e.target.value)}
                className="bg-surface-dark border border-border-dark text-white rounded-lg px-3 py-1.5 text-xs focus:ring-primary focus:border-primary outline-none transition-all min-w-[150px] h-10 shadow-sm"
              >
                <option value="Todas">{t('dashboard.gerencias.Todas')}</option>
                <option value="Mina">{t('dashboard.gerencias.Mina')}</option>
                <option value="Planta de Procesos">{t('dashboard.gerencias.Planta de Procesos')}</option>
                <option value="Servicios Generales">{t('dashboard.gerencias.Servicios Generales')}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest ml-1">{t('commitments.label_periodo')}</label>
              <select
                value={selectedPeriodo}
                onChange={(e) => setSelectedPeriodo(e.target.value)}
                className="bg-surface-dark border border-border-dark text-white rounded-lg px-3 py-1.5 text-xs focus:ring-primary focus:border-primary outline-none transition-all min-w-[100px] h-10 shadow-sm"
              >
                <option value="Todos">{t('dashboard.gerencias.Todas')}</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 h-10 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all uppercase tracking-widest self-end"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>{t('commitments.btn_new')}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="px-6 py-4 flex-1 overflow-y-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: t('commitments.kpi_total'), val: stats.total, color: "text-white" },
            { label: t('commitments.kpi_approved'), val: stats.cumplidos, color: "text-green-500" },
            { label: t('commitments.kpi_in_progress'), val: stats.enTramite, color: "text-blue-500" },
            { label: t('commitments.kpi_pending'), val: stats.pendientes, color: "text-yellow-500" }
          ].map((stat, i) => (
            <div key={i} className="bg-surface-dark border border-border-dark p-5 rounded-xl shadow-sm">
              <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-end gap-2 mt-1">
                <p className={`${stat.color} text-2xl font-black`}>{stat.val}</p>
                <span className="text-[10px] text-text-secondary mb-1">{t('commitments.units')}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-surface-dark border border-border-dark rounded-xl p-2 shadow-lg">
          <div className="flex flex-wrap gap-1">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${activeCategory === cat
                  ? 'bg-primary text-white border-primary shadow-lg shadow-blue-500/20'
                  : 'bg-transparent text-text-secondary border-transparent hover:bg-white/5 hover:text-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-surface-dark border border-border-dark p-6 rounded-xl shadow-lg h-[380px] flex flex-col">
            <h3 className="text-white text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg icon-fill">donut_large</span>
              {t('commitments.chart_compliance')}
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={6}
                    dataKey="value"
                    label={({ name, value }) => {
                      const perc = stats.total > 0 ? ((value / stats.total) * 100).toFixed(1) : 0;
                      return `${name}: ${value} (${perc}%)`;
                    }}
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_STATUS[entry.name as keyof typeof COLORS_STATUS] || '#475569'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomDetailedTooltip dataField="status" />} />
                  <Legend verticalAlign="bottom" height={40} wrapperStyle={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: '900', color: '#92a4c9' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-surface-dark border border-border-dark p-6 rounded-xl shadow-lg h-[380px] flex flex-col">
            <h3 className="text-white text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">balance</span>
              {t('commitments.chart_authority')}
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={authorityBarData} margin={{ left: 20, right: 30 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} fontWeight="bold" width={80} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} content={<CustomDetailedTooltip dataField="autoridad" />} />
                  <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }} />
                  {Object.keys(COLORS_STATUS).map(status => (
                    <Bar key={status} dataKey={status} stackId="a" fill={COLORS_STATUS[status as keyof typeof COLORS_STATUS]} barSize={20}>
                      <LabelList dataKey={status} position="center" fill="#fff" fontSize={8} fontWeight="black"
                        formatter={(val: number) => val > 0 ? val : ''} />
                    </Bar>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-surface-dark border border-border-dark p-6 rounded-xl shadow-lg h-[380px] flex flex-col">
            <h3 className="text-white text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">stacked_bar_chart</span>
              {t('commitments.chart_management')}
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gerenciaBarData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} axisLine={false} tickLine={false} fontWeight="bold" />
                  <YAxis stroke="#94a3b8" fontSize={9} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomDetailedTooltip dataField="gerencia" />} />
                  <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }} />
                  {Object.keys(COLORS_STATUS).map(status => (
                    <Bar key={status} dataKey={status} stackId="a" fill={COLORS_STATUS[status as keyof typeof COLORS_STATUS]} barSize={45}>
                      <LabelList dataKey={status} position="center" fill="#fff" fontSize={8} fontWeight="black"
                        formatter={(val: number) => val > 0 ? val : ''} />
                    </Bar>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-surface-dark border border-border-dark p-6 rounded-xl shadow-lg h-[380px] flex flex-col">
            <h3 className="text-white text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">category</span>
              {t('commitments.chart_type')}
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeBarData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#324467" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#92a4c9" fontSize={10} tickLine={false} axisLine={false} fontWeight="bold" />
                  <YAxis stroke="#92a4c9" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomDetailedTooltip dataField="tipo" />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }} />
                  {Object.keys(COLORS_STATUS).map(status => (
                    <Bar key={status} dataKey={status} stackId="a" fill={COLORS_STATUS[status as keyof typeof COLORS_STATUS]} barSize={35}>
                      <LabelList dataKey={status} position="center" fill="#fff" fontSize={8} fontWeight="black"
                        formatter={(val: number) => val > 0 ? val : ''} />
                    </Bar>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Filtro de Estatus bajo los gráficos */}
        <div className="bg-surface-dark border border-border-dark p-4 rounded-xl shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest ml-1">{t('commitments.table_filter_status')}</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-background-dark border border-border-dark text-white rounded-lg px-3 py-1.5 text-xs focus:ring-primary outline-none min-w-[150px] h-10 shadow-sm"
              >
                <option value={t('commitments.all_status')}>{t('commitments.all_status')}</option>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-text-secondary text-[10px] font-black uppercase tracking-widest">{t('commitments.records_found')}</span>
            <span className="text-white text-lg font-black">{docsForTable.length}</span>
          </div>
        </div>

        <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-border-dark bg-surface-dark-lighter flex justify-between items-center">
            <h3 className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">list_alt</span>
              {t('common.actions')}: {activeCategory}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-background-dark/50 border-b border-border-dark text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                  <th className="p-4">{t('commitments.table_id')}</th>
                  <th className="p-4">{t('commitments.table_desc_source')}</th>
                  <th className="p-4">{t('commitments.table_responsible')}</th>
                  <th className="p-4">{t('commitments.table_period')}</th>
                  <th className="p-4">{t('commitments.table_deadline')}</th>
                  <th className="p-4">{t('commitments.table_status')}</th>
                  <th className="p-4 text-right">{t('commitments.table_sheet')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark">
                {docsForTable.length > 0 ? docsForTable.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/compromisos/${c.id}`)}
                  >
                    <td className="p-4 font-bold text-white text-xs">{c.id}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-medium leading-tight">{c.description}</span>
                        <span className="text-text-secondary text-[10px] uppercase font-bold mt-1">{c.source}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="size-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary uppercase font-black border border-primary/20">
                          {c.responsible ? c.responsible.split(' ').map(n => n[0]).join('') : '??'}
                        </div>
                        <span className="text-slate-300 text-xs font-medium">{c.responsible || i18n.language === 'en' ? 'Unassigned' : 'Sin Asignar'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] bg-background-dark px-2 py-1 rounded border border-border-dark text-slate-400 font-bold uppercase">
                        {c.periodo}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 text-xs font-medium">{c.deadline}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${c.status === 'En Curso' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        c.status === 'Validado' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          c.status === 'Atrasado' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            'bg-slate-700/50 text-slate-300 border-slate-600'
                        }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">arrow_forward_ios</span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-text-secondary text-sm italic">
                      {t('commitments.no_records')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal para Nuevo Compromiso */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm">
          <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-border-dark flex justify-between items-center bg-surface-dark-lighter">
              <h3 className="text-white font-black uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_circle</span>
                {t('commitments.modal_title')}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-text-secondary hover:text-white transition-colors">
                <span className="material-symbols-outlined">{t('common.cancel')}</span>
              </button>
            </div>
            <div className="p-8 pb-4">
              <div className="flex items-center gap-4 bg-primary/10 p-4 rounded-xl border border-primary/20">
                <div className="flex-1">
                  <h4 className="text-white text-sm font-bold flex items-center gap-2">
                    <span className="text-amber-400">✨</span> Asistente IA
                  </h4>
                  <p className="text-[#94a3b8] text-xs mt-1">Sube una RCA, EIA o Resolución para extraer los compromisos automáticamente.</p>
                </div>
                <div>
                  <input
                    type="file" id="ai-upload-commitment" className="hidden" accept=".pdf,.doc,.docx"
                    onChange={handleAutoFill} disabled={isLoadingAI}
                  />
                  <label
                    htmlFor="ai-upload-commitment"
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
            <form onSubmit={handleSaveCommitment} className="p-8 pt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* ID y Responsable */}
                <div className="space-y-2 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['id'] ? "text-amber-500" : "text-text-secondary")}>{t('commitments.modal_id')}</label>
                  <input
                    type="text" required value={newCommitment.id}
                    onChange={e => setNewCommitment({ ...newCommitment, id: e.target.value })}
                    placeholder="Ej: RCA-123"
                    className={getInputClass('id')}
                  />
                  <AIHint field="id" />
                </div>
                <div className="space-y-2 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['responsible'] ? "text-amber-500" : "text-text-secondary")}>{t('commitments.table_responsible')}</label>
                  <input
                    type="text" value={newCommitment.responsible}
                    onChange={e => setNewCommitment({ ...newCommitment, responsible: e.target.value })}
                    placeholder={i18n.language === 'en' ? "Manager Name" : "Nombre del encargado"}
                    className={getInputClass('responsible')}
                  />
                  <AIHint field="responsible" />
                </div>

                {/* Descripción (Full width) */}
                <div className="md:col-span-2 space-y-2 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['description'] ? "text-amber-500" : "text-text-secondary")}>{t('commitments.modal_desc')}</label>
                  <textarea
                    required value={newCommitment.description}
                    onChange={e => setNewCommitment({ ...newCommitment, description: e.target.value })}
                    placeholder={i18n.language === 'en' ? "Detail the regulatory obligation..." : "Detalle la obligación normativa..."}
                    className={getInputClass('description', true)}
                  />
                  <AIHint field="description" />
                </div>

                {/* Origen y Tipo */}
                <div className="space-y-2 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['source'] ? "text-amber-500" : "text-text-secondary")}>{t('commitments.modal_source')}</label>
                  <input
                    type="text" value={newCommitment.source}
                    onChange={e => setNewCommitment({ ...newCommitment, source: e.target.value })}
                    placeholder="Ej: RCA 254/2018"
                    className={getInputClass('source')}
                  />
                  <AIHint field="source" />
                </div>
                <div className="space-y-2 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['tipo'] ? "text-amber-500" : "text-text-secondary")}>{t('commitments.modal_type')}</label>
                  <select
                    value={newCommitment.tipo}
                    onChange={e => setNewCommitment({ ...newCommitment, tipo: e.target.value })}
                    className={getInputClass('tipo')}
                  >
                    {[
                      t('common.type_ambient'),
                      t('common.type_social'),
                      t('common.type_water'),
                      t('common.type_bio'),
                      t('common.type_heritage'),
                      t('common.type_normative'),
                      t('common.type_mine_safety'),
                      t('common.type_transport'),
                      t('common.type_waste')
                    ].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <AIHint field="tipo" />
                </div>

                {/* Gerencia y Periodo */}
                <div className="space-y-2 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['gerencia'] ? "text-amber-500" : "text-text-secondary")}>{t('commitments.modal_management')}</label>
                  <select
                    value={newCommitment.gerencia}
                    onChange={e => setNewCommitment({ ...newCommitment, gerencia: e.target.value })}
                    className={getInputClass('gerencia')}
                  >
                    <option value="Mina">{t('dashboard.gerencias.Mina')}</option>
                    <option value="Planta de Procesos">{t('dashboard.gerencias.Planta de Procesos')}</option>
                    <option value="Servicios Generales">{t('dashboard.gerencias.Servicios Generales')}</option>
                  </select>
                  <AIHint field="gerencia" />
                </div>
                <div className="space-y-2 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['periodo'] ? "text-amber-500" : "text-text-secondary")}>{t('commitments.modal_period')}</label>
                  <select
                    value={newCommitment.periodo}
                    onChange={e => setNewCommitment({ ...newCommitment, periodo: e.target.value })}
                    className={getInputClass('periodo')}
                  >
                    {['2023', '2024', '2025', '2026', '2027'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <AIHint field="periodo" />
                </div>

                {/* Vencimiento y Estado */}
                <div className="space-y-2 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['deadline'] ? "text-amber-500" : "text-text-secondary")}>{t('commitments.modal_deadline')}</label>
                  <input
                    type="text" value={newCommitment.deadline}
                    onChange={e => setNewCommitment({ ...newCommitment, deadline: e.target.value })}
                    placeholder={i18n.language === 'en' ? "e.g., 15 Oct 2024" : "Ej: 15 Oct 2024"}
                    className={getInputClass('deadline')}
                  />
                  <AIHint field="deadline" />
                </div>
                <div className="space-y-2 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['status'] ? "text-amber-500" : "text-text-secondary")}>{t('commitments.modal_status')}</label>
                  <select
                    value={newCommitment.status}
                    onChange={e => setNewCommitment({ ...newCommitment, status: e.target.value as any })}
                    className={getInputClass('status')}
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <AIHint field="status" />
                </div>

                {/* Detalles Adicionales */}
                <div className="space-y-2 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['area'] ? "text-amber-500" : "text-text-secondary")}>{t('commitments.modal_area')}</label>
                  <input
                    type="text" value={newCommitment.area}
                    onChange={e => setNewCommitment({ ...newCommitment, area: e.target.value })}
                    placeholder={i18n.language === 'en' ? "e.g., North Pit, Dam..." : "Ej: Rajo Norte, Tranque..."}
                    className={getInputClass('area')}
                  />
                  <AIHint field="area" />
                </div>
                <div className="space-y-2 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['autoridad'] ? "text-amber-500" : "text-text-secondary")}>{t('commitments.modal_authority')}</label>
                  <input
                    type="text" value={newCommitment.autoridad}
                    onChange={e => setNewCommitment({ ...newCommitment, autoridad: e.target.value })}
                    placeholder="Ej: SMA, DGA, SEA..."
                    className={getInputClass('autoridad')}
                  />
                  <AIHint field="autoridad" />
                </div>

                <div className="space-y-2 relative">
                  <label className={"text-[10px] font-black uppercase tracking-widest ml-1 " + (inferredFields['contratista'] ? "text-amber-500" : "text-text-secondary")}>{t('commitments.modal_contractor')}</label>
                  <input
                    type="text" value={newCommitment.contratista}
                    onChange={e => setNewCommitment({ ...newCommitment, contratista: e.target.value })}
                    placeholder="Ej: ICV, Vecchiola..."
                    className={getInputClass('contratista')}
                  />
                  <AIHint field="contratista" />
                </div>
                <div className="flex flex-col gap-1 pt-6 relative">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox" id="vigencia" checked={newCommitment.vigenciaAcotada}
                      onChange={e => setNewCommitment({ ...newCommitment, vigenciaAcotada: e.target.checked })}
                      className="size-5 rounded bg-background-dark border-border-dark text-primary focus:ring-primary"
                    />
                    <label htmlFor="vigencia" className={`text-xs font-bold uppercase tracking-tight ${inferredFields['vigenciaAcotada'] ? 'text-amber-500' : 'text-white'}`}>{t('commitments.modal_restricted')}</label>
                  </div>
                  <AIHint field="vigenciaAcotada" />
                </div>
              </div>

              <div className="pt-8 border-t border-border-dark flex justify-end gap-4">
                <button
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg border border-border-dark text-text-secondary text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-lg bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-primary-hover transition-all"
                >
                  {t('commitments.btn_save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Commitments;