import React, { useState } from 'react';
import {
  QrCode,
  Eye,
  Navigation,
  Heart,
  MessageCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  Flame,
  Users,
  ShieldCheck,
  Tag
} from 'lucide-react';

export default function MerchantMetricsView({ business, coupons = [] }) {
  const [period, setPeriod] = useState('week'); // 'today' | 'week' | 'month' | 'all'
  const [selectedDayIndex, setSelectedDayIndex] = useState(5); // Sábado destacado por defecto

  // Cupones pertenecientes a este local
  const businessCoupons = coupons.filter((c) => c.comercioId === business?.id);

  // Canjes registrados en tiempo real durante la sesión (empieza en 2 para Resto Lago)
  const sessionScans = businessCoupons.reduce((acc, c) => acc + (c.vecesUsado || 0), 0);
  // Diferencia respecto al baseline inicial (2) para reflejar escaneos en vivo
  const extraLiveScans = Math.max(0, sessionScans - 2);

  // Datos operativos simulados según período seleccionado (Cero datos financieros/dinero)
  const periodStats = {
    today: {
      label: 'Hoy',
      canjes: 6 + extraLiveScans,
      trend: '+20%',
      vistas: 148,
      comoLlegar: 39,
      whatsapp: 14,
      guardados: 22
    },
    week: {
      label: 'Esta semana',
      canjes: 34 + extraLiveScans,
      trend: '+18%',
      vistas: 842,
      comoLlegar: 215,
      whatsapp: 64,
      guardados: 112
    },
    month: {
      label: 'Este mes',
      canjes: 142 + extraLiveScans,
      trend: '+24%',
      vistas: 3280,
      comoLlegar: 890,
      whatsapp: 245,
      guardados: 430
    },
    all: {
      label: 'Histórico',
      canjes: 486 + extraLiveScans,
      trend: 'Temporada',
      vistas: 11420,
      comoLlegar: 2940,
      whatsapp: 812,
      guardados: 1290
    }
  };

  const currentStats = periodStats[period];

  // Desglose por día de la semana para gráfico operativo
  const weeklyActivity = [
    { day: 'Lun', count: 3, label: 'Lunes' },
    { day: 'Mar', count: 4, label: 'Martes' },
    { day: 'Mié', count: 5, label: 'Miércoles' },
    { day: 'Jue', count: 6, label: 'Jueves' },
    { day: 'Vie', count: 9, label: 'Viernes' },
    { day: 'Sáb', count: 12 + extraLiveScans, label: 'Sábado' },
    { day: 'Dom', count: 8, label: 'Domingo' }
  ];

  const maxDayCount = Math.max(...weeklyActivity.map((d) => d.count), 1);

  // Rendimiento por promoción (combinando cupones reales del comercio + referencia operativa)
  const promoPerformance = [
    {
      id: businessCoupons[0]?.id || 'promo-resto-lago',
      titulo: businessCoupons[0]?.titulo || '20% OFF en Gastronomía',
      descuento: businessCoupons[0]?.descuento || '20% OFF',
      codigo: businessCoupons[0]?.codigo || 'LAGO-20-8912',
      usos: 84 + extraLiveScans,
      activa: true
    },
    {
      id: 'promo-secundaria-demo',
      titulo: 'Copa de Bienvenida / Postre Cortesía',
      descuento: 'GIFT',
      codigo: 'LAGO-GIFT-01',
      usos: 58,
      activa: true
    }
  ];

  const totalPromoUsos = promoPerformance.reduce((acc, p) => acc + p.usos, 0);

  // Bitácora unificada (canjes en vivo arriba + historial reciente de muestra)
  const liveLogs = businessCoupons.flatMap((c) =>
    (c.historialCanjes || []).map((h) => ({
      ...h,
      cliente: 'Juan Pérez',
      descuento: c.descuento,
      titulo: c.titulo,
      codigo: c.codigo,
      isLive: true
    }))
  );

  const staticRecentLogs = [
    { id: 'log-a', cliente: 'María Gómez', fecha: 'Ayer - 22:10 hs', descuento: '20% OFF', titulo: '20% OFF en Gastronomía', codigo: 'LAGO-20-8912' },
    { id: 'log-b', cliente: 'Carlos Méndez', fecha: 'Ayer - 20:45 hs', descuento: 'GIFT', titulo: 'Copa de Bienvenida', codigo: 'LAGO-GIFT-01' },
    { id: 'log-c', cliente: 'Lucía Fernández', fecha: '03/11/2026 - 13:15 hs', descuento: '20% OFF', titulo: '20% OFF en Gastronomía', codigo: 'LAGO-20-8912' }
  ];

  const allLogs = [...liveLogs, ...staticRecentLogs];

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. Selector de Período Temporal */}
      <div className="grid grid-cols-4 p-1 rounded-2xl bg-[#141418] border border-white/10 shadow-inner">
        {[
          { id: 'today', label: 'Hoy' },
          { id: 'week', label: 'Semana' },
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

      {/* 2. KPIs Principales de Seguimiento (Sin Montos ni Datos Sensibles) */}
      <div className="grid grid-cols-2 gap-3">
        {/* KPI 1: Cupones Canjeados (Conectado en vivo) */}
        <div className="bg-gradient-to-br from-[#1C1A14] via-[#141418] to-[#121216] border border-gold-border/60 rounded-3xl p-4 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#F5D77F]">
              <QrCode className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[9px] font-extrabold flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" />
              {currentStats.trend}
            </span>
          </div>
          <div>
            <div className="font-serif text-2xl font-black text-white leading-none">
              {currentStats.canjes}
            </div>
            <p className="text-[11px] text-[#E5C07B] font-semibold mt-1">
              Cupones Canjeados
            </p>
            <p className="text-[9px] text-gray-400">
              Visitas verificadas en caja
            </p>
          </div>
        </div>

        {/* KPI 2: Visualizaciones en Guía */}
        <div className="bg-[#141418] border border-white/5 rounded-3xl p-4 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E5C07B]">
              <Eye className="w-4 h-4" />
            </div>
            <span className="text-[9px] text-gray-400 font-semibold">
              {currentStats.label}
            </span>
          </div>
          <div>
            <div className="font-serif text-2xl font-black text-white leading-none">
              {currentStats.vistas.toLocaleString('es-AR')}
            </div>
            <p className="text-[11px] text-gray-200 font-semibold mt-1">
              Vistas de Ficha
            </p>
            <p className="text-[9px] text-gray-400">
              Turistas viendo tu local
            </p>
          </div>
        </div>

        {/* KPI 3: Clics en "Cómo llegar" */}
        <div className="bg-[#141418] border border-white/5 rounded-3xl p-4 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E5C07B]">
              <Navigation className="w-4 h-4" />
            </div>
            <span className="text-[9px] text-[#E5C07B] font-semibold">
              Maps / Radar
            </span>
          </div>
          <div>
            <div className="font-serif text-2xl font-black text-white leading-none">
              {currentStats.comoLlegar}
            </div>
            <p className="text-[11px] text-gray-200 font-semibold mt-1">
              Solicitudes de Ruta
            </p>
            <p className="text-[9px] text-gray-400">
              Tocaron "Cómo llegar"
            </p>
          </div>
        </div>

        {/* KPI 4: Guardados y WhatsApp */}
        <div className="bg-[#141418] border border-white/5 rounded-3xl p-4 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-400">
              <Heart className="w-4 h-4 fill-red-400/20" />
            </div>
            <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5">
              <MessageCircle className="w-2.5 h-2.5" />
              {currentStats.whatsapp} WA
            </span>
          </div>
          <div>
            <div className="font-serif text-2xl font-black text-white leading-none">
              {currentStats.guardados}
            </div>
            <p className="text-[11px] text-gray-200 font-semibold mt-1">
              Locales Guardados
            </p>
            <p className="text-[9px] text-gray-400">
              Favoritos + clics WhatsApp
            </p>
          </div>
        </div>
      </div>

      {/* 3. Desglose por Promoción Activa */}
      <div className="bg-[#141418] border border-white/5 rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-lg">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <h3 className="text-xs uppercase tracking-wider text-[#C9A66B] font-bold flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#E5C07B]" />
            <span>Uso por Promoción</span>
          </h3>
          <span className="text-[10px] text-gray-400">
            {totalPromoUsos} canjes acumulados
          </span>
        </div>

        <div className="space-y-3">
          {promoPerformance.map((promo) => {
            const pct = Math.round((promo.usos / totalPromoUsos) * 100);
            return (
              <div key={promo.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="px-1.5 py-0.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5D77F] text-[9px] font-black shrink-0">
                      {promo.descuento}
                    </span>
                    <span className="font-semibold text-white truncate">
                      {promo.titulo}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#F5D77F] shrink-0">
                    {promo.usos} usos ({pct}%)
                  </span>
                </div>

                {/* Barra de progreso dorada */}
                <div className="w-full h-2 rounded-full bg-[#0B0B0E] overflow-hidden border border-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Afluencia por Días y Horarios Pico (Gráfico Operativo) */}
      <div className="bg-[#141418] border border-white/5 rounded-3xl p-4 sm:p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs uppercase tracking-wider text-[#C9A66B] font-bold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#F5D77F]" />
              <span>Afluencia Semanal (Canjes)</span>
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Tocá una barra para ver el detalle diario
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F5D77F] text-[10px] font-bold">
            {weeklyActivity[selectedDayIndex].label}: {weeklyActivity[selectedDayIndex].count}
          </span>
        </div>

        {/* Gráfico de Barras Semanal */}
        <div className="flex items-end justify-between gap-2 h-28 pt-3 px-1">
          {weeklyActivity.map((item, idx) => {
            const heightPct = Math.max(18, Math.round((item.count / maxDayCount) * 100));
            const isSelected = selectedDayIndex === idx;
            return (
              <button
                key={item.day}
                type="button"
                onClick={() => setSelectedDayIndex(idx)}
                className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end cursor-pointer group"
              >
                <span className={`text-[9px] font-bold transition-colors ${
                  isSelected ? 'text-[#F5D77F]' : 'text-gray-500 group-hover:text-gray-300'
                }`}>
                  {item.count}
                </span>
                <div className="w-full flex-1 flex items-end justify-center">
                  <div
                    className={`w-full max-w-[26px] rounded-t-xl transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-t from-[#B8860B] via-[#D4AF37] to-[#F5D77F] shadow-[0_0_12px_rgba(212,175,55,0.45)]'
                        : 'bg-white/10 group-hover:bg-white/20'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className={`text-[10px] font-semibold ${
                  isSelected ? 'text-white' : 'text-gray-400'
                }`}>
                  {item.day}
                </span>
              </button>
            );
          })}
        </div>

        {/* Insights de Horarios Pico para el Staff */}
        <div className="p-3 rounded-2xl bg-[#0B0B0E] border border-white/5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#F5D77F]">
            <Clock className="w-3.5 h-3.5" />
            <span>Franjas Horarias de Mayor Demanda</span>
          </div>
          <p className="text-[11px] text-gray-300 leading-relaxed">
            • Pico nocturno: <strong className="text-white">Vie y Sáb 20:30 – 23:00 hs</strong><br />
            • Segundo pico: <strong className="text-white">Domingos 12:30 – 14:30 hs</strong>
          </p>
        </div>
      </div>

      {/* 5. Embudo de Atracción desde la App */}
      <div className="bg-[#141418] border border-white/5 rounded-3xl p-4 sm:p-5 space-y-3 shadow-lg">
        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
          <Users className="w-4 h-4 text-[#E5C07B]" />
          <h3 className="text-xs uppercase tracking-wider text-[#C9A66B] font-bold">
            Conversión de Turistas en la App
          </h3>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0B0B0E] border border-white/5">
            <span className="text-gray-300">1. Descubrieron el local (Home / Mapa)</span>
            <span className="font-bold text-white">{currentStats.vistas}</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0B0B0E] border border-white/5">
            <span className="text-gray-300">2. Pidieron ruta o WhatsApp</span>
            <span className="font-bold text-[#E5C07B]">{currentStats.comoLlegar + currentStats.whatsapp}</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1C1A14] border border-[#D4AF37]/40">
            <span className="text-[#FAF6EE] font-semibold">3. Canjearon QR presencialmente</span>
            <span className="font-extrabold text-[#F5D77F]">{currentStats.canjes}</span>
          </div>
        </div>
      </div>

      {/* 6. Bitácora Completa de Canjes Verificados */}
      <div className="bg-[#141418] border border-white/5 rounded-3xl p-4 sm:p-5 space-y-3 shadow-lg">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <h3 className="text-xs uppercase tracking-wider text-[#C9A66B] font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Registro Histórico de Canjes</span>
          </h3>
          <span className="text-[10px] text-gray-400">
            Solo verificación
          </span>
        </div>

        <div className="space-y-2">
          {allLogs.map((log, idx) => (
            <div
              key={log.id || idx}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#0B0B0E] border border-white/5 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-[10px]">
                  ✓
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-white flex items-center gap-1.5 truncate">
                    <span>{log.cliente}</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#D4AF37]/20 text-[#F5D77F] text-[9px] font-bold">
                      {log.descuento}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate">
                    {log.titulo} • {log.fecha}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-gray-500 shrink-0 pl-2">
                #{log.codigo?.split('-').pop() || 'OK'}
              </span>
            </div>
          ))}
        </div>

        {/* Nota de privacidad operativa */}
        <div className="flex items-center gap-2 pt-2 text-[10px] text-gray-500 justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-[#E5C07B]" />
          <span>Panel operativo sin exposición de montos ni información contable.</span>
        </div>
      </div>
    </div>
  );
}
