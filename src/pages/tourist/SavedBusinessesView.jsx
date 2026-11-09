import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Heart, 
  Star, 
  MapPin, 
  Navigation, 
  ArrowRight, 
  Compass,
  UtensilsCrossed,
  Calendar,
  Bookmark,
  Clock,
  Ticket
} from 'lucide-react';

export default function SavedBusinessesView({ 
  savedBusinesses = [], 
  savedEvents = [],
  onBack, 
  onSelectBusiness, 
  onSelectEvent,
  onNavigateToMap, 
  onRemoveSaved, 
  onRemoveSavedEvent,
  onExplore,
  onExploreEvents
}) {
  const [activeSubTab, setActiveSubTab] = useState('locales'); // 'locales' | 'eventos'

  const totalSaved = savedBusinesses.length + savedEvents.length;

  const handleOpenEventMap = (evento) => {
    const lat = evento.coordenadas?.lat || -31.4200;
    const lng = evento.coordenadas?.lng || -64.4980;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full min-h-screen bg-[#0B0B0E] text-[#F5F5F7] p-5 pb-24 overflow-x-hidden select-none animate-fadeIn">
      
      {/* 1. Header con Botón Volver */}
      <div className="flex items-center gap-3 pt-2 mb-4">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#141418] border border-white/10 hover:border-gold-border flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer shrink-0 shadow-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
              Mis Guardados
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#F5D77F] text-xs font-bold">
              {totalSaved}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Tus locales y eventos preferidos para visitar
          </p>
        </div>
      </div>

      {/* 2. Sub-Tabs: Locales vs Eventos */}
      <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#141418] border border-white/10 mb-5 shadow-inner">
        <button
          type="button"
          onClick={() => setActiveSubTab('locales')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'locales'
              ? 'bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] shadow-[0_2px_12px_rgba(212,175,55,0.35)] font-extrabold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Locales</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
            activeSubTab === 'locales'
              ? 'bg-[#0B0B0E]/30 text-[#0B0B0E]'
              : 'bg-white/10 text-gray-300'
          }`}>
            {savedBusinesses.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('eventos')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'eventos'
              ? 'bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] shadow-[0_2px_12px_rgba(212,175,55,0.35)] font-extrabold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Eventos</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
            activeSubTab === 'eventos'
              ? 'bg-[#0B0B0E]/30 text-[#0B0B0E]'
              : 'bg-white/10 text-gray-300'
          }`}>
            {savedEvents.length}
          </span>
        </button>
      </div>

      {/* 3. Pestaña 1: Locales Guardados */}
      {activeSubTab === 'locales' && (
        savedBusinesses.length === 0 ? (
          <div className="py-16 px-6 text-center bg-[#141418] border border-white/5 rounded-3xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C07B] mx-auto shadow-inner">
              <Heart className="w-7 h-7 stroke-[1.8]" />
            </div>
            
            <div>
              <h2 className="font-bold text-base text-white">
                No tienes locales guardados todavía
              </h2>
              <p className="text-xs text-gray-400 max-w-[260px] mx-auto mt-1 leading-relaxed">
                Explorá restaurantes, actividades y alojamientos y tocalos con el corazón para guardarlos acá.
              </p>
            </div>

            <button
              type="button"
              onClick={onExplore}
              className="mt-2 px-6 py-3 rounded-2xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider cursor-pointer shadow-gold-glow hover:brightness-105 active:scale-[0.99] transition-all inline-flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explorar Comercios</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            {savedBusinesses.map((comercio) => (
              <div
                key={comercio.id}
                className="bg-[#141418] border border-gold-border/60 hover:border-[#D4AF37] rounded-3xl p-4 shadow-lg hover:shadow-gold-glow/20 transition-all duration-200 group relative"
              >
                {/* Botón para quitar de guardados */}
                <button
                  type="button"
                  onClick={() => onRemoveSaved && onRemoveSaved(comercio.id)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-red-500 hover:scale-110 transition-transform cursor-pointer"
                  title="Quitar de guardados"
                >
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                </button>

                <div className="flex gap-3.5">
                  <div 
                    onClick={() => onSelectBusiness && onSelectBusiness(comercio)}
                    className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-[#1C1C22] cursor-pointer"
                  >
                    <img
                      src={comercio.fotos?.[0]}
                      alt={comercio.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {comercio.esPremium && (
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[8px] font-bold text-[#F5D77F] border border-gold-500/30">
                        ★ PREMIUM
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pr-6 flex flex-col justify-between">
                    <div>
                      <h3 
                        onClick={() => onSelectBusiness && onSelectBusiness(comercio)}
                        className="font-bold text-sm text-white truncate hover:text-[#F5D77F] cursor-pointer"
                      >
                        {comercio.nombre}
                      </h3>
                      
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">
                        {comercio.eslogan}
                      </p>

                      <div className="flex items-center gap-2 mt-1 text-[11px]">
                        <span className="flex items-center gap-0.5 text-[#E5C07B] font-semibold">
                          <Star className="w-3 h-3 fill-[#E5C07B]" />
                          {comercio.rating}
                        </span>
                        <span className="text-gray-400">({comercio.reviewsCount})</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-green-400 font-medium text-[10px]">Abierto</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-gray-400 pt-1">
                      <MapPin className="w-3 h-3 text-[#E5C07B] shrink-0" />
                      <span className="truncate">{comercio.distancia}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => onSelectBusiness && onSelectBusiness(comercio)}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Ver Ficha</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateToMap && onNavigateToMap(comercio)}
                    className="py-2.5 px-3 rounded-xl bg-gold-gradient text-black text-xs font-bold flex items-center justify-center gap-1.5 shadow-gold-glow/20 hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Cómo llegar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* 4. Pestaña 2: Eventos Guardados */}
      {activeSubTab === 'eventos' && (
        savedEvents.length === 0 ? (
          <div className="py-16 px-6 text-center bg-[#141418] border border-white/5 rounded-3xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C07B] mx-auto shadow-inner">
              <Calendar className="w-7 h-7 stroke-[1.8]" />
            </div>
            
            <div>
              <h2 className="font-bold text-base text-white">
                No tienes eventos guardados todavía
              </h2>
              <p className="text-xs text-gray-400 max-w-[260px] mx-auto mt-1 leading-relaxed">
                Descubrí festivales, obras de teatro y recitales en la cartelera y guardalos para no olvidarte de asistir.
              </p>
            </div>

            <button
              type="button"
              onClick={onExploreEvents}
              className="mt-2 px-6 py-3 rounded-2xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider cursor-pointer shadow-gold-glow hover:brightness-105 active:scale-[0.99] transition-all inline-flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explorar Cartelera</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            {savedEvents.map((evento) => (
              <div
                key={evento.id}
                className="bg-[#141418] border border-gold-border/60 hover:border-[#D4AF37] rounded-3xl p-4 shadow-lg hover:shadow-gold-glow/20 transition-all duration-200 group relative"
              >
                {/* Botón para quitar de guardados */}
                <button
                  type="button"
                  onClick={() => onRemoveSavedEvent && onRemoveSavedEvent(evento.id)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#E5C07B] hover:scale-110 transition-transform cursor-pointer"
                  title="Quitar de guardados"
                >
                  <Bookmark className="w-4 h-4 fill-[#E5C07B] text-[#E5C07B]" />
                </button>

                <div className="flex gap-3.5">
                  {/* Bloque Calendárico Estilizado */}
                  <div 
                    onClick={() => onSelectEvent && onSelectEvent(evento)}
                    className="w-20 h-24 rounded-2xl bg-gradient-to-b from-[#221F16] via-[#1A1812] to-[#121216] border border-gold-border/60 flex flex-col items-center justify-center shrink-0 shadow-md cursor-pointer group-hover:border-[#D4AF37] transition-colors"
                  >
                    <span className="text-[10px] uppercase font-bold text-[#E5C07B] tracking-wider leading-none">
                      {evento.fechaCorta?.mes || 'NOV'}
                    </span>
                    <span className="text-2xl font-black text-[#FAF6EE] font-serif leading-tight mt-1">
                      {evento.fechaCorta?.dia || '15'}
                    </span>
                  </div>

                  {/* Información Principal del Evento */}
                  <div className="flex-1 min-w-0 pr-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#C9A66B]">
                          {evento.categoriaLabel}
                        </span>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                          evento.esGratuito 
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-[#D4AF37]/15 text-[#F5D77F] border border-[#D4AF37]/30'
                        }`}>
                          {evento.esGratuito ? 'GRATIS' : 'PROMO'}
                        </span>
                      </div>

                      <h3 
                        onClick={() => onSelectEvent && onSelectEvent(evento)}
                        className="font-bold text-sm text-white truncate hover:text-[#F5D77F] cursor-pointer mt-0.5"
                      >
                        {evento.titulo}
                      </h3>

                      <p className="text-[11px] text-[#E5C07B] truncate mt-0.5 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#E5C07B]" />
                        <span>{evento.fecha} • {evento.hora}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-gray-400 pt-1 truncate">
                      <MapPin className="w-3 h-3 text-[#E5C07B] shrink-0" />
                      <span className="truncate">{evento.lugar}</span>
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => onSelectEvent && onSelectEvent(evento)}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Ver Detalle</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEventMap(evento)}
                    className="py-2.5 px-3 rounded-xl bg-gold-gradient text-black text-xs font-bold flex items-center justify-center gap-1.5 shadow-gold-glow/20 hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Cómo llegar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
