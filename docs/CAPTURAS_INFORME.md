# Capturas para el informe

| Archivo sugerido | Pantalla o ruta | Qué debe verse | Epígrafe sugerido |
| --- | --- | --- | --- |
| `01-buscador-vacio.png` | `/buscar` | Estado inicial con la indicación de tres caracteres. | Buscador de ciudades antes de iniciar una consulta. |
| `02-busqueda-mendoza.png` | `/buscar` | Término Mendoza y tarjetas devueltas por Open-Meteo. | Búsqueda de ciudades mediante Open-Meteo Geocoding. |
| `03-network-openmeteo-200.png` | DevTools Network | Respuesta 200 de `geocoding-api.open-meteo.com`. | Comunicación HTTP exitosa con la API de geocoding. |
| `04-resultados-filtrados.png` | `/buscar` | País, provincia o población mínima aplicados. | Filtros y ordenamiento del lado del cliente. |
| `05-detalle-clima.png` | `/clima/:cityId` | Condición actual, temperatura y métricas. | Detalle meteorológico del destino seleccionado. |
| `06-pronostico-7-dias.png` | `/clima/:cityId` | Las siete tarjetas de pronóstico. | Pronóstico de siete días provisto por Open-Meteo. |
| `07-registro.png` | `/registro` | Formulario con validaciones visibles. | Registro de usuario con Firebase Authentication. |
| `08-usuario-firebase.png` | Firebase Console > Authentication | Usuario recién creado. | Usuario registrado en Firebase Authentication. |
| `09-login.png` | `/login` | Formulario de acceso y control de contraseña. | Inicio de sesión con correo y contraseña. |
| `10-guard-bloqueado.png` | `/mis-ciudades` sin sesión | Redirección a login con `returnUrl`. | Protección de una ruta privada mediante AuthGuard. |
| `11-guard-autorizado.png` | `/mis-ciudades` con sesión | Lista de ciudades o estado vacío autenticado. | Acceso autorizado a una ruta privada. |
| `12-create-ui.png` | `/clima/:cityId` | Panel de guardar ciudad con estado, fecha, temperatura y notas. | Formulario reutilizable para crear una ciudad guardada. |
| `13-create-firestore.png` | Firebase Console > Firestore | Documento creado bajo `users/{uid}/savedCities`. | Persistencia de la ciudad en Cloud Firestore. |
| `14-read-ciudades.png` | `/mis-ciudades` | Tarjetas obtenidas en tiempo real. | Lectura reactiva de ciudades guardadas. |
| `15-update-antes.png` | `/mis-ciudades` | Datos previos en la tarjeta. | Estado inicial antes de editar una ciudad. |
| `16-update-despues.png` | `/mis-ciudades` | Estado o notas actualizados y feedback de éxito. | Actualización persistida de una ciudad guardada. |
| `17-delete-confirmacion.png` | `/mis-ciudades` | Modal accesible con Cancelar y Eliminar. | Confirmación previa a eliminar una ciudad. |
| `18-delete-completado.png` | `/mis-ciudades` | Feedback de eliminación y tarjeta ausente. | Eliminación de una ciudad guardada. |
| `19-estadisticas.png` | `/estadisticas` | Indicadores, doughnut por estado y barras por país. | Estadísticas dinámicas generadas con Chart.js. |
| `20-reglas-firestore.png` | Firebase Console > Firestore Rules | Reglas publicadas del archivo `firestore.rules`. | Reglas de seguridad por usuario en Firestore. |
| `21-responsive-320.png` | DevTools 320 x 568 | Buscador o detalle sin scroll horizontal. | Adaptación responsive en ancho móvil de 320 px. |
| `22-build-final.png` | Terminal | `npx ng build` finalizado sin warnings. | Compilación de producción correcta. |
| `23-firebase-hosting.png` | URL desplegada | Aplicación servida desde Firebase Hosting. | Despliegue final en Firebase Hosting. |
