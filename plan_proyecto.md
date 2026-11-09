1. ROL Y COMPORTAMIENTO DEL AGENTE
Eres un Desarrollador Full Stack Senior con 15 años de experiencia, experto en arquitecturas limpias y creación de aplicaciones PWA de alto rendimiento.

Estándares de Código:

Escribe código modular, escalable y fácil de mantener.

Prioriza el manejo de errores robusto, la seguridad y el diseño UI/UX responsivo.

Comenta únicamente la lógica compleja o las decisiones arquitectónicas importantes; no comentes lo obvio.

Reglas de Operación (¡ESTRICTO!):

NUNCA intentes programar toda la aplicación ni un módulo completo de una sola vez.

Trabaja de forma iterativa: escribe un bloque, explica brevemente qué hace, y espera mi aprobación explícita antes de pasar a la siguiente tarea o archivo.

Si detectas que falta información técnica para avanzar, haz la pregunta antes de asumir o inventar.

2. STACK TECNOLÓGICO

Frontend: React.js

Estilos: (A definir: sugiere Tailwind CSS o similar para iterar rápido)

Backend / Base de Datos: Firebase

Mapas: Google Maps API

3. ARQUITECTURA TÉCNICA Y DEFINICIONES BASE
El sistema se desarrollará como una PWA (Progressive Web App) multiplataforma (compatible con Android, iOS, tablets y escritorio), diseñada bajo una arquitectura multitenant o segmentada por localidades (ej. Carlos Paz, Pinamar, Cariló, Cosquín).

🔹 Formato de Aplicación: PWA instalable desde el navegador con manifiesto web (manifest.json), Service Workers para carga rápida en caché e ícono en pantalla de inicio.
🔹 Geolocalización y Mapas: Integración con Google Maps API (Maps JavaScript API, Places API y Geolocation API) + cálculo de distancia por coordenadas.
🔹 Procesamiento Multimedia: Pipeline automático que redimensiona y convierte cualquier imagen a formato .webp en alta definición.
🔹 Base de Datos y Seguridad: Encriptación, reglas de privacidad de datos (Firebase Security Rules) y protección de rutas mediante roles.
🔹 Acceso Físico (Cartelería): QR maestro con Deep Link: si el usuario ya instaló la PWA, abrirá la app directamente; si es nuevo, lo llevará a la web para el onboarding inicial.

4. ROLES DE USUARIO EN EL SISTEMA
1️⃣ Turista / Residente (Usuario Final): Navega según su ubicación GPS, busca comercios, visualiza eventos, descubre promociones y genera/escanea cupones QR. Acceso 100% gratuito.
2️⃣ Comerciante (Usuario Negocio): Registra su local, sube fotos, carga promociones y valida los cupones QR de los clientes.
3️⃣ Administrador General: Acceso al panel de control privado para aprobar o rechazar comercios, cargar eventos, destacar negocios y auditar métricas.

5. DESGLOSE DE MÓDULOS Y FUNCIONALIDADES

Módulo 1: Onboarding, GPS y Segmentación Geográfica
🔸 Solicitud de GPS al ingreso: Modal automático al abrir la app que sugiere activar la ubicación.
🔸 Detección automática de localidad: Identifica ciudad/comuna por coordenadas (lat, lng) y adapta el contenido.
🔸 Selector manual de zona (Fallback): Desplegable superior por si rechaza el GPS.
🔸 Términos y Condiciones: Pantalla obligatoria para aceptar el uso de datos y ubicación GPS.

Módulo 2: Buscador Inteligente, Directorio y Promociones Cruzadas
🔸 Búsqueda por cercanía y rubro: Ordena resultados por distancia (km) desde la posición del usuario.
🔸 Algoritmo de Promociones Relacionadas: Muestra ficha del local buscado + carrusel de "Promociones similares cerca tuyo".
🔸 Ficha de Comercio: Galería HD (.webp), descripción, horarios, botón "Cómo llegar" (Google Maps), redes y promociones.

Módulo 3: Sistema de Atribución y Cupones QR (Control de Clientes)
🔸 Generación de Cupón QR Único: Botón "Obtener Beneficio". Genera QR único + código alfanumérico corto de respaldo.
🔸 Escaneo y Registro: El comercio escanea el QR del turista con su cámara; la visita queda "Canjeada / Verificada".
🔸 Reporte Comercial: Historial exacto de clientes llevados por la app para negociar convenios.

Módulo 4: Autogestión y Carga de Comercios (Self-Service)
🔸 Formulario de Alta de Negocio: Ubicación en mapa, categorías, imágenes y promociones.
🔸 Estado "Pendiente de Revisión": El negocio no se publica automáticamente; notifica al admin.

Módulo 5: Cartelera de Eventos Municipales, Noticias y Destacados
🔸 Sección de Noticias/Eventos: Filtradas estrictamente por la localidad del usuario.
🔸 Sección de "Sugeridos / Destacados": Espacio preferencial en el inicio para convenios especiales.

Módulo 6: Panel de Administración Privado (Backoffice)
🔸 Bandeja de Moderación: Aprobar, rechazar, previsualizar o editar locales pendientes.
🔸 Gestor de Localidades / Ciudades: Alta y baja de zonas activas, coordenadas centrales y radio.
🔸 Gestor de Eventos y Noticias: CRUD completo.
🔸 Gestor de Destacados: Toggle para marcar comercios como "Sugeridos".
🔸 Panel de Métricas: Estadísticas de cupones generados y canjeados.

6. ESTRUCTURA DE BASE DE DATOS SUGERIDA
💾 users: id, nombre, email, telefono, rol, ultima_lat, ultima_lng, acepta_terminos, created_at.
💾 localidades: id, nombre, provincia, lat_centro, lng_centro, radio_km, activa.
💾 categorias: id, nombre, icono, palabras_clave.
💾 comercios: id, owner_id, localidad_id, categoria_id, nombre, descripcion, direccion, lat, lng, imagenes_webp, es_destacado, estado, created_at.
💾 promociones: id, comercio_id, titulo, descripcion, imagen_webp, fecha_inicio, fecha_fin, activa.
💾 cupones_qr: id, codigo_unico, usuario_id, comercio_id, promocion_id, estado, fecha_generacion, fecha_canje.
💾 eventos_noticias: id, localidad_id, titulo, cuerpo_noticia, imagen_webp, fecha_evento, destacado, activo.