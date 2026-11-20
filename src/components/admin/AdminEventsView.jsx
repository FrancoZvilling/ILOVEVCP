import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Trash2,
  X,
  Music,
  Theater,
  Trophy,
  Utensils,
  Ticket
} from 'lucide-react';

const EVENT_CATEGORIES = [
  { id: 'musica', label: 'Música & Festivales', shortLabel: 'Música', icon: Music },
  { id: 'teatro', label: 'Teatro & Espectáculos', shortLabel: 'Teatro', icon: Theater },
  { id: 'deportes', label: 'Deportes & Aventura', shortLabel: 'Deportes', icon: Trophy },
  { id: 'gastronomia', label: 'Feria Gastronómica', shortLabel: 'Ferias', icon: Utensils }
];

const DEMO_EVENT_IMAGES = [
  {
    label: 'Recital / Sunset',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80'
  },
  {
    label: 'Gala de Teatro',
    url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1000&q=80'
  },
  {
    label: 'Feria Gastronómica',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80'
  },
  {
    label: 'Maratón / Deporte',
    url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1000&q=80'
  }
];

export default function AdminEventsView({
  events = [],
  localities = [],
  onCreateEvent,
  onToggleEventFeatured,
  onToggleEventActive,
  onDeleteEvent
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [newEvent, setNewEvent] = useState({
    titulo: '',
    subtitulo: '',
    categoria: 'musica',
    localidadId: 'carlos-paz',
    fecha: 'Sábado 6 Dic',
    dia: '06',
    mes: 'DIC',
    hora: '20:30 hs',
    lugar: 'Costanera del Lago San Roque',
    direccion: 'Av. Costanera Illia 500, Villa Carlos Paz',
    esDestacado: true,
    esGratuito: true,
    precioLabel: 'Entrada Libre y Gratuita',
    organizador: 'Secretaría de Turismo y Cultura',
    descripcion: '',
    imagen: DEMO_EVENT_IMAGES[0].url
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  const featuredCount = events.filter((e) => e.esDestacado).length;
  const activeCount = events.filter((e) => e.activo !== false).length;

  const filteredEvents =
    selectedCategory === 'all'
      ? events
      : events.filter((e) => e.categoria === selectedCategory);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newEvent.titulo.trim()) return;

    const catObj =
      EVENT_CATEGORIES.find((c) => c.id === newEvent.categoria) || EVENT_CATEGORIES[0];

    const created = {
      id: `evento-${Date.now()}`,
      localidadId: newEvent.localidadId || 'carlos-paz',
      titulo: newEvent.titulo.trim(),
      subtitulo:
        newEvent.subtitulo.trim() || `${catObj.label} • Evento Oficial`,
      categoria: newEvent.categoria,
      categoriaLabel: catObj.label,
      fecha: newEvent.fecha.trim() || 'Sábado 6 Dic',
      fechaCorta: {
        dia: (newEvent.dia || '06').toString().padStart(2, '0'),
        mes: (newEvent.mes || 'DIC').toUpperCase().slice(0, 3)
      },
      hora: newEvent.hora.trim() || '20:00 hs',
      lugar: newEvent.lugar.trim() || 'Costanera Villa Carlos Paz',
      direccion: newEvent.direccion.trim() || 'Centro, Villa Carlos Paz',
      coordenadas: { lat: -31.4215, lng: -64.4985 },
      esDestacado: Boolean(newEvent.esDestacado),
      esGratuito: Boolean(newEvent.esGratuito),
      precioLabel:
        newEvent.precioLabel.trim() ||
        (newEvent.esGratuito
          ? 'Entrada Libre y Gratuita'
          : 'Beneficio Exclusivo Membresía I LOVE'),
      organizador:
        newEvent.organizador.trim() || 'Secretaría de Turismo y Cultura',
      descripcion:
        newEvent.descripcion.trim() ||
        'Evento oficial de la agenda turística y cultural para disfrutar en familia y con amigos.',
      imagen: newEvent.imagen || DEMO_EVENT_IMAGES[0].url,
      tags: [
        catObj.shortLabel,
        newEvent.esGratuito ? 'Gratuito' : 'Beneficio Miembros',
        'Agenda Oficial'
      ],
      activo: true
    };

    if (onCreateEvent) {
      onCreateEvent(created);
    }

    showToast(`Evento "${created.titulo}" publicado en la cartelera del turista`);
    setNewEvent({
      ...newEvent,
      titulo: '',
      subtitulo: '',
      descripcion: ''
    });
    setShowCreateForm(false);
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

      {/* 1. Resumen Rápido de Cartelera Cultural */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 rounded-2xl bg-[#141418] border border-white/5 text-center">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
            En Agenda
          </span>
          <span className="font-serif text-xl font-bold text-white mt-0.5 block">
            {events.length}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-gradient-to-br from-[#221E14] to-[#141418] border border-gold-border/60 text-center">
          <span className="text-[10px] text-[#E5C07B] uppercase tracking-wider font-bold block">
            🌿 Destacados
          </span>
          <span className="font-serif text-xl font-bold text-[#F5D77F] mt-0.5 block">
            {featuredCount}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#141418] border border-white/5 text-center">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
            Públicos
          </span>
          <span className="font-serif text-xl font-bold text-emerald-400 mt-0.5 block">
            {activeCount}
          </span>
        </div>
      </div>

      {/* 2. Cabecera y Botón + Publicar Evento */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="font-serif text-base font-bold text-white flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#E5C07B]" />
            <span>Cartelera Municipal</span>
          </h2>
          <p className="text-[11px] text-gray-400">
            Sincronizada en tiempo real con la pestaña Eventos del Turista
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
              <span>Nuevo Evento</span>
            </>
          )}
        </button>
      </div>

      {/* 3. Formulario Plegable: Publicar Evento Municipal */}
      {showCreateForm && (
        <form
          onSubmit={handleCreateSubmit}
          className="p-4 rounded-3xl bg-gradient-to-b from-[#1A1813] to-[#141418] border border-[#D4AF37]/60 space-y-3.5 shadow-gold-glow/20 animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F5D77F]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#F5D77F]">
                Publicar Nuevo Evento o Noticia
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="col-span-2">
              <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                Título del Evento *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Fiesta Nacional de la Primavera"
                value={newEvent.titulo}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, titulo: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                Categoría Cultural
              </label>
              <select
                value={newEvent.categoria}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, categoria: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                Localidad
              </label>
              <select
                value={newEvent.localidadId}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, localidadId: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                {localities.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                Fecha Visible (Texto)
              </label>
              <input
                type="text"
                placeholder="Ej: Sábado 6 Dic"
                value={newEvent.fecha}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, fecha: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                  Día (N°)
                </label>
                <input
                  type="text"
                  maxLength={2}
                  value={newEvent.dia}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, dia: e.target.value })
                  }
                  className="w-full px-2.5 py-2 rounded-xl bg-[#0B0B0E] border border-white/10 text-xs text-white text-center font-bold focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                  Mes (3 let)
                </label>
                <input
                  type="text"
                  maxLength={3}
                  value={newEvent.mes}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, mes: e.target.value.toUpperCase() })
                  }
                  className="w-full px-2.5 py-2 rounded-xl bg-[#0B0B0E] border border-white/10 text-xs text-white text-center font-bold uppercase focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                Horario
              </label>
              <input
                type="text"
                placeholder="Ej: 20:30 hs"
                value={newEvent.hora}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, hora: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                Predio / Lugar
              </label>
              <input
                type="text"
                placeholder="Ej: Parque de Asistencia"
                value={newEvent.lugar}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, lugar: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="col-span-2">
              <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                Descripción para el Turista
              </label>
              <textarea
                rows={2}
                placeholder="Describí los artistas, actividades o beneficios del evento..."
                value={newEvent.descripcion}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, descripcion: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#0B0B0E] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37] resize-none"
              />
            </div>

            {/* Selector Rápido de Imagen de Portada (.webp / HD) */}
            <div className="col-span-2 space-y-1.5">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                Foto de Portada (Seleccionar preset o pegar URL):
              </span>
              <div className="flex gap-1.5 overflow-x-auto pt-1 pb-1.5 scrollbar-none">
                {DEMO_EVENT_IMAGES.map((img) => (
                  <button
                    key={img.label}
                    type="button"
                    onClick={() => setNewEvent({ ...newEvent, imagen: img.url })}
                    className={`shrink-0 px-2.5 py-1.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer border ${
                      newEvent.imagen === img.url
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F5D77F]'
                        : 'bg-[#0B0B0E] border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {img.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Switches de Modalidad (Gratuito y Destacado Municipal) */}
            <div className="col-span-2 grid grid-cols-2 gap-2 pt-1">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0B0B0E] border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newEvent.esGratuito}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      esGratuito: e.target.checked,
                      precioLabel: e.target.checked
                        ? 'Entrada Libre y Gratuita'
                        : '20% OFF con Membresía I LOVE CARLOS PAZ'
                    })
                  }
                  className="accent-[#D4AF37] w-3.5 h-3.5"
                />
                <span className="text-[11px] font-semibold text-gray-200">
                  Entrada Gratuita
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#221D12]/80 border border-[#D4AF37]/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newEvent.esDestacado}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, esDestacado: e.target.checked })
                  }
                  className="accent-[#D4AF37] w-3.5 h-3.5"
                />
                <span className="text-[11px] font-bold text-[#F5D77F]">
                  🌿 Destacado Municipal
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] text-xs font-extrabold uppercase tracking-wider shadow-gold-glow/30 cursor-pointer"
          >
            Publicar Evento en Cartelera
          </button>
        </form>
      )}

      {/* 4. Píldoras de Filtro por Categoría */}
      <div className="flex gap-1.5 overflow-x-auto pt-1 pb-1.5 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] font-bold'
              : 'bg-[#141418] border border-white/10 text-gray-400 hover:text-white'
          }`}
        >
          Todos ({events.length})
        </button>
        {EVENT_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] font-bold'
                  : 'bg-[#141418] border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {cat.shortLabel}
            </button>
          );
        })}
      </div>

      {/* 5. Tarjetas de Eventos con Controles 1-Toque */}
      <div className="space-y-3.5">
        {filteredEvents.map((evento) => {
          const isPublic = evento.activo !== false;

          return (
            <div
              key={evento.id}
              className={`rounded-3xl overflow-hidden transition-all duration-200 border ${
                !isPublic
                  ? 'bg-[#101014] border-white/5 opacity-75'
                  : evento.esDestacado
                  ? 'bg-gradient-to-b from-[#1E1B14] to-[#141418] border-[#D4AF37]/60 shadow-[0_8px_24px_rgba(0,0,0,0.55)]'
                  : 'bg-[#141418] border-white/10'
              }`}
            >
              {/* Cabecera con miniatura y calendario */}
              <div className="p-4 flex gap-3.5">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-white/10 bg-[#1A1A22]">
                  <img
                    src={evento.imagen}
                    alt={evento.titulo}
                    className={`w-full h-full object-cover ${
                      !isPublic ? 'grayscale' : ''
                    }`}
                  />
                  {/* Bloque Día/Mes superpuesto */}
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-lg bg-black/85 border border-[#D4AF37]/50 text-center leading-none">
                    <span className="text-[8px] font-bold text-[#E5C07B] block uppercase">
                      {evento.fechaCorta?.mes || 'NOV'}
                    </span>
                    <span className="text-xs font-black text-white font-serif">
                      {evento.fechaCorta?.dia || '15'}
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    {evento.esDestacado && (
                      <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#B8860B] text-[#0B0B0E] text-[9px] font-extrabold uppercase tracking-wider">
                        🌿 DESTACADO MUNICIPAL
                      </span>
                    )}

                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        evento.esGratuito
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-[#D4AF37]/15 text-[#F5D77F] border border-[#D4AF37]/30'
                      }`}
                    >
                      {evento.esGratuito ? 'GRATUITO' : 'PROMO MIEMBROS'}
                    </span>

                    {!isPublic && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[9px] font-bold uppercase">
                        OCULTO
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-sm font-bold text-white leading-snug line-clamp-2">
                    {evento.titulo}
                  </h3>

                  <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1 text-[#E5C07B]">
                      <Clock className="w-3 h-3" />
                      {evento.fecha} • {evento.hora}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 text-[#E5C07B] shrink-0" />
                    <span className="truncate">{evento.lugar}</span>
                  </div>
                </div>
              </div>

              {/* Botonera de Control Rápido 1-Toque */}
              <div className="px-4 py-2.5 bg-[#0E0E12]/90 border-t border-white/5 flex items-center gap-2">
                {/* 1. Switch Destacado Municipal */}
                <button
                  type="button"
                  onClick={() => {
                    if (onToggleEventFeatured) onToggleEventFeatured(evento.id);
                    showToast(
                      evento.esDestacado
                        ? `"${evento.titulo}" pasó a cartelera general`
                        : `🌿 "${evento.titulo}" fijado como Destacado Municipal`
                    );
                  }}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    evento.esDestacado
                      ? 'bg-[#D4AF37]/20 border border-[#D4AF37] text-[#F5D77F]'
                      : 'bg-[#141418] border border-white/10 text-gray-300 hover:border-gold-border hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{evento.esDestacado ? 'Destacado' : 'Destacar'}</span>
                </button>

                {/* 2. Switch Ocultar / Publicar */}
                <button
                  type="button"
                  onClick={() => {
                    if (onToggleEventActive) onToggleEventActive(evento.id);
                    showToast(
                      isPublic
                        ? `Evento ocultado temporalmente`
                        : `Evento visible nuevamente en la Agenda`
                    );
                  }}
                  className={`py-2 px-3 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    isPublic
                      ? 'bg-[#141418] border border-white/10 text-gray-300 hover:border-rose-500/40 hover:text-rose-300'
                      : 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  {isPublic ? (
                    <>
                      <PauseCircle className="w-3.5 h-3.5" />
                      <span>Ocultar</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Publicar</span>
                    </>
                  )}
                </button>

                {/* 3. Eliminar Evento */}
                <button
                  type="button"
                  onClick={() => {
                    if (onDeleteEvent) onDeleteEvent(evento.id);
                    showToast(`Evento eliminado de la agenda`);
                  }}
                  className="p-2 rounded-xl bg-[#141418] border border-white/10 text-gray-400 hover:border-rose-500/40 hover:text-rose-400 transition-all cursor-pointer"
                  title="Eliminar evento"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
