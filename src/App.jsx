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
import BottomNav from './components/layout/BottomNav';
import { localidadesMock } from './data/mocks/localidades';
import { comerciosMock } from './data/mocks/comercios';
import { promocionesCatalogoMock } from './data/mocks/cupones';
import { eventosMock } from './data/mocks/eventos';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [activeZone, setActiveZone] = useState(localidadesMock[0]); // Carlos Paz
  const [showZoneSelector, setShowZoneSelector] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  
  // Estado dinámico interactivo para Comercios Guardados (Favoritos)
  const [savedBusinessIds, setSavedBusinessIds] = useState(['resto-lago', 'las-olivas']);
  const [savedEventIds, setSavedEventIds] = useState(['festival-lago-2026']);
  const [showSavedBusinesses, setShowSavedBusinesses] = useState(false);

  // Estado dinámico interactivo para Cupones y Canjes
  const [coupons, setCoupons] = useState(promocionesCatalogoMock);
  const [activeCoupon, setActiveCoupon] = useState(null);

  // Estado dinámico para Eventos Culturales
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Estados de Modales de Perfil
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
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
  }, [activeTab, showSavedBusinesses, selectedBusiness, showZoneSelector, showAuth, showOnboarding]);

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
          setActiveCoupon(updated);
          return updated;
        }
        return c;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center sm:py-6 sm:px-4">
      
      {/* Selector de Pantallas Rápido para Demostración al Cliente */}
      <div className="hidden sm:flex items-center gap-1.5 mb-3 bg-[#141418] border border-white/10 px-3 py-1.5 rounded-full text-[11px] text-gray-400 select-none shadow-md">
        <span className="text-[#E5C07B] font-bold mr-1">Demo Flujo:</span>
        <button
          type="button"
          onClick={() => {
            setShowOnboarding(true);
            setShowAuth(false);
            setShowZoneSelector(false);
            setSelectedBusiness(null);
          }}
          className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
            showOnboarding ? 'bg-[#D4AF37] text-black font-bold' : 'hover:text-white'
          }`}
        >
          0. Onboarding
        </button>
        <button
          type="button"
          onClick={() => {
            setShowOnboarding(false);
            setShowAuth(true);
            setShowZoneSelector(false);
            setSelectedBusiness(null);
          }}
          className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
            !showOnboarding && showAuth ? 'bg-[#D4AF37] text-black font-bold' : 'hover:text-white'
          }`}
        >
          1. Login
        </button>
        <button
          type="button"
          onClick={() => {
            setShowOnboarding(false);
            setShowAuth(false);
            setShowZoneSelector(true);
            setSelectedBusiness(null);
          }}
          className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
            !showOnboarding && showZoneSelector ? 'bg-[#D4AF37] text-black font-bold' : 'hover:text-white'
          }`}
        >
          2. Zona
        </button>
        <button
          type="button"
          onClick={() => {
            setShowOnboarding(false);
            setShowAuth(false);
            setShowZoneSelector(false);
            setSelectedBusiness(null);
            setActiveTab('home');
          }}
          className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
            !showOnboarding && !showAuth && !showZoneSelector && !selectedBusiness && activeTab === 'home'
              ? 'bg-[#D4AF37] text-black font-bold'
              : 'hover:text-white'
          }`}
        >
          3. Home
        </button>
        <button
          type="button"
          onClick={() => {
            setShowOnboarding(false);
            setShowAuth(false);
            setShowZoneSelector(false);
            setSelectedBusiness(comerciosMock[0]);
            setActiveTab('home');
          }}
          className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
            !showOnboarding && selectedBusiness && activeTab === 'home' ? 'bg-[#D4AF37] text-black font-bold' : 'hover:text-white'
          }`}
        >
          4. Ficha
        </button>
        <button
          type="button"
          onClick={() => {
            setShowOnboarding(false);
            setShowAuth(false);
            setShowZoneSelector(false);
            setSelectedBusiness(null);
            setActiveTab('map');
          }}
          className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
            !showOnboarding && activeTab === 'map' ? 'bg-[#D4AF37] text-black font-bold' : 'hover:text-white'
          }`}
        >
          5. Mapa
        </button>
        <button
          type="button"
          onClick={() => {
            setShowOnboarding(false);
            setShowAuth(false);
            setShowZoneSelector(false);
            setSelectedBusiness(null);
            setActiveTab('coupons');
          }}
          className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
            !showOnboarding && activeTab === 'coupons' ? 'bg-[#D4AF37] text-black font-bold' : 'hover:text-white'
          }`}
        >
          6. Cupones QR
        </button>
        <button
          type="button"
          onClick={() => {
            setShowOnboarding(false);
            setShowAuth(false);
            setShowZoneSelector(false);
            setSelectedBusiness(null);
            setShowSavedBusinesses(false);
            setActiveTab('profile');
          }}
          className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
            !showOnboarding && activeTab === 'profile' ? 'bg-[#D4AF37] text-black font-bold' : 'hover:text-white'
          }`}
        >
          7. Perfil
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
              onSelectZone={handleZoneSelect} 
            />
          ) : selectedBusiness && activeTab === 'home' ? (
            <BusinessDetail
              comercio={selectedBusiness}
              isSaved={savedBusinessIds.includes(selectedBusiness.id)}
              onToggleSave={handleToggleSaveBusiness}
              onBack={handleBackFromDetail}
              onNavigateToMap={handleNavigateToMap}
              onOpenCoupon={handleOpenCoupon}
              allComercios={comerciosMock}
              onSelectRelatedBusiness={(b) => setSelectedBusiness(b)}
            />
          ) : (
            <>
              {activeTab === 'home' && (
                <Home
                  currentZone={activeZone}
                  onOpenZoneSelector={() => setShowZoneSelector(true)}
                  onSelectBusiness={handleSelectBusiness}
                  onSelectEvent={(evento) => setSelectedEvent(evento)}
                />
              )}

              {activeTab === 'map' && (
                <MapView
                  comercio={selectedBusiness}
                  initialMode={selectedBusiness ? 'route' : 'explore'}
                  allComercios={comerciosMock}
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
                    savedBusinesses={comerciosMock.filter((c) => savedBusinessIds.includes(c.id))}
                    savedEvents={eventosMock.filter((e) => savedEventIds.includes(e.id))}
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
                    onRegisterBusiness={() => alert('Abriendo Formulario de Alta de Comercio (Módulo 4)...')}
                    currentRole="tourist"
                    onRoleChange={(role) => alert(`Cambiando a rol: ${role}`)}
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

        {/* Barra Inferior de Navegación (visible en vistas principales) */}
        {!showOnboarding && !showAuth && !showZoneSelector && (
          <BottomNav 
            activeTab={activeTab} 
            onTabChange={(tab) => {
              setActiveTab(tab);
              if (tab !== 'home') {
                setSelectedBusiness(null);
              }
            }} 
          />
        )}
      </div>
    </div>
  );
}
