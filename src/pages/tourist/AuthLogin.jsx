import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, Check } from 'lucide-react';
import TermsModal from '../../components/common/TermsModal';

export default function AuthLogin({ onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('register'); // 'register' | 'login'
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [showTerms, setShowTerms] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    whatsapp: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authMode === 'register' && !acceptedTerms) {
      alert('Debes aceptar los Términos y Condiciones para continuar.');
      return;
    }
    if (onLoginSuccess) {
      onLoginSuccess(formData);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#07080B] text-[#F5F5F7] flex flex-col justify-between p-5 pb-8 overflow-hidden select-none">
      {/* 1. Fondo Dark Marble con Vetas Doradas */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#090A0E] via-[#0E0F14] to-[#07080B]" />
        {/* Manchas de luz cálida y bokeh dorado */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#B8860B]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 pt-4 flex-1 flex flex-col justify-between">
        <div>
          {/* 2. Emblema Art Déco / Corona Geométrica Dorada */}
          <div className="flex justify-center mb-3">
            <svg
              viewBox="0 0 100 60"
              className="w-20 h-12 text-[#D4AF37]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
            >
              {/* Estructura geométrica Art Déco de alas doradas */}
              <polygon points="50,5 60,20 50,35 40,20" stroke="#F5D77F" strokeWidth="1.5" />
              <polygon points="50,15 70,30 50,45 30,30" strokeOpacity="0.8" />
              <polygon points="50,25 80,40 50,55 20,40" strokeOpacity="0.5" />
              {/* Líneas angulares superiores */}
              <line x1="50" y1="5" x2="85" y2="25" stroke="#F5D77F" strokeWidth="1.2" />
              <line x1="50" y1="5" x2="15" y2="25" stroke="#F5D77F" strokeWidth="1.2" />
              <line x1="50" y1="12" x2="92" y2="30" strokeOpacity="0.6" />
              <line x1="50" y1="12" x2="8" y2="30" strokeOpacity="0.6" />
              <circle cx="50" cy="5" r="2" fill="#F5D77F" />
            </svg>
          </div>

          {/* 3. Header de Marca */}
          <div className="text-center mb-5">
            <h1 className="font-serif text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#FAF6EE] via-[#E5C07B] to-[#D4AF37] leading-none">
              I LOVE
            </h1>
            <h2 className="font-serif text-2xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-[#FAF6EE] via-[#E5C07B] to-[#C9A66B] mt-1">
              CARLOS PAZ
            </h2>
            <p className="text-[11px] text-[#C9A66B]/90 mt-2 font-medium tracking-wide">
              Bienvenido a Carlos Paz • Sierra de Córdoba ✨
            </p>
          </div>

          {/* 4. Selector de Pestañas (Iniciar sesión / Registro) */}
          <div className="flex bg-[#141418] border border-white/5 rounded-2xl p-1 mb-5 max-w-[320px] mx-auto shadow-inner">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                authMode === 'login'
                  ? 'text-[#F5D77F] bg-[#1E1E26] shadow-md border-b-2 border-[#D4AF37]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                authMode === 'register'
                  ? 'text-[#F5D77F] bg-[#1E1E26] shadow-md border-b-2 border-[#D4AF37]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Registro
            </button>
          </div>

          {/* Título de Formulario */}
          <div className="text-center mb-4">
            <h3 className="text-xs text-[#E5C07B] font-medium tracking-wide">
              {authMode === 'register' ? 'Crea tu cuenta para comenzar' : 'Ingresa tus credenciales'}
            </h3>
          </div>

          {/* 5. Formulario de Datos */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authMode === 'register' && (
              <>
                {/* Campo Nombre */}
                <div>
                  <label className="block text-[11px] font-serif italic text-[#E5C07B] mb-1 pl-1">
                    Nombre
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ej: Carlos"
                      className="w-full pl-10 pr-4 py-3 bg-[#121217] border border-gold-border rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    />
                  </div>
                </div>

                {/* Campo Apellido */}
                <div>
                  <label className="block text-[11px] font-serif italic text-[#E5C07B] mb-1 pl-1">
                    Apellido
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      placeholder="Ej: Paz"
                      className="w-full pl-10 pr-4 py-3 bg-[#121217] border border-gold-border rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Campo Mail */}
            <div>
              <label className="block text-[11px] font-serif italic text-[#E5C07B] mb-1 pl-1">
                Mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tuemail@ejemplo.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#121217] border border-gold-border rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>
            </div>

            {/* Campo WhatsApp / Teléfono */}
            {authMode === 'register' && (
              <div>
                <label className="block text-[11px] font-serif italic text-[#E5C07B] mb-1 pl-1">
                  WhatsApp
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="Ej: +54 9 3541 123456"
                    className="w-full pl-10 pr-4 py-3 bg-[#121217] border border-gold-border rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Campo Contraseña (en modo login) */}
            {authMode === 'login' && (
              <div>
                <label className="block text-[11px] font-serif italic text-[#E5C07B] mb-1 pl-1">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-[#121217] border border-gold-border rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Checkbox Acepto los Términos y Condiciones */}
            {authMode === 'register' && (
              <div className="flex items-start gap-2.5 pt-1 pb-1 pl-1 text-left">
                <button
                  type="button"
                  onClick={() => setAcceptedTerms(!acceptedTerms)}
                  className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center border transition-all cursor-pointer ${
                    acceptedTerms
                      ? 'bg-gold-gradient border-[#D4AF37] text-black shadow-sm'
                      : 'bg-[#141418] border-gold-border hover:border-gold-400'
                  }`}
                >
                  {acceptedTerms && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <div className="text-[11px] text-gray-300 leading-tight">
                  <span onClick={() => setAcceptedTerms(!acceptedTerms)} className="cursor-pointer select-none">
                    Acepto los{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-[#E5C07B] underline font-medium hover:text-[#F5D77F] cursor-pointer"
                  >
                    Términos y Condiciones
                  </button>
                  <span onClick={() => setAcceptedTerms(!acceptedTerms)} className="cursor-pointer select-none">
                    {' '}y el uso de ubicación GPS
                  </span>
                </div>
              </div>
            )}

            {/* 6. Botón de Acción Principal (Crear cuenta / Iniciar sesión) */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gold-gradient text-[#0B0B0E] font-bold text-sm tracking-wide shadow-gold-glow hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
              >
                {authMode === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}
              </button>
            </div>
          </form>

          {/* 7. Botón Social: Continuar con Google */}
          <div className="mt-3">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-gray-100 text-[#0B0B0E] font-semibold text-xs transition-all flex items-center justify-center gap-2.5 shadow-md cursor-pointer"
            >
              {/* Logo Oficial de Google */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuar con Google</span>
            </button>
          </div>
        </div>

        {/* 8. Términos y Enlace Inferior */}
        <div className="pt-4 text-center space-y-2">
          <p className="text-[10px] text-gray-400">
            Al registrarte aceptas nuestros{' '}
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="text-gray-300 underline hover:text-[#E5C07B] cursor-pointer"
            >
              Términos y Política de Privacidad
            </button>
          </p>

          <p className="text-[11px] text-gray-400">
            {authMode === 'register' ? '¿Ya tienes cuenta?' : '¿Aún no tienes cuenta?'}{' '}
            <button
              type="button"
              onClick={() => setAuthMode(authMode === 'register' ? 'login' : 'register')}
              className="text-[#E5C07B] underline font-semibold hover:text-[#F5D77F] cursor-pointer ml-1"
            >
              {authMode === 'register' ? 'Iniciar sesión' : 'Registrate aquí'}
            </button>
          </p>
        </div>
      </div>

      {/* Modal de Términos y Condiciones */}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </div>
  );
}
