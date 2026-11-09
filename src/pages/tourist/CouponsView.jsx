import React, { useState } from 'react';
import { 
  Sparkles, 
  Bookmark, 
  CheckCircle2, 
  ChevronRight, 
  QrCode, 
  History, 
  Compass, 
  Calendar, 
  Building2 
} from 'lucide-react';

export default function CouponsView({ 
  coupons, 
  onOpenCouponModal, 
  onToggleSave 
}) {
  const [activeTab, setActiveTab] = useState('explorar'); // 'explorar' | 'guardados' | 'historial'

  const savedCoupons = coupons.filter((c) => c.guardado);

  // Generamos la lista plana de todos los canjes históricos
  const allRedemptions = coupons
    .flatMap((c) => (c.historialCanjes || []).map((h) => ({ ...h, couponTitle: c.titulo, descuento: c.descuento })))
    .sort((a, b) => b.id.localeCompare(a.id));

  return (
    <div className="w-full min-h-screen bg-[#0B0B0E] text-[#F5F5F7] p-5 pb-24 overflow-x-hidden select-none">
      
      {/* 1. Header */}
      <div className="pt-2 mb-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F5D77F] text-[10px] font-bold tracking-widest uppercase mb-2">
          <Sparkles className="w-3 h-3 text-[#F5D77F]" />
          MEMBRESÍA EXCLUSIVA
        </div>
        <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
          Beneficios & Cupones
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Descuentos de uso recurrente para disfrutar durante toda tu estadía.
        </p>
      </div>

      {/* 2. Pestañas Semánticas: Explorar | Guardados | Historial */}
      <div className="flex bg-[#141418] border border-white/5 rounded-2xl p-1 mb-5 shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('explorar')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'explorar'
              ? 'text-[#F5D77F] bg-[#1E1E26] shadow-md border-b-2 border-[#D4AF37]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Explorar ({coupons.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('guardados')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'guardados'
              ? 'text-[#F5D77F] bg-[#1E1E26] shadow-md border-b-2 border-[#D4AF37]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Guardados ({savedCoupons.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('historial')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'historial'
              ? 'text-[#F5D77F] bg-[#1E1E26] shadow-md border-b-2 border-[#D4AF37]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Historial ({allRedemptions.length})
        </button>
      </div>

      {/* 3. Contenido de Cada Pestaña */}

      {/* PESTAÑA A: EXPLORAR (Catálogo Completo de la Ciudad) */}
      {activeTab === 'explorar' && (
        <div className="space-y-3.5">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-[#141418] border border-white/5 hover:border-gold-border rounded-2xl overflow-hidden transition-all duration-200 group"
            >
              <div className="flex p-3 gap-3">
                {/* Miniatura con Descuento */}
                <div 
                  onClick={() => onOpenCouponModal(coupon)}
                  className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-[#1C1C22] cursor-pointer"
                >
                  <img
                    src={coupon.imagen}
                    alt={coupon.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[9px] font-black text-[#F5D77F] border border-gold-500/30">
                    {coupon.descuento}
                  </div>
                </div>

                {/* Info y Acciones */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[10px] text-[#E5C07B] font-bold uppercase truncate">
                        {coupon.comercioNombre}
                      </span>
                      {/* Botón de Guardar Rápido */}
                      <button
                        type="button"
                        onClick={() => onToggleSave(coupon.id)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          coupon.guardado
                            ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#E5C07B]'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                        }`}
                        title={coupon.guardado ? 'Guardado' : 'Guardar cupón'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${coupon.guardado ? 'fill-[#E5C07B]' : ''}`} />
                      </button>
                    </div>

                    <h3 
                      onClick={() => onOpenCouponModal(coupon)}
                      className="font-bold text-sm text-white truncate hover:text-[#F5D77F] cursor-pointer mt-0.5"
                    >
                      {coupon.titulo}
                    </h3>
                    <p className="text-[11px] text-gray-400 truncate">
                      {coupon.validez}
                    </p>
                  </div>

                  {/* Botón Abrir QR */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    {coupon.vecesUsado > 0 ? (
                      <span className="text-[10px] text-gray-400 font-medium">
                        Usado {coupon.vecesUsado} veces
                      </span>
                    ) : (
                      <span className="text-[10px] text-green-400 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        Beneficio activo
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => onOpenCouponModal(coupon)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#E5C07B] hover:text-[#F5D77F] cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Ver QR</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PESTAÑA B: GUARDADOS (Billetera Personal) */}
      {activeTab === 'guardados' && (
        <div className="space-y-3.5">
          {savedCoupons.length === 0 ? (
            /* Empty State si no guardó nada aún */
            <div className="py-12 px-6 text-center bg-[#141418] border border-white/5 rounded-3xl space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C07B] mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">
                Tu billetera de cupones está vacía
              </h3>
              <p className="text-xs text-gray-400 max-w-[240px] mx-auto">
                Guardá beneficios desde la pestaña Explorar para tenerlos listos cuando llegues al local.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('explorar')}
                className="mt-2 px-5 py-2.5 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider cursor-pointer shadow-gold-glow"
              >
                Explorar Beneficios
              </button>
            </div>
          ) : (
            savedCoupons.map((coupon) => (
              <div
                key={coupon.id}
                onClick={() => onOpenCouponModal(coupon)}
                className="bg-[#141418] border border-gold-border rounded-2xl overflow-hidden p-3.5 flex items-center justify-between gap-3 shadow-md hover:border-[#D4AF37] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={coupon.imagen}
                    alt={coupon.titulo}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-[#E5C07B] uppercase block truncate">
                      {coupon.comercioNombre}
                    </span>
                    <h4 className="font-bold text-sm text-white truncate group-hover:text-[#F5D77F]">
                      {coupon.titulo}
                    </h4>
                    <span className="inline-block text-[10px] text-gray-400 mt-0.5">
                      {coupon.vecesUsado > 0 ? `Canjeado ${coupon.vecesUsado} veces` : 'Listo para usar'}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gold-gradient text-black font-bold text-xs shadow-sm">
                  <QrCode className="w-4 h-4" />
                  <span>QR</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* PESTAÑA C: HISTORIAL (Reporte de Canjes Reales) */}
      {activeTab === 'historial' && (
        <div className="space-y-3">
          <div className="bg-[#141418] border border-white/5 rounded-2xl p-3 text-xs text-gray-400 flex items-center gap-2 mb-2">
            <History className="w-4 h-4 text-[#E5C07B] shrink-0" />
            <span>Registro oficial de visitas con descuento registradas en la app.</span>
          </div>

          {allRedemptions.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs">
              Aún no has canjeado ningún cupón.
            </div>
          ) : (
            allRedemptions.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#141418] border border-white/5 rounded-2xl p-3.5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">
                      {item.comercio}
                    </h4>
                    <p className="text-[11px] text-[#E5C07B] font-medium">
                      {item.descuento} aplicado
                    </p>
                    <span className="text-[10px] text-gray-400 block mt-0.5 font-mono">
                      {item.fecha}
                    </span>
                  </div>
                </div>

                <span className="text-[9px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-1 rounded-md shrink-0">
                  Verificado
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
