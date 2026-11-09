import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Sparkles, 
  Ticket, 
  ChevronRight, 
  Music, 
  Theater, 
  Trophy, 
  Utensils,
  Tag
} from 'lucide-react';
import { eventosMock } from '../../data/mocks/eventos';

export default function EventsFeed({ currentZone, onSelectEvent }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Todos', icon: null },
    { id: 'musica', label: 'Música', icon: Music },
    { id: 'teatro', label: 'Teatro', icon: Theater },
    { id: 'deportes', label: 'Deportes', icon: Trophy },
    { id: 'gastronomia', label: 'Ferias', icon: Utensils },
  ];

  const filteredEvents = selectedCategory === 'all'
    ? eventosMock
    : eventosMock.filter((e) => e.categoria === selectedCategory);

  // Evento destacado para el Hero
  const featuredEvent = filteredEvents.find((e) => e.esDestacado) || filteredEvents[0];
  const otherEvents = filteredEvents.filter((e) => e.id !== featuredEvent?.id);

  return (
    <div className="space-y-6">
      {/* 1. Banner Hero de Agenda Cultural */}
      <div className="relative rounded-3xl p-5 overflow-hidden bg-gradient-to-br from-[#1C1A14] via-[#141418] to-[#0E0E12] border border-gold-border shadow-gold-glow/20">
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F5D77F] text-[10px] font-bold tracking-widest uppercase">
            <Calendar className="w-3 h-3 text-[#F5D77F]" />
            AGENDA OFICIAL & CULTURAL
          </div>
          
          <h2 className="font-serif text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FAF6EE] via-[#E5C07B] to-[#D4AF37] leading-tight">
            Eventos en {currentZone?.nombre || 'Carlos Paz'}
          </h2>
          <p className="text-xs text-gray-300 max-w-[290px]">
            Festivales, teatro, recitales y actividades para disfrutar en las sierras.
          </p>
        </div>
      </div>

      {/* 2. Filtros Rápidos por Categoría */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-5 px-5">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] font-bold shadow-[0_2px_10px_rgba(212,175,55,0.35)]'
                  : 'bg-[#141418] border border-white/5 text-gray-400 hover:text-white hover:border-[#D4AF37]/30'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tarjeta de Evento Destacado Principal */}
      {featuredEvent && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-wider text-[#C9A66B] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F5D77F]" />
              <span>Evento Destacado de la Semana</span>
            </h3>
          </div>

          <div
            onClick={() => onSelectEvent && onSelectEvent(featuredEvent)}
            className="group relative rounded-3xl overflow-hidden bg-[#141418] border border-gold-border/60 hover:border-[#D4AF37] shadow-[0_12px_32px_rgba(0,0,0,0.7)] transition-all duration-300 cursor-pointer hover:shadow-gold-glow/30"
          >
            {/* Foto Panorámica con Gradiente */}
            <div className="relative w-full h-48 overflow-hidden bg-[#181820]">
              <img
                src={featuredEvent.imagen}
                alt={featuredEvent.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0E] via-[#0B0B0E]/40 to-black/30" />

              {/* Badges Superpuestos */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#D4AF37]/60 text-[#F5D77F] text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-sm">
                  <span>🌿</span>
                  <span>DESTACADO MUNICIPAL</span>
                </span>

                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#F5D77F] to-[#D4AF37] text-[#0B0B0E] text-[10px] font-extrabold uppercase shadow-sm">
                  {featuredEvent.esGratuito ? 'GRATUITO' : 'DESCUENTO'}
                </span>
              </div>
            </div>

            {/* Contenido del Evento Destacado */}
            <div className="p-4 space-y-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#E5C07B] font-medium mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{featuredEvent.fecha} • {featuredEvent.hora}</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-white group-hover:text-[#F5D77F] transition-colors leading-tight">
                  {featuredEvent.titulo}
                </h4>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {featuredEvent.descripcion}
                </p>
              </div>

              {/* Ubicación y Botón de Acción */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                <div className="flex items-center gap-1.5 text-gray-300 truncate pr-2">
                  <MapPin className="w-3.5 h-3.5 text-[#E5C07B] shrink-0" />
                  <span className="truncate">{featuredEvent.lugar}</span>
                </div>

                <div className="shrink-0 flex items-center gap-1 text-[#F5D77F] font-bold group-hover:translate-x-0.5 transition-transform">
                  <span>Ver detalle</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Listado de Próximos Eventos */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs uppercase tracking-wider text-[#C9A66B] font-semibold">
              Próximas fechas
            </h3>
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#D4AF37]/20 text-[#E5C07B]">
              {filteredEvents.length}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {filteredEvents.map((evento) => (
            <div
              key={evento.id}
              onClick={() => onSelectEvent && onSelectEvent(evento)}
              className="group relative bg-[#141418] border border-white/5 hover:border-gold-border rounded-2xl p-3.5 transition-all duration-200 cursor-pointer hover:shadow-gold-glow/20 flex gap-3.5 items-center"
            >
              {/* Bloque Calendárico Estilizado */}
              <div className="w-14 h-16 rounded-xl bg-gradient-to-b from-[#221F16] via-[#1A1812] to-[#121216] border border-gold-border/60 flex flex-col items-center justify-center shrink-0 shadow-md group-hover:border-[#D4AF37] transition-colors">
                <span className="text-[10px] uppercase font-bold text-[#E5C07B] tracking-wider leading-none">
                  {evento.fechaCorta?.mes || 'NOV'}
                </span>
                <span className="text-xl font-black text-[#FAF6EE] font-serif leading-tight mt-0.5">
                  {evento.fechaCorta?.dia || '15'}
                </span>
              </div>

              {/* Información Central del Evento */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#C9A66B] truncate">
                    {evento.categoriaLabel}
                  </span>
                  <span className={`shrink-0 text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                    evento.esGratuito 
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-[#D4AF37]/15 text-[#F5D77F] border border-[#D4AF37]/30'
                  }`}>
                    {evento.esGratuito ? 'GRATIS' : 'PROMO'}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white group-hover:text-[#F5D77F] transition-colors truncate">
                  {evento.titulo}
                </h4>

                <div className="flex items-center gap-2 text-[11px] text-gray-400 truncate">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#E5C07B]" />
                    {evento.hora}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-[#E5C07B] shrink-0" />
                    <span className="truncate">{evento.lugar}</span>
                  </span>
                </div>
              </div>

              {/* Flecha lateral */}
              <div className="shrink-0 text-gray-500 group-hover:text-[#F5D77F] group-hover:translate-x-0.5 transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
