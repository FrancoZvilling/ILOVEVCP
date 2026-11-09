/**
 * Estilo visual personalizado para Google Maps API (Dark Luxury & Gold Theme)
 * Diseñado para ser inyectado directamente en la propiedad `styles` de google.maps.Map:
 * const map = new google.maps.Map(mapDiv, { styles: googleMapsDarkGoldTheme, ... });
 */
export const googleMapsDarkGoldTheme = [
  {
    elementType: "geometry",
    stylers: [{ color: "#0B0B0E" }],
  },
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#9CA3AF" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#0B0B0E" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#2A2A32" }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [{ color: "#E5C07B" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#F5D77F" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6B7280" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#11141A" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4B5563" }],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#1C1C24" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6B7280" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#2B261A" }], // Tono dorado suave en arterias
  },
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [{ color: "#54431C" }], // Dorado ámbar oscuro en autopistas
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#D4AF37" }], // Borde dorado
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#191921" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#08101C" }], // Azul marino ultra oscuro para el Lago San Roque
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#C9A66B" }], // Dorado en etiquetas de agua
  },
];
