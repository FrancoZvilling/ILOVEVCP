import React, { useState } from 'react';
import {
  BarChart3,
  QrCode,
  Store,
  Users,
  MapPin,
  Search,
  X,
  TrendingUp,
  Eye,
  Navigation,
  MessageCircle,
  Tag,
  ChevronRight,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Award,
  Inbox
} from 'lucide-react';

// Base histórica simulada por comercio para enriquecer los datos en tiempo real
const STORE_BASELINE_METRICS = {
  'resto-lago': {
    monthCanjesBase: 140,
    weekCanjesBase: 32,
    todayCanjesBase: 4,
    vistasMonth: 3280,
    comoLlegarMonth: 890,
    whatsappMonth: 245,
    guardadosMonth: 430,
    extraHistory: [
      { id: 'h-rl-1', cliente: 'María Gómez', fecha: 'Ayer - 22:10 hs', descuento: '20% OFF', titulo: '20% OFF en Gastronomía', codigo: 'LAGO-20-8912' },
      { id: 'h-rl-2', cliente: 'Carlos Méndez', fecha: 'Ayer - 20:45 hs', descuento: '20% OFF', titulo: '20% OFF en Gastronomía', codigo: 'LAGO-20-8912' }
    ]
  },
  'las-olivas': {
    monthCanjesBase: 95,
    weekCanjesBase: 23,
    todayCanjesBase: 3,
    vistasMonth: 2190,
    comoLlegarMonth: 610,
    whatsappMonth: 178,
    guardadosMonth: 295,
    extraHistory: [
      { id: 'h-lo-1', cliente: 'Sofía Peralta', fecha: 'Ayer - 21:30 hs', descuento: '30% OFF', titulo: '30% OFF en Pizzas a la Leña', codigo: 'OLIVAS-30-7421' }
    ]
  },
  'spa-relax': {
    monthCanjesBase: 64,
    weekCanjesBase: 16,
    todayCanjesBase: 2,
    vistasMonth: 1740,
    comoLlegarMonth: 420,
    whatsappMonth: 195,
    guardadosMonth: 310,
    extraHistory: [
      { id: 'h-sr-1', cliente: 'Valeria Rossi', fecha: '04/11/2026 - 16:00 hs', descuento: '2x1', titulo: '2x1 en Circuito Hídrico', codigo: 'SPA-2X1-9931' }
    ]
  },
  'kayak-lago': {
    monthCanjesBase: 41,
    weekCanjesBase: 11,
    todayCanjesBase: 1,
    vistasMonth: 1260,
    comoLlegarMonth: 340,
    whatsappMonth: 112,
    guardadosMonth: 175,
    extraHistory: [
      { id: 'h-kl-1', cliente: 'Martín Acosta', fecha: '02/11/2026 - 11:20 hs', descuento: '20% OFF', titulo: '20% OFF en Paseo Guiado', codigo: 'KAYAK-20-4102' }
    ]
  }
};

export default function AdminMetricsView({
  businesses = [],
  pendingBusinesses = [],
  coupons = [],
  localities = [],
  events = [],
  onGoToModeration
}) {
  const [period, setPeriod] = useState('month'); // 'today' | 'week' | 'month' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [inspectedBusiness, setInspectedBusiness] = useState(null);
  const [copiedReport, setCopiedReport] = useState(false);

  // Multiplicador de escala según período para vistas y rutas
  const periodFactor = {
    today: 0.05,
    week: 0.26,
    month: 1,
    all: 3.4
  }[period];

  const periodLabels = {
    today: 'Hoy',
    week: 'Últimos 7 días',
    month: 'Este mes',
    all: 'Histórico total'
  };

  // Cálculo enriquecido de métricas por cada comercio específico
  const enrichedBusinesses = businesses.map((biz) => {
    const storeCoupons = coupons.filter((c) => c.comercioId === biz.id);
    const liveCouponsUsed = storeCoupons.reduce((acc, c) => acc + (c.vecesUsado || 0), 0);
    const baseline = STORE_BASELINE_METRICS[biz.id] || {
      monthCanjesBase: 0,
      weekCanjesBase: 0,
      todayCanjesBase: 0,
      vistasMonth: 120,
      comoLlegarMonth: 35,
      whatsappMonth: 14,
      guardadosMonth: 18,
      extraHistory: []
    };

    const baseCanjesForPeriod =
      period === 'today'
        ? baseline.todayCanjesBase
        : period === 'week'
        ? baseline.weekCanjesBase
        : period === 'month'
        ? baseline.monthCanjesBase
        : Math.round(baseline.monthCanjesBase * 3.4);

    const totalCanjesStore = baseCanjesForPeriod + liveCouponsUsed;
    const vistas = Math.max(1, Math.round(baseline.vistasMonth * periodFactor));
    const comoLlegar = Math.max(0, Math.round(baseline.comoLlegarMonth * periodFactor));
    const whatsapp = Math.max(0, Math.round(baseline.whatsappMonth * periodFactor));
    const guardados = Math.max(0, Math.round(baseline.guardadosMonth * periodFactor));
    const conversionPct = Math.min(99, ((totalCanjesStore / vistas) * 100)).toFixed(1);

    // Historial combinado (canjes en vivo + base del comercio)
    const liveHistory = storeCoupons.flatMap((c) =>
      (c.historialCanjes || []).map((h) => ({
        ...h,
        cliente: 'Juan Pérez',
        descuento: c.descuento,
        titulo: c.titulo,
        codigo: c.codigo,
        isLive: true
      }))
    );

    return {
      ...biz,
      storeCoupons,
      liveCouponsUsed,
      totalCanjesStore,
      vistas,
      comoLlegar,
      whatsapp,
      guardados,
      conversionPct,
      auditHistory: [...liveHistory, ...baseline.extraHistory]
    };
  }).sort((a, b) => b.totalCanjesStore - a.totalCanjesStore);

  // Totales globales de toda la red
  const globalTotalCanjes = enrichedBusinesses.reduce((acc, b) => acc + b.totalCanjesStore, 0);
  const globalTotalVistas = enrichedBusinesses.reduce((acc, b) => acc + b.vistas, 0);
  const globalTotalRutas = enrichedBusinesses.reduce((acc, b) => acc + b.comoLlegar, 0);
  const activeLocalitiesCount = localities.filter((l) => l.activa !== false).length;

  // Filtrado del listado de seguimiento por comercio
  const filteredStores = enrichedBusinesses.filter((biz) => {
    const matchesCat = selectedCategory === 'all' || biz.categoriaId === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      biz.nombre?.toLowerCase().includes(q) ||
      biz.eslogan?.toLowerCase().includes(q) ||
      biz.direccion?.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  // Comercio actualmente inspeccionado en el Drill-Down (actualizado en vivo)
  const activeInspected = inspectedBusiness
    ? enrichedBusinesses.find((b) => b.id === inspectedBusiness.id) || inspectedBusiness
    : null;

  const handleCopyCommercialReport = (biz) => {
    const reportText = `📊 Reporte I LOVE CARLOS PAZ - ${biz.nombre} (${periodLabels[period]}):\n• Cupones QR Canjeados: ${biz.totalCanjesStore}\n• Vistas de Ficha: ${biz.vistas}\n• Derivaciones a Maps: ${biz.comoLlegar}\n• Consultas WhatsApp: ${biz.whatsapp}`;
    navigator.clipboard?.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* ========================================================
          VISTA DRILL-DOWN: AUDITORÍA PROFUNDA DE UN LOCAL ESPECÍFICO
         ======================================================== */}
      {activeInspected ? (
        <div className="space-y-4 animate-fadeIn">
          {/* Barra superior para volver al ranking general */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setInspectedBusiness(null)}
              className="px-3 py-1.5 rounded-xl bg-[#141418] border border-white/10 hover:border-gold-border text-xs font-semibold text-[#E5C07B] flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>← Volver al listado general</span>
            </button>
            <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5D77F] text-[10px] font-bold">
              {periodLabels[period]}
            </span>
          </div>

          {/* Cabecera del Local Auditado */}
          <div className="bg-gradient-to-br from-[#1C1A14] via-[#141418] to-[#121216] border border-gold-border/60 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <img
                src={activeInspected.fotos?.[0]}
                alt={activeInspected.nombre}
                className="w-16 h-16 rounded-2xl object-cover border border-white/10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold uppercase">
                    ACTIVO
                  </span>
                  {activeInspected.esPremium && (
                    <span className="px-2 py-0.5 rounded bg-[#D4AF37] text-[#0B0B0E] text-[9px] font-black uppercase">
                      ★ DESTACADO
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-lg font-bold text-white truncate mt-1">
                  {activeInspected.nombre}
                </h2>
                <p className="text-[11px] text-gray-400 truncate">
                  {activeInspected.direccion}
                </p>
              </div>
            </div>

            {/* Métrica Protagonista: Total de Cupones Usados por este Local */}
            <div className="p-4 rounded-2xl bg-[#0B0B0E]/90 border border-[#D4AF37]/50 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#E5C07B] font-bold block">
                  Cupones Usados en este Local
                </span>
                <span className="text-[11px] text-gray-400">
                  Clientes verificados con QR ({periodLabels[period]})
                </span>
              </div>
              <div className="text-right">
                <span className="font-serif text-3xl font-black text-[#F5D77F] leading-none">
                  {activeInspected.totalCanjesStore}
                </span>
                <span className="block text-[9px] text-emerald-400 font-bold mt-0.5">
                  {activeInspected.liveCouponsUsed} en sesión actual
                </span>
              </div>
            </div>

            {/* Sub-KPIs de Tracción del Local */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-[#0B0B0E]/70 border border-white/5">
                <div className="font-bold text-sm text-white">
                  {activeInspected.vistas.toLocaleString('es-AR')}
                </div>
                <div className="text-[9px] text-gray-400 mt-0.5">Vistas Ficha</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-[#0B0B0E]/70 border border-white/5">
                <div className="font-bold text-sm text-[#E5C07B]">
                  {activeInspected.comoLlegar}
                </div>
                <div className="text-[9px] text-gray-400 mt-0.5">Rutas Maps</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-[#0B0B0E]/70 border border-white/5">
                <div className="font-bold text-sm text-emerald-400">
                  {activeInspected.whatsapp}
                </div>
                <div className="text-[9px] text-gray-400 mt-0.5">Clics WhatsApp</div>
              </div>
            </div>

            {/* Botón Copiar Reporte Comercial para Negociar Convenio */}
            <button
              type="button"
              onClick={() => handleCopyCommercialReport(activeInspected)}
              className="w-full py-3 rounded-2xl bg-gold-gradient text-[#0B0B0E] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow/30 hover:brightness-105 cursor-pointer transition-all"
            >
              {copiedReport ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Reporte Copiado al Portapapeles</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Reporte Comercial para Convenio</span>
                </>
              )}
            </button>
          </div>

          {/* Desglose por Cada Cupón / Promoción del Local */}
          <div className="bg-[#141418] border border-white/5 rounded-3xl p-4 space-y-3 shadow-lg">
            <h3 className="text-xs uppercase tracking-wider text-[#C9A66B] font-bold flex items-center gap-1.5 pb-2 border-b border-white/5">
              <Tag className="w-3.5 h-3.5 text-[#E5C07B]" />
              <span>Desglose por Cupón del Local ({activeInspected.storeCoupons.length})</span>
            </h3>

            {activeInspected.storeCoupons.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-3">
                Este comercio no tiene cupones cargados actualmente.
              </p>
            ) : (
              <div className="space-y-2.5">
                {activeInspected.storeCoupons.map((c) => {
                  const isActive = c.activa !== false;
                  // Distribución proporcional o canjes reales del cupón
                  const couponUses =
                    activeInspected.storeCoupons.length === 1
                      ? activeInspected.totalCanjesStore
                      : (c.vecesUsado || 0);
                  return (
                    <div
                      key={c.id}
                      className="p-3 rounded-2xl bg-[#0B0B0E] border border-white/5 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-[#D4AF37] text-[#0B0B0E] text-[9px] font-black">
                            {c.descuento}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            isActive ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-500 bg-white/5'
                          }`}>
                            {isActive ? 'ACTIVA' : 'PAUSADA'}
                          </span>
                          <span className="font-mono text-[10px] text-gray-500">
                            {c.codigo}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-white truncate mt-1">
                          {c.titulo}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-[#F5D77F]">
                          {couponUses}
                        </span>
                        <span className="block text-[9px] text-gray-400">
                          usos
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bitácora de Clientes Llevados a este Local */}
          <div className="bg-[#141418] border border-white/5 rounded-3xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="text-xs uppercase tracking-wider text-[#C9A66B] font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#E5C07B]" />
                <span>Últimos Clientes Verificados</span>
              </h3>
              <span className="text-[10px] text-gray-400">
                {activeInspected.auditHistory.length} registros
              </span>
            </div>

            {activeInspected.auditHistory.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-3">
                Sin canjes registrados todavía para este local.
              </p>
            ) : (
              <div className="space-y-2">
                {activeInspected.auditHistory.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-[#0B0B0E] border border-white/5 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 text-[10px] font-bold">
                        ✓
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-white flex items-center gap-1.5 truncate">
                          <span>{item.cliente}</span>
                          <span className="px-1.5 py-0.2 rounded bg-[#D4AF37]/20 text-[#F5D77F] text-[9px] font-bold">
                            {item.descuento}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 truncate">
                          {item.fecha}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 shrink-0 pl-2">
                      #{item.codigo?.split('-').pop() || 'QR'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ========================================================
            VISTA GENERAL: MÉTRICAS GLOBALES Y RANKING POR COMERCIO
           ======================================================== */
        <>
          {/* 1. Selector de Período Temporal */}
          <div className="grid grid-cols-4 p-1 rounded-2xl bg-[#141418] border border-white/10 shadow-inner">
            {[
              { id: 'today', label: 'Hoy' },
              { id: 'week', label: '7 Días' },
              { id: 'month', label: 'Mes' },
              { id: 'all', label: 'Total' }
            ].map((item) => {
              const isActive = period === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPeriod(item.id)}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* 2. KPIs Globales de Toda la Plataforma */}
          <div className="grid grid-cols-2 gap-3">
            {/* KPI 1: Total Cupones Canjeados en Red */}
            <div className="bg-gradient-to-br from-[#1C1A14] via-[#141418] to-[#121216] border border-gold-border/60 rounded-3xl p-4 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#F5D77F]">
                  <QrCode className="w-4 h-4" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[9px] font-extrabold flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" />
                  En vivo
                </span>
              </div>
              <div>
                <div className="font-serif text-2xl font-black text-white leading-none">
                  {globalTotalCanjes.toLocaleString('es-AR')}
                </div>
                <p className="text-[11px] text-[#E5C07B] font-semibold mt-1">
                  Cupones Usados (Red)
                </p>
                <p className="text-[9px] text-gray-400">
                  Suma de todos los locales
                </p>
              </div>
            </div>

            {/* KPI 2: Comercios Activos y Pendientes */}
            <div
              onClick={() => pendingBusinesses.length > 0 && onGoToModeration && onGoToModeration()}
              className="bg-[#141418] border border-white/5 hover:border-gold-border/50 rounded-3xl p-4 space-y-2 shadow-lg cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E5C07B]">
                  <Store className="w-4 h-4" />
                </div>
                {pendingBusinesses.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[9px] font-extrabold">
                    {pendingBusinesses.length} pend.
                  </span>
                )}
              </div>
              <div>
                <div className="font-serif text-2xl font-black text-white leading-none">
                  {businesses.length}
                </div>
                <p className="text-[11px] text-gray-200 font-semibold mt-1">
                  Locales Activos
                </p>
                <p className="text-[9px] text-gray-400">
                  En {activeLocalitiesCount} {activeLocalitiesCount === 1 ? 'localidad' : 'localidades'}
                </p>
              </div>
            </div>

            {/* KPI 3: Vistas de Fichas en la App */}
            <div className="bg-[#141418] border border-white/5 rounded-3xl p-4 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E5C07B]">
                  <Eye className="w-4 h-4" />
                </div>
                <span className="text-[9px] text-gray-400 font-semibold">
                  {periodLabels[period]}
                </span>
              </div>
              <div>
                <div className="font-serif text-2xl font-black text-white leading-none">
                  {globalTotalVistas.toLocaleString('es-AR')}
                </div>
                <p className="text-[11px] text-gray-200 font-semibold mt-1">
                  Vistas a Locales
                </p>
                <p className="text-[9px] text-gray-400">
                  Tráfico total en la guía
                </p>
              </div>
            </div>

            {/* KPI 4: Derivaciones a Google Maps */}
            <div className="bg-[#141418] border border-white/5 rounded-3xl p-4 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E5C07B]">
                  <Navigation className="w-4 h-4" />
                </div>
                <span className="text-[9px] text-[#E5C07B] font-semibold">
                  GPS / Rutas
                </span>
              </div>
              <div>
                <div className="font-serif text-2xl font-black text-white leading-none">
                  {globalTotalRutas.toLocaleString('es-AR')}
                </div>
                <p className="text-[11px] text-gray-200 font-semibold mt-1">
                  Clics "Cómo llegar"
                </p>
                <p className="text-[9px] text-gray-400">
                  Clientes enviados a locales
                </p>
              </div>
            </div>
          </div>

          {/* 3. Sección Principal: Seguimiento de Cupones por Cada Local Específico */}
          <section className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#C9A66B] font-bold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#F5D77F]" />
                  <span>Uso de Cupones por Local ({filteredStores.length})</span>
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Tocá cualquier comercio para auditar sus cupones y clientes
                </p>
              </div>
            </div>

            {/* Buscador Rápido de Local */}
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-3.5 h-3.5 text-[#E5C07B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar local específico (Ej. Resto Lago, Las Olivas)..."
                className="w-full bg-[#141418] border border-white/10 focus:border-[#D4AF37] rounded-2xl py-2.5 pl-9 pr-9 text-xs text-white placeholder-gray-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Filtro Rápido por Rubro */}
            <div className="flex gap-1.5 overflow-x-auto pt-1 pb-1.5 scrollbar-none">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'gastronomia', label: 'Gastronomía' },
                { id: 'experiencias', label: 'Experiencias' },
                { id: 'relax', label: 'Spa & Relax' }
              ].map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#D4AF37]/25 border border-[#D4AF37] text-[#F5D77F] font-bold'
                        : 'bg-[#141418] border border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Tarjetas de Seguimiento Individual por Comercio */}
            <div className="space-y-3">
              {filteredStores.map((biz, index) => (
                <div
                  key={biz.id}
                  onClick={() => setInspectedBusiness(biz)}
                  className="group bg-[#141418] border border-white/5 hover:border-gold-border/70 rounded-3xl p-4 space-y-3 shadow-lg transition-all cursor-pointer hover:shadow-gold-glow/15"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Posición en Ranking + Foto */}
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-white/10 bg-[#0B0B0E]">
                        <img
                          src={biz.fotos?.[0]}
                          alt={biz.nombre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-md bg-black/85 text-[#F5D77F] text-[9px] font-black flex items-center justify-center border border-[#D4AF37]/40">
                          {index + 1}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-white truncate group-hover:text-[#F5D77F] transition-colors">
                            {biz.nombre}
                          </h4>
                          {biz.esPremium && (
                            <span className="shrink-0 text-[8px] font-black px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#F5D77F] border border-[#D4AF37]/40">
                              ★
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">
                          {biz.eslogan} • {biz.storeCoupons.length} {biz.storeCoupons.length === 1 ? 'promo' : 'promos'}
                        </p>
                      </div>
                    </div>

                    {/* Contador Protagonista de Cupones Usados por este Local */}
                    <div className="shrink-0 text-right px-3 py-1.5 rounded-2xl bg-gradient-to-br from-[#201C12] to-[#121216] border border-[#D4AF37]/50">
                      <div className="font-serif text-lg font-black text-[#F5D77F] leading-none">
                        {biz.totalCanjesStore}
                      </div>
                      <span className="text-[9px] font-bold text-[#E5C07B] uppercase tracking-wider">
                        Cupones
                      </span>
                    </div>
                  </div>

                  {/* Barra Inferior de Métricas del Local */}
                  <div className="grid grid-cols-4 gap-1.5 pt-2.5 border-t border-white/5 text-center text-[10px]">
                    <div className="bg-[#0B0B0E] rounded-xl py-1.5 px-1">
                      <span className="text-gray-400 block text-[9px]">Vistas</span>
                      <span className="font-bold text-white">{biz.vistas}</span>
                    </div>
                    <div className="bg-[#0B0B0E] rounded-xl py-1.5 px-1">
                      <span className="text-gray-400 block text-[9px]">Maps</span>
                      <span className="font-bold text-[#E5C07B]">{biz.comoLlegar}</span>
                    </div>
                    <div className="bg-[#0B0B0E] rounded-xl py-1.5 px-1">
                      <span className="text-gray-400 block text-[9px]">WhatsApp</span>
                      <span className="font-bold text-emerald-400">{biz.whatsapp}</span>
                    </div>
                    <div className="bg-[#0B0B0E] rounded-xl py-1.5 px-1 flex flex-col items-center justify-center">
                      <span className="text-[#F5D77F] font-bold flex items-center gap-0.5 text-[10px]">
                        <span>Auditar</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
