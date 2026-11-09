import React, { useState } from 'react';
import { 
  Store, 
  Sparkles, 
  Heart, 
  CheckCircle2, 
  MapPin, 
  ChevronRight, 
  ShieldCheck, 
  Bell, 
  FileText, 
  LogOut, 
  ArrowRight,
  UserCheck,
  Bookmark
} from 'lucide-react';

export default function ProfileView({ 
  user = {
    nombre: 'Juan Pérez',
    email: 'juan.perez@correo.com',
    telefono: '+54 9 3541 458912',
    iniciales: 'JP',
    zona: 'Carlos Paz'
  },
  savedCount = 2,
  redeemedCount = 3,
  onOpenSavedBusinesses,
  onOpenSecurity,
  onOpenTerms,
  onRegisterBusiness,
  currentRole = 'tourist',
  onRoleChange,
  onLogout
}) {
  const [notificationsActive, setNotificationsActive] = useState(true);

  return (
    <div className="w-full min-h-screen bg-[#0B0B0E] text-[#F5F5F7] p-5 pb-24 overflow-x-hidden select-none">
      
      {/* 1. SECCIÓN B2B (ARRIBA DE TODO - MÁXIMA VISIBILIDAD) */}
      <div className="relative rounded-3xl p-5 mb-6 overflow-hidden bg-gradient-to-br from-[#241E10] via-[#1A1710] to-[#121217] border border-[#D4AF37]/50 shadow-[0_10px_25px_rgba(212,175,55,0.18)]">
        {/* Glow dorado decorativo */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5D77F] text-[10px] font-bold tracking-widest uppercase">
            <Store className="w-3 h-3 text-[#F5D77F]" />
            <span>ACCESO COMERCIANTES</span>
          </div>

          <div>
            <h2 className="font-serif text-lg font-bold text-white tracking-wide leading-snug">
              ¿Tenés un negocio en Carlos Paz?
            </h2>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              Publicá tu local en <span className="text-[#F5D77F] font-semibold">I LOVE CARLOS PAZ</span> y atraé miles de turistas a tu mesa o mostrador.
            </p>
          </div>

          <button
            type="button"
            onClick={onRegisterBusiness}
            className="w-full mt-1 py-3 px-4 rounded-xl bg-gold-gradient text-[#0B0B0E] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>Registrar mi Comercio</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* 2. CABECERA DE USUARIO */}
      <div className="bg-[#141418] border border-white/5 rounded-3xl p-5 mb-5 shadow-lg space-y-4">
        <div className="flex items-center gap-4">
          {/* Avatar con Iniciales y Borde Dorado */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F5D77F] via-[#D4AF37] to-[#AA7C26] p-0.5 shrink-0 shadow-md">
            <div className="w-full h-full rounded-full bg-[#121217] flex items-center justify-center text-lg font-bold font-serif text-[#F5D77F]">
              {user.iniciales}
            </div>
          </div>

          {/* Información del Usuario */}
          <div className="min-w-0 flex-1">
            <h1 className="font-bold text-lg text-white truncate">
              {user.nombre}
            </h1>
            <p className="text-xs text-gray-400 truncate">
              {user.email}
            </p>
            <p className="text-[11px] text-gray-400 font-mono mt-0.5">
              {user.telefono}
            </p>
          </div>
        </div>

        {/* Badge de Membresía */}
        <div className="p-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37]/15 via-[#1A1710] to-[#141418] border border-[#D4AF37]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F5D77F]" />
            <span className="text-xs font-bold text-[#F5D77F] tracking-wide">
              Membresía Premium Activa
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-medium">
            Pase 2026
          </span>
        </div>

        {/* 3. RESUMEN MÉTRICO */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
          <div 
            onClick={onOpenSavedBusinesses}
            className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-center gap-1.5 text-[#E5C07B] h-6">
              <Heart className="w-4 h-4 fill-[#E5C07B]" />
              <span className="font-bold text-sm text-white">{savedCount}</span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5">Guardados</span>
          </div>

          <div className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-white/[0.04]">
            <div className="flex items-center justify-center gap-1.5 text-[#25D366] h-6">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-bold text-sm text-white">{redeemedCount}</span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5">Visitas</span>
          </div>

          <div className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-white/[0.04]">
            <div className="flex items-center justify-center gap-1 text-[#E5C07B] h-6">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="font-bold text-[11px] text-white truncate max-w-[74px] tracking-tight">{user.zona}</span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5">Ubicación</span>
          </div>
        </div>
      </div>

      {/* 4. MENÚ DE OPCIONES (DARK LUXURY GROUP) */}
      <div className="space-y-4">
        {/* Grupo 1: Contenido Personal */}
        <div className="bg-[#141418] border border-white/5 rounded-3xl overflow-hidden shadow-md divide-y divide-white/5">
          {/* Mis Guardados (Locales y Eventos) */}
          <button
            type="button"
            onClick={onOpenSavedBusinesses}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E5C07B]/10 border border-[#E5C07B]/20 flex items-center justify-center text-[#E5C07B]">
                <Bookmark className="w-4 h-4 fill-[#E5C07B]" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">
                  Mis Guardados
                </span>
                <span className="text-[11px] text-gray-400">
                  Locales y eventos para visitar
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#F5D77F] text-xs font-bold">
                {savedCount}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </button>

          {/* Seguridad y Contraseña */}
          <button
            type="button"
            onClick={onOpenSecurity}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">
                  Seguridad y Contraseña
                </span>
                <span className="text-[11px] text-gray-400">
                  Actualizar clave y teléfono
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Grupo 2: Preferencias y Legales */}
        <div className="bg-[#141418] border border-white/5 rounded-3xl overflow-hidden shadow-md divide-y divide-white/5">
          {/* Notificaciones */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">
                  Notificaciones de Promociones
                </span>
                <span className="text-[11px] text-gray-400">
                  Alertas de nuevos beneficios cerca tuyo
                </span>
              </div>
            </div>

            {/* Switch Toggle */}
            <button
              type="button"
              onClick={() => setNotificationsActive(!notificationsActive)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                notificationsActive ? 'bg-[#D4AF37]' : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  notificationsActive ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Términos y Privacidad (GPS) */}
          <button
            type="button"
            onClick={onOpenTerms}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">
                  Términos, Privacidad & GPS
                </span>
                <span className="text-[11px] text-gray-400">
                  Políticas de geolocalización y datos
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Grupo 3: Selector de Roles para la Demostración Comercial */}
        <div className="bg-[#141418] border border-[#D4AF37]/30 rounded-3xl p-4 shadow-md space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F5D77F] uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Modo Demostración (Roles)</span>
            </span>
            <span className="text-[10px] text-gray-400">
              Para presentar al cliente
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-[#0E0E12] p-1.5 rounded-2xl border border-white/5">
            <button
              type="button"
              onClick={() => onRoleChange && onRoleChange('tourist')}
              className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                currentRole === 'tourist'
                  ? 'bg-gold-gradient text-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              👤 Turista
            </button>

            <button
              type="button"
              onClick={() => onRoleChange && onRoleChange('merchant')}
              className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                currentRole === 'merchant'
                  ? 'bg-gold-gradient text-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🏪 Comercio
            </button>

            <button
              type="button"
              onClick={() => onRoleChange && onRoleChange('admin')}
              className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                currentRole === 'admin'
                  ? 'bg-gold-gradient text-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ⚙ Admin
            </button>
          </div>
        </div>

        {/* Botón de Cerrar Sesión */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full p-4 rounded-3xl bg-[#141418] border border-white/5 hover:border-red-500/30 flex items-center justify-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer shadow-md"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>

        {/* Versión de la Aplicación */}
        <p className="text-center text-[10px] text-gray-400 pt-2 tracking-wide">
          I LOVE CARLOS PAZ • PWA v1.0.0
        </p>
      </div>
    </div>
  );
}
