import React, { useState } from 'react';
import {
  Inbox,
  CheckCircle2,
  X,
  MapPin,
  Clock,
  Phone,
  Globe,
  Tag,
  ExternalLink,
  Sparkles,
  Eye,
  ChevronDown,
  AlertCircle,
  Store
} from 'lucide-react';
import { categoriasMock } from '../../data/mocks/categorias';

export default function AdminModerationView({
  pendingBusinesses = [],
  onApproveBusiness,
  onRejectBusiness
}) {
  // Configuración temporal por solicitud (asignación de rubro oficial, activación de localidad y estado premium)
  const [moderationConfig, setModerationConfig] = useState({});
  const [expandedId, setExpandedId] = useState(pendingBusinesses[0]?.id || null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('Datos o ubicación incompletos');
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const getConfigFor = (biz) => {
    const existing = moderationConfig[biz.id];
    return {
      assignedCategoryId:
        existing?.assignedCategoryId ??
        (biz.categoriaId && biz.categoriaId !== 'other' ? biz.categoriaId : 'experiencias'),
      activateNewLocality: existing?.activateNewLocality ?? true,
      markAsPremium: existing?.markAsPremium ?? false
    };
  };

  const updateConfigFor = (bizId, field, value) => {
    setModerationConfig((prev) => ({
      ...prev,
      [bizId]: {
        ...(prev[bizId] || {}),
        [field]: value
      }
    }));
  };

  const handleConfirmApprove = (biz) => {
    const cfg = getConfigFor(biz);
    if (onApproveBusiness) {
      onApproveBusiness(biz, cfg);
    }
    setFeedbackMsg({
      type: 'approved',
      text: `¡"${biz.nombre}" fue aprobado y publicado en vivo en la guía!`
    });
    setTimeout(() => setFeedbackMsg(null), 4500);
  };

  const handleConfirmReject = (biz) => {
    if (onRejectBusiness) {
      onRejectBusiness(biz.id, rejectReason);
    }
    setRejectingId(null);
    setFeedbackMsg({
      type: 'rejected',
      text: `La solicitud de "${biz.nombre}" fue rechazada (${rejectReason}).`
    });
    setTimeout(() => setFeedbackMsg(null), 4500);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Encabezado de la Bandeja */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs uppercase tracking-wider text-[#C9A66B] font-bold flex items-center gap-1.5">
            <Inbox className="w-3.5 h-3.5 text-[#E5C07B]" />
            <span>Cola de Moderación ({pendingBusinesses.length})</span>
          </h2>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Verificá datos, ubicaciones en Maps y asigná rubros antes de publicar
          </p>
        </div>
      </div>

      {/* Mensaje de confirmación tras Aprobar / Rechazar */}
      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 animate-fadeIn ${
            feedbackMsg.type === 'approved'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : 'bg-red-500/15 border-red-500/40 text-red-300'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Estado Vacío si no quedan pendientes */}
      {pendingBusinesses.length === 0 ? (
        <div className="py-14 px-6 text-center bg-[#141418] border border-white/5 rounded-3xl space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-7 h-7 stroke-[1.8]" />
          </div>
          <h3 className="font-serif text-lg font-bold text-white">
            ¡Bandeja al día!
          </h3>
          <p className="text-xs text-gray-400 max-w-[260px] mx-auto leading-relaxed">
            No hay comercios pendientes de revisión. Podés registrar uno nuevo desde <strong>Perfil &gt; Registrá tu comercio</strong> para probar el flujo en vivo.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingBusinesses.map((biz) => {
            const isExpanded = expandedId === biz.id;
            const isRejecting = rejectingId === biz.id;
            const cfg = getConfigFor(biz);

            return (
              <div
                key={biz.id}
                className="bg-[#141418] border border-gold-border/60 rounded-3xl overflow-hidden shadow-xl transition-all"
              >
                {/* 1. Cabecera Resumen de la Solicitud */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : biz.id)}
                  className="p-4 flex items-start justify-between gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-white/10 bg-[#0B0B0E]">
                      <img
                        src={biz.fotos?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80'}
                        alt={biz.nombre}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-black/80 text-[8px] font-bold text-emerald-400">
                        {biz.fotos?.length || 1}f
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[9px] font-extrabold uppercase">
                          ● PENDIENTE
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {biz.fechaSolicitud || 'Reciente'}
                        </span>
                      </div>

                      <h3 className="font-serif text-base font-bold text-white truncate mt-1">
                        {biz.nombre}
                      </h3>
                      <p className="text-[11px] text-gray-400 truncate">
                        {biz.eslogan}
                      </p>

                      {/* Alertas especiales de Nueva Ciudad o Nuevo Rubro */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {biz.isNewLocalitySuggested ? (
                          <span className="px-2 py-0.5 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37] text-[#F5D77F] text-[9px] font-bold flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            <span>Nueva Zona: {biz.localidadNombre}</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-[9px] font-medium">
                            📍 {biz.localidadNombre || 'Carlos Paz'}
                          </span>
                        )}

                        {biz.isNewCategorySuggested ? (
                          <span className="px-2 py-0.5 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37] text-[#F5D77F] text-[9px] font-bold flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            <span>Rubro Sugerido: {biz.categoriaNombre}</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-[9px] font-medium">
                            🏷️ {biz.categoriaNombre || 'Gastronomía'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white shrink-0 mt-1 cursor-pointer"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-[#F5D77F]' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* 2. Panel Desplegable de Auditoría y Previsualización de la Solicitud */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-white/5 space-y-4 animate-fadeIn">
                    {/* Galería de fotos subidas (.webp) */}
                    {biz.fotos && biz.fotos.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">
                          Galería enviada ({biz.fotos.length} imágenes .webp)
                        </span>
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                          {biz.fotos.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt={`${biz.nombre} ${i + 1}`}
                              className="w-24 h-20 rounded-xl object-cover border border-white/10 shrink-0"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Datos de Ubicación, Contacto y Descripción */}
                    <div className="p-3 rounded-2xl bg-[#0B0B0E] border border-white/5 space-y-2 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 text-gray-300">
                          <MapPin className="w-3.5 h-3.5 text-[#E5C07B] shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-white block">{biz.direccion}</span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              Coords: {biz.coordenadas?.lat}, {biz.coordenadas?.lng}
                            </span>
                          </div>
                        </div>
                        {biz.mapsLink && (
                          <a
                            href={biz.mapsLink}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 py-1 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5D77F] text-[10px] font-bold flex items-center gap-1 shrink-0 hover:bg-[#D4AF37]/25"
                          >
                            <span>Maps</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-gray-300 pt-1 border-t border-white/5">
                        <Clock className="w-3.5 h-3.5 text-[#E5C07B] shrink-0" />
                        <span>{biz.horario || 'Consultar horarios'}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-300">
                        <Phone className="w-3.5 h-3.5 text-[#E5C07B] shrink-0" />
                        <span>{biz.whatsapp}</span>
                      </div>

                      {biz.descripcion && (
                        <p className="text-[11px] text-gray-400 pt-1 border-t border-white/5 leading-relaxed">
                          "{biz.descripcion}"
                        </p>
                      )}
                    </div>

                    {/* Resolución 1: Si sugirió una Nueva Localidad (ej. Mar del Plata) */}
                    {biz.isNewLocalitySuggested && biz.suggestedLocalityData && (
                      <div className="p-3.5 rounded-2xl bg-[#1C1A14] border border-[#D4AF37]/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#F5D77F] flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5" />
                            <span>Nueva Localidad Detectada</span>
                          </span>
                          <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                            Maps Sync OK
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-300 leading-snug">
                          El comercio solicita abrir la zona <strong>{biz.suggestedLocalityData.nombre} ({biz.suggestedLocalityData.provincia})</strong>.
                        </p>
                        <label className="flex items-center gap-2 pt-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={cfg.activateNewLocality}
                            onChange={(e) => updateConfigFor(biz.id, 'activateNewLocality', e.target.checked)}
                            className="accent-[#D4AF37] w-4 h-4 rounded cursor-pointer"
                          />
                          <span className="text-xs font-semibold text-white">
                            Activar "{biz.suggestedLocalityData.nombre}" en el selector de zonas de la app
                          </span>
                        </label>
                      </div>
                    )}

                    {/* Resolución 2: Si sugirió un Rubro Nuevo ("Otro rubro") */}
                    {biz.isNewCategorySuggested && (
                      <div className="p-3.5 rounded-2xl bg-[#1C1A14] border border-[#D4AF37]/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#F5D77F] flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" />
                            <span>Asignar Rubro Oficial</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-300">
                          El local sugirió: <strong className="text-white">"{biz.categoriaNombre}"</strong>. Seleccioná en qué categoría oficial publicarlo:
                        </p>
                        <select
                          value={cfg.assignedCategoryId}
                          onChange={(e) => updateConfigFor(biz.id, 'assignedCategoryId', e.target.value)}
                          className="w-full bg-[#0B0B0E] border border-[#D4AF37]/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                        >
                          {categoriasMock.map((cat) => (
                            <option key={cat.id} value={cat.id} className="bg-[#141418]">
                              {cat.nombre} ({cat.beneficioMax})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Opción: Publicar directamente como Comercio Destacado */}
                    <label className="flex items-center justify-between p-3 rounded-2xl bg-[#0B0B0E] border border-white/5 cursor-pointer hover:border-gold-border/40">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#F5D77F]" />
                        <div>
                          <span className="text-xs font-bold text-white block">
                            Publicar como ★ Comercio Destacado
                          </span>
                          <span className="text-[10px] text-gray-400">
                            Posiciona al local primero en el inicio con insignia dorada
                          </span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={cfg.markAsPremium}
                        onChange={(e) => updateConfigFor(biz.id, 'markAsPremium', e.target.checked)}
                        className="accent-[#D4AF37] w-4 h-4 rounded cursor-pointer"
                      />
                    </label>

                    {/* Formulario de Rechazo con Motivo o Botones Aprobar / Rechazar */}
                    {isRejecting ? (
                      <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-3 animate-fadeIn">
                        <label className="text-[11px] font-bold text-red-300 block">
                          Seleccioná el motivo de rechazo:
                        </label>
                        <select
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          className="w-full bg-[#0B0B0E] border border-red-500/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        >
                          <option value="Datos o ubicación incompletos">Datos o ubicación incompletos</option>
                          <option value="Imágenes de baja calidad">Imágenes de baja calidad</option>
                          <option value="Comercio duplicado">Comercio duplicado</option>
                          <option value="Rubro no admitido en la guía">Rubro no admitido en la guía</option>
                        </select>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setRejectingId(null)}
                            className="py-2 rounded-xl bg-white/5 text-xs font-semibold text-gray-300 hover:text-white cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleConfirmReject(biz)}
                            className="py-2 rounded-xl bg-red-500 text-black font-bold text-xs cursor-pointer hover:bg-red-400"
                          >
                            Confirmar Rechazo
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setRejectingId(biz.id)}
                          className="col-span-1 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all"
                        >
                          <X className="w-4 h-4" />
                          <span>Rechazar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleConfirmApprove(biz)}
                          className="col-span-2 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#0B0B0E] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg cursor-pointer transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                          <span>Aprobar y Publicar</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
