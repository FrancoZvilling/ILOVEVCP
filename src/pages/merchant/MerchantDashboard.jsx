import React from 'react';
import {
  Store,
  ScanLine,
  BarChart3,
  ShieldCheck,
  User,
  Sparkles,
  Tag
} from 'lucide-react';
import MerchantQrScanner from '../../components/merchant/MerchantQrScanner';
import MerchantMetricsView from '../../components/merchant/MerchantMetricsView';
import MerchantBusinessManager from '../../components/merchant/MerchantBusinessManager';

export default function MerchantDashboard({
  merchantBusiness,
  activeTab = 'scanner',
  onTabChange,
  onSwitchToTourist,
  coupons = [],
  onValidateCoupon,
  onToggleCouponActive,
  onCreateCoupon,
  onUpdateBusiness
}) {
  const business = merchantBusiness || {
    id: 'resto-lago',
    nombre: 'Resto Lago I LOVE CARLOS PAZ',
    eslogan: 'Restaurante • Lago',
    fotos: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'],
    esPremium: true
  };

  return (
    <div className="w-full min-h-screen bg-[#0B0B0E] text-[#F5F5F7] pb-24 overflow-x-hidden select-none animate-fadeIn">
      {/* 1. Header Sticky del Comercio */}
      <header className="sticky top-0 z-30 bg-[#0B0B0E]/95 backdrop-blur-md px-5 pt-4 pb-3.5 border-b border-white/5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar / Miniatura del Local */}
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-gold-border/60 shrink-0 bg-[#141418] shadow-md">
              <img
                src={business.fotos?.[0]}
                alt={business.nombre}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LOCAL ACTIVO
                </span>
                {business.esPremium && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5D77F] text-[9px] font-bold">
                    ★ DESTACADO
                  </span>
                )}
              </div>

              <h1 className="font-serif text-base font-bold text-white truncate mt-0.5">
                {business.nombre}
              </h1>
            </div>
          </div>

          {/* Botón Rápido para Volver a Modo Turista */}
          <button
            type="button"
            onClick={onSwitchToTourist}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#141418] border border-white/10 hover:border-gold-border text-[10px] font-semibold text-gray-300 hover:text-[#F5D77F] transition-all cursor-pointer"
            title="Volver a la vista de turista"
          >
            <User className="w-3 h-3 text-[#E5C07B]" />
            <span>Turista</span>
          </button>
        </div>

        {/* Barra de Contexto Operativo (Seguridad para Staff / Mostrador) */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#141418] border border-white/5 text-[10px] text-gray-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E5C07B] shrink-0" />
            <span>Panel de Mostrador • Seguimiento operativo</span>
          </div>
          <span className="text-[#E5C07B] font-semibold">
            {activeTab === 'scanner' && 'Escáner QR'}
            {activeTab === 'metrics' && 'Métricas'}
            {activeTab === 'business' && 'Mi Local'}
          </span>
        </div>
      </header>

      {/* 2. Contenido Condicional según Pestaña Activa */}
      <div className="px-5 pt-5">
        {activeTab === 'scanner' && (
          <MerchantQrScanner
            business={business}
            coupons={coupons}
            onValidateCoupon={onValidateCoupon}
          />
        )}

        {activeTab === 'metrics' && (
          <MerchantMetricsView
            business={business}
            coupons={coupons}
          />
        )}

        {activeTab === 'business' && (
          <MerchantBusinessManager
            business={business}
            coupons={coupons}
            onToggleCouponActive={onToggleCouponActive}
            onCreateCoupon={onCreateCoupon}
            onUpdateBusiness={onUpdateBusiness}
          />
        )}
      </div>
    </div>
  );
}
