import React, { useState } from 'react';
import { MapPin, ChevronDown, ChevronRight, Check } from 'lucide-react';
import { localidadesMock } from '../../data/mocks/localidades';

export default function ZoneSelector({ onSelectZone, initialZone = 'carlos-paz' }) {
  const [selectedZoneId, setSelectedZoneId] = useState(initialZone);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedZone = localidadesMock.find((loc) => loc.id === selectedZoneId) || localidadesMock[0];

  const handleConfirm = () => {
    if (onSelectZone) {
      onSelectZone(selectedZone);
    } else {
      alert(`Zona confirmada: ${selectedZone.nombre}`);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen bg-[#0B0B0E] text-[#F5F5F7] flex flex-col justify-between p-5 pb-8 overflow-hidden select-none">
      {/* Fondo sutil con brillo dorado superior */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Contenido Superior */}
      <div className="relative z-10">
        {/* Header de Marca */}
        <header className="flex items-baseline justify-between pt-4 pb-6">
          <h1 className="font-serif text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#AA7C26] font-bold">
            I LOVE
          </h1>
          <span className="text-xs tracking-wide text-[#C9A66B]/90 font-medium lowercase">
            selector de zona premium
          </span>
        </header>

        {/* Selector de Ubicación Activa (GPS / Actual) */}
        <div 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full bg-[#141418] border border-gold-border rounded-2xl p-4 flex items-center justify-between shadow-lg cursor-pointer hover:border-gold-400 transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-[#E5C07B] fill-[#E5C07B]/20 shrink-0" />
            <span className="font-semibold text-base text-[#F5F5F7]">
              Estas en {selectedZone.nombre}
            </span>
          </div>
          <ChevronDown className={`w-5 h-5 text-[#E5C07B] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </div>

        {/* Título de Sección */}
        <div className="mt-8 mb-4">
          <h2 className="text-sm tracking-wider text-[#C9A66B] font-medium lowercase">
            Zonas disponibles
          </h2>
        </div>

        {/* Lista de Zonas Disponibles */}
        <div className="space-y-3">
          {localidadesMock.map((zona) => {
            const isSelected = zona.id === selectedZoneId;
            return (
              <button
                key={zona.id}
                type="button"
                onClick={() => {
                  setSelectedZoneId(zona.id);
                  setDropdownOpen(false);
                }}
                className={`w-full text-left p-3.5 rounded-2xl flex items-center justify-between transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#1A1A22] border border-[#D4AF37] shadow-gold-glow/40'
                    : 'bg-[#141418] border border-white/5 hover:border-gold-border'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Ícono con contenedor cuadrado dorado */}
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F5D77F] via-[#D4AF37] to-[#AA7C26] flex items-center justify-center shrink-0 shadow-md">
                    <MapPin className="w-5 h-5 text-[#0B0B0E] fill-[#0B0B0E]" />
                  </div>
                  
                  {/* Textos de Localidad */}
                  <div className="truncate">
                    <div className="font-semibold text-base text-white tracking-wide truncate">
                      {zona.nombre}
                    </div>
                    <div className="text-xs text-gray-400 font-normal mt-0.5 truncate">
                      {zona.subtitulo} • {zona.distanciaKm === 0 ? 'Tu ubicación actual' : `${zona.distanciaKm} km`}
                    </div>
                  </div>
                </div>

                {/* Indicador derecho */}
                <div className="shrink-0 ml-2">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-[#E5C07B]" />
                    </div>
                  ) : (
                    <ChevronRight className="w-5 h-5 text-[#E5C07B]/70" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Botón de Confirmar Zona (Fijo al pie) */}
      <div className="relative z-10 pt-6">
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full py-4 rounded-2xl bg-gold-gradient text-[#0B0B0E] font-bold text-sm tracking-wider uppercase shadow-gold-glow hover:brightness-105 active:scale-[0.99] transition-all duration-150 cursor-pointer"
        >
          CONFIRMAR ZONA
        </button>
      </div>
    </div>
  );
}
