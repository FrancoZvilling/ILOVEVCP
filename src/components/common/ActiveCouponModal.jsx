import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Copy, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Bookmark, 
  Repeat, 
  CheckCircle2 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function ActiveCouponModal({ 
  coupon, 
  onClose, 
  onToggleSave, 
  onSimulateRedeem 
}) {
  const [copied, setCopied] = useState(false);
  const [redemptionSuccess, setRedemptionSuccess] = useState(false);

  if (!coupon) return null;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(coupon.codigo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeem = () => {
    setRedemptionSuccess(true);
    if (onSimulateRedeem) {
      onSimulateRedeem(coupon.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn">
      {/* Contenedor del Modal */}
      <div className="relative w-full max-w-sm bg-[#121217] border border-gold-border rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col max-h-[92vh]">
        
        {/* Botón de Cierre Superior */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-300 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. Header con Imagen de la Promo */}
        <div className="relative w-full h-36 bg-[#1A1A22] shrink-0">
          <img
            src={coupon.imagen}
            alt={coupon.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-black/50" />
          
          {/* Badge de Descuento */}
          <div className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/50 text-[#F5D77F] text-xs font-bold shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#F5D77F]" />
            <span>{coupon.descuento}</span>
          </div>

          {/* Badge de Recurrencia */}
          <div className="absolute bottom-3 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1C1A14]/90 border border-gold-border text-[10px] text-[#E5C07B] font-semibold">
            <Repeat className="w-3 h-3 text-[#E5C07B]" />
            <span>Uso Recurrente</span>
          </div>
        </div>

        {/* 2. Cuerpo del Cupón */}
        <div className="p-5 overflow-y-auto space-y-4 text-center">
          <div>
            <span className="text-[10px] tracking-widest text-[#E5C07B] uppercase font-bold">
              MEMBRESÍA I LOVE CARLOS PAZ
            </span>
            <h2 className="font-serif text-xl font-bold text-white mt-0.5">
              {coupon.titulo}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {coupon.comercioNombre}
            </p>
          </div>

          {/* 3. Ticket con Código QR Gigante */}
          <div className="relative bg-[#1A1A22] border border-dashed border-[#D4AF37]/60 rounded-2xl p-4 shadow-inner">
            {/* Muescas laterales de ticket */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#121217] border-r border-[#D4AF37]/60" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#121217] border-l border-[#D4AF37]/60" />

            {redemptionSuccess ? (
              /* Feedback de Canje Registrado */
              <div className="py-6 flex flex-col items-center justify-center space-y-2 animate-scaleUp">
                <div className="w-14 h-14 rounded-full bg-[#25D366]/20 border border-[#25D366] flex items-center justify-center text-[#25D366] shadow-lg">
                  <Check className="w-7 h-7 stroke-[3]" />
                </div>
                <h3 className="font-bold text-base text-white">
                  ¡Canje Registrado con Éxito!
                </h3>
                <p className="text-xs text-gray-300 max-w-[240px]">
                  Descuento verificado por el personal. Este beneficio sigue activo en tu cuenta para tu próxima visita.
                </p>
                <div className="mt-2 p-2 rounded-xl bg-black/40 border border-white/5 w-full text-[11px] text-gray-400 flex items-center justify-between">
                  <span>Total de canjes en este local:</span>
                  <span className="font-bold text-[#F5D77F]">{coupon.vecesUsado + 1} visitas</span>
                </div>
              </div>
            ) : (
              /* Código QR Listo para Escanear */
              <div className="flex flex-col items-center">
                <div className="p-3 bg-white rounded-2xl shadow-xl">
                  <QRCodeSVG
                    value={coupon.codigo}
                    size={160}
                    level="H"
                    fgColor="#0B0B0E"
                  />
                </div>

                <div className="flex items-center gap-1.5 mt-3 text-xs text-[#25D366] font-semibold">
                  <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                  <span>Mostrá este QR al mozo o recepcionista</span>
                </div>

                {/* Código Alfanumérico de Respaldo */}
                <div className="mt-2.5 inline-flex items-center gap-2 bg-[#0E0E12] border border-gold-border px-3 py-1.5 rounded-xl">
                  <span className="font-mono text-xs font-bold text-[#F5D77F] tracking-wider">
                    #{coupon.codigo}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Conteo de usos históricos */}
                {coupon.vecesUsado > 0 && (
                  <p className="text-[10px] text-gray-400 mt-2">
                    Has utilizado este beneficio <span className="text-[#E5C07B] font-bold">{coupon.vecesUsado} veces</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 4. Condiciones de Uso */}
          <div className="text-left bg-white/5 rounded-xl p-3 space-y-1 text-[11px] text-gray-300">
            <div className="flex items-center gap-1.5 text-gray-400 font-medium">
              <Clock className="w-3 h-3 text-[#E5C07B]" />
              <span>{coupon.validez}</span>
            </div>
            <p className="text-gray-400 pl-4">
              {coupon.condiciones}
            </p>
          </div>

          {/* 5. Acciones: Guardar Cupón + Simular Canje (Demo) */}
          <div className="space-y-2 pt-1">
            {/* Botón Guardar / Guardado */}
            <button
              type="button"
              onClick={() => onToggleSave && onToggleSave(coupon.id)}
              className={`w-full py-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                coupon.guardado
                  ? 'bg-[#1C1810] border-[#D4AF37] text-[#E5C07B]'
                  : 'bg-gold-gradient text-black hover:brightness-105 shadow-gold-glow'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${coupon.guardado ? 'fill-[#E5C07B]' : ''}`} />
              <span>{coupon.guardado ? '✓ Guardado en Mis Cupones' : 'Guardar cupón en Mis Cupones'}</span>
            </button>

            {/* Botón Simular Canje (Demo Comercial) */}
            {!redemptionSuccess ? (
              <button
                type="button"
                onClick={handleRedeem}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-gray-400 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#E5C07B]" />
                <span>Simular escaneo del comercio (Demo)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-white/10 text-white font-semibold text-xs cursor-pointer hover:bg-white/15"
              >
                Listo, cerrar ventana
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
