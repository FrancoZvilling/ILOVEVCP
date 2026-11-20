import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  Store,
  X,
  Save,
  Info,
  QrCode
} from 'lucide-react';

export default function MerchantBusinessManager({
  business,
  coupons = [],
  onToggleCouponActive,
  onCreateCoupon,
  onUpdateBusiness
}) {
  const businessCoupons = coupons.filter((c) => c.comercioId === business?.id);

  // Estados para crear nueva promoción
  const [showNewPromoForm, setShowNewPromoForm] = useState(false);
  const [promoForm, setPromoForm] = useState({
    titulo: '',
    descuento: '20% OFF',
    validez: 'Válido todos los días',
    condiciones: ''
  });
  const [promoError, setPromoError] = useState('');
  const [promoSuccessMsg, setPromoSuccessMsg] = useState('');

  // Estados para edición rápida de datos del local
  const [esloganInput, setEsloganInput] = useState(business?.eslogan || '');
  const [horarioInput, setHorarioInput] = useState(business?.horario || '');
  const [whatsappInput, setWhatsappInput] = useState(business?.whatsapp || '');
  const [businessSavedSuccess, setBusinessSavedSuccess] = useState(false);

  const discountPresets = ['15% OFF', '20% OFF', '30% OFF', '2x1', 'GIFT'];

  const handleCreatePromoSubmit = (e) => {
    e.preventDefault();
    if (!promoForm.titulo.trim() || !promoForm.descuento.trim()) {
      setPromoError('Completá el título del beneficio y el descuento.');
      return;
    }

    const prefix = (business?.nombre || 'LOCAL')
      .split(' ')[0]
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .slice(0, 5) || 'PROMO';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const shortTag = promoForm.descuento.replace(/[^A-Z0-9]/gi, '').slice(0, 4).toUpperCase() || 'VIP';

    const newCoupon = {
      id: `promo-${Date.now()}`,
      comercioId: business?.id || 'resto-lago',
      comercioNombre: business?.nombre || 'Resto Lago I LOVE CARLOS PAZ',
      categoria: 'Gastronomía',
      titulo: promoForm.titulo.trim(),
      descuento: promoForm.descuento.trim().toUpperCase(),
      codigo: `${prefix}-${shortTag}-${randomNum}`,
      imagen: business?.fotos?.[0] || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      validez: promoForm.validez.trim() || 'Válido todos los días',
      condiciones: promoForm.condiciones.trim() || 'Presentar el cupón QR antes de solicitar la cuenta.',
      guardado: false,
      activa: true,
      vecesUsado: 0,
      historialCanjes: []
    };

    if (onCreateCoupon) {
      onCreateCoupon(newCoupon);
    }

    setPromoForm({
      titulo: '',
      descuento: '20% OFF',
      validez: 'Válido todos los días',
      condiciones: ''
    });
    setPromoError('');
    setShowNewPromoForm(false);
    setPromoSuccessMsg(`¡Promoción "${newCoupon.titulo}" creada con código ${newCoupon.codigo}!`);
    setTimeout(() => setPromoSuccessMsg(''), 4000);
  };

  const handleSaveBusinessInfo = (e) => {
    e.preventDefault();
    if (onUpdateBusiness && business?.id) {
      onUpdateBusiness(business.id, {
        eslogan: esloganInput.trim(),
        horario: horarioInput.trim(),
        whatsapp: whatsappInput.trim()
      });
    }
    setBusinessSavedSuccess(true);
    setTimeout(() => setBusinessSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ========================================================
          1. GESTOR DE PROMOCIONES Y CUPONES QR
         ======================================================== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs uppercase tracking-wider text-[#C9A66B] font-bold flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#E5C07B]" />
              <span>Mis Promociones ({businessCoupons.length})</span>
            </h2>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Activá, pausá o creá nuevos cupones para los turistas
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowNewPromoForm(!showNewPromoForm);
              setPromoError('');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
              showNewPromoForm
                ? 'bg-white/10 text-gray-300 hover:text-white'
                : 'bg-gold-gradient text-[#0B0B0E] shadow-gold-glow/30 hover:brightness-105'
            }`}
          >
            {showNewPromoForm ? (
              <>
                <X className="w-3.5 h-3.5" />
                <span>Cerrar</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Nueva Promo</span>
              </>
            )}
          </button>
        </div>

        {/* Confirmación de Promo Creada */}
        {promoSuccessMsg && (
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{promoSuccessMsg}</span>
          </div>
        )}

        {/* Formulario Inline para Crear Nueva Promoción */}
        {showNewPromoForm && (
          <form
            onSubmit={handleCreatePromoSubmit}
            className="bg-[#141418] border border-[#D4AF37]/60 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl animate-fadeIn"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <QrCode className="w-4 h-4 text-[#E5C07B]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Crear Nuevo Beneficio QR
              </h3>
            </div>

            {/* Título */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-300 block">
                Título del beneficio <span className="text-[#E5C07B]">*</span>
              </label>
              <input
                type="text"
                value={promoForm.titulo}
                onChange={(e) => setPromoForm({ ...promoForm, titulo: e.target.value })}
                placeholder="Ej. Postre sin cargo en cenas o 25% OFF"
                className="w-full bg-[#0B0B0E] border border-white/10 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
              />
            </div>

            {/* Descuento / Etiqueta Rápida */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-gray-300 block">
                Etiqueta destacada <span className="text-[#E5C07B]">*</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {discountPresets.map((preset) => {
                  const isSelected = promoForm.descuento === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setPromoForm({ ...promoForm, descuento: preset })}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gold-gradient text-[#0B0B0E]'
                          : 'bg-[#0B0B0E] border border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={promoForm.descuento}
                onChange={(e) => setPromoForm({ ...promoForm, descuento: e.target.value })}
                placeholder="O escribí uno personalizado (Ej. 25% OFF)"
                className="w-full bg-[#0B0B0E] border border-white/10 focus:border-[#D4AF37] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none"
              />
            </div>

            {/* Validez y Condiciones */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-300 block">
                Días / Validez
              </label>
              <input
                type="text"
                value={promoForm.validez}
                onChange={(e) => setPromoForm({ ...promoForm, validez: e.target.value })}
                placeholder="Ej. Válido de Jueves a Domingos"
                className="w-full bg-[#0B0B0E] border border-white/10 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-300 block">
                Condiciones / Letra chica
              </label>
              <textarea
                rows={2}
                value={promoForm.condiciones}
                onChange={(e) => setPromoForm({ ...promoForm, condiciones: e.target.value })}
                placeholder="Ej. Solo consumo en salón. No acumulable con otras promos."
                className="w-full bg-[#0B0B0E] border border-white/10 focus:border-[#D4AF37] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none resize-none"
              />
            </div>

            {promoError && (
              <p className="text-xs text-red-400 text-center">{promoError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:brightness-105 cursor-pointer transition-all"
            >
              Publicar Beneficio y Generar QR
            </button>
          </form>
        )}

        {/* Lista de Promociones del Comercio */}
        <div className="space-y-3">
          {businessCoupons.length === 0 ? (
            <div className="p-6 rounded-3xl bg-[#141418] border border-white/5 text-center space-y-2">
              <p className="text-xs font-semibold text-gray-300">
                Todavía no cargaste promociones
              </p>
              <p className="text-[11px] text-gray-500">
                Tocá "+ Nueva Promo" para publicar tu primer cupón QR.
              </p>
            </div>
          ) : (
            businessCoupons.map((coupon) => {
              const isActive = coupon.activa !== false;
              return (
                <div
                  key={coupon.id}
                  className={`rounded-3xl p-4 border transition-all space-y-3 ${
                    isActive
                      ? 'bg-[#141418] border-gold-border/50 shadow-md'
                      : 'bg-[#101014] border-white/5 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-[#D4AF37] text-[#0B0B0E] text-[10px] font-black uppercase">
                          {coupon.descuento}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          isActive
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                            : 'bg-white/5 border-white/10 text-gray-400'
                        }`}>
                          {isActive ? '● ACTIVA' : 'PAUSADA'}
                        </span>
                        <span className="font-mono text-[10px] text-gray-400">
                          {coupon.codigo}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-white leading-tight">
                        {coupon.titulo}
                      </h3>
                      <p className="text-[11px] text-gray-400">
                        {coupon.validez} • {coupon.condiciones}
                      </p>
                    </div>

                    {/* Switch Activar / Pausar */}
                    <button
                      type="button"
                      onClick={() => onToggleCouponActive && onToggleCouponActive(coupon.id)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 mt-1 ${
                        isActive ? 'bg-[#D4AF37]' : 'bg-gray-700'
                      }`}
                      title={isActive ? 'Pausar promoción' : 'Activar promoción'}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-all absolute top-0.5 ${
                          isActive ? 'right-0.5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-gray-400">
                    <span>Usos verificados en mostrador:</span>
                    <span className="font-bold text-[#F5D77F]">
                      {coupon.vecesUsado || 0} {coupon.vecesUsado === 1 ? 'canje' : 'canjes'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ========================================================
          2. EDICIÓN RÁPIDA DE DATOS DEL LOCAL
         ======================================================== */}
      <form
        onSubmit={handleSaveBusinessInfo}
        className="bg-[#141418] border border-white/5 rounded-3xl p-4 sm:p-5 space-y-4 shadow-lg"
      >
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-[#E5C07B]" />
            <h2 className="text-xs uppercase tracking-wider text-[#C9A66B] font-bold">
              Datos Rápidos del Local
            </h2>
          </div>
          {businessSavedSuccess && (
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Guardado
            </span>
          )}
        </div>

        {/* Dirección fija (solo lectura por gobernanza) */}
        <div className="p-3 rounded-2xl bg-[#0B0B0E] border border-white/5 flex items-start gap-2.5 text-xs">
          <MapPin className="w-4 h-4 text-[#E5C07B] shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="font-semibold text-white truncate">{business?.direccion}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Ubicación verificada en Maps • Para modificar dirección o rubro, contactá al Admin.
            </p>
          </div>
        </div>

        {/* Eslogan */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-gray-300 block">
            Eslogan / Especialidad
          </label>
          <input
            type="text"
            value={esloganInput}
            onChange={(e) => setEsloganInput(e.target.value)}
            className="w-full bg-[#0B0B0E] border border-white/10 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        {/* Horarios */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-gray-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#E5C07B]" />
            <span>Horarios de atención</span>
          </label>
          <input
            type="text"
            value={horarioInput}
            onChange={(e) => setHorarioInput(e.target.value)}
            className="w-full bg-[#0B0B0E] border border-white/10 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        {/* WhatsApp */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-gray-300 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-[#E5C07B]" />
            <span>WhatsApp de reservas / consultas</span>
          </label>
          <input
            type="tel"
            value={whatsappInput}
            onChange={(e) => setWhatsappInput(e.target.value)}
            className="w-full bg-[#0B0B0E] border border-white/10 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-gold-border/50 hover:border-[#D4AF37] text-[#F5D77F] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Cambios del Local</span>
        </button>

        <div className="flex items-start gap-1.5 text-[10px] text-gray-500 pt-1">
          <Info className="w-3.5 h-3.5 text-[#E5C07B] shrink-0 mt-0.5" />
          <span>
            Los cambios de horarios, WhatsApp y promociones se reflejan de inmediato en la app del turista.
          </span>
        </div>
      </form>
    </div>
  );
}
