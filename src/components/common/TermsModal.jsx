import React from 'react';
import { X, ShieldCheck, MapPin, Tag, Lock, Check } from 'lucide-react';

export default function TermsModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="relative w-full max-w-sm bg-[#121217] border border-gold-border rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col max-h-[90vh]">
        
        {/* Botón de Cierre */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-300 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="p-5 pb-3 border-b border-white/5 text-center shrink-0">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C07B] mx-auto mb-2 shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-xl font-bold text-white tracking-wide">
            Términos y Privacidad
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Políticas de uso, GPS y tratamiento de datos
          </p>
        </div>

        {/* Contenido con Scroll */}
        <div className="p-5 overflow-y-auto space-y-4 text-left text-xs text-gray-300 leading-relaxed">
          
          {/* Bloque 1: GPS y Geolocalización */}
          <div className="bg-[#1A1A22] border border-white/5 p-3.5 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-[#E5C07B] font-bold text-xs">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>1. Geolocalización y Permisos GPS</span>
            </div>
            <p className="text-gray-400 text-[11px]">
              La aplicación solicita acceso a tu ubicación GPS únicamente para calcular la distancia métrica a los comercios y trazar rutas recomendadas en el mapa. Si decides no activar el GPS, puedes seleccionar tu localidad manualmente en cualquier momento desde el selector superior.
            </p>
          </div>

          {/* Bloque 2: Cupones y Beneficios */}
          <div className="bg-[#1A1A22] border border-white/5 p-3.5 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-[#E5C07B] font-bold text-xs">
              <Tag className="w-4 h-4 shrink-0" />
              <span>2. Beneficios y Cupones Gratuitos</span>
            </div>
            <p className="text-gray-400 text-[11px]">
              El acceso a los descuentos de <strong className="text-white">I LOVE CARLOS PAZ</strong> es 100% gratuito para el turista o residente. Nunca te solicitaremos datos bancarios ni números de tarjeta de crédito. Los beneficios se validan directamente en el comercio mostrando tu código QR.
            </p>
          </div>

          {/* Bloque 3: Privacidad de Datos */}
          <div className="bg-[#1A1A22] border border-white/5 p-3.5 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-[#E5C07B] font-bold text-xs">
              <Lock className="w-4 h-4 shrink-0" />
              <span>3. Protección y Confidencialidad</span>
            </div>
            <p className="text-gray-400 text-[11px]">
              Tus datos personales (nombre, teléfono y correo) están resguardados bajo estándares de privacidad y solo se utilizan para la gestión de tu membresía y para contactarte en caso de novedades exclusivas o soporte técnico.
            </p>
          </div>

          <div className="text-[10px] text-gray-400 text-center pt-1">
            Versión actualizada para la temporada 2026 • Villa Carlos Paz
          </div>
        </div>

        {/* Botón de Aceptación */}
        <div className="p-4 border-t border-white/5 bg-[#0E0E12] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-gold-gradient text-[#0B0B0E] font-bold text-xs tracking-wider uppercase shadow-gold-glow hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Comprendido y Aceptado</span>
          </button>
        </div>
      </div>
    </div>
  );
}
