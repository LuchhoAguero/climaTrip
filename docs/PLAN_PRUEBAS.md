# Plan de pruebas - ClimaTrip

| ID | Caso | Resultado esperado |
| --- | --- | --- |
| AUTH-01 | Registro válido | Se crea usuario y redirige a la ruta solicitada. |
| AUTH-02 | Registro inválido | Se muestran validaciones sin enviar el formulario. |
| AUTH-03 | Login válido | Inicia sesión y permite acceder a rutas privadas. |
| AUTH-04 | Login inválido | Se muestra un mensaje traducido. |
| GUARD-01 | Ruta privada sin sesión | Redirige a `/login` con `returnUrl`. |
| GUARD-02 | Ruta privada con sesión | Muestra la pantalla solicitada. |
| API-01 | Búsqueda válida | Open-Meteo devuelve tarjetas de ciudades. |
| API-02 | Menos de tres caracteres | No se envía ninguna petición. |
| API-03 | Sin resultados | Se informa búsqueda sin resultados. |
| API-04 | Error de red | Se muestra error comprensible. |
| WEATHER-01 | Clima válido | Se muestran datos actuales y pronóstico de siete días. |
| CRUD-01 | Crear | Guarda una ciudad en Firestore. |
| CRUD-02 | Leer | La lista refleja cambios en tiempo real. |
| CRUD-03 | Actualizar | Persiste estado, fecha, temperatura y notas. |
| CRUD-04 | Eliminar | Pide confirmación y elimina el documento. |
| CRUD-05 | Evitar duplicado | No permite dos documentos con el mismo `cityExternalId`. |
| SEC-01 | Separación por usuario | Un usuario no puede leer la subcolección de otro. |
| STATS-01 | Estadísticas con datos | Indicadores y Chart.js se recalculan. |
| STATS-02 | Estadísticas vacías | Se muestra estado vacío. |
| UI-01 | Responsive 320 px | No hay scroll horizontal ni controles inaccesibles. |
| UI-02 | Teclado | Formularios, menú y modales se pueden operar por teclado. |
| BUILD-01 | Compilación producción | `npx ng build` finaliza sin warnings. |
