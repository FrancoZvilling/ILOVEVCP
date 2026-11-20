import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Compass,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Edit3,
  Save,
  X,
  Store,
  Globe,
  Navigation,
  Sparkles
} from 'lucide-react';

const PRESET_ARG_CITIES = [
  {
    nombre: 'Mar del Plata',
    subtitulo: 'Costa Atlántica',
    provincia: 'Buenos Aires',
    latCentro: -38.0055,
    lngCentro: -57.5426,
    radioKm: 18,
    distanciaKm: 710
  },
  {
    nombre: 'San Carlos de Bariloche',
    subtitulo: 'Patagonia Andina',
    provincia: 'Río Negro',
    latCentro: -41.1335,
    lngCentro: -71.3103,
    radioKm: 20,
    distanciaKm: 1320
  },
  {
    nombre: 'Mendoza Capital',
    subtitulo: 'Cuyo & Bodegas',
    provincia: 'Mendoza',
    latCentro: -32.8895,
    lngCentro: -68.8458,
    radioKm: 16,
    distanciaKm: 580
  },
  {
    nombre: 'Villa de Merlo',
    subtitulo: 'Sierras de los Comechingones',
    provincia: 'San Luis',
    latCentro: -32.3429,
    lngCentro: -65.0139,
    radioKm: 12,
    distanciaKm: 195
  }
];

export default function AdminLocalitiesView({
  localities = [],
  businesses = [],
  onToggleLocalityActive,
  onCreateLocality,
  onUpdateLocality
}) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  // Estado formulario nueva localidad
  const [newCity, setNewCity] = useState({
    nombre: '',
    subtitulo: '',
    provincia: 'Córdoba',
    radioKm: 15,
    latCentro: -31.4241,
    lngCentro: -64.4978,
    distanciaKm: 45,
    activa: true
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  const activeCount = localities.filter((l) => l.activa !== false).length;
  const pausedCount = localities.filter((l) => l.activa === false).length;

  const handleApplyPreset = (preset) => {
    setNewCity({
      ...preset,
      activa: true
    });
    showToast(`Coordenadas GPS de ${preset.nombre} sincronizadas`);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newCity.nombre.trim()) return;

    const slugId = newCity.nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (onCreateLocality) {
      onCreateLocality({
        id: slugId || `zona-${Date.now()}`,
        nombre: newCity.nombre.trim(),
        subtitulo: newCity.subtitulo.trim() || newCity.provincia.trim() || 'Zona Turística',
        provincia: newCity.provincia.trim() || 'Argentina',
        distanciaKm: Number(newCity.distanciaKm) || 50,
        latCentro: Number(newCity.latCentro) || -31.4241,
        lngCentro: Number(newCity.lngCentro) || -64.4978,
        radioKm: Number(newCity.radioKm) || 15,
        activa: Boolean(newCity.activa)
      });
    }

    showToast(`Localidad "${newCity.nombre}" habilitada en la plataforma`);
    setNewCity({
      nombre: '',
      subtitulo: '',
      provincia: 'Córdoba',
      radioKm: 15,
      latCentro: -31.4241,
      lngCentro: -64.4978,
      distanciaKm: 45,
      activa: true
    });
    setShowCreateForm(false);
  };

  const startEditing = (loc) => {
    setEditingId(loc.id);
    setEditDraft({
      nombre: loc.nombre || '',
      subtitulo: loc.subtitulo || '',
      provincia: loc.provincia || '',
      radioKm: loc.radioKm || 15,
      latCentro: loc.latCentro || -31.4241,
      lngCentro: loc.lngCentro || -64.4978
    });
  };

  const saveEdit = (locId) => {
    if (onUpdateLocality) {
      onUpdateLocality(locId, {
        ...editDraft,
        radioKm: Number(editDraft.radioKm) || 15,
        latCentro: Number(editDraft.latCentro),
        lngCentro: Number(editDraft.lngCentro)
      });
    }
    setEditingId(null);
    showToast('Parámetros de cobertura actualizados');
  };

  return (
    <div className="space-y-5 pb-8 animate-fadeIn">
      {/* Notificación flotante */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#1A1A22] border border-[#D4AF37] text-[#F5D77F] text-xs font-bold shadow-[0_10px_30px_rgba(0,0,0,0.85)] flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Resumen Multitenant */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 rounded-2xl bg-[#141418] border border-white/5 text-center">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
            Ciudades
          </span>
          <span className="font-serif text-xl font-bold text-white mt-0.5 block">
            {localities.length}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-gradient-to-br from-[#221E14] to-[#141418] border border-gold-border/60 text-center">
          <span className="text-[10px] text-[#E5C07B] uppercase tracking-wider font-bold block">
            Activas
          </span>
          <span className="font-serif text-xl font-bold text-[#F5D77F] mt-0.5 block">
            {activeCount}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#141418] border border-white/5 text-center">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
            Pausadas
          </span>
          <span className="font-serif text-xl font-bold text-gray-300 mt-0.5 block">
            {pausedCount}
          </span>
        </div>
      </div>

      {/* 2. Cabecera y Botón + Nueva Localidad */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="font-serif text-base font-bold text-white flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#E5C07B]" />
            <span>Zonas y Radios GPS</span>
          </h2>
          <p className="text-[11px] text-gray-400">
            Las zonas activas aparecen en el selector de ciudad del turista
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateForm(!showCreateForm)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
            showCreateForm
              ? 'bg-white/10 text-gray-300 border border-white/15'
              : 'bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] shadow-gold-glow/30'
          }`}
        >
          {showCreateForm ? (
            <>
              <X className="w-3.5 h-3.5" />
              <span>Cerrar</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Nueva Zona</span>
            </>
          )}
        </button>
      </div>

      {/* 3. Formulario Plegable: Alta de Nueva Localidad Multitenant */}
      {showCreateForm && (
        <form
          onSubmit={handleCreateSubmit}
          className="p-4 rounded-3xl bg-gradient-to-b from-[#1A1813] to-[#141418] border border-[#D4AF37]/60 space-y-4 shadow-gold-glow/20 animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F5D77F]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#F5D77F]">
                Habilitar Nueva Ciudad / Destino
              </span>
            </div>
            <span className="text-[10px] text-gray-400">Google Maps Sync</span>
          </div>

          {/* Presets Rápidos de Ciudades Turísticas */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">
              Autocompletado rápido con coordenadas reales:
            </span>
            <div className="flex gap-1.5 overflow-x-auto pt-1 pb-1.5 scrollbar-none">
              {PRESET_ARG_CITIES.map((preset) => (
                <button
                  key={preset.nombre}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="shrink-0 px-2.5 py-1.5 rounded-xl bg-[#0E0E12] border border-white/10 hover:border-[#D4AF37] text-[10px] font-semibold text-[#FAF6EE] flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Navigation className="w-2.5 h-2.5 text-[#E5C07B]" />
                  <span>{preset.nombre}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="col-span-2">
              <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                Nombre de la Ciudad / Localidad *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Mar del Plata"
                value={newCity.nombre}
                onChange={(e) => setNewCity({ ...newCity, nombre: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                Valle / Región
              </label>
              <input
                type="text"
                placeholder="Ej: Costa Atlántica"
                value={newCity.subtitulo}
                onChange={(e) => setNewCity({ ...newCity, subtitulo: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                Provincia
              </label>
              <input
                type="text"
                placeholder="Ej: Buenos Aires"
                value={newCity.provincia}
                onChange={(e) => setNewCity({ ...newCity, provincia: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                Radio Cobertura (km)
              </label>
              <input
                type="number"
                min="2"
                max="100"
                value={newCity.radioKm}
                onChange={(e) => setNewCity({ ...newCity, radioKm: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                Distancia Ref. (km)
              </label>
              <input
                type="number"
                min="0"
                value={newCity.distanciaKm}
                onChange={(e) => setNewCity({ ...newCity, distanciaKm: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                Latitud Centro
              </label>
              <input
                type="number"
                step="any"
                value={newCity.latCentro}
                onChange={(e) => setNewCity({ ...newCity, latCentro: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                Longitud Centro
              </label>
              <input
                type="number"
                step="any"
                value={newCity.lngCentro}
                onChange={(e) => setNewCity({ ...newCity, lngCentro: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] text-xs font-extrabold uppercase tracking-wider shadow-gold-glow/30 cursor-pointer"
          >
            Guardar y Activar Localidad
          </button>
        </form>
      )}

      {/* 4. Listado de Localidades Configuradas */}
      <div className="space-y-3">
        {localities.map((loc) => {
          const isActive = loc.activa !== false;
          const isEditing = editingId === loc.id;
          const localBusinessesCount = businesses.filter(
            (b) => b.localidadId === loc.id
          ).length;

          return (
            <div
              key={loc.id}
              className={`rounded-3xl p-4 transition-all duration-200 border ${
                !isActive
                  ? 'bg-[#101014] border-white/5 opacity-75'
                  : 'bg-[#141418] border-gold-border/40 shadow-[0_6px_20px_rgba(0,0,0,0.45)]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-br from-[#F5D77F] via-[#D4AF37] to-[#AA7C26] text-[#0B0B0E] shadow-md'
                        : 'bg-white/5 text-gray-500 border border-white/10'
                    }`}
                  >
                    <MapPin className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif text-base font-bold text-white truncate">
                        {loc.nombre}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                          isActive
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {isActive ? 'Activa en App' : 'Oculta'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {loc.subtitulo} • {loc.provincia || 'Argentina'}
                    </p>
                  </div>
                </div>

                {/* Contador de Comercios en esta Localidad */}
                <div className="shrink-0 px-2.5 py-1 rounded-xl bg-[#0B0B0E] border border-white/5 text-right">
                  <span className="text-xs font-bold text-[#F5D77F] flex items-center gap-1">
                    <Store className="w-3 h-3 text-[#E5C07B]" />
                    {localBusinessesCount}
                  </span>
                  <span className="text-[9px] text-gray-500 block">locales</span>
                </div>
              </div>

              {/* Píldoras Técnicas de Georreferencia */}
              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400 flex-wrap gap-2">
                <span className="flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-[#E5C07B]" />
                  Radio: <strong className="text-white">{loc.radioKm || 15} km</strong>
                </span>
                <span className="text-[10px] font-mono text-gray-400 bg-[#0B0B0E] px-2 py-0.5 rounded-lg border border-white/5">
                  {Number(loc.latCentro).toFixed(4)}, {Number(loc.lngCentro).toFixed(4)}
                </span>
              </div>

              {/* Editor Inline de Localidad */}
              {isEditing && (
                <div className="mt-3.5 pt-3.5 border-t border-white/10 space-y-3 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={editDraft.nombre}
                        onChange={(e) =>
                          setEditDraft({ ...editDraft, nombre: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                        Radio GPS (km)
                      </label>
                      <input
                        type="number"
                        min="2"
                        max="100"
                        value={editDraft.radioKm}
                        onChange={(e) =>
                          setEditDraft({ ...editDraft, radioKm: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                        Región / Valle
                      </label>
                      <input
                        type="text"
                        value={editDraft.subtitulo}
                        onChange={(e) =>
                          setEditDraft({ ...editDraft, subtitulo: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                        Provincia
                      </label>
                      <input
                        type="text"
                        value={editDraft.provincia}
                        onChange={(e) =>
                          setEditDraft({ ...editDraft, provincia: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => saveEdit(loc.id)}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Guardar Cambios</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-3 py-2 rounded-xl bg-white/5 text-gray-300 text-xs font-semibold cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Barra de Acciones 1-Toque */}
              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (isActive && activeCount <= 1) {
                      showToast('Debe quedar al menos 1 localidad activa en la app');
                      return;
                    }
                    if (onToggleLocalityActive) onToggleLocalityActive(loc.id);
                    showToast(
                      isActive
                        ? `${loc.nombre} ocultada del selector de zonas`
                        : `${loc.nombre} activada en el selector de zonas`
                    );
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1D1D24] border border-white/10 text-gray-300 hover:border-rose-500/40 hover:text-rose-300'
                      : 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  {isActive ? (
                    <>
                      <PauseCircle className="w-3.5 h-3.5" />
                      <span>Pausar Zona</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Activar Zona</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => (isEditing ? setEditingId(null) : startEditing(loc))}
                  className="py-2 px-3 rounded-xl bg-[#1D1D24] border border-white/10 hover:border-gold-border text-[11px] font-semibold text-gray-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#E5C07B]" />
                  <span>{isEditing ? 'Cerrar' : 'Editar Radio'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
