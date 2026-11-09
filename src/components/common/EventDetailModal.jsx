import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Ticket, 
  Share2, 
  Navigation, 
  Bookmark, 
  Sparkles, 
  ShieldCheck, 
  Check,
  ExternalLink
} from 'lucide-react';

export default function EventDetailModal({ 
  evento, 
  onClose, 
  onNavigateToMap,
  isSaved = false,
  onToggleSave 
}) {
  const [copied, setCopied] = useState(false);

  if (!evento) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: evento.titulo,
        text: `Mirá este evento en Carlos Paz: ${evento.titulo}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenGoogleMaps = () => {
    const lat = evento.coordenadas?.lat || -31.4200;
    const lng = evento.coordenadas?.lng || -64.4980;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div 
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto no-scrollbar bg-[#0E0F14] border border-gold-border/60 rounded-t-[32px] sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] flex flex-col animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header con Imagen Panorámica y Botones Superpuestos */}
        <div className="relative w-full h-56 sm:h-64 bg-[#181820] shrink-0">
          <img
            src={evento.imagen}
            alt={evento.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0F14] via-[#0E0F14]/40 to-black/60" />

          {/* Botones Flotantes Superiores */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
            {evento.esDestacado ? (
              <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#D4AF37]/60 text-[#F5D77F] text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3 h-3 text-[#F5D77F]" />
                <span>DESTACADO MUNICIPAL</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-gray-300 text-[10px] font-semibold uppercase">
                {evento.categoriaLabel}
              </span>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:text-[#E5C07B] transition-colors cursor-pointer"
                title="Compartir evento"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:text-[#E5C07B] transition-colors cursor-pointer"
                title="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Badge de Entrada / Tarifa en la Imagen */}
          <div className="absolute bottom-3 left-5">
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide shadow-md flex items-center gap-1.5 ${
              evento.esGratuito
                ? 'bg-emerald-500 text-[#0B0B0E]'
                : 'bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E]'
            }`}>
              <Ticket className="w-3.5 h-3.5 fill-[#0B0B0E]" />
              <span>{evento.esGratuito ? 'ACCESO GRATUITO' : 'BENEFICIO MIEMBRO'}</span>
            </span>
          </div>
        </div>

        {/* 2. Cuerpo del Evento */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Título y Subtítulo */}
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-[#E5C07B] uppercase tracking-widest">
              {evento.subtitulo || evento.categoriaLabel}
            </p>
            <h2 className="font-serif text-2xl font-bold text-white tracking-wide leading-tight">
              {evento.titulo}
            </h2>
          </div>

          {/* Fila Informativa Rápida: Fecha, Hora y Precio */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#141418] border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#E5C07B]" />
                <span>Fecha y Horario</span>
              </span>
              <p className="text-xs font-bold text-white">
                {evento.fecha}
              </p>
              <p className="text-[11px] text-[#E5C07B]">
                {evento.hora}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#141418] border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                <Ticket className="w-3 h-3 text-[#E5C07B]" />
                <span>Modalidad</span>
              </span>
              <p className="text-xs font-bold text-white truncate">
                {evento.precioLabel}
              </p>
              <p className="text-[11px] text-gray-400">
                {evento.esGratuito ? 'Sin reserva previa' : 'Cupos limitados'}
              </p>
            </div>
          </div>

          {/* Tarjeta de Ubicación */}
          <div className="p-3.5 rounded-2xl bg-[#141418] border border-white/5 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C07B] shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white truncate">
                  {evento.lugar}
                </h4>
                <p className="text-[11px] text-gray-400 truncate">
                  {evento.direccion}
                </p>
              </div>
            </div>
          </div>

          {/* Descripción Completa */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C9A66B]">
              Acerca del Evento
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              {evento.descripcion}
            </p>
          </div>

          {/* Organizador Oficial */}
          {evento.organizador && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300">
              <ShieldCheck className="w-4 h-4 text-[#E5C07B] shrink-0" />
              <span>
                Organizado por: <strong className="text-white">{evento.organizador}</strong>
              </span>
            </div>
          )}

          {/* Etiquetas / Tags */}
          {evento.tags && evento.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {evento.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-[#181820] border border-white/10 text-[10px] text-gray-300 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Botones de Acción al Pie */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => onToggleSave && onToggleSave(evento.id)}
              className={`py-3.5 px-3 rounded-2xl border text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isSaved
                  ? 'bg-[#1C1810] border-[#D4AF37] text-[#E5C07B]'
                  : 'bg-white/5 border-white/10 text-white hover:border-[#D4AF37]/50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#E5C07B]' : ''}`} />
              <span>{isSaved ? 'Guardado' : 'Guardar'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenGoogleMaps}
              className="py-3.5 px-3 rounded-2xl bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] font-bold text-xs tracking-wide uppercase flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4 fill-[#0B0B0E]" />
              <span>Cómo llegar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
