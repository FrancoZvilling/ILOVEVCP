import React from 'react';
import {
  Shield,
  BarChart3,
  Inbox,
  Store,
  MapPin,
  Calendar,
  User,
  ShieldCheck
} from 'lucide-react';
import AdminMetricsView from '../../components/admin/AdminMetricsView';
import AdminModerationView from '../../components/admin/AdminModerationView';
import AdminBusinessesView from '../../components/admin/AdminBusinessesView';
import AdminLocalitiesView from '../../components/admin/AdminLocalitiesView';
import AdminEventsView from '../../components/admin/AdminEventsView';

export default function AdminDashboard({
  activeTab = 'metrics',
  onTabChange,
  onSwitchRole,
  businesses = [],
  pendingBusinesses = [],
  coupons = [],
  localities = [],
  events = [],
  onApproveBusiness,
  onRejectBusiness,
  onToggleFeaturedBusiness,
  onTogglePauseBusiness,
  onUpdateBusiness,
  onToggleLocalityActive,
  onCreateLocality,
  onUpdateLocality,
  onCreateEvent,
  onToggleEventFeatured,
  onToggleEventActive,
  onDeleteEvent
}) {
  const totalCanjes = coupons.reduce((acc, c) => acc + (c.vecesUsado || 0), 0);

  const tabLabels = {
    metrics: 'Auditoría y Métricas',
    moderation: 'Bandeja de Moderación',
    businesses: 'Comercios & Destacados',
    localities: 'Gestor de Localidades',
    events: 'Cartelera de Eventos'
  };

  return (
    <div className="w-full min-h-screen bg-[#0B0B0E] text-[#F5F5F7] pb-24 overflow-x-hidden select-none animate-fadeIn">
      {/* 1. Header Sticky del Administrador General */}
      <header className="sticky top-0 z-30 bg-[#0B0B0E]/95 backdrop-blur-md px-5 pt-4 pb-3.5 border-b border-white/5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F5D77F] via-[#D4AF37] to-[#AA7C26] flex items-center justify-center text-[#0B0B0E] shrink-0 shadow-gold-glow/30">
              <Shield className="w-5 h-5 stroke-[2.3]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5D77F] text-[9px] font-bold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ADMIN GENERAL
                </span>
              </div>
              <h1 className="font-serif text-base font-bold text-white truncate mt-0.5">
                Backoffice I LOVE
              </h1>
            </div>
          </div>

          {/* Botones Rápidos para Alternar de Rol */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onSwitchRole && onSwitchRole('tourist')}
              className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-[#141418] border border-white/10 hover:border-gold-border text-[10px] font-semibold text-gray-300 hover:text-[#F5D77F] transition-all cursor-pointer"
              title="Ir a vista Turista"
            >
              <User className="w-3 h-3 text-[#E5C07B]" />
              <span>Turista</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchRole && onSwitchRole('merchant')}
              className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-[#141418] border border-white/10 hover:border-gold-border text-[10px] font-semibold text-gray-300 hover:text-[#F5D77F] transition-all cursor-pointer"
              title="Ir a vista Comercio"
            >
              <Store className="w-3 h-3 text-[#E5C07B]" />
              <span>Comercio</span>
            </button>
          </div>
        </div>

        {/* Barra de Contexto y Estado Global */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#141418] border border-white/5 text-[10px] text-gray-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E5C07B] shrink-0" />
            <span className="text-[#FAF6EE] font-semibold">{tabLabels[activeTab]}</span>
          </div>
          <span className="text-[#E5C07B] font-semibold">
            {businesses.length} locales • {pendingBusinesses.length} pend.
          </span>
        </div>
      </header>

      {/* 2. Contenido de la Pestaña Activa */}
      <div className="px-5 pt-5">
        {activeTab === 'metrics' && (
          <AdminMetricsView
            businesses={businesses}
            pendingBusinesses={pendingBusinesses}
            coupons={coupons}
            localities={localities}
            events={events}
            onGoToModeration={() => onTabChange && onTabChange('moderation')}
          />
        )}

        {activeTab === 'moderation' && (
          <AdminModerationView
            pendingBusinesses={pendingBusinesses}
            onApproveBusiness={onApproveBusiness}
            onRejectBusiness={onRejectBusiness}
          />
        )}

        {activeTab === 'businesses' && (
          <AdminBusinessesView
            businesses={businesses}
            coupons={coupons}
            localities={localities}
            onToggleFeatured={onToggleFeaturedBusiness}
            onTogglePauseBusiness={onTogglePauseBusiness}
            onUpdateBusiness={onUpdateBusiness}
          />
        )}

        {activeTab === 'localities' && (
          <AdminLocalitiesView
            localities={localities}
            businesses={businesses}
            onToggleLocalityActive={onToggleLocalityActive}
            onCreateLocality={onCreateLocality}
            onUpdateLocality={onUpdateLocality}
          />
        )}

        {activeTab === 'events' && (
          <AdminEventsView
            events={events}
            localities={localities}
            onCreateEvent={onCreateEvent}
            onToggleEventFeatured={onToggleEventFeatured}
            onToggleEventActive={onToggleEventActive}
            onDeleteEvent={onDeleteEvent}
          />
        )}
      </div>
    </div>
  );
}
