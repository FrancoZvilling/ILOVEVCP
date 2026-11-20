import React, { useState, useRef, useEffect } from 'react';
import OnboardingLanding from './pages/tourist/OnboardingLanding';
import ZoneSelector from './components/common/ZoneSelector';
import Home from './pages/tourist/Home';
import BusinessDetail from './pages/tourist/BusinessDetail';
import MapView from './pages/tourist/MapView';
import AuthLogin from './pages/tourist/AuthLogin';
import CouponsView from './pages/tourist/CouponsView';
import ProfileView from './pages/tourist/ProfileView';
import SavedBusinessesView from './pages/tourist/SavedBusinessesView';
import ActiveCouponModal from './components/common/ActiveCouponModal';
import SecurityModal from './components/common/SecurityModal';
import TermsModal from './components/common/TermsModal';
import EventDetailModal from './components/common/EventDetailModal';
import BusinessRegisterView from './pages/merchant/BusinessRegisterView';
import MerchantDashboard from './pages/merchant/MerchantDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import BottomNav from './components/layout/BottomNav';
import MerchantBottomNav from './components/layout/MerchantBottomNav';
import AdminBottomNav from './components/layout/AdminBottomNav';
import { localidadesMock } from './data/mocks/localidades';
import { comerciosMock, comerciosPendientesMock } from './data/mocks/comercios';
import { promocionesCatalogoMock } from './data/mocks/cupones';
import { eventosMock } from './data/mocks/eventos';

export default function App() {
  const [currentRole, setCurrentRole] = useState('tourist'); // 'tourist' | 'merchant' | 'admin'
  const [merchantTab, setMerchantTab] = useState('scanner'); // 'scanner' | 'metrics' | 'business'
  const [adminTab, setAdminTab] = useState('metrics'); // 'metrics' | 'moderation' | 'businesses' | 'localities' | 'events'
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [localities, setLocalities] = useState(localidadesMock);
  const [activeZone, setActiveZone] = useState(localidadesMock[0]); // Carlos Paz
  const [showZoneSelector, setShowZoneSelector] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  
  // Estado dinámico interactivo para Comercios Guardados (Favoritos)
  const [savedBusinessIds, setSavedBusinessIds] = useState(['resto-lago', 'las-olivas']);
  const [savedEventIds, setSavedEventIds] = useState(['festival-lago-2026']);
  const [showSavedBusinesses, setShowSavedBusinesses] = useState(false);

  // Estado dinámico para Comercios Activos y Cupones
  const [businesses, setBusinesses] = useState(comerciosMock);
  const [coupons, setCoupons] = useState(promocionesCatalogoMock);
  const [activeCoupon, setActiveCoupon] = useState(null);

  // Estado dinámico para Eventos Culturales
  const [events, setEvents] = useState(eventosMock);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Estados de Modales de Perfil y Flujo Comerciante/Admin
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showBusinessRegister, setShowBusinessRegister] = useState(false);
  const [pendingBusinesses, setPendingBusinesses] = useState(comerciosPendientesMock);
  const [userProfile, setUserProfile] = useState({
    nombre: 'Juan Pérez',
    email: 'juan.perez@correo.com',
    telefono: '+54 9 3541 458912',
    iniciales: 'JP',
  });

  // Referencia al contenedor de scroll principal para resetear la posición arriba al cambiar de pantalla
  const mainContainerRef = useRef(null);

  useEffect(() => {
    if (mainContainerRef.current) {
      mainContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeTab, showSavedBusinesses, selectedBusiness, showZoneSelector, showAuth, showOnboarding, showBusinessRegister, currentRole, merchantTab, adminTab]);

  const handleToggleSaveBusiness = (businessId) => {
    setSavedBusinessIds((prev) =>
      prev.includes(businessId) ? prev.filter((id) => id !== businessId) : [...prev, businessId]
    );
  };

  const handleToggleSaveEvent = (eventId) => {
    setSavedEventIds((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const handleLoginSuccess = (userData) => {
    console.log('Usuario autenticado:', userData);
    setShowAuth(false);
    setShowZoneSelector(true);
  };

  const handleZoneSelect = (zone) => {
    setActiveZone(zone);
    setShowZoneSelector(false);
  };

  const handleSelectBusiness = (business) => {
    setSelectedBusiness(business);
  };

  const handleBackFromDetail = () => {
    setSelectedBusiness(null);
  };

  const handleNavigateToMap = (business) => {
    setSelectedBusiness(business);
    setActiveTab('map');
  };

  const handleBackFromMap = () => {
    if (selectedBusiness) {
      setActiveTab('home');
    } else {
      setActiveTab('home');
    }
  };

  // Abrir Modal de Cupón
  const handleOpenCoupon = (promoOrCoupon) => {
    const existing = coupons.find((c) => c.id === promoOrCoupon.id || c.codigo === promoOrCoupon.codigo);
    if (existing) {
      setActiveCoupon(existing);
    } else {
      // Si viene de la ficha de un negocio directamente
      const fallback = {
        id: promoOrCoupon.id || `promo-${selectedBusiness?.id || 'lago'}`,
        comercioId: selectedBusiness?.id || 'resto-lago',
        comercioNombre: selectedBusiness?.nombre || 'Resto Lago I LOVE CARLOS PAZ',
        titulo: promoOrCoupon?.titulo || 'Cupón 20% OFF',
        descuento: promoOrCoupon?.descuento || '20% OFF',
        codigo: promoOrCoupon?.codigo || 'LAGO-20-8912',
        imagen: selectedBusiness?.fotos?.[0] || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        validez: promoOrCoupon?.validez || 'Válido todos los días',
        condiciones: promoOrCoupon?.condicion || 'Consumo en salón. 1 canje por día.',
        guardado: true,
        vecesUsado: 0,
        historialCanjes: []
      };
      setActiveCoupon(fallback);
    }
  };

  // Toggle Guardar / Quitar Cupón
  const handleToggleSaveCoupon = (couponId) => {
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id === couponId) {
          const updated = { ...c, guardado: !c.guardado };
          if (activeCoupon && activeCoupon.id === couponId) {
            setActiveCoupon(updated);
          }
          return updated;
        }
        return c;
      })
    );
  };

  // Simulación de Canje Recurrente por el Comercio (Suma visita en historial y métricas)
  const handleSimulateRedeem = (couponId) => {
    const now = new Date();
    const timeString = `Hoy - ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} hs`;

    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id === couponId) {
          const newHistory = [
            {
              id: `canje-${Date.now()}`,
              fecha: timeString,
              comercio: c.comercioNombre,
              descuento: c.descuento
            },
            ...(c.historialCanjes || [])
          ];
          const updated = {
            ...c,
            vecesUsado: (c.vecesUsado || 0) + 1,
            historialCanjes: newHistory,
            guardado: true // Al canjearlo, queda guardado en su billetera
          };
          if (activeCoupon && activeCoupon.id === couponId) {
            setActiveCoupon(updated);
          }
          return updated;
        }
        return c;
      })
    );
  };

  // Gestor de Promociones del Comercio: Activar / Pausar
  const handleToggleCouponActive = (couponId) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, activa: !(c.activa !== false) } : c))
    );
  };

  // Gestor de Promociones del Comercio: Crear nueva promo QR
  const handleCreateCoupon = (newCoupon) => {
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  // Edición rápida de datos del comercio (horarios, WhatsApp, eslogan)
  const handleUpdateBusiness = (businessId, updatedFields) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === businessId ? { ...b, ...updatedFields } : b))
    );
    if (selectedBusiness && selectedBusiness.id === businessId) {
      setSelectedBusiness((prev) => ({ ...prev, ...updatedFields }));
    }
  };

  // Moderación del Admin: Aprobar solicitud de comercio pendiente
  const handleApprovePendingBusiness = (pendingBiz, cfg = {}) => {
    let finalLocalidadId = pendingBiz.localidadId;

    // Si sugirió una nueva localidad (ej. Mar del Plata) y el Admin activó la casilla
    if (pendingBiz.isNewLocalitySuggested && pendingBiz.suggestedLocalityData && cfg.activateNewLocality !== false) {
      const slugId = pendingBiz.suggestedLocalityData.nombre
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      finalLocalidadId = slugId;

      setLocalities((prev) => {
        if (prev.some((l) => l.id === slugId)) return prev;
        return [
          ...prev,
          {
            id: slugId,
            nombre: pendingBiz.suggestedLocalityData.nombre,
            subtitulo: pendingBiz.suggestedLocalityData.provincia || 'Argentina',
            provincia: pendingBiz.suggestedLocalityData.provincia || 'Argentina',
            distanciaKm: 350,
            latCentro: pendingBiz.suggestedLocalityData.lat || -38.0055,
            lngCentro: pendingBiz.suggestedLocalityData.lng || -57.5426,
            radioKm: 15,
            activa: true
          }
        ];
      });
    }

    const approvedBiz = {
      ...pendingBiz,
      localidadId: finalLocalidadId,
      categoriaId:
        pendingBiz.isNewCategorySuggested || pendingBiz.categoriaId === 'other'
          ? cfg.assignedCategoryId || 'experiencias'
          : pendingBiz.categoriaId,
      esPremium: Boolean(cfg.markAsPremium),
      estado: 'aprobado'
    };

    setBusinesses((prev) => [approvedBiz, ...prev]);
    setPendingBusinesses((prev) => prev.filter((item) => item.id !== pendingBiz.id));
  };

  // Moderación del Admin: Rechazar solicitud de comercio pendiente
  const handleRejectPendingBusiness = (pendingId) => {
    setPendingBusinesses((prev) => prev.filter((item) => item.id !== pendingId));
  };

  // Gestión del Admin: Activar o quitar estatus de "★ Comercio Destacado"
  const handleToggleFeaturedBusiness = (businessId) => {
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === businessId ? { ...b, esPremium: !b.esPremium } : b
      )
    );
    if (selectedBusiness && selectedBusiness.id === businessId) {
      setSelectedBusiness((prev) => ({ ...prev, esPremium: !prev.esPremium }));
    }
  };

  // Gestión del Admin: Pausar o reactivar visibilidad de un comercio en la Guía
  const handleTogglePauseBusiness = (businessId) => {
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === businessId
          ? { ...b, estado: b.estado === 'pausado' ? 'aprobado' : 'pausado' }
          : b
      )
    );
  };

  // Gestión del Admin: Localidades Multitenant
  const handleToggleLocalityActive = (locId) => {
    setLocalities((prev) =>
      prev.map((l) =>
        l.id === locId ? { ...l, activa: l.activa === false ? true : false } : l
      )
    );
  };

  const handleCreateLocality = (newLoc) => {
    setLocalities((prev) => {
      if (prev.some((l) => l.id === newLoc.id)) return prev;
      return [...prev, newLoc];
    });
  };

  const handleUpdateLocality = (locId, updatedFields) => {
    setLocalities((prev) =>
      prev.map((l) => (l.id === locId ? { ...l, ...updatedFields } : l))
    );
    if (activeZone && activeZone.id === locId) {
      setActiveZone((prev) => ({ ...prev, ...updatedFields }));
    }
  };

  // Gestión del Admin: Cartelera de Eventos Municipales y Culturales
  const handleCreateEvent = (newEvt) => {
    setEvents((prev) => [newEvt, ...prev]);
  };

  const handleToggleEventFeatured = (evtId) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === evtId ? { ...e, esDestacado: !e.esDestacado } : e
      )
    );
  };

  const handleToggleEventActive = (evtId) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === evtId
          ? { ...e, activo: e.activo === false ? true : false }
          : e
      )
    );
  };

  const handleDeleteEvent = (evtId) => {
    setEvents((prev) => prev.filter((e) => e.id !== evtId));
  };

  return (
    <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center sm:py-6 sm:px-4">
      
      {/* Selector de Pantallas Rápido para Demostración al Cliente */}
      <div className="hidden sm:flex items-center gap-1.5 mb-3 bg-[#141418] border border-white/10 px-3 py-1.5 rounded-full text-[11px] text-gray-400 select-none shadow-md flex-wrap justify-center">
        <span className="text-[#E5C07B] font-bold mr-1">Demo Flujo:</span>
        <button
          type="button"
          onClick={() => {
            setCurrentRole('tourist');
            setShowOnboarding(true);
            setShowAuth(false);
            setShowZoneSelector(false);
            setShowBusinessRegister(false);
            setSelectedBusiness(null);
          }}
          className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
            currentRole === 'tourist' && showOnboarding ? 'bg-[#D4AF37] text-black font-bold' : 'hover:text-white'
          }`}
        >
          0. Onboarding
        </button>
        <button
          type="button"
          onClick={() => {
            setCurrentRole('tourist');
            setShowOnboarding(false);
            setShowAuth(true);
            setShowZoneSelector(false);
            setShowBusinessRegister(false);
            setSelectedBusiness(null);
          }}
          className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
            currentRole === 'tourist' && !showOnboarding && !showBusinessRegister && showAuth ? 'bg-[#D4AF37] text-black font-bold' : 'hover:text-white'
          }`}
        >
          1. Login
        </button>
        <button
          type="button"
          onClick={() => {
            setCurrentRole('tourist');
            setShowOnboarding(false);
            setShowAuth(false);
            setShowZoneSelector(true);
            setShowBusinessRegister(false);
            setSelectedBusiness(null);
          }}
          className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
            currentRole === 'tourist' && !showOnboarding && !showBusinessRegister && showZoneSelector ? 'bg-[#D4AF37] text-black font-bold' : 'hover:text-white'
          }`}
        >
          2. Zona
        </button>
        <button
          type="button"
          onClick={() => {
            setCurrentRole('tourist');
            setShowOnboarding(false);
            setShowAuth(false);
            setShowZoneSelector(false);
            setShowBusinessRegister(false);
            setSelectedBusiness(null);
            setActiveTab('home');
          }}
          className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
            currentRole === 'tourist' && !showOnboarding && !showBusinessRegister && !showAuth && !showZoneSelector && !selectedBusiness && activeTab === 'home'
              ? 'bg-[#D4AF37] text-black font-bold'
              : 'hover:text-white'
          }`}
        >
          3. Home
        </button>
        <button
          type="button"
          onClick={() => {
            setCurrentRole('tourist');
            setShowOnboarding(false);
            setShowAuth(false);
            setShowZoneSelector(false);
            setShowBusinessRegister(false);
            setSelectedBusiness(businesses[0]);
            setActiveTab('home');
          }}
          className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
            currentRole === 'tourist' && !showOnboarding && !showBusinessRegister && selectedBusiness && activeTab === 'home' ? 'bg-[#D4AF37] text-black font-bold' : 'hover:text-white'
          }`}
        >
          4. Ficha
        </button>
        <button
          type="button"
          onClick={() => {
            setCurrentRole('tourist');
            setShowOnboarding(false);
            setShowAuth(false);
            setShowZoneSelector(false);
            setShowBusinessRegister(false);
            setSelectedBusiness(null);
            setActiveTab('map');
          }}
          className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
            currentRole === 'tourist' && !showOnboarding && !showBusinessRegister && activeTab === 'map' ? 'bg-[#D4AF37] text-black font-bold' : 'hover:text-white'
          }`}
        >
          5. Mapa
        </button>
        <button
          type="button"
          onClick={() => {
            setCurrentRole('tourist');
            setShowOnboarding(false);
            setShowAuth(false);
            setShowZoneSelector(false);
            setShowBusinessRegister(false);
            setSelectedBusiness(null);
            setActiveTab('coupons');
          }}
          className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
            currentRole === 'tourist' && !showOnboarding && !showBusinessRegister && activeTab === 'coupons' ? 'bg-[#D4AF37] text-black font-bold' : 'hover:text-white'
          }`}
        >
          6. Cupones QR
        </button>
        <button
          type="button"
          onClick={() => {
            setCurrentRole('tourist');
            setShowOnboarding(false);
            setShowAuth(false);
            setShowZoneSelector(false);
            setShowBusinessRegister(false);
            setSelectedBusiness(null);
            setShowSavedBusinesses(false);
            setActiveTab('profile');
          }}
          className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
            currentRole === 'tourist' && !showOnboarding && !showBusinessRegister && activeTab === 'profile' ? 'bg-[#D4AF37] text-black font-bold' : 'hover:text-white'
          }`}
        >
          7. Perfil
        </button>
        <div className="w-[1px] h-3.5 bg-white/15 mx-0.5" />
        <button
          type="button"
          onClick={() => {
            setShowOnboarding(false);
            setShowAuth(false);
            setShowZoneSelector(false);
            setShowBusinessRegister(false);
            setCurrentRole('merchant');
            setMerchantTab('scanner');
          }}
          className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
            currentRole === 'merchant' && !showBusinessRegister ? 'bg-[#D4AF37] text-black font-bold' : 'hover:text-white text-[#E5C07B]'
          }`}
        >
          🏪 Comercio
        </button>
        <button
          type="button"
          onClick={() => {
            setShowOnboarding(false);
            setShowAuth(false);
            setShowZoneSelector(false);
            setShowBusinessRegister(false);
            setCurrentRole('admin');
            setAdminTab('metrics');
          }}
          className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
            currentRole === 'admin' && !showBusinessRegister ? 'bg-[#D4AF37] text-black font-bold' : 'hover:text-white text-[#F5D77F]'
          }`}
        >
          🛡️ Admin
        </button>
      </div>

      {/* Contenedor móvil con formato PWA */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[844px] sm:h-[844px] bg-[#0B0B0E] sm:rounded-[38px] sm:border sm:border-white/10 sm:shadow-2xl overflow-hidden relative flex flex-col">
        {/* Barra superior de estado (Modo Mockup en Desktop) */}
        <div className="hidden sm:flex justify-between items-center px-7 pt-3 pb-1 text-xs text-gray-400 select-none bg-[#0B0B0E] border-b border-white/5 z-40 shrink-0">
          <span className="font-semibold text-white">9:41</span>
          <div className="w-20 h-4 bg-black rounded-full mx-auto" />
          <span className="text-[10px] tracking-widest text-[#E5C07B] font-bold">PWA</span>
        </div>

        {/* Área de Pantallas con Scroll */}
        <main ref={mainContainerRef} className="flex-1 overflow-y-auto relative">
          {showOnboarding ? (
            <OnboardingLanding
              onStartExploring={() => {
                setShowOnboarding(false);
                setShowAuth(true);
              }}
            />
          ) : showAuth ? (
            <AuthLogin onLoginSuccess={handleLoginSuccess} />
          ) : showZoneSelector ? (
            <ZoneSelector 
              initialZone={activeZone.id} 
              localities={localities}
              onSelectZone={handleZoneSelect} 
            />
          ) : showBusinessRegister ? (
            <BusinessRegisterView
              onBack={() => setShowBusinessRegister(false)}
              onCompleteRegistration={(newBiz) => setPendingBusinesses((prev) => [newBiz, ...prev])}
            />
          ) : currentRole === 'merchant' ? (
            <MerchantDashboard
              merchantBusiness={businesses[0]}
              activeTab={merchantTab}
              onTabChange={setMerchantTab}
              onSwitchToTourist={() => setCurrentRole('tourist')}
              coupons={coupons}
              onValidateCoupon={handleSimulateRedeem}
              onToggleCouponActive={handleToggleCouponActive}
              onCreateCoupon={handleCreateCoupon}
              onUpdateBusiness={handleUpdateBusiness}
            />
          ) : currentRole === 'admin' ? (
            <AdminDashboard
              activeTab={adminTab}
              onTabChange={setAdminTab}
              onSwitchRole={(role) => setCurrentRole(role)}
              businesses={businesses}
              pendingBusinesses={pendingBusinesses}
              coupons={coupons}
              localities={localities}
              events={events}
              onApproveBusiness={handleApprovePendingBusiness}
              onRejectBusiness={handleRejectPendingBusiness}
              onToggleFeaturedBusiness={handleToggleFeaturedBusiness}
              onTogglePauseBusiness={handleTogglePauseBusiness}
              onUpdateBusiness={handleUpdateBusiness}
              onToggleLocalityActive={handleToggleLocalityActive}
              onCreateLocality={handleCreateLocality}
              onUpdateLocality={handleUpdateLocality}
              onCreateEvent={handleCreateEvent}
              onToggleEventFeatured={handleToggleEventFeatured}
              onToggleEventActive={handleToggleEventActive}
              onDeleteEvent={handleDeleteEvent}
            />
          ) : selectedBusiness && activeTab === 'home' ? (
            <BusinessDetail
              comercio={selectedBusiness}
              isSaved={savedBusinessIds.includes(selectedBusiness.id)}
              onToggleSave={handleToggleSaveBusiness}
              onBack={handleBackFromDetail}
              onNavigateToMap={handleNavigateToMap}
              onOpenCoupon={handleOpenCoupon}
              allComercios={businesses}
              onSelectRelatedBusiness={(b) => setSelectedBusiness(b)}
            />
          ) : (
            <>
              {activeTab === 'home' && (
                <Home
                  currentZone={activeZone}
                  allComercios={businesses}
                  allEvents={events}
                  onOpenZoneSelector={() => setShowZoneSelector(true)}
                  onSelectBusiness={handleSelectBusiness}
                  onSelectEvent={(evento) => setSelectedEvent(evento)}
                />
              )}

              {activeTab === 'map' && (
                <MapView
                  comercio={selectedBusiness}
                  initialMode={selectedBusiness ? 'route' : 'explore'}
                  allComercios={businesses}
                  onBack={handleBackFromMap}
                  onOpenBusinessDetail={(b) => {
                    setSelectedBusiness(b);
                    setActiveTab('home');
                  }}
                />
              )}

              {activeTab === 'coupons' && (
                <CouponsView 
                  coupons={coupons}
                  onOpenCouponModal={handleOpenCoupon} 
                  onToggleSave={handleToggleSaveCoupon}
                />
              )}

              {activeTab === 'profile' && (
                showSavedBusinesses ? (
                  <SavedBusinessesView
                    savedBusinesses={businesses.filter((c) => savedBusinessIds.includes(c.id))}
                    savedEvents={events.filter((e) => savedEventIds.includes(e.id))}
                    onBack={() => setShowSavedBusinesses(false)}
                    onSelectBusiness={(comercio) => {
                      setShowSavedBusinesses(false);
                      setSelectedBusiness(comercio);
                      setActiveTab('home');
                    }}
                    onSelectEvent={(evento) => {
                      setSelectedEvent(evento);
                    }}
                    onNavigateToMap={(comercio) => {
                      setShowSavedBusinesses(false);
                      setSelectedBusiness(comercio);
                      setActiveTab('map');
                    }}
                    onRemoveSaved={handleToggleSaveBusiness}
                    onRemoveSavedEvent={handleToggleSaveEvent}
                    onExplore={() => {
                      setShowSavedBusinesses(false);
                      setActiveTab('home');
                    }}
                    onExploreEvents={() => {
                      setShowSavedBusinesses(false);
                      setActiveTab('home');
                    }}
                  />
                ) : (
                  <ProfileView
                    user={{
                      ...userProfile,
                      zona: activeZone.nombre
                    }}
                    savedCount={savedBusinessIds.length + savedEventIds.length}
                    redeemedCount={coupons.reduce((acc, c) => acc + (c.vecesUsado || 0), 0)}
                    onOpenSavedBusinesses={() => setShowSavedBusinesses(true)}
                    onOpenSecurity={() => setShowSecurityModal(true)}
                    onOpenTerms={() => setShowTermsModal(true)}
                    onRegisterBusiness={() => setShowBusinessRegister(true)}
                    currentRole={currentRole}
                    onRoleChange={(role) => {
                      if (role === 'merchant') {
                        setCurrentRole('merchant');
                        setMerchantTab('scanner');
                      } else if (role === 'admin') {
                        setCurrentRole('admin');
                        setAdminTab('metrics');
                      } else {
                        setCurrentRole('tourist');
                      }
                    }}
                    onLogout={() => setShowAuth(true)}
                  />
                )
              )}
            </>
          )}
        </main>

        {/* Modal de Cupón Activo con QR */}
        {activeCoupon && (
          <ActiveCouponModal
            coupon={activeCoupon}
            onClose={() => setActiveCoupon(null)}
            onToggleSave={handleToggleSaveCoupon}
            onSimulateRedeem={handleSimulateRedeem}
          />
        )}

        {/* Modal de Seguridad y Contraseña */}
        {showSecurityModal && (
          <SecurityModal
            userPhone={userProfile.telefono}
            onClose={() => setShowSecurityModal(false)}
            onSaveSuccess={(data) => {
              if (data.phone) {
                setUserProfile(prev => ({ ...prev, telefono: data.phone }));
              }
            }}
          />
        )}

        {/* Modal de Términos, Privacidad y GPS */}
        {showTermsModal && (
          <TermsModal onClose={() => setShowTermsModal(false)} />
        )}

        {/* Modal de Detalle de Evento */}
        {selectedEvent && (
          <EventDetailModal
            evento={selectedEvent}
            isSaved={savedEventIds.includes(selectedEvent.id)}
            onToggleSave={handleToggleSaveEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}

        {/* Barra Inferior de Navegación (Turista vs Comercio vs Admin) */}
        {!showOnboarding && !showAuth && !showZoneSelector && !showBusinessRegister && (
          currentRole === 'admin' ? (
            <AdminBottomNav
              activeTab={adminTab}
              onTabChange={setAdminTab}
              pendingCount={pendingBusinesses.length}
            />
          ) : currentRole === 'merchant' ? (
            <MerchantBottomNav
              activeTab={merchantTab}
              onTabChange={setMerchantTab}
            />
          ) : (
            <BottomNav 
              activeTab={activeTab} 
              onTabChange={(tab) => {
                setActiveTab(tab);
                if (tab !== 'home') {
                  setSelectedBusiness(null);
                }
              }} 
            />
          )
        )}
      </div>
    </div>
  );
}
