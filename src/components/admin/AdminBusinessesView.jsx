import React, { useState } from 'react';
import {
  Store,
  Star,
  Search,
  X,
  MapPin,
  Tag,
  Clock,
  Phone,
  Pencil,
  Save,
  CheckCircle2,
  Sparkles,
  QrCode
} from 'lucide-react';
import { categoriasMock } from '../../data/mocks/categorias';

export default function AdminBusinessesView({
  businesses = [],
  coupons = [],
  localities = [],
  onToggleFeatured,
  onTogglePauseBusiness,
  onUpdateBusiness
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'featured' | 'standard' | 'paused'
  const [editingBizId, setEditingBizId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const featuredCount = businesses.filter((b) => b.esPremium).length;
  const pausedCount = businesses.filter((b) => b.estado === 'pausado').length;
  const activeCount = businesses.length - pausedCount;

  const filteredBusinesses = businesses
    .filter((biz) => {
      if (statusFilter === 'featured' && !biz.esPremium) return false;
      if (statusFilter === 'standard' && (biz.esPremium || biz.estado === 'pausado')) return false;
      if (statusFilter === 'paused' && biz.estado !== 'pausado') return false;

      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        biz.nombre?.toLowerCase().includes(q) ||
        biz.eslogan?.toLowerCase().includes(q) ||
        biz.direccion?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (b.esPremium ? 1 : 0) - (a.esPremium ? 1 : 0));

  const handleStartEdit = (biz) => {
    if (editingBizId === biz.id) {
      setEditingBizId(null);
      return;
    }
    setEditingBizId(biz.id);
    setEditForm({
      nombre: biz.nombre || '',
      eslogan: biz.eslogan || '',
      localidadId: biz.localidadId || 'carlos-paz',
      categoriaId: biz.categoriaId || 'gastronomia',
      direccion: biz.direccion || '',
      horario: biz.horario || '',
      whatsapp: biz.whatsapp || ''
    });
  };

  const handleSaveEdit = (e, bizId) => {
    e.preventDefault();
    if (onUpdateBusiness) {
      onUpdateBusiness(bizId, editForm);
    }
    setEditingBizId(null);
    setFeedbackMsg('Datos del comercio actualizados en el directorio público.');
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const getLocalityName = (locId) => {
    return localities.find((l) => l.id === locId)?.nombre || 'Carlos Paz';
  };

  const getCategoryName = (catId) => {
    return categoriasMock.find((c) => c.id === catId)?.nombre || 'General';
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. Resumen Rápido Superior */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-[#141418] border border-white/5 rounded-2xl p-3 text-center">
          <div className="font-serif text-xl font-black text-white leading-none">
            {businesses.length}
          </div>
          <span className="text-[10px] text-gray-400 font-semibold mt-1 block">
            Total Locales
          </span>
        </div>

        <div className="bg-gradient-to-br from-[#1C1A14] to-[#141418] border border-gold-border/60 rounded-2xl p-3 text-center">
          <div className="font-serif text-xl font-black text-[#F5D77F] leading-none flex items-center justify-center gap-1">
            <Star className="w-3.5 h-3.5 fill-[#F5D77F] text-[#F5D77F]" />
            <span>{featuredCount}</span>
          </div>
          <span className="text-[10px] text-[#E5C07B] font-semibold mt-1 block">
            Destacados
          </span>
        </div>

        <div className="bg-[#141418] border border-white/5 rounded-2xl p-3 text-center">
          <div className="font-serif text-xl font-black text-emerald-400 leading-none">
            {activeCount}
          </div>
          <span className="text-[10px] text-gray-400 font-semibold mt-1 block">
            Visibles Hoy
          </span>
        </div>
      </div>

      {/* Mensaje de confirmación */}
      {feedbackMsg && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* 2. Buscador y Filtros de Estado */}
      <div className="space-y-2.5">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-3.5 h-3.5 text-[#E5C07B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar comercio por nombre o dirección..."
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

        <div className="flex gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
          {[
            { id: 'all', label: `Todos (${businesses.length})` },
            { id: 'featured', label: `★ Destacados (${featuredCount})` },
            { id: 'standard', label: 'Estándar' },
            { id: 'paused', label: `Pausados (${pausedCount})` }
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] shadow-sm'
                    : 'bg-[#141418] border border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Listado de Comercios con Control de Destacados y Edición Oficial */}
      <div className="space-y-3.5">
        {filteredBusinesses.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#141418] border border-white/5 text-center space-y-2">
            <p className="text-xs font-semibold text-gray-300">
              No hay comercios en esta vista
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="text-[11px] text-[#E5C07B] hover:underline cursor-pointer"
            >
              Ver todos los locales
            </button>
          </div>
        ) : (
          filteredBusinesses.map((biz) => {
            const isPaused = biz.estado === 'pausado';
            const isFeatured = Boolean(biz.esPremium);
            const isEditing = editingBizId === biz.id;
            const storeCoupons = coupons.filter((c) => c.comercioId === biz.id);

            return (
              <div
                key={biz.id}
                className={`rounded-3xl p-4 border transition-all space-y-3.5 shadow-lg ${
                  isPaused
                    ? 'bg-[#101014] border-white/5 opacity-75'
                    : isFeatured
                    ? 'bg-gradient-to-b from-[#1A1812] to-[#141418] border-gold-border/70'
                    : 'bg-[#141418] border-white/5'
                }`}
              >
                {/* Fila Superior: Foto e Identidad */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-white/10 bg-[#0B0B0E]">
                      <img
                        src={biz.fotos?.[0]}
                        alt={biz.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                            isPaused
                              ? 'bg-red-500/15 border-red-500/30 text-red-300'
                              : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                          }`}
                        >
                          {isPaused ? 'PAUSADO' : '● ACTIVO'}
                        </span>
                        {isFeatured && (
                          <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#0B0B0E] text-[9px] font-black uppercase">
                            ★ DESTACADO
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm text-white truncate mt-1">
                        {biz.nombre}
                      </h3>
                      <p className="text-[11px] text-gray-400 truncate">
                        📍 {getLocalityName(biz.localidadId)} • 🏷️ {getCategoryName(biz.categoriaId)}
                      </p>
                    </div>
                  </div>

                  {/* Botón Editar Ficha Oficial */}
                  <button
                    type="button"
                    onClick={() => handleStartEdit(biz)}
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      isEditing
                        ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0B0B0E]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-gold-border'
                    }`}
                    title="Editar rubro, dirección o datos del comercio"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Controles Rápidos del Admin: Toggle Destacado + Toggle Visible/Pausado */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {/* Toggle ★ Comercio Destacado */}
                  <button
                    type="button"
                    onClick={() => onToggleFeatured && onToggleFeatured(biz.id)}
                    className={`py-2.5 px-3 rounded-2xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isFeatured
                        ? 'bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] border-[#F5D77F] text-[#0B0B0E] shadow-gold-glow/20'
                        : 'bg-[#0B0B0E] border-white/10 text-gray-300 hover:border-[#D4AF37]/60 hover:text-[#F5D77F]'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${isFeatured ? 'fill-[#0B0B0E]' : 'text-[#E5C07B]'}`} />
                    <span>{isFeatured ? 'Destacado Activo' : 'Destacar Local'}</span>
                  </button>

                  {/* Toggle Pausar / Reactivar Local */}
                  <button
                    type="button"
                    onClick={() => onTogglePauseBusiness && onTogglePauseBusiness(biz.id)}
                    className={`py-2.5 px-3 rounded-2xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isPaused
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                        : 'bg-[#0B0B0E] border-white/10 text-gray-400 hover:border-red-500/40 hover:text-red-300'
                    }`}
                  >
                    <span>{isPaused ? 'Reactivar en Guía' : 'Pausar Local'}</span>
                  </button>
                </div>

                {/* Formulario Desplegable de Edición Administrativa (Rubro, Localidad, Dirección, Horarios) */}
                {isEditing && (
                  <form
                    onSubmit={(e) => handleSaveEdit(e, biz.id)}
                    className="p-3.5 rounded-2xl bg-[#0B0B0E] border border-[#D4AF37]/50 space-y-3 animate-fadeIn"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5D77F]">
                        Edición Oficial de Administrador
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingBizId(null)}
                        className="text-gray-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 block">Nombre comercial</label>
                      <input
                        type="text"
                        value={editForm.nombre}
                        onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                        className="w-full bg-[#141418] border border-white/10 focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 block">Localidad</label>
                        <select
                          value={editForm.localidadId}
                          onChange={(e) => setEditForm({ ...editForm, localidadId: e.target.value })}
                          className="w-full bg-[#141418] border border-white/10 focus:border-[#D4AF37] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                        >
                          {localities.map((loc) => (
                            <option key={loc.id} value={loc.id} className="bg-[#141418]">
                              {loc.nombre}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 block">Rubro Oficial</label>
                        <select
                          value={editForm.categoriaId}
                          onChange={(e) => setEditForm({ ...editForm, categoriaId: e.target.value })}
                          className="w-full bg-[#141418] border border-white/10 focus:border-[#D4AF37] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                        >
                          {categoriasMock.map((cat) => (
                            <option key={cat.id} value={cat.id} className="bg-[#141418]">
                              {cat.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 block">Dirección verificada</label>
                      <input
                        type="text"
                        value={editForm.direccion}
                        onChange={(e) => setEditForm({ ...editForm, direccion: e.target.value })}
                        className="w-full bg-[#141418] border border-white/10 focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 block">Horarios</label>
                        <input
                          type="text"
                          value={editForm.horario}
                          onChange={(e) => setEditForm({ ...editForm, horario: e.target.value })}
                          className="w-full bg-[#141418] border border-white/10 focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 block">WhatsApp</label>
                        <input
                          type="text"
                          value={editForm.whatsapp}
                          onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                          className="w-full bg-[#141418] border border-white/10 focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-gold-gradient text-[#0B0B0E] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-105"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Guardar Cambios Oficiales</span>
                    </button>
                  </form>
                )}

                {/* Pie informativo de la tarjeta */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-gray-400">
                  <span>
                    {isFeatured ? '★ Posicionado 1° en Inicio' : 'Listado estándar'}
                  </span>
                  <span className="text-[#E5C07B] font-semibold">
                    {storeCoupons.length} {storeCoupons.length === 1 ? 'cupón activo' : 'cupones activos'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
