import React, { useState } from 'react';
import {
  ChevronLeft,
  Store,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  FileText,
  ArrowRight,
  Utensils,
  Bed,
  Compass,
  Wine,
  Tag,
  Wand2,
  CheckCircle2,
  Plus,
  Globe,
  Info,
  Link2,
  Camera,
  Upload,
  X,
  Crosshair,
  Navigation,
  Image as ImageIcon,
  ShieldCheck
} from 'lucide-react';
import { localidadesMock } from '../../data/mocks/localidades';
import { categoriasMock } from '../../data/mocks/categorias';

const ARG_CITIES_PRESETS = {
  'mar del plata': { nombre: 'Mar del Plata', provincia: 'Buenos Aires', lat: -38.0055, lng: -57.5426 },
  'bariloche': { nombre: 'San Carlos de Bariloche', provincia: 'Río Negro', lat: -41.1335, lng: -71.3103 },
  'pinamar': { nombre: 'Pinamar', provincia: 'Buenos Aires', lat: -37.1079, lng: -56.8614 },
  'cordoba': { nombre: 'Córdoba Capital', provincia: 'Córdoba', lat: -31.4201, lng: -64.1888 },
  'rosario': { nombre: 'Rosario', provincia: 'Santa Fe', lat: -32.9442, lng: -60.6505 },
  'mendoza': { nombre: 'Mendoza', provincia: 'Mendoza', lat: -32.8895, lng: -68.8458 }
};

const DEMO_PHOTOS = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
];

export default function BusinessRegisterView({ onBack, onCompleteRegistration }) {
  const [step, setStep] = useState(1); // 1: Identidad | 2: Ubicación & Fotos | 3: Promoción | 4: Confirmación
  const [errorMsg, setErrorMsg] = useState('');

  // Estados específicos del Paso 2 (Hardcoded Mock)
  const [locationMethod, setLocationMethod] = useState('link'); // 'link' | 'pin'
  const [isLocationSynced, setIsLocationSynced] = useState(false);
  const [pinPreviewPos, setPinPreviewPos] = useState({ x: 52, y: 48 });

  const [formData, setFormData] = useState({
    // Paso 1: Identidad
    nombre: '',
    eslogan: '',
    localidadId: 'carlos-paz',
    customLocalidadInput: '',
    customLocalidadSynced: null,
    categoriaId: 'gastronomia',
    customCategoria: '',
    direccion: '',
    horario: '',
    whatsapp: '',
    descripcion: '',
    // Paso 2: Ubicación & Fotos (Mock)
    mapsLink: '',
    coordenadas: { lat: -31.4241, lng: -64.4978 },
    fotos: [],
    // Paso 3: Primera Promoción (se completará en la siguiente iteración)
    promoTitulo: '',
    promoDescuento: '20% OFF',
    promoValidez: 'Válido todos los días',
    promoCondicion: ''
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg('');
  };

  // Simulador de sincronización de nueva ciudad con Google Places (Hardcoded)
  const handleSyncCustomCity = (cityNameOverride) => {
    const rawName = (cityNameOverride ?? formData.customLocalidadInput).trim();
    if (!rawName) {
      setErrorMsg('Escribí el nombre de tu ciudad antes de sincronizar con Google Maps.');
      return;
    }
    const key = rawName.toLowerCase();
    const matched = ARG_CITIES_PRESETS[key];
    const resolved = matched || {
      nombre: rawName.replace(/\b\w/g, (l) => l.toUpperCase()),
      provincia: 'Argentina',
      lat: Number((-34.6037 + (Math.random() - 0.5) * 4).toFixed(4)),
      lng: Number((-60.5000 + (Math.random() - 0.5) * 4).toFixed(4))
    };

    setFormData((prev) => ({
      ...prev,
      customLocalidadInput: resolved.nombre,
      customLocalidadSynced: resolved,
      coordenadas: { lat: resolved.lat, lng: resolved.lng }
    }));
    setErrorMsg('');
  };

  // Simulador hardcoded de extracción de link de Google Maps
  const handleSyncMapsLink = (overrideLink) => {
    const link = (overrideLink ?? formData.mapsLink).trim();
    if (!link) {
      setErrorMsg('Pegá un link de Google Maps válido o usá el enlace de ejemplo.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      mapsLink: link,
      coordenadas: {
        lat: Number((prev.coordenadas.lat + (Math.random() - 0.5) * 0.008).toFixed(4)),
        lng: Number((prev.coordenadas.lng + (Math.random() - 0.5) * 0.008).toFixed(4))
      }
    }));
    setPinPreviewPos({ x: 58, y: 44 });
    setIsLocationSynced(true);
    setErrorMsg('');
  };

  // Simulador hardcoded de detección GPS
  const handleDetectMockGps = () => {
    setPinPreviewPos({ x: 46, y: 55 });
    setIsLocationSynced(true);
    setErrorMsg('');
  };

  // Ajuste manual simulado haciendo clic sobre el mini-mapa
  const handleMiniMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(90, Math.max(10, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(85, Math.max(15, ((e.clientY - rect.top) / rect.height) * 100));
    setPinPreviewPos({ x, y });
    setIsLocationSynced(true);
    setErrorMsg('');
  };

  // Simulador de carga de fotos desde dispositivo (local object URLs)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const newUrls = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      fotos: [...prev.fotos, ...newUrls].slice(0, 4)
    }));
    setErrorMsg('');
  };

  const handleLoadDemoPhotos = () => {
    setFormData((prev) => ({
      ...prev,
      fotos: DEMO_PHOTOS
    }));
    setErrorMsg('');
  };

  const handleRemovePhoto = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      fotos: prev.fotos.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Botón de ayuda rápida para demostración al cliente
  const handleFillDemoData = () => {
    if (step === 1) {
      setFormData((prev) => ({
        ...prev,
        nombre: 'Parrilla El Mirador Serranos',
        eslogan: 'Asador Criollo & Vinos de Altura',
        localidadId: 'carlos-paz',
        categoriaId: 'gastronomia',
        direccion: 'Av. Costanera Bernardo D’Elía 340',
        horario: 'Mar a Dom • 12:00 a 00:30 hs',
        whatsapp: '+54 9 3541 628890',
        descripcion: 'Vista panorámica al Lago San Roque con cortes seleccionados a la estaca, empanadas salteñas y cava climatizada.'
      }));
    } else if (step === 2) {
      setFormData((prev) => ({
        ...prev,
        mapsLink: 'https://maps.app.goo.gl/UHajQQTkEBCoQBGz8',
        fotos: DEMO_PHOTOS
      }));
      setIsLocationSynced(true);
      setPinPreviewPos({ x: 58, y: 44 });
    }
    setErrorMsg('');
  };

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Utensils':
        return <Utensils className="w-4 h-4" />;
      case 'Bed':
        return <Bed className="w-4 h-4" />;
      case 'Compass':
        return <Compass className="w-4 h-4" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'Wine':
        return <Wine className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  const handleNextFromStep1 = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.direccion.trim() || !formData.whatsapp.trim()) {
      setErrorMsg('Por favor completá el nombre del local, dirección y WhatsApp de contacto.');
      return;
    }
    if (formData.localidadId === 'other' && !formData.customLocalidadSynced) {
      setErrorMsg('Por favor escribí y sincronizá tu localidad con Google Maps para continuar.');
      return;
    }
    if (formData.categoriaId === 'other' && !formData.customCategoria.trim()) {
      setErrorMsg('Por favor indicá el nombre del rubro de tu comercio.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleNextFromStep2 = (e) => {
    e.preventDefault();
    if (!isLocationSynced) {
      setErrorMsg('Por favor sincronizá el link de Google Maps o ubicá el pin en el mapa.');
      return;
    }
    if (formData.fotos.length === 0) {
      setErrorMsg('Subí al menos 1 foto del local (o usá "Cargar muestra").');
      return;
    }

    const selectedLoc = localidadesMock.find((l) => l.id === formData.localidadId);
    const selectedCat = categoriasMock.find((c) => c.id === formData.categoriaId);

    const newBusinessPayload = {
      id: `custom-${Date.now()}`,
      nombre: formData.nombre,
      eslogan: formData.eslogan || 'Comercio Adherido',
      localidadId: formData.localidadId === 'other' ? `custom-loc-${Date.now()}` : formData.localidadId,
      localidadNombre: formData.localidadId === 'other'
        ? `${formData.customLocalidadSynced?.nombre}, ${formData.customLocalidadSynced?.provincia}`
        : selectedLoc?.nombre,
      isNewLocalitySuggested: formData.localidadId === 'other',
      suggestedLocalityData: formData.localidadId === 'other' ? formData.customLocalidadSynced : null,
      categoriaId: formData.categoriaId,
      categoriaNombre: formData.categoriaId === 'other' ? formData.customCategoria : selectedCat?.nombre,
      isNewCategorySuggested: formData.categoriaId === 'other',
      direccion: formData.direccion,
      horario: formData.horario || 'Consultar horarios',
      whatsapp: formData.whatsapp,
      descripcion: formData.descripcion,
      mapsLink: formData.mapsLink,
      coordenadas: formData.coordenadas,
      fotos: formData.fotos,
      promocionPrincipal: null, // Opción A: beneficios se gestionan post-aprobación
      estado: 'pendiente',
      esPremium: false,
      rating: 5.0,
      reviewsCount: 0,
      distancia: 'Ubicado en zona',
      distanciaKm: 0.5,
      fechaSolicitud: new Date().toLocaleDateString('es-AR')
    };

    if (onCompleteRegistration) {
      onCompleteRegistration(newBusinessPayload);
    }

    setErrorMsg('');
    setStep(3); // Paso 3 = Pantalla final de Confirmación "Pendiente de Revisión"
  };

  const stepsMeta = [
    { num: 1, label: 'Identidad del Local' },
    { num: 2, label: 'Ubicación y Fotos' }
  ];

  return (
    <div className="w-full min-h-screen bg-[#0B0B0E] text-[#F5F5F7] pb-12 overflow-x-hidden select-none animate-fadeIn">
      {/* Header Sticky Superior */}
      <header className="sticky top-0 z-30 bg-[#0B0B0E]/95 backdrop-blur-md px-5 pt-4 pb-4 border-b border-white/5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => (step === 2 ? setStep(1) : onBack && onBack())}
            className="w-10 h-10 rounded-full bg-[#141418] border border-white/10 hover:border-gold-border flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 text-center">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F5D77F] text-[9px] font-bold tracking-widest uppercase">
              <Store className="w-3 h-3" />
              ALTA DE COMERCIO • B2B
            </span>
          </div>

          {step <= 2 ? (
            <button
              type="button"
              onClick={handleFillDemoData}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-semibold text-[#E5C07B] flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              title="Completar datos de ejemplo para demo"
            >
              <Wand2 className="w-3 h-3" />
              <span>Auto</span>
            </button>
          ) : (
            <div className="w-10 shrink-0" />
          )}
        </div>

        {/* Título y Barra de Progreso de 2 Pasos */}
        {step <= 2 && (
          <div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
              Registrá tu Comercio
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Completá estos 2 pasos para sumarte a la guía oficial
            </p>

            {/* Indicador de pasos */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {stepsMeta.map((s) => {
                const isDone = step > s.num;
                const isCurrent = step === s.num;
                return (
                  <div key={s.num} className="space-y-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isCurrent
                          ? 'bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] shadow-[0_0_8px_rgba(212,175,55,0.5)]'
                          : isDone
                          ? 'bg-[#D4AF37]/70'
                          : 'bg-white/10'
                      }`}
                    />
                    <div className="flex items-center gap-1 text-[10px]">
                      {isDone ? (
                        <CheckCircle2 className="w-3 h-3 text-[#E5C07B]" />
                      ) : (
                        <span className={`font-bold ${isCurrent ? 'text-[#F5D77F]' : 'text-gray-500'}`}>
                          {s.num}.
                        </span>
                      )}
                      <span className={isCurrent ? 'text-white font-semibold' : isDone ? 'text-[#E5C07B]' : 'text-gray-500'}>
                        {s.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Contenido del Formulario */}
      <div className="px-5 pt-5">
        {step === 1 && (
          <form onSubmit={handleNextFromStep1} className="space-y-5 animate-fadeIn">
            {/* Tarjeta Principal de Datos */}
            <div className="bg-[#141418] border border-white/5 rounded-3xl p-4 sm:p-5 space-y-4 shadow-lg">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <Store className="w-4 h-4 text-[#E5C07B]" />
                <h2 className="text-xs uppercase tracking-wider text-[#C9A66B] font-bold">
                  1. Identidad del Local
                </h2>
              </div>

              {/* Nombre Comercial */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-300 block">
                  Nombre comercial <span className="text-[#E5C07B]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  placeholder="Ej. Parrilla El Mirador"
                  className="w-full bg-[#0B0B0E] border border-white/10 focus:border-[#D4AF37] rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>

              {/* Eslogan / Especialidad */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-300 block">
                  Eslogan o especialidad corta
                </label>
                <input
                  type="text"
                  value={formData.eslogan}
                  onChange={(e) => handleChange('eslogan', e.target.value)}
                  placeholder="Ej. Restaurante • Vista al Lago • Parrilla"
                  className="w-full bg-[#0B0B0E] border border-white/10 focus:border-[#D4AF37] rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>

              {/* Selector de Localidad con Opción de Nueva Ciudad Sincronizada */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-gray-300 block">
                  Localidad / Destino <span className="text-[#E5C07B]">*</span>
                </label>
                <select
                  value={formData.localidadId}
                  onChange={(e) => {
                    const val = e.target.value;
                    const foundLoc = localidadesMock.find((l) => l.id === val);
                    setFormData((prev) => ({
                      ...prev,
                      localidadId: val,
                      coordenadas: foundLoc
                        ? { lat: foundLoc.latCentro, lng: foundLoc.lngCentro }
                        : prev.coordenadas
                    }));
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full bg-[#0B0B0E] border border-white/10 focus:border-[#D4AF37] rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all cursor-pointer"
                >
                  {localidadesMock.map((loc) => (
                    <option key={loc.id} value={loc.id} className="bg-[#141418] text-white">
                      {loc.nombre} ({loc.provincia})
                    </option>
                  ))}
                  <option value="other" className="bg-[#1C1A14] text-[#F5D77F] font-bold">
                    ➕ Mi ciudad no está en la lista (Agregar nueva localidad)
                  </option>
                </select>

                {/* Panel Desplegable para Nueva Localidad Sincronizada con Google Maps */}
                {formData.localidadId === 'other' && (
                  <div className="bg-[#0B0B0E] border border-[#D4AF37]/40 rounded-2xl p-3.5 space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#F5D77F] flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5" />
                        <span>Sincronizar ciudad con Google Maps</span>
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.customLocalidadInput}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            customLocalidadInput: e.target.value,
                            customLocalidadSynced: null
                          }));
                          if (errorMsg) setErrorMsg('');
                        }}
                        placeholder="Ej. Mar del Plata, Bariloche..."
                        className="flex-1 bg-[#141418] border border-white/10 focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSyncCustomCity()}
                        className="px-3.5 py-2 rounded-xl bg-gold-gradient text-black font-bold text-xs cursor-pointer hover:brightness-105 transition-all shrink-0"
                      >
                        Sincronizar
                      </button>
                    </div>

                    {/* Sugerencias rápidas para demo */}
                    {!formData.customLocalidadSynced && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <span className="text-[10px] text-gray-500">Sugerencias:</span>
                        {['Mar del Plata', 'Pinamar', 'Bariloche'].map((city) => (
                          <button
                            key={city}
                            type="button"
                            onClick={() => handleSyncCustomCity(city)}
                            className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-gray-300 cursor-pointer transition-colors"
                          >
                            + {city}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Confirmación de Sincronización con Maps */}
                    {formData.customLocalidadSynced && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            Sincronizado: {formData.customLocalidadSynced.nombre}, {formData.customLocalidadSynced.provincia}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 pl-5">
                          Coords: {formData.customLocalidadSynced.lat}, {formData.customLocalidadSynced.lng} • Se habilitará al aprobar tu local.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selector Visual de Rubro / Categoría */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-gray-300 block">
                  Rubro principal <span className="text-[#E5C07B]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categoriasMock.map((cat) => {
                    const isSelected = formData.categoriaId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleChange('categoriaId', cat.id)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1F1C14] border-[#D4AF37] text-[#FAF6EE] shadow-[0_2px_10px_rgba(212,175,55,0.2)]'
                            : 'bg-[#0B0B0E] border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <div className={`p-1.5 rounded-xl shrink-0 ${
                          isSelected ? 'bg-gold-gradient text-black' : 'bg-white/5 text-[#E5C07B]'
                        }`}>
                          {getCategoryIcon(cat.icono)}
                        </div>
                        <span className="text-xs font-semibold truncate">{cat.nombre}</span>
                      </button>
                    );
                  })}

                  {/* Opción 6: Sugerir Otro Rubro */}
                  <button
                    type="button"
                    onClick={() => handleChange('categoriaId', 'other')}
                    className={`flex items-center gap-2.5 p-2.5 rounded-2xl border border-dashed text-left transition-all cursor-pointer ${
                      formData.categoriaId === 'other'
                        ? 'bg-[#1F1C14] border-[#D4AF37] text-[#FAF6EE] shadow-[0_2px_10px_rgba(212,175,55,0.2)]'
                        : 'bg-[#0B0B0E] border-[#D4AF37]/40 text-[#E5C07B] hover:border-[#D4AF37] hover:bg-[#1A1812]'
                    }`}
                  >
                    <div className={`p-1.5 rounded-xl shrink-0 ${
                      formData.categoriaId === 'other' ? 'bg-gold-gradient text-black' : 'bg-[#D4AF37]/15 text-[#E5C07B]'
                    }`}>
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold truncate">Otro rubro</span>
                  </button>
                </div>

                {/* Panel Desplegable para Nuevo Rubro */}
                {formData.categoriaId === 'other' && (
                  <div className="bg-[#0B0B0E] border border-[#D4AF37]/40 rounded-2xl p-3.5 space-y-2 animate-fadeIn">
                    <label className="text-[11px] font-semibold text-[#F5D77F] block">
                      ¿Cuál es el rubro de tu local? <span className="text-[#E5C07B]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.customCategoria}
                      onChange={(e) => handleChange('customCategoria', e.target.value)}
                      placeholder="Ej. Indumentaria, Heladería, Veterinaria, Rent a Car..."
                      className="w-full bg-[#141418] border border-white/10 focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none"
                    />
                    <div className="flex items-start gap-1.5 text-[10px] text-gray-400 pt-0.5">
                      <Info className="w-3.5 h-3.5 text-[#E5C07B] shrink-0 mt-0.5" />
                      <span>
                        Nuestro equipo asignará el rubro oficial al aprobar tu local.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tarjeta de Contacto y Horarios */}
            <div className="bg-[#141418] border border-white/5 rounded-3xl p-4 sm:p-5 space-y-4 shadow-lg">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <Phone className="w-4 h-4 text-[#E5C07B]" />
                <h2 className="text-xs uppercase tracking-wider text-[#C9A66B] font-bold">
                  Contacto y Horarios
                </h2>
              </div>

              {/* Dirección Física */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E5C07B]" />
                  <span>Dirección exacta <span className="text-[#E5C07B]">*</span></span>
                </label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => handleChange('direccion', e.target.value)}
                  placeholder="Ej. Av. Costanera 340, Villa Carlos Paz"
                  className="w-full bg-[#0B0B0E] border border-white/10 focus:border-[#D4AF37] rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Horarios */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#E5C07B]" />
                    <span>Horarios de atención</span>
                  </label>
                  <input
                    type="text"
                    value={formData.horario}
                    onChange={(e) => handleChange('horario', e.target.value)}
                    placeholder="Ej. 12:00 a 00:00 hs"
                    className="w-full bg-[#0B0B0E] border border-white/10 focus:border-[#D4AF37] rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  />
                </div>

                {/* WhatsApp */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-300 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#E5C07B]" />
                    <span>WhatsApp comercial <span className="text-[#E5C07B]">*</span></span>
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    placeholder="+54 9 3541 ..."
                    className="w-full bg-[#0B0B0E] border border-white/10 focus:border-[#D4AF37] rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-300 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#E5C07B]" />
                  <span>Descripción para los turistas</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => handleChange('descripcion', e.target.value)}
                  placeholder="Contanos qué hace especial a tu comercio, platos recomendados, servicios..."
                  className="w-full bg-[#0B0B0E] border border-white/10 focus:border-[#D4AF37] rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all resize-none"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 text-center">
                {errorMsg}
              </div>
            )}

            {/* Botón Siguiente */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
            >
              <span>Continuar: Ubicación y Fotos</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        )}

        {/* PASO 2: Ubicación Híbrida (Hardcoded Mock) y Galería de Fotos */}
        {step === 2 && (
          <form onSubmit={handleNextFromStep2} className="space-y-5 animate-fadeIn">
            {/* Tarjeta 1: Sincronización de Ubicación */}
            <div className="bg-[#141418] border border-white/5 rounded-3xl p-4 sm:p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#E5C07B]" />
                  <h2 className="text-xs uppercase tracking-wider text-[#C9A66B] font-bold">
                    2. Ubicación Exacta en Mapa
                  </h2>
                </div>
                {isLocationSynced && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                    ✓ Sincronizado
                  </span>
                )}
              </div>

              {/* Switcher de Método: Pegar Link de Google Maps vs Ajustar Pin / GPS */}
              <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#0B0B0E] border border-white/10">
                <button
                  type="button"
                  onClick={() => setLocationMethod('link')}
                  className={`py-2 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    locationMethod === 'link'
                      ? 'bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Link Google Maps</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLocationMethod('pin')}
                  className={`py-2 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    locationMethod === 'pin'
                      ? 'bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>GPS / Pin Manual</span>
                </button>
              </div>

              {/* Vía A: Pegar enlace de Google Maps */}
              {locationMethod === 'link' ? (
                <div className="space-y-2.5 animate-fadeIn">
                  <label className="text-[11px] text-gray-300 block">
                    Pegá el enlace compartido desde tu Google Maps:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.mapsLink}
                      onChange={(e) => {
                        handleChange('mapsLink', e.target.value);
                        setIsLocationSynced(false);
                      }}
                      placeholder="https://maps.app.goo.gl/..."
                      className="flex-1 bg-[#0B0B0E] border border-white/10 focus:border-[#D4AF37] rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleSyncMapsLink()}
                      className="px-3.5 py-2.5 rounded-xl bg-gold-gradient text-black font-bold text-xs cursor-pointer hover:brightness-105 transition-all shrink-0"
                    >
                      Sincronizar
                    </button>
                  </div>

                  {/* Botón rápido de ejemplo */}
                  {!formData.mapsLink && (
                    <button
                      type="button"
                      onClick={() => handleSyncMapsLink('https://maps.app.goo.gl/UHajQQTkEBCoQBGz8')}
                      className="text-[10px] text-[#E5C07B] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>Usar link de ejemplo (maps.app.goo.gl/UHajQ...)</span>
                    </button>
                  )}
                </div>
              ) : (
                /* Vía B: Detectar GPS o ajustar manualmente */
                <div className="space-y-2.5 animate-fadeIn">
                  <button
                    type="button"
                    onClick={handleDetectMockGps}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#0B0B0E] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-xs font-semibold text-[#F5D77F] flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Detectar mi ubicación actual (Estoy en el local)</span>
                  </button>
                  <p className="text-[10px] text-gray-400 text-center">
                    También podés tocar cualquier punto del mapa debajo para ajustar el pin exacto.
                  </p>
                </div>
              )}

              {/* Mini-Mapa Visual de Verificación (Mockup Interactivo) */}
              <div className="space-y-1.5 pt-1">
                <div 
                  onClick={handleMiniMapClick}
                  className="relative w-full h-48 rounded-2xl overflow-hidden border border-gold-border/50 cursor-crosshair shadow-inner group"
                  title="Tocá para ajustar el pin"
                >
                  <img
                    src="/mock-images/carlos-paz-dark-map.jpg"
                    alt="Vista previa de mapa"
                    className="w-full h-full object-cover select-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0E]/85 via-transparent to-[#0B0B0E]/40 pointer-events-none" />

                  {/* Pin Dorado del Comercio en el Mini-Mapa */}
                  <div
                    className="absolute z-10 flex flex-col items-center pointer-events-none transition-all duration-300"
                    style={{
                      top: `${pinPreviewPos.y}%`,
                      left: `${pinPreviewPos.x}%`,
                      transform: 'translate(-50%, -100%)'
                    }}
                  >
                    <div className="w-9 h-10 bg-gradient-to-b from-[#F5D77F] via-[#D4AF37] to-[#AA7C26] rounded-t-full p-[2px] shadow-[0_0_20px_rgba(212,175,55,0.8)] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#FAF6EE] flex items-center justify-center">
                        <Store className="w-3.5 h-3.5 text-[#0B0B0E]" />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[7px] border-x-transparent border-t-[8px] border-t-[#AA7C26]" />
                    </div>
                    <span className="mt-2 px-2 py-0.5 rounded-full bg-[#0B0B0E]/90 border border-[#D4AF37]/60 text-[9px] font-bold text-[#F5D77F] whitespace-nowrap shadow-md">
                      {formData.nombre || 'Tu Comercio'}
                    </span>
                  </div>

                  {/* Barra inferior de coordenadas dentro del mini-mapa */}
                  <div className="absolute bottom-2 inset-x-2 px-3 py-1.5 rounded-xl bg-[#0B0B0E]/85 backdrop-blur-md border border-white/10 flex items-center justify-between text-[10px]">
                    <span className="text-gray-300 font-mono">
                      Lat: {formData.coordenadas.lat}, Lng: {formData.coordenadas.lng}
                    </span>
                    <span className="text-[#E5C07B] font-semibold">
                      {isLocationSynced ? 'Pin Verificado' : 'Tocá para fijar pin'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta 2: Galería de Fotos HD (.webp) */}
            <div className="bg-[#141418] border border-white/5 rounded-3xl p-4 sm:p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#E5C07B]" />
                  <h2 className="text-xs uppercase tracking-wider text-[#C9A66B] font-bold">
                    Galería de Fotos ({formData.fotos.length}/4)
                  </h2>
                </div>

                {formData.fotos.length === 0 && (
                  <button
                    type="button"
                    onClick={handleLoadDemoPhotos}
                    className="text-[10px] font-semibold text-[#E5C07B] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>Cargar muestra</span>
                  </button>
                )}
              </div>

              {/* Grilla de Previsualización de Fotos */}
              {formData.fotos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {formData.fotos.map((fotoUrl, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-[#0B0B0E] group"
                    >
                      <img
                        src={fotoUrl}
                        alt={`Foto ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 text-[8px] font-bold text-emerald-400 border border-emerald-500/30">
                        .WEBP HD
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/75 border border-white/20 flex items-center justify-center text-white hover:text-red-400 transition-colors cursor-pointer"
                        title="Quitar foto"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Zona de Subida de Imágenes */}
              {formData.fotos.length < 4 && (
                <label className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border border-dashed border-[#D4AF37]/40 bg-[#0B0B0E] hover:bg-[#181610] hover:border-[#D4AF37] transition-all cursor-pointer text-center">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#E5C07B]">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      Subir fotos del local o productos
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Se optimizarán automáticamente a formato .webp HD
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 text-center">
                {errorMsg}
              </div>
            )}

            {/* Botones de Navegación */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setStep(1);
                }}
                className="col-span-1 py-4 rounded-2xl bg-[#141418] border border-white/10 hover:border-white/20 text-xs font-bold text-gray-300 hover:text-white cursor-pointer transition-all"
              >
                ← Atrás
              </button>
              <button
                type="submit"
                className="col-span-2 py-4 rounded-2xl bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] font-bold text-xs sm:text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>Enviar Local a Revisión</span>
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>
        )}

        {/* PASO 3: Pantalla Final de Confirmación — Estado "Pendiente de Revisión" */}
        {step === 3 && (
          <div className="space-y-5 animate-fadeIn pt-2">
            {/* Tarjeta Hero de Confirmación */}
            <div className="relative bg-gradient-to-b from-[#1C1A14] via-[#141418] to-[#121216] border border-gold-border/60 rounded-3xl p-6 text-center space-y-4 shadow-[0_16px_40px_rgba(0,0,0,0.8)] overflow-hidden">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Ícono Central de Revisión */}
              <div className="relative mx-auto w-20 h-20 rounded-full bg-[#D4AF37]/15 border-2 border-[#D4AF37]/60 flex items-center justify-center text-[#F5D77F] shadow-[0_0_25px_rgba(212,175,55,0.3)]">
                <Clock className="w-9 h-9 stroke-[1.8]" />
                <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0B0B0E] border border-[#D4AF37] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </span>
              </div>

              {/* Badge de Estado */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[10px] font-extrabold tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>ESTADO: PENDIENTE DE REVISIÓN</span>
              </div>

              <div className="space-y-1.5">
                <h2 className="font-serif text-2xl font-bold text-white">
                  ¡Recibimos tu comercio!
                </h2>
                <p className="text-xs text-gray-300 max-w-[300px] mx-auto leading-relaxed">
                  La ficha de <strong className="text-[#F5D77F]">{formData.nombre}</strong> fue enviada a nuestro equipo de moderación. No se publicará hasta ser verificada.
                </p>
              </div>
            </div>

            {/* Tarjeta de Resumen de la Solicitud */}
            <div className="bg-[#141418] border border-white/5 rounded-3xl p-4 sm:p-5 space-y-3 shadow-lg">
              <h3 className="text-[11px] uppercase tracking-wider text-[#C9A66B] font-bold pb-2 border-b border-white/5">
                Resumen de Solicitud
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-400">Localidad / Destino:</span>
                  <span className="text-white font-semibold text-right">
                    {formData.localidadId === 'other'
                      ? `${formData.customLocalidadSynced?.nombre} (Nueva)`
                      : localidadesMock.find((l) => l.id === formData.localidadId)?.nombre}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-400">Rubro:</span>
                  <span className="text-white font-semibold text-right">
                    {formData.categoriaId === 'other'
                      ? `${formData.customCategoria} (A asignar)`
                      : categoriasMock.find((c) => c.id === formData.categoriaId)?.nombre}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-400">Ubicación Maps:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sincronizada ({formData.coordenadas.lat}, {formData.coordenadas.lng})</span>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-400">Galería HD:</span>
                  <span className="text-white font-semibold">
                    {formData.fotos.length} {formData.fotos.length === 1 ? 'imagen .webp' : 'imágenes .webp'}
                  </span>
                </div>
              </div>
            </div>

            {/* Próximos Pasos */}
            <div className="bg-[#141418] border border-white/5 rounded-3xl p-4 sm:p-5 space-y-3">
              <h3 className="text-[11px] uppercase tracking-wider text-[#C9A66B] font-bold">
                ¿Qué sigue ahora?
              </h3>
              <ul className="space-y-2.5 text-xs text-gray-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#F5D77F] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    Validamos la dirección, ubicación en Google Maps y datos comerciales.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#F5D77F] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    Si sugeriste una ciudad o rubro nuevo, los activaremos oficialmente al aprobar tu local.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#F5D77F] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    Una vez aprobado, podrás crear tus cupones de descuento desde el <strong className="text-white">Panel de Comercio</strong>.
                  </span>
                </li>
              </ul>
            </div>

            {/* Botón Principal de Regreso */}
            <button
              type="button"
              onClick={() => onBack && onBack()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
            >
              <span>Volver a la App</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
