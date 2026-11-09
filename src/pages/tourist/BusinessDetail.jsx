import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Heart, 
  Share2, 
  Star, 
  MapPin, 
  Navigation, 
  MessageCircle, 
  Bookmark, 
  ChevronRight, 
  Tag, 
  Pencil, 
  ThumbsUp,
  QrCode,
  Sparkles
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { reviewsMock } from '../../data/mocks/reviews';
import { comerciosMock } from '../../data/mocks/comercios';

export default function BusinessDetail({ 
  comercio, 
  onBack, 
  onNavigateToMap, 
  onOpenCoupon,
  isSaved = false,
  onToggleSave,
  allComercios = [],
  onSelectRelatedBusiness
}) {
  const [isFavorite, setIsFavorite] = useState(isSaved);
  const [likedReviews, setLikedReviews] = useState({});

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (onToggleSave && comercio) {
      onToggleSave(comercio.id);
    }
  };

  if (!comercio) return null;

  // Algoritmo de promociones similares y comercios relacionados (Módulo 2)
  const pool = allComercios.length > 0 ? allComercios : comerciosMock;
  const relatedBusinesses = pool
    .filter((c) => c.id !== comercio.id)
    .sort((a, b) => {
      // 1. Priorizar misma categoría
      const aSameCategory = a.categoriaId === comercio.categoriaId;
      const bSameCategory = b.categoriaId === comercio.categoriaId;
      if (aSameCategory && !bSameCategory) return -1;
      if (!aSameCategory && bSameCategory) return 1;
      // 2. Priorizar menor distancia
      return (a.distanciaKm || 0) - (b.distanciaKm || 0);
    });

  const toggleReviewLike = (reviewId) => {
    setLikedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const galleryImages = comercio.fotos && comercio.fotos.length > 0
    ? comercio.fotos
    : [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80"
      ];

  return (
    <div className="w-full min-h-screen bg-[#0B0B0E] text-[#F5F5F7] pb-24 overflow-x-hidden select-none">
      {/* 1. Header Fotográfico con Acciones Flotantes */}
      <div className="relative w-full h-64 bg-[#141418]">
        <img
          src={galleryImages[0]}
          alt={comercio.nombre}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0E] via-transparent to-black/60" />

        {/* Botones de Navegación Flotantes */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-[#E5C07B] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleFavorite}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-red-400 transition-colors cursor-pointer"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => alert('Enlace copiado al portapapeles')}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-[#E5C07B] transition-colors cursor-pointer"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Cuerpo de la Ficha */}
      <div className="px-5 pt-3 space-y-5">
        {/* Título y Badge Premium */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <h1 className="font-serif text-2xl font-bold text-white tracking-wide leading-tight">
              {comercio.nombre}
            </h1>
            {comercio.esPremium && (
              <span className="shrink-0 text-[10px] font-bold text-[#E5C07B] bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                ★ premium
              </span>
            )}
          </div>

          {/* Calificación y Conteo de Reseñas */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex text-[#E5C07B]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#E5C07B] stroke-[#E5C07B]" />
              ))}
            </div>
            <span className="text-sm font-semibold text-white">{comercio.rating}</span>
            <span className="text-xs text-gray-400">({comercio.reviewsCount} reseñas)</span>
          </div>

          {/* Dirección y Horarios */}
          <div className="flex items-start gap-2 text-xs text-gray-400 mt-2.5">
            <MapPin className="w-4 h-4 text-[#E5C07B] shrink-0 mt-0.5" />
            <span>
              {comercio.direccion} — <span className="text-gray-300">{comercio.horario}</span>
            </span>
          </div>
        </div>

        {/* 3. Botones de Acción Inmediata (Cómo llegar, WhatsApp, Guardar) */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => onNavigateToMap && onNavigateToMap(comercio)}
            className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-[#141418] border border-gold-border hover:border-[#D4AF37] text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <Navigation className="w-4 h-4 text-[#E5C07B]" />
            <span>Cómo llegar</span>
          </button>

          <button
            type="button"
            onClick={() => window.open(`https://wa.me/${comercio.whatsapp?.replace(/\+/g, '')}`, '_blank')}
            className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-gold-gradient text-[#0B0B0E] text-xs font-bold transition-all shadow-gold-glow/20 hover:brightness-105 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-[#0B0B0E]" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isFavorite
                ? 'bg-[#1C1810] border-[#D4AF37] text-[#E5C07B]'
                : 'bg-[#141418] border-gold-border hover:border-[#D4AF37] text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-[#E5C07B] text-[#E5C07B]' : 'text-[#E5C07B]'}`} />
            <span>{isFavorite ? 'Guardado' : 'Guardar'}</span>
          </button>
        </div>

        {/* 4. Galería de Fotos */}
        <section className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white tracking-wide">
              Galería de fotos
            </h2>
            <button
              type="button"
              className="text-xs text-gray-400 hover:text-[#E5C07B] flex items-center gap-0.5 cursor-pointer"
            >
              <span>Ver todo (12)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {galleryImages.slice(0, 4).map((img, idx) => (
              <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-[#18181D] border border-white/5">
                <img
                  src={img}
                  alt={`Foto ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </section>

        {/* 5. Tarjeta Destacada de Cupón QR */}
        <section className="pt-2">
          <div 
            onClick={() => onOpenCoupon && onOpenCoupon(comercio.promocionPrincipal)}
            className="relative rounded-2xl p-4 overflow-hidden border border-dashed border-[#D4AF37] bg-gradient-to-r from-[#211B10] via-[#1A1710] to-[#141418] shadow-gold-glow/20 cursor-pointer hover:border-[#F5D77F] transition-all duration-200"
          >
            <div className="flex items-center justify-between gap-3">
              {/* Información del Beneficio */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#D4AF37]/20 text-[#E5C07B]">
                    <Tag className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-wide">
                    {comercio.promocionPrincipal?.titulo || 'Cupón 20% OFF'}
                  </h3>
                </div>
                <p className="text-xs text-gray-300 pt-1">
                  {comercio.promocionPrincipal?.validez}
                </p>
                <p className="text-[11px] text-gray-400">
                  {comercio.promocionPrincipal?.condicion}
                </p>
              </div>

              {/* Botón Cuadrado QR Dorado (Invita a abrir el cupón completo) */}
              <div className="shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F5D77F] via-[#D4AF37] to-[#AA7C26] p-2 flex flex-col items-center justify-center text-[#0B0B0E] shadow-[0_4px_16px_rgba(212,175,55,0.35)] group-hover:scale-105 transition-all duration-200">
                <QrCode className="w-8 h-8 stroke-[2.2] text-[#0B0B0E]" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0B0B0E] mt-1">
                  Ver QR
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Muro de Reseñas */}
        <section className="pt-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Reseñas</h2>
            <button
              type="button"
              onClick={() => alert('Formulario para escribir reseña')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E5C07B] text-[#0B0B0E] text-xs font-bold shadow-sm hover:brightness-105 cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Escribir reseña</span>
            </button>
          </div>

          {/* Resumen de Calificación */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{comercio.rating}</span>
            <div className="flex text-[#E5C07B]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#E5C07B] stroke-[#E5C07B]" />
              ))}
            </div>
            <span className="text-xs text-gray-400">{comercio.reviewsCount} reseñas</span>
          </div>

          {/* Lista de Reseñas */}
          <div className="space-y-3 pt-1">
            {reviewsMock.map((rev) => {
              const isLiked = likedReviews[rev.id];
              return (
                <div
                  key={rev.id}
                  className="bg-[#141418] border border-white/5 rounded-2xl p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full ${rev.inicialBg} font-bold text-xs flex items-center justify-center shadow-inner`}>
                        {rev.inicial}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{rev.autor}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                          <div className="flex text-[#E5C07B]">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-2.5 h-2.5 fill-[#E5C07B] stroke-[#E5C07B]" />
                            ))}
                          </div>
                          <span>{rev.fecha}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    {rev.comentario}
                  </p>

                  <div className="flex items-center justify-start pt-1">
                    <button
                      type="button"
                      onClick={() => toggleReviewLike(rev.id)}
                      className={`flex items-center gap-1.5 text-[11px] transition-colors cursor-pointer ${
                        isLiked ? 'text-[#E5C07B] font-semibold' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#E5C07B]' : ''}`} />
                      <span>{rev.likes + (isLiked ? 1 : 0)}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. Carrusel de Promociones Similares Cerca Tuyo (Módulo 2 - Venta Cruzada) */}
        {relatedBusinesses.length > 0 && (
          <section className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#F5D77F]" />
                  <span>Promociones similares cerca tuyo</span>
                </h2>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Otros lugares destacados que te pueden interesar
                </p>
              </div>
            </div>

            {/* Carrusel Horizontal Scrollable */}
            <div className="flex gap-3 overflow-x-auto pb-3 -mx-5 px-5 scrollbar-none">
              {relatedBusinesses.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (onSelectRelatedBusiness) {
                      onSelectRelatedBusiness(item);
                    }
                  }}
                  className="w-60 shrink-0 bg-[#141418] border border-white/5 hover:border-gold-border rounded-2xl p-3 space-y-2.5 transition-all duration-200 cursor-pointer hover:shadow-gold-glow/20 group"
                >
                  {/* Foto miniatura con badge de descuento */}
                  <div className="relative w-full h-28 rounded-xl overflow-hidden bg-[#181820]">
                    <img
                      src={item.fotos?.[0]}
                      alt={item.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[9px] font-black text-[#F5D77F] border border-gold-500/30">
                      {item.promocionPrincipal?.descuento || 'PROMO'}
                    </div>
                    {item.esPremium && (
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-[#D4AF37] text-[8px] font-black text-black">
                        ★
                      </div>
                    )}
                  </div>

                  {/* Textos del comercio relacionado */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-xs text-white truncate group-hover:text-[#F5D77F] transition-colors">
                      {item.nombre}
                    </h3>
                    <p className="text-[10px] text-gray-400 truncate">
                      {item.eslogan}
                    </p>
                  </div>

                  {/* Beneficio y Distancia */}
                  <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-300">
                    <div className="flex items-center gap-1 text-[#E5C07B] font-semibold truncate pr-2">
                      <Tag className="w-3 h-3 shrink-0" />
                      <span className="truncate">{item.promocionPrincipal?.titulo}</span>
                    </div>

                    <div className="shrink-0 flex items-center gap-1 text-gray-400">
                      <MapPin className="w-3 h-3 text-[#E5C07B]" />
                      <span>{item.distancia?.split('•')[0] || `${(item.distanciaKm || 0.5) * 1000} m`}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer de Marca */}
        <div className="text-center text-[10px] text-gray-400 pt-4 pb-2 tracking-wide">
          {comercio.nombre} • I LOVE {comercio.localidadId === 'carlos-paz' ? 'CARLOS PAZ' : 'ZONA'} • Premium
        </div>
      </div>
    </div>
  );
}
