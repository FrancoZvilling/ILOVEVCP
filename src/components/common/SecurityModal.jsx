import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, Phone, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function SecurityModal({ 
  userPhone = '+54 9 3541 458912', 
  onClose, 
  onSaveSuccess 
}) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    phone: userPhone,
  });
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert('Las contraseñas nuevas no coinciden');
      return;
    }

    setSuccessMessage(true);
    setTimeout(() => {
      if (onSaveSuccess) onSaveSuccess(formData);
      onClose();
    }, 1500);
  };

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
        <div className="p-5 pb-3 border-b border-white/5 text-center">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C07B] mx-auto mb-2 shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-xl font-bold text-white tracking-wide">
            Seguridad y Cuenta
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Actualizá tu contraseña y teléfono de contacto
          </p>
        </div>

        {/* Formulario */}
        <div className="p-5 overflow-y-auto space-y-4">
          {successMessage ? (
            <div className="py-8 text-center space-y-2 animate-scaleUp">
              <div className="w-14 h-14 rounded-full bg-[#25D366]/20 border border-[#25D366] flex items-center justify-center text-[#25D366] mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-white">
                ¡Credenciales Actualizadas!
              </h3>
              <p className="text-xs text-gray-400 max-w-[220px] mx-auto">
                Tus datos de acceso y recuperación se guardaron correctamente.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Teléfono / WhatsApp */}
              <div>
                <label className="block text-[11px] font-serif italic text-[#E5C07B] mb-1 pl-1">
                  Teléfono / WhatsApp de recuperación
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A22] border border-gold-border rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>
              </div>

              {/* Contraseña Actual */}
              <div>
                <label className="block text-[11px] font-serif italic text-[#E5C07B] mb-1 pl-1">
                  Contraseña actual
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Ingresá tu clave actual"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    className="w-full pl-10 pr-10 py-2.5 bg-[#1A1A22] border border-gold-border rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Nueva Contraseña */}
              <div>
                <label className="block text-[11px] font-serif italic text-[#E5C07B] mb-1 pl-1">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full pl-10 pr-10 py-2.5 bg-[#1A1A22] border border-gold-border rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-[11px] font-serif italic text-[#E5C07B] mb-1 pl-1">
                  Confirmar nueva contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    placeholder="Reingresá la clave nueva"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A22] border border-gold-border rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>
              </div>

              {/* Botón de Guardar */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gold-gradient text-[#0B0B0E] font-bold text-xs tracking-wider uppercase shadow-gold-glow hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Actualizar Credenciales</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
