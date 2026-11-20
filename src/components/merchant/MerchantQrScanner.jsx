import React, { useState } from 'react';
import {
  ScanLine,
  QrCode,
  Camera,
  Keyboard,
  CheckCircle2,
  AlertCircle,
  Tag,
  Clock,
  ShieldCheck,
  User,
  RotateCcw,
  Wand2
} from 'lucide-react';

export default function MerchantQrScanner({
  business,
  coupons = [],
  onValidateCoupon
}) {
  const [scanStatus, setScanStatus] = useState('idle'); // 'idle' | 'scanning' | 'detected' | 'success' | 'error'
  const [manualCode, setManualCode] = useState('');
  const [detectedCoupon, setDetectedCoupon] = useState(null);
  const [errorText, setErrorText] = useState('');

  // Cupones pertenecientes a este comercio
  const businessCoupons = coupons.filter((c) => c.comercioId === business?.id);
  const primaryCode = businessCoupons[0]?.codigo || 'LAGO-20-8912';

  // Historial en vivo de canjes validados en este local
  const liveHistory = businessCoupons
    .flatMap((c) =>
      (c.historialCanjes || []).map((h) => ({
        ...h,
        tituloPromo: c.titulo,
        descuento: c.descuento,
        codigo: c.codigo
      }))
    );

  // Simular lectura de cámara apuntando al teléfono del turista
  const handleSimulateCameraScan = () => {
    setErrorText('');
    setScanStatus('scanning');

    setTimeout(() => {
      const target = businessCoupons[0] || coupons[0];
      if (target) {
        setDetectedCoupon(target);
        setScanStatus('detected');
      } else {
        setErrorText('No hay cupones activos configurados para escanear.');
        setScanStatus('error');
      }
    }, 650);
  };

  // Validar un código alfanumérico ingresado manualmente
  const handleVerifyManualCode = (e, codeOverride) => {
    if (e) e.preventDefault();
    const cleanCode = (codeOverride ?? manualCode).trim().toUpperCase();

    if (!cleanCode) {
      setErrorText('Ingresá el código corto del cupón del cliente.');
      setScanStatus('error');
      return;
    }

    const found = coupons.find((c) => c.codigo?.toUpperCase() === cleanCode);
    if (!found) {
      setErrorText(`El código "${cleanCode}" no existe o expiró. Verificalo con el cliente.`);
      setScanStatus('error');
      return;
    }

    if (found.comercioId !== business?.id) {
      setErrorText(`Este cupón pertenece a otro local (${found.comercioNombre}).`);
      setScanStatus('error');
      return;
    }

    setErrorText('');
    setDetectedCoupon(found);
    setScanStatus('detected');
  };

  // Confirmar el canje en mostrador y actualizar métricas en vivo
  const handleConfirmRedemption = () => {
    if (!detectedCoupon) return;
    if (onValidateCoupon) {
      onValidateCoupon(detectedCoupon.id);
    }
    setScanStatus('success');
  };

  const handleReset = () => {
    setScanStatus('idle');
    setManualCode('');
    setDetectedCoupon(null);
    setErrorText('');
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. VISTA PRINCIPAL: VISOR DE CÁMARA + CÓDIGO MANUAL */}
      {(scanStatus === 'idle' || scanStatus === 'scanning' || scanStatus === 'error') && (
        <>
          {/* Visor Simulado de Cámara QR */}
          <div className="bg-[#141418] border border-gold-border/50 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#E5C07B]" />
                <h2 className="text-xs uppercase tracking-wider text-[#C9A66B] font-bold">
                  Escáner de Mostrador
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[9px] font-bold text-emerald-400">
                ● CÁMARA LISTA
              </span>
            </div>

            {/* Cuadro Visor con Esquinas Doradas y Láser */}
            <div className="relative h-56 rounded-2xl bg-[#070709] border border-white/10 overflow-hidden flex flex-col items-center justify-center">
              {/* Fondo sutil de rejilla */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(#D4AF37 0.75px, transparent 0.75px)',
                  backgroundSize: '18px 18px'
                }}
              />

              {/* Marco de Enfoque con 4 Esquinas Doradas */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                <span className="absolute top-0 left-0 w-6 h-6 border-t-[3px] border-l-[3px] border-[#F5D77F] rounded-tl-xl" />
                <span className="absolute top-0 right-0 w-6 h-6 border-t-[3px] border-r-[3px] border-[#F5D77F] rounded-tr-xl" />
                <span className="absolute bottom-0 left-0 w-6 h-6 border-b-[3px] border-l-[3px] border-[#F5D77F] rounded-bl-xl" />
                <span className="absolute bottom-0 right-0 w-6 h-6 border-b-[3px] border-r-[3px] border-[#F5D77F] rounded-br-xl" />

                <QrCode
                  className={`w-20 h-20 transition-all duration-300 ${
                    scanStatus === 'scanning'
                      ? 'text-[#F5D77F] scale-105 opacity-90'
                      : 'text-white/15'
                  }`}
                />

                {/* Barra Láser Animada */}
                <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-[#F5D77F] to-transparent shadow-[0_0_12px_#F5D77F] animate-scanline" />
              </div>

              <p className="relative z-10 text-[11px] font-medium text-gray-300 mt-3">
                {scanStatus === 'scanning'
                  ? 'Leyendo código QR del turista...'
                  : 'Encuadrá el código QR del celular del cliente'}
              </p>
            </div>

            {/* Botón Principal Simulador de Cámara */}
            <button
              type="button"
              disabled={scanStatus === 'scanning'}
              onClick={handleSimulateCameraScan}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] font-bold text-xs sm:text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-70"
            >
              <ScanLine className={`w-4 h-4 stroke-[2.5] ${scanStatus === 'scanning' ? 'animate-spin' : ''}`} />
              <span>
                {scanStatus === 'scanning' ? 'Escaneando...' : 'Simular Lectura de Cámara QR'}
              </span>
            </button>
          </div>

          {/* Ingreso de Código Alfanumérico de Respaldo */}
          <form
            onSubmit={(e) => handleVerifyManualCode(e)}
            className="bg-[#141418] border border-white/5 rounded-3xl p-4 sm:p-5 space-y-3 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-[#E5C07B]" />
                <h3 className="text-xs font-bold text-white">
                  Código de Respaldo Manual
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setManualCode(primaryCode);
                  handleVerifyManualCode(null, primaryCode);
                }}
                className="text-[10px] font-semibold text-[#E5C07B] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Wand2 className="w-3 h-3" />
                <span>Probar {primaryCode}</span>
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => {
                  setManualCode(e.target.value.toUpperCase());
                  if (scanStatus === 'error') setScanStatus('idle');
                }}
                placeholder="EJ. LAGO-20-8912"
                className="flex-1 bg-[#0B0B0E] border border-white/10 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider text-white placeholder-gray-600 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-gold-border text-xs font-bold text-[#F5D77F] cursor-pointer transition-all shrink-0"
              >
                Validar
              </button>
            </div>

            {/* Mensaje de Error si el código no coincide */}
            {scanStatus === 'error' && errorText && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-xs text-red-400 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorText}</span>
              </div>
            )}
          </form>
        </>
      )}

      {/* 2. ESTADO: CUPÓN DETECTADO (CONFIRMACIÓN EN MOSTRADOR) */}
      {scanStatus === 'detected' && detectedCoupon && (
        <div className="bg-[#141418] border-2 border-[#D4AF37] rounded-3xl p-5 space-y-4 shadow-[0_12px_36px_rgba(212,175,55,0.25)] animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F5D77F] text-[10px] font-extrabold tracking-widest uppercase">
              CUPÓN DETECTADO
            </span>
            <span className="font-mono text-xs font-bold text-gray-300">
              {detectedCoupon.codigo}
            </span>
          </div>

          {/* Datos del Cliente (Turista) */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0B0B0E] border border-white/5">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#F5D77F] to-[#AA7C26] text-[#0B0B0E] font-serif font-extrabold text-sm flex items-center justify-center shrink-0">
              JP
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white truncate">Juan Pérez</h3>
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
              <p className="text-[11px] text-emerald-400 font-medium">
                Usuario Verificado • Habilitado
              </p>
            </div>
          </div>

          {/* Detalle de la Promoción a Aplicar */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#1C1A14] to-[#121216] border border-gold-border/50 flex gap-3 items-center">
            <img
              src={detectedCoupon.imagen}
              alt={detectedCoupon.titulo}
              className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/10"
            />
            <div className="min-w-0 flex-1 space-y-1">
              <span className="inline-block px-2 py-0.5 rounded bg-[#D4AF37] text-[#0B0B0E] text-[10px] font-black uppercase">
                {detectedCoupon.descuento}
              </span>
              <h4 className="font-bold text-sm text-white leading-tight truncate">
                {detectedCoupon.titulo}
              </h4>
              <p className="text-[10px] text-gray-300 leading-snug">
                {detectedCoupon.condiciones}
              </p>
            </div>
          </div>

          {/* Botones Confirmar / Cancelar */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleReset}
              className="col-span-1 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 hover:text-white cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmRedemption}
              className="col-span-2 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#0B0B0E] font-extrabold text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-lg cursor-pointer transition-all"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Confirmar Canje</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. ESTADO: CANJE VERIFICADO CON ÉXITO */}
      {scanStatus === 'success' && detectedCoupon && (
        <div className="bg-gradient-to-b from-[#132018] via-[#141418] to-[#121216] border border-emerald-500/50 rounded-3xl p-6 text-center space-y-4 shadow-2xl animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_24px_rgba(16,185,129,0.35)]">
            <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
              VISITA VERIFICADA EN SISTEMA
            </span>
            <h3 className="font-serif text-2xl font-bold text-white">
              ¡Canje Aprobado!
            </h3>
            <p className="text-xs text-gray-300 max-w-[260px] mx-auto leading-relaxed">
              Se registró el beneficio <strong className="text-[#F5D77F]">{detectedCoupon.descuento}</strong> para <strong>Juan Pérez</strong>.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-[11px] text-gray-400">
            El registro ya impactó en tus métricas de seguimiento y en el historial del turista.
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="w-full py-3.5 rounded-2xl bg-gold-gradient text-[#0B0B0E] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-105 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Escanear Siguiente Cliente</span>
          </button>
        </div>
      )}

      {/* 4. BITÁCORA RÁPIDA DE ÚLTIMOS CANJES EN MOSTRADOR */}
      <div className="bg-[#141418] border border-white/5 rounded-3xl p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <h3 className="text-xs uppercase tracking-wider text-[#C9A66B] font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#E5C07B]" />
            <span>Últimos Canjes Verificados</span>
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#F5D77F] text-[10px] font-bold">
            {liveHistory.length} registros
          </span>
        </div>

        {liveHistory.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-3">
            Todavía no hay canjes escaneados hoy.
          </p>
        ) : (
          <div className="space-y-2">
            {liveHistory.slice(0, 4).map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-[#0B0B0E] border border-white/5 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate flex items-center gap-1.5">
                      <span>Juan Pérez</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#D4AF37]/20 text-[#F5D77F] font-bold">
                        {item.descuento || '20% OFF'}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 truncate">
                      {item.fecha}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-gray-500 shrink-0 pl-2">
                  #{item.codigo?.split('-').pop() || 'OK'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
