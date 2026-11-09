export const promocionesCatalogoMock = [
  {
    id: "promo-resto-lago",
    comercioId: "resto-lago",
    comercioNombre: "Resto Lago I LOVE CARLOS PAZ",
    categoria: "Gastronomía",
    titulo: "20% OFF en Gastronomía",
    descuento: "20% OFF",
    codigo: "LAGO-20-8912",
    imagen: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    validez: "Válido todos los días",
    condiciones: "Consumo en salón. 1 canje por día por usuario.",
    guardado: true,
    vecesUsado: 2,
    historialCanjes: [
      { id: "canje-1", fecha: "04/11/2026 - 13:30 hs", comercio: "Resto Lago" },
      { id: "canje-2", fecha: "05/11/2026 - 21:15 hs", comercio: "Resto Lago" },
    ]
  },
  {
    id: "promo-las-olivas",
    comercioId: "las-olivas",
    comercioNombre: "Pizzería Las Olivas",
    categoria: "Gastronomía",
    titulo: "30% OFF en Pizzas a la Leña",
    descuento: "30% OFF",
    codigo: "OLIVAS-30-7421",
    imagen: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    validez: "Válido Lunes a Jueves",
    condiciones: "Válido en pizzas grandes. 1 canje por turno.",
    guardado: true,
    vecesUsado: 1,
    historialCanjes: [
      { id: "canje-3", fecha: "03/11/2026 - 22:00 hs", comercio: "Pizzería Las Olivas" }
    ]
  },
  {
    id: "promo-kayak",
    comercioId: "kayak-lago",
    comercioNombre: "Kayak Lago San Roque",
    categoria: "Experiencias",
    titulo: "20% OFF en Paseo Guiado",
    descuento: "20% OFF",
    codigo: "KAYAK-20-4102",
    imagen: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    validez: "Válido fines de semana",
    condiciones: "Sujeto a condiciones climáticas. Reserva previa.",
    guardado: false,
    vecesUsado: 0,
    historialCanjes: []
  },
  {
    id: "promo-spa",
    comercioId: "spa-relax",
    comercioNombre: "Spa Relax Las Sierras",
    categoria: "Spa & Relax",
    titulo: "2x1 en Circuito Hídrico",
    descuento: "2x1",
    codigo: "SPA-2X1-9931",
    imagen: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    validez: "Válido de Martes a Domingo",
    condiciones: "Acceso para 2 personas abonando 1. Con turno.",
    guardado: false,
    vecesUsado: 0,
    historialCanjes: []
  }
];
