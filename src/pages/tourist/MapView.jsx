import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Clock, 
  Compass, 
  Layers, 
  ExternalLink, 
  ChevronLeft, 
  Utensils, 
  MapPin, 
  ArrowLeft,
  Navigation,
  Search,
  Filter,
  Pizza,
  X,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { googleMapsDarkGoldTheme } from '../../utils/googleMapsStyle';

// Mapeo geográfico de posiciones simuladas para los comercios en el mapa de Carlos Paz
const BUSINESS_MAP_POSITIONS = {
  'resto-lago': { top: '47.5%', left: '77.5%', iconType: 'food' },
  'las-olivas': { top: '38%', left: '46%', iconType: 'pizza' },
  'spa-relax': { top: '68%', left: '38%', iconType: 'spa' },
  'kayak-lago': { top: '28%', left: '72%', iconType: 'kayak' }
};

export default function MapView({ 
  comercio = null, 
  initialMode = 'explore', 
  allComercios = [], 
  onBack,
  onOpenBusinessDetail
}) {
  const [mapLayer, setMapLayer] = useState('dark-gold');
  // Modo de operación: 'route' (ruta guiada puntual) o 'explore' (radar de comercios cercanos)
  const [mode, setMode] = useState(comercio ? 'route' : initialMode);
  const [activeBusiness, setActiveBusiness] = useState(comercio);

  // Estados interactivos para el Modo Exploración
  const [radiusKm, setRadiusKm] = useState(2.0); // 0.5 | 1.0 | 2.0 | 5.0
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'gastronomia' | 'experiencias' | 'relax'
  const [selectedExploreBusiness, setSelectedExploreBusiness] = useState(null);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  // Helper para renderizar iconos temáticos según categoría
  const renderBusinessIcon = (iconType) => {
    switch (iconType) {
      case 'pizza':
        return <Pizza className="w-3.5 h-3.5 text-[#0B0B0E] stroke-[2.2]" />;
      case 'spa':
        return <Sparkles className="w-3.5 h-3.5 text-[#0B0B0E] stroke-[2.2]" />;
      case 'kayak':
        return <Compass className="w-3.5 h-3.5 text-[#0B0B0E] stroke-[2.2]" />;
      case 'food':
      default:
        return <Utensils className="w-3.5 h-3.5 text-[#0B0B0E] stroke-[2.2]" />;
    }
  };

  // Sincronizar si cambia la prop comercio
  useEffect(() => {
    if (comercio) {
      setActiveBusiness(comercio);
      setMode('route');
    }
  }, [comercio]);

  // Filtrado de comercios según radio de distancia y categoría
  const comerciosList = allComercios.length > 0 ? allComercios : [];
  const filteredComercios = comerciosList.filter((c) => {
    const matchesDistance = (c.distanciaKm || 0) <= radiusKm;
    const matchesCategory = selectedCategory === 'all' || c.categoriaId === selectedCategory;
    return matchesDistance && matchesCategory;
  });

  // Datos del comercio activo para el modo ruta
  const business = activeBusiness || {
    id: "resto-lago",
    nombre: "Resto Lago",
    subtitulo: "I LOVE CARLOS PAZ",
    eslogan: "Restaurante • Lago • Abierto ahora",
    rating: 4.9,
    reviewsCount: 248,
    distancia: "200 m • 3 min caminando",
    tiempoEstimado: "Llega en 3 min • Ruta más rápida, sin tráfico",
    coordenadas: { lat: -31.4225, lng: -64.4990 }
  };

  const routePos = BUSINESS_MAP_POSITIONS[business.id] || { top: '47.5%', left: '77.5%', iconType: 'food' };
  const svgDest = {
    'resto-lago': { x: 310, y: 380, pathD: "M 75,520 C 115,480 160,490 220,420 C 250,385 270,400 310,380" },
    'las-olivas': { x: 184, y: 304, pathD: "M 75,520 C 100,450 120,420 150,360 C 165,330 170,320 184,304" },
    'spa-relax': { x: 152, y: 544, pathD: "M 75,520 C 95,530 115,535 152,544" },
    'kayak-lago': { x: 288, y: 224, pathD: "M 75,520 C 120,450 180,380 230,300 C 260,250 270,235 288,224" }
  }[business.id] || { x: 310, y: 380, pathD: "M 75,520 C 115,480 160,490 220,420 C 250,385 270,400 310,380" };

  const handleOpenGoogleMaps = () => {
    const lat = business.coordenadas?.lat || -31.4225;
    const lng = business.coordenadas?.lng || -64.4990;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
    window.open(url, '_blank');
  };

  const handleSwitchToExplore = () => {
    setMode('explore');
    setActiveBusiness(null);
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-[#07090E] text-[#F5F5F7] flex flex-col justify-between overflow-hidden select-none pb-20">
      
      {/* ========================================================
          1. HEADER CONDICIONAL (MODO RUTA vs MODO EXPLORAR)
         ======================================================== */}
      {mode === 'route' ? (
        /* HEADER MODO RUTA GUIADA (Comercio Específico) */
        <div className="relative z-30 pt-3 px-4 animate-fadeIn">
          <div className="bg-[#0B0B0E]/85 backdrop-blur-xl border border-gold-border/40 rounded-3xl p-4 shadow-2xl">
            <div className="flex items-center justify-between">
              {/* Botón Volver / Cambiar a Modo Explorar */}
              <button
                type="button"
                onClick={handleSwitchToExplore}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white hover:border-gold-border transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#E5C07B]" />
                <span>Ver todos</span>
              </button>

              {/* Badge Dorado PREMIUM con Laureles */}
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#F5D77F]/20 via-[#D4AF37]/25 to-[#AA7C26]/20 border border-[#D4AF37]/60 text-[#F5D77F] text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 shadow-sm">
                <span className="text-xs">🌿</span>
                <span>PREMIUM</span>
              </div>
            </div>

            {/* Título en Tipografía Serif de Alta Gama */}
            <div className="text-center mt-1">
              <h1 className="font-serif text-[26px] font-medium text-[#FAF6EE] tracking-wide leading-tight">
                {business.nombre}
              </h1>
              <h2 className="font-serif text-[11px] tracking-[0.2em] text-[#E5C07B] uppercase font-semibold mt-0.5">
                {business.subtitulo || "I LOVE CARLOS PAZ"}
              </h2>
            </div>

            {/* Subtítulo: Categoría, Estado y Reseñas */}
            <div className="text-center text-xs text-[#9CA3AF] mt-2 flex items-center justify-center gap-1.5 flex-wrap">
              <span>{business.eslogan || "Restaurante • Lago • Abierto ahora"}</span>
              <span>•</span>
              <span className="text-[#E5C07B] font-semibold flex items-center gap-1">
                {business.rating} ★
              </span>
              <span>({business.reviewsCount} reseñas)</span>
            </div>
          </div>
        </div>
      ) : (
        /* HEADER MODO EXPLORAR (Radar Plegable / Desplegable con Flecha) */
        <div className="relative z-30 pt-3 px-4 animate-fadeIn">
          <div className="bg-[#0B0B0E]/90 backdrop-blur-xl border border-gold-border/40 rounded-3xl p-3.5 sm:p-4 shadow-2xl transition-all duration-300">
            {/* Fila 1: Encabezado del Radar, Resumen Activo y Flecha Desplegable */}
            <div 
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            >
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37]/25 to-[#AA7C26]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#E5C07B] shadow-inner shrink-0">
                  <Navigation className="w-4 h-4 transform rotate-45" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0B0B0E] animate-pulse" />
                </div>
                <div>
                  <h2 className="font-serif text-sm sm:text-base font-medium text-[#FAF6EE] tracking-wide leading-none">
                    Radar de Comercios
                  </h2>
                  {/* Resumen de filtros activos cuando está plegado */}
                  <div className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-1">
                    <span className="text-[#E5C07B] font-semibold">
                      {radiusKm < 1 ? `${radiusKm * 1000}m` : `${radiusKm}km`}
                    </span>
                    <span>•</span>
                    <span className="capitalize">
                      {selectedCategory === 'all' ? 'Todos' : selectedCategory === 'experiencias' ? 'Aventura' : selectedCategory}
                    </span>
                    <span>•</span>
                    <span className="text-gray-300 font-medium">
                      {filteredComercios.length} {filteredComercios.length === 1 ? 'local' : 'locales'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón Circular con Flecha (Desplegar / Plegar) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFiltersExpanded(!isFiltersExpanded);
                  }}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm ${
                    isFiltersExpanded
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F5D77F]'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-[#D4AF37]/40'
                  }`}
                  title={isFiltersExpanded ? "Plegar filtros para ver el mapa completo" : "Desplegar selector de distancia y filtros"}
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isFiltersExpanded ? 'rotate-180 text-[#F5D77F]' : ''}`} />
                </button>
              </div>
            </div>

            {/* Contenido Desplegable: Selector de Radio y Categorías */}
            {isFiltersExpanded && (
              <div className="space-y-3 pt-3 mt-3 border-t border-white/5 animate-fadeIn">
                {/* Fila 2: Selector de Radio en km */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-[#E5C07B]" />
                      <span>Radio de búsqueda:</span>
                    </span>
                    <span className="text-[#F5D77F] font-bold">
                      {radiusKm < 1 ? `${radiusKm * 1000} metros` : `${radiusKm} km a la redonda`}
                    </span>
                  </div>

                  {/* Botones de Selección de Radio */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { label: '500 m', value: 0.5 },
                      { label: '1 km', value: 1.0 },
                      { label: '2 km', value: 2.0 },
                      { label: '5 km', value: 5.0 },
                    ].map((item) => {
                      const isActive = radiusKm === item.value;
                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setRadiusKm(item.value)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer text-center ${
                            isActive
                              ? 'bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] font-bold shadow-[0_2px_10px_rgba(212,175,55,0.35)] scale-[1.02]'
                              : 'bg-[#141418] text-gray-400 border border-white/5 hover:text-white hover:border-[#D4AF37]/40 hover:bg-[#181820]'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Fila 3: Filtro Rápido de Categorías */}
                <div className="flex items-center justify-center gap-1.5 pt-0.5 flex-wrap">
                  {[
                    { id: 'all', label: 'Todos' },
                    { id: 'gastronomia', label: 'Gastronomía' },
                    { id: 'experiencias', label: 'Aventura' },
                    { id: 'relax', label: 'Relax & Spa' },
                  ].map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1 rounded-full text-[11px] whitespace-nowrap transition-all cursor-pointer text-center ${
                          isActive
                            ? 'bg-[#D4AF37]/25 border border-[#D4AF37] text-[#F5D77F] font-bold shadow-sm'
                            : 'bg-white/5 border border-white/10 text-gray-400 hover:text-gray-200 hover:border-white/20'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          2. CAPA DEL MAPA BASE SATELITAL NOCTURNO
         ======================================================== */}
      <div 
        className="absolute inset-0 z-0 overflow-hidden cursor-default"
        onClick={() => setSelectedExploreBusiness(null)}
      >
        {/* Imagen Satelital Nocturna de Alta Resolución */}
        <img
          src="/mock-images/carlos-paz-dark-map.jpg"
          alt="Mapa Nocturno Villa Carlos Paz"
          className="w-full h-full object-cover scale-[1.03] select-none"
        />

        {/* Viñeta oscura periférica */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0E]/70 via-transparent to-[#07090E]/90 pointer-events-none" />

        {/* 3. CAPA VECTORIAL SVG */}
        <svg
          viewBox="0 0 400 800"
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="goldRouteGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E5C07B" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#F5D77F" />
            </linearGradient>

            <filter id="routeGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Manzanas y Red de Calles Iluminadas Secundarias */}
          <g stroke="#D4AF37" strokeOpacity="0.18" strokeWidth="1" fill="none">
            <path d="M 40,240 L 140,220 L 160,280 L 60,300 Z" />
            <path d="M 60,310 L 160,290 L 175,340 L 75,360 Z" />
            <path d="M 155,215 L 260,195 L 275,250 L 175,270 Z" />
            <path d="M 180,280 L 285,260 L 295,310 L 195,330 Z" />
            <path d="M 70,170 L 170,150 L 185,200 L 85,220 Z" />
            <path d="M 270,190 L 370,170 L 380,220 L 280,240 Z" />
            <line x1="20" y1="420" x2="160" y2="400" strokeOpacity="0.25" strokeWidth="1.2" />
            <line x1="40" y1="480" x2="140" y2="460" strokeOpacity="0.2" />
            <line x1="180" y1="450" x2="250" y2="430" strokeOpacity="0.2" />
          </g>

          {/* Etiqueta Caligráfica "LAGO SAN ROQUE" */}
          <g opacity="0.85">
            <text
              x="295"
              y="600"
              fill="#D4AF37"
              fontSize="14"
              fontFamily="'Playfair Display', Georgia, serif"
              fontStyle="italic"
              letterSpacing="3"
              textAnchor="middle"
            >
              LAGO
            </text>
            <text
              x="295"
              y="620"
              fill="#D4AF37"
              fontSize="13"
              fontFamily="'Playfair Display', Georgia, serif"
              fontStyle="italic"
              letterSpacing="3"
              textAnchor="middle"
            >
              SAN ROQUE
            </text>
          </g>

          {/* Etiqueta de la Avenida Costanera */}
          <text
            x="60"
            y="545"
            fill="#9CA3AF"
            fontSize="9"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontWeight="500"
            transform="rotate(-28 60 545)"
            letterSpacing="0.5"
            opacity="0.8"
          >
            Av. Costanera
          </text>

          {/* TRAZADO DE RUTA DORADA (Solo visible en MODO RUTA) */}
          {mode === 'route' && (
            <g filter="url(#routeGlowFilter)">
              <path
                d={svgDest.pathD}
                stroke="#D4AF37"
                strokeWidth="9"
                strokeOpacity="0.45"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d={svgDest.pathD}
                stroke="url(#goldRouteGradient)"
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d={svgDest.pathD}
                stroke="#0B0B0E"
                strokeWidth="1.6"
                strokeDasharray="4 4"
                strokeLinecap="butt"
                fill="none"
              />
            </g>
          )}

          {/* Marcador de Punto de Usuario (Beacon Azul de Radar) */}
          <g>
            <circle cx="75" cy="520" r="16" fill="#3B82F6" fillOpacity="0.25" />
            <circle cx="75" cy="520" r="10" fill="#3B82F6" fillOpacity="0.45" stroke="#60A5FA" strokeWidth="1.5" />
            <circle cx="75" cy="520" r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="75" cy="520" r="2" fill="#FFFFFF" />
          </g>

          {/* ONDA EXPANSIVA DE RADAR (Modo Explorar con radio dinámico) */}
          {mode === 'explore' && (
            <g className="transition-all duration-500 ease-out">
              <circle
                cx="75"
                cy="520"
                r={
                  radiusKm <= 0.5 ? 120 :
                  radiusKm <= 1.0 ? 190 :
                  radiusKm <= 2.0 ? 280 : 390
                }
                fill="#D4AF37"
                fillOpacity="0.04"
                stroke="#D4AF37"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                strokeOpacity="0.35"
              />
              <circle
                cx="75"
                cy="520"
                r={
                  radiusKm <= 0.5 ? 85 :
                  radiusKm <= 1.0 ? 140 :
                  radiusKm <= 2.0 ? 210 : 310
                }
                fill="none"
                stroke="#F5D77F"
                strokeWidth="0.8"
                strokeOpacity="0.2"
              />
            </g>
          )}

          {/* Punto de anclaje blanco (Modo Ruta) */}
          {mode === 'route' && (
            <circle cx={svgDest.x} cy={svgDest.y} r="3.5" fill="#FFFFFF" stroke="#0B0B0E" strokeWidth="1.5" />
          )}
        </svg>

        {/* 4. Etiqueta Flotante "📍 Tu ubicación" */}
        <div 
          className="absolute z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0B0B0E]/90 border border-white/10 shadow-lg"
          style={{ top: '60.5%', left: '8%' }}
        >
          <MapPin className="w-3.5 h-3.5 text-[#F5D77F] fill-[#F5D77F]" />
          <span className="text-[11px] font-semibold text-white tracking-wide">
            Tu ubicación
          </span>
        </div>

        {/* 5. PINES EN EL MAPA: MODO RUTA (1 destino) vs MODO EXPLORAR (Múltiples comercios en radar) */}
        {mode === 'route' ? (
          <div 
            className="absolute z-20 flex flex-col items-center pointer-events-auto animate-scaleUp"
            style={{ top: routePos.top, left: routePos.left, transform: 'translate(-50%, -100%)' }}
          >
            <div className="relative w-12 h-14 bg-gradient-to-b from-[#F5D77F] via-[#D4AF37] to-[#AA7C26] rounded-t-full rounded-b-none p-[3px] shadow-[0_8px_20px_rgba(212,175,55,0.45)] flex flex-col items-center justify-start">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FFF5DA] to-[#E5C07B] flex items-center justify-center mt-0.5 shadow-inner">
                {renderBusinessIcon(routePos.iconType)}
              </div>
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[10px] border-x-transparent border-t-[11px] border-t-[#AA7C26]" />
            </div>

            <div className="mt-3.5 text-center flex items-center gap-1.5 px-2 py-1 rounded bg-[#0B0B0E]/85 backdrop-blur-md border border-gold-border/60 shadow-lg whitespace-nowrap">
              <span className="text-[10px] text-[#F5D77F]">⚑</span>
              <div className="text-left">
                <div className="text-[10px] font-bold text-[#F5D77F] leading-tight">
                  {business.nombre}
                </div>
                <div className="text-[9px] font-semibold text-[#E5C07B] tracking-wider leading-tight">
                  {business.subtitulo || "I LOVE CARLOS PAZ"}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Múltiples Pines Interactivos en Modo Exploración */
          filteredComercios.map((comercioItem) => {
            const pos = BUSINESS_MAP_POSITIONS[comercioItem.id] || { top: '50%', left: '50%', iconType: 'food' };
            const isSelected = selectedExploreBusiness?.id === comercioItem.id;

            return (
              <div
                key={comercioItem.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedExploreBusiness(isSelected ? null : comercioItem);
                }}
                className={`absolute z-20 flex flex-col items-center pointer-events-auto cursor-pointer transition-all duration-300 ${
                  isSelected ? 'scale-115 z-30' : 'hover:scale-105'
                }`}
                style={{
                  top: pos.top,
                  left: pos.left,
                  transform: 'translate(-50%, -100%)'
                }}
              >
                {/* Pin Metálico Dorado 3D con halo interactivo */}
                <div
                  className={`relative rounded-t-full rounded-b-none p-[2.5px] transition-all flex flex-col items-center justify-start ${
                    isSelected
                      ? 'w-11 h-13 bg-gradient-to-b from-[#FFF5DA] via-[#F5D77F] to-[#AA7C26] shadow-[0_0_24px_rgba(245,215,127,0.9)] ring-2 ring-[#FFF5DA]'
                      : 'w-10 h-12 bg-gradient-to-b from-[#F5D77F] via-[#D4AF37] to-[#AA7C26] shadow-[0_6px_16px_rgba(0,0,0,0.6)]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFF5DA] to-[#E5C07B] flex items-center justify-center mt-0.5 shadow-inner">
                    {renderBusinessIcon(pos.iconType)}
                  </div>
                  {/* Punta inferior del pin */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[8px] border-x-transparent border-t-[9px] border-t-[#AA7C26]" />
                </div>

                {/* Etiqueta Flotante con Nombre y Calificación */}
                <div
                  className={`mt-2.5 text-center flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md border shadow-lg whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#0B0B0E]/95 border-[#F5D77F] text-[#FFF5DA] shadow-[0_4px_14px_rgba(212,175,55,0.45)]'
                      : 'bg-[#0B0B0E]/85 border-gold-border/50 text-[#E5C07B]'
                  }`}
                >
                  <span className="text-[10px] font-bold leading-tight">
                    {comercioItem.nombre.replace(' I LOVE CARLOS PAZ', '')}
                  </span>
                  <span className="text-[9px] text-[#F5D77F] font-semibold flex items-center gap-0.5">
                    • {comercioItem.rating} ★
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* 6. Controles Flotantes a la Derecha */}
        <div className="absolute bottom-44 right-4 z-20 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => alert('Orientación calibrada hacia el norte')}
            className="w-10 h-10 rounded-full bg-[#121318]/90 backdrop-blur-md border border-gold-border/60 flex items-center justify-center text-[#E5C07B] hover:text-white shadow-xl cursor-pointer hover:border-[#D4AF37] transition-all"
          >
            <Compass className="w-5 h-5 stroke-[1.8]" />
          </button>
          <button
            type="button"
            onClick={() => setMapLayer(mapLayer === 'dark-gold' ? 'satellite' : 'dark-gold')}
            className="w-10 h-10 rounded-full bg-[#121318]/90 backdrop-blur-md border border-gold-border/60 flex items-center justify-center text-[#E5C07B] hover:text-white shadow-xl cursor-pointer hover:border-[#D4AF37] transition-all"
          >
            <Layers className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>

        {/* 7. Indicador Métrico de Escala */}
        <div className="absolute bottom-44 left-5 z-20 text-[10px] text-gray-300 font-mono select-none">
          <span className="tracking-wider">100 m</span>
          <div className="w-14 h-1.5 border-b border-x border-[#E5C07B]/70 mt-0.5" />
        </div>
      </div>

      {/* ========================================================
          8. CARD INFERIOR (Solo en MODO RUTA GUIADA)
         ======================================================== */}
      {mode === 'route' && (
        <div className="relative z-30 px-4 pb-2 animate-fadeIn">
          <div className="bg-[#121318]/95 backdrop-blur-xl border border-gold-border/50 rounded-3xl p-4 shadow-[0_12px_32px_rgba(0,0,0,0.85)] space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
                <Clock className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <div className="font-bold text-base text-[#F5F5F7] tracking-wide">
                  {business.distancia || "200 m • 3 min caminando"}
                </div>
                <div className="text-xs text-[#9CA3AF] mt-0.5">
                  {business.tiempoEstimado || "Llega en 3 min • Ruta más rápida, sin tráfico"}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenGoogleMaps}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
            >
              <span>Abrir en Google Maps</span>
              <ExternalLink className="w-4 h-4 stroke-[2.8]" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          9. MINI-CARD FLOTANTE INFERIOR (Modo Explorar al tocar un Pin)
         ======================================================== */}
      {mode === 'explore' && selectedExploreBusiness && (
        <div className="relative z-30 px-4 pb-2 animate-fadeIn">
          <div className="bg-[#121318]/95 backdrop-blur-xl border border-gold-border/60 rounded-3xl p-4 shadow-[0_16px_36px_rgba(0,0,0,0.9)] space-y-3">
            
            {/* Cabecera de la Mini-Card: Foto, Info y Botón Cerrar */}
            <div className="flex items-start gap-3">
              {/* Foto HD Miniatura */}
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-md">
                <img
                  src={selectedExploreBusiness.fotos?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80'}
                  alt={selectedExploreBusiness.nombre}
                  className="w-full h-full object-cover"
                />
                {selectedExploreBusiness.esPremium && (
                  <span className="absolute top-1 left-1 px-1 py-0.5 rounded-sm bg-[#D4AF37] text-[8px] font-extrabold text-black leading-none">
                    ★
                  </span>
                )}
              </div>

              {/* Textos del Comercio */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-[#F5F5F7] truncate leading-tight">
                    {selectedExploreBusiness.nombre}
                  </h3>
                </div>

                <p className="text-[11px] text-gray-400 truncate mt-0.5">
                  {selectedExploreBusiness.eslogan || selectedExploreBusiness.direccion}
                </p>

                <div className="flex items-center gap-2 mt-1.5 text-xs">
                  <span className="text-[#F5D77F] font-bold flex items-center gap-0.5">
                    ★ {selectedExploreBusiness.rating}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-300 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#E5C07B]" />
                    {selectedExploreBusiness.distancia?.split('•')[0] || `${(selectedExploreBusiness.distanciaKm || 0.5) * 1000} m`}
                  </span>
                </div>
              </div>

              {/* Botón Cerrar Mini-Card (X) */}
              <button
                type="button"
                onClick={() => setSelectedExploreBusiness(null)}
                className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Botones de Acción: Ver Ficha & Cómo Llegar */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (onOpenBusinessDetail) {
                    onOpenBusinessDetail(selectedExploreBusiness);
                  }
                }}
                className="py-3 px-3 rounded-2xl bg-white/5 border border-white/10 hover:border-gold-border/60 hover:bg-white/10 text-xs font-bold text-[#FAF6EE] tracking-wide flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Ver Ficha</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#E5C07B]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveBusiness(selectedExploreBusiness);
                  setMode('route');
                }}
                className="py-3 px-3 rounded-2xl bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] font-bold text-xs tracking-wide uppercase flex items-center justify-center gap-1.5 shadow-gold-glow hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 fill-[#0B0B0E]" />
                <span>Cómo llegar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
