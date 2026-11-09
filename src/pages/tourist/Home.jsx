import React, { useState } from 'react';
import { 
  MapPin, 
  ChevronDown, 
  Bell, 
  Sparkles, 
  Utensils, 
  Bed, 
  Compass, 
  Wine, 
  Star, 
  ArrowRight,
  Tag,
  Calendar,
  Search,
  X
} from 'lucide-react';
import { categoriasMock } from '../../data/mocks/categorias';
import { comerciosMock } from '../../data/mocks/comercios';
import { eventosMock } from '../../data/mocks/eventos';
import EventsFeed from '../../components/tourist/EventsFeed';

export default function Home({ currentZone, onOpenZoneSelector, onSelectBusiness, onSelectEvent }) {
  const [activeSection, setActiveSection] = useState('beneficios'); // 'beneficios' | 'eventos'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mapeo dinámico de íconos para categorías
  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Utensils':
        return <Utensils className="w-5 h-5" />;
      case 'Bed':
        return <Bed className="w-5 h-5" />;
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Wine':
        return <Wine className="w-5 h-5" />;
      default:
        return <Tag className="w-5 h-5" />;
    }
  };

  // Filtrado reactivo por categoría y búsqueda inteligente por texto
  const filteredComercios = comerciosMock.filter((comercio) => {
    const matchesCategory = !selectedCategory || comercio.categoriaId === selectedCategory;

    const query = searchQuery.trim().toLowerCase();
    const matchesQuery = !query || (
      comercio.nombre?.toLowerCase().includes(query) ||
      comercio.eslogan?.toLowerCase().includes(query) ||
      comercio.direccion?.toLowerCase().includes(query) ||
      comercio.categoriaId?.toLowerCase().includes(query) ||
      comercio.promocionPrincipal?.titulo?.toLowerCase().includes(query) ||
      comercio.promocionPrincipal?.descuento?.toLowerCase().includes(query)
    );

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="w-full min-h-screen bg-[#0B0B0E] text-[#F5F5F7] pb-24 overflow-x-hidden">
      {/* Header Superior con Selector de Zona y Toggle Beneficios / Eventos */}
      <header className="sticky top-0 z-30 bg-[#0B0B0E]/95 backdrop-blur-md px-5 pt-4 pb-3 border-b border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium block">Bienvenido</span>
            <h1 className="text-lg font-bold text-white flex items-center gap-1.5">
              Hola, Juan <span className="inline-block animate-pulse">👋</span>
            </h1>
          </div>

          {/* Píldora de Selector de Zona Activa */}
          <button
            type="button"
            onClick={onOpenZoneSelector}
            className="flex items-center gap-2 bg-[#141418] border border-gold-border hover:border-gold-400 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5 text-[#E5C07B]" />
            <span className="text-xs font-semibold text-[#F5F5F7]">
              {currentZone?.nombre || 'Carlos Paz'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#E5C07B]" />
          </button>
        </div>

        {/* Toggle Switcher: Beneficios vs Eventos */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#141418] border border-white/10 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveSection('beneficios')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSection === 'beneficios'
                ? 'bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] shadow-[0_2px_12px_rgba(212,175,55,0.35)] font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Beneficios</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('eventos')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSection === 'eventos'
                ? 'bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] shadow-[0_2px_12px_rgba(212,175,55,0.35)] font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Eventos</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold ${
              activeSection === 'eventos'
                ? 'bg-[#0B0B0E]/30 text-[#0B0B0E]'
                : 'bg-[#D4AF37]/20 text-[#F5D77F] border border-[#D4AF37]/40'
            }`}>
              {eventosMock.length}
            </span>
          </button>
        </div>
      </header>

      {/* Contenido Principal Condicional: Beneficios vs Eventos */}
      {activeSection === 'beneficios' ? (
        <div className="px-5 pt-5 space-y-6 animate-fadeIn">
        {/* Banner Hero Premium */}
        <div className="relative rounded-3xl p-5 overflow-hidden bg-gradient-to-br from-[#1C1A14] via-[#141418] to-[#0E0E12] border border-gold-border shadow-gold-glow/20">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F5D77F] text-[10px] font-bold tracking-widest uppercase mb-2">
              <Sparkles className="w-3 h-3 text-[#F5D77F]" />
              MEMBRESÍA PREMIUM
            </div>
            
            <h2 className="font-serif text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FAF6EE] via-[#E5C07B] to-[#D4AF37] leading-tight">
              I LOVE {currentZone?.nombre?.toUpperCase() || 'CARLOS PAZ'}
            </h2>
            <p className="text-xs text-gray-300 mt-1.5 max-w-[280px]">
              Tu pase exclusivo a descuentos gastronómicos, alojamiento y actividades.
            </p>
          </div>
        </div>

        {/* Barra de Búsqueda Inteligente */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-[#E5C07B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, pizzería, kayak, spa..."
              className="w-full bg-[#141418] border border-white/10 focus:border-[#D4AF37] rounded-2xl py-3.5 pl-11 pr-10 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Borrar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Sección de Categorías */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs uppercase tracking-wider text-[#C9A66B] font-semibold">
              Categorías destacadas
            </h3>
            {selectedCategory && (
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="text-[11px] text-[#E5C07B] hover:underline"
              >
                Ver todas
              </button>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-5 px-5">
            {categoriasMock.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                  className={`shrink-0 flex flex-col items-center justify-center p-3.5 rounded-2xl border min-w-[96px] transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#1F1C14] border-[#D4AF37] shadow-gold-glow/30 scale-[1.02]'
                      : 'bg-[#141418] border-white/5 hover:border-gold-border'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl mb-2 transition-colors ${
                    isSelected 
                      ? 'bg-gold-gradient text-black shadow-md' 
                      : 'bg-white/5 text-[#E5C07B]'
                  }`}>
                    {getCategoryIcon(cat.icono)}
                  </div>
                  <span className="text-xs font-semibold text-white whitespace-nowrap">
                    {cat.nombre}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5 whitespace-nowrap">
                    {cat.beneficioMax}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Sección Beneficios Destacados */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs uppercase tracking-wider text-[#C9A66B] font-semibold">
                {searchQuery ? 'Resultados de búsqueda' : 'Beneficios destacados'}
              </h3>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#D4AF37]/20 text-[#E5C07B]">
                {filteredComercios.length}
              </span>
            </div>

            {(searchQuery || selectedCategory) ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
                className="text-[11px] text-[#E5C07B] hover:underline cursor-pointer"
              >
                Limpiar filtros
              </button>
            ) : (
              <div className="flex items-center gap-1 text-[11px] text-gray-400">
                <Star className="w-3.5 h-3.5 text-[#E5C07B] fill-[#E5C07B]" />
                <span className="font-semibold text-white">4.8</span>
                <span>(128 reseñas)</span>
              </div>
            )}
          </div>

          <div className="space-y-3.5">
            {filteredComercios.length === 0 ? (
              <div className="py-12 px-6 text-center bg-[#141418] border border-white/5 rounded-3xl space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C07B] mx-auto shadow-inner">
                  <Search className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white">
                  No se encontraron resultados
                </h4>
                <p className="text-xs text-gray-400 max-w-[240px] mx-auto leading-relaxed">
                  No encontramos locales para "{searchQuery}". Probá con palabras como resto, pizza, kayak o spa.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  className="mt-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-[#E5C07B] hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Restablecer búsqueda
                </button>
              </div>
            ) : (
              filteredComercios.map((comercio) => (
              <div
                key={comercio.id}
                onClick={() => onSelectBusiness && onSelectBusiness(comercio)}
                className="group relative bg-[#141418] border border-white/5 hover:border-gold-border rounded-2xl p-4 transition-all duration-200 cursor-pointer hover:shadow-gold-glow/20"
              >
                <div className="flex gap-4">
                  {/* Foto miniatura con badge de descuento superpuesto */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-[#1C1C22]">
                    <img
                      src={comercio.fotos[0]}
                      alt={comercio.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[9px] font-black text-[#F5D77F] border border-gold-500/30">
                      {comercio.promocionPrincipal?.descuento || 'PROMO'}
                    </div>
                  </div>

                  {/* Información del Comercio */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-semibold text-base text-white tracking-wide truncate group-hover:text-[#F5D77F] transition-colors">
                        {comercio.nombre}
                      </h4>
                      {comercio.esPremium && (
                        <span className="shrink-0 text-[9px] font-bold text-[#E5C07B] bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-1.5 py-0.5 rounded">
                          ★ PREMIUM
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {comercio.eslogan}
                    </p>

                    {/* Beneficio Destacado */}
                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#E5C07B] bg-[#D4AF37]/10 px-2 py-0.5 rounded-md">
                      <Tag className="w-3 h-3 text-[#E5C07B]" />
                      <span>{comercio.promocionPrincipal?.titulo}</span>
                    </div>

                    {/* Footer de la tarjeta: distancia y rating */}
                    <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2.5 pt-2 border-t border-white/5">
                      <span className="flex items-center gap-1 text-gray-400">
                        <MapPin className="w-3 h-3 text-[#E5C07B]" />
                        {comercio.distancia}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-gray-300">
                        <Star className="w-3 h-3 text-[#E5C07B] fill-[#E5C07B]" />
                        {comercio.rating} ({comercio.reviewsCount})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )))}
          </div>
        </section>
      </div>
    ) : (
      /* Sección de Eventos (Paso 3) */
      <div className="px-5 pt-5 pb-6 animate-fadeIn">
        <EventsFeed 
          currentZone={currentZone} 
          onSelectEvent={onSelectEvent} 
        />
      </div>
    )}
  </div>
  );
}
