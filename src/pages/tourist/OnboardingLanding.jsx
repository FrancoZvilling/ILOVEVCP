import React from 'react';
import { Compass, Ticket, MapPin, Heart, ArrowRight, Sparkles } from 'lucide-react';

export default function OnboardingLanding({ onStartExploring }) {
  const benefits = [
    {
      id: 'discover',
      title: 'Descubrí todo Carlos Paz',
      description: 'Explorá atractivos, gastronomía y eventos locales',
      icon: Compass,
    },
    {
      id: 'coupons',
      title: 'Descuentos exclusivos con cupones',
      description: 'Ahorrá en restaurantes, paseos y actividades',
      icon: Ticket,
    },
    {
      id: 'map',
      title: 'Mapa cerca tuyo',
      description: 'Encontrá lugares cercanos en tiempo real',
      icon: MapPin,
    },
    {
      id: 'favorites',
      title: 'Guardar favoritos',
      description: 'Guardá tus lugares preferidos para visitar',
      icon: Heart,
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#07080C] text-[#F5F5F7] flex flex-col justify-between p-5 pb-8 overflow-hidden select-none">
      {/* 1. Fondo de Lago Nocturno con Reflejos y Cielo Estrellado */}
      <div className="absolute inset-0 z-0">
        <img
          src="/mock-images/lake-san-roque-night.jpg"
          alt="Lago San Roque de Noche"
          onError={(e) => {
            // Fallback elegante mientras carga o si no existe
            e.currentTarget.style.display = 'none';
          }}
          className="w-full h-full object-cover object-center"
        />
        {/* Viñeta oscura con degradé nocturno */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07080C]/85 via-[#0B0B0E]/60 to-[#07080C]/95" />
        {/* Destello de luz dorada superior */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-60 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Header de Marca (Estilo Serif de Alto Impacto) */}
      <div className="relative z-10 pt-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F5D77F] text-[10px] font-bold tracking-widest uppercase mb-3">
          <Sparkles className="w-3 h-3 text-[#F5D77F]" />
          GUÍA EXCLUSIVA
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#FAF6EE] via-[#E5C07B] to-[#D4AF37] leading-tight">
          I LOVE
        </h1>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-b from-[#FAF6EE] via-[#E5C07B] to-[#C9A66B] mt-0.5">
          CARLOS PAZ
        </h2>

        <p className="font-sans text-xs tracking-wide text-[#E5C07B]/90 font-medium mt-2">
          Tu guía premium de Villa Carlos Paz
        </p>
      </div>

      {/* 3. Tarjeta Translúcida Central con Lista de Beneficios */}
      <div className="relative z-10 my-6">
        <div className="bg-[#121217]/85 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-[0_16px_40px_rgba(0,0,0,0.8)] space-y-4">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex items-center gap-3.5 py-1.5 group"
              >
                {/* Ícono Circular Dorado */}
                <div className="w-12 h-12 rounded-full border border-gold-border/60 bg-gradient-to-br from-[#1C1A14] to-[#121216] flex items-center justify-center shrink-0 shadow-md group-hover:border-[#D4AF37] transition-colors">
                  <Icon className="w-5 h-5 text-[#E5C07B] stroke-[1.8]" />
                </div>

                {/* Textos del Beneficio */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-white tracking-wide truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-300 font-normal leading-relaxed mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Botón de Acción Principal y Microcopy de Confianza */}
      <div className="relative z-10 space-y-3">
        <button
          type="button"
          onClick={onStartExploring}
          className="w-full py-4 rounded-2xl bg-gold-gradient text-[#0B0B0E] font-bold text-sm tracking-wide uppercase shadow-gold-glow hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Descargar y registrarse</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        <p className="text-center text-[11px] text-gray-400 tracking-wide">
          Gratis • Registrate en segundos • Sin tarjeta
        </p>
      </div>
    </div>
  );
}
