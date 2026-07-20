# Plan de Pruebas - ClimaTrip

## Automatizadas Completadas

| ID              | Caso                                                                                 | Estado     |
| --------------- | ------------------------------------------------------------------------------------ | ---------- |
| AUTH-UNIT-01    | Registro con checkbox de términos desmarcado deja el formulario inválido.            | Completada |
| AUTH-UNIT-02    | Registro inválido no invoca el servicio de Auth.                                     | Completada |
| AUTH-UNIT-03    | Registro válido con términos aceptados invoca el servicio.                           | Completada |
| GUARD-UNIT-01   | Ruta privada con usuario autenticado permite acceso.                                 | Completada |
| GUARD-UNIT-02   | Ruta privada sin sesión redirige a `/login` con `returnUrl`.                         | Completada |
| API-UNIT-01     | Búsqueda menor a tres caracteres no llama a Open-Meteo.                              | Completada |
| API-UNIT-02     | Búsqueda válida arma parámetros esperados.                                           | Completada |
| API-UNIT-03     | Error HTTP devuelve mensaje comprensible.                                            | Completada |
| SEARCH-UNIT-01  | Población conocida superior o igual supera el filtro.                                | Completada |
| SEARCH-UNIT-02  | Población conocida inferior no supera el filtro.                                     | Completada |
| SEARCH-UNIT-03  | Población desconocida no supera un mínimo positivo.                                  | Completada |
| SEARCH-UNIT-04  | Filtro vacío o cero no excluye población desconocida.                                | Completada |
| SEARCH-UNIT-05  | Población mínima negativa es inválida.                                               | Completada |
| SEARCH-UNIT-06  | Ordenamiento por población deja valores desconocidos al final.                       | Completada |
| SEARCH-UNIT-07  | Regiones dependen del país, sin duplicados y ordenadas.                              | Completada |
| STATS-UNIT-01   | Próxima ciudad planificada ignora fechas pasadas.                                    | Completada |
| STATS-UNIT-02   | Próxima ciudad planificada acepta fecha de hoy.                                      | Completada |
| STATS-UNIT-03   | Próxima ciudad planificada ignora fechas inválidas, nulas y estados no planificados. | Completada |
| WEATHER-UNIT-01 | Amanecer y atardecer se formatean como `HH:mm`.                                      | Completada |
| UI-UNIT-01      | Componente raíz se crea correctamente.                                               | Completada |

## Pendientes con Firebase Real

| ID           | Caso                                       | Motivo                                      |
| ------------ | ------------------------------------------ | ------------------------------------------- |
| FIREBASE-01  | Crear proyecto Firebase real.              | Requiere acción manual en Firebase Console. |
| AUTH-REAL-01 | Registro real con Firebase Authentication. | Pendiente de credenciales reales.           |
| AUTH-REAL-02 | Login y logout reales.                     | Pendiente de credenciales reales.           |
| CRUD-REAL-01 | Crear ciudad en Cloud Firestore.           | Pendiente de proyecto y base Firestore.     |
| CRUD-REAL-02 | Leer ciudades separadas por usuario.       | Pendiente de proyecto y reglas publicadas.  |
| CRUD-REAL-03 | Actualizar ciudad guardada.                | Pendiente de proyecto y reglas publicadas.  |
| CRUD-REAL-04 | Eliminar ciudad guardada.                  | Pendiente de proyecto y reglas publicadas.  |
| SEC-REAL-01  | Validar reglas contra otro usuario.        | Pendiente de usuarios reales.               |
| HOSTING-01   | Deploy en Firebase Hosting.                | Pendiente de creación manual del proyecto.  |

## Manuales Recomendadas

| ID         | Caso                                     | Resultado esperado                                      |
| ---------- | ---------------------------------------- | ------------------------------------------------------- |
| UI-01      | Responsive 320 px, tablet y desktop.     | No hay solapamientos ni scroll horizontal innecesario.  |
| UI-02      | Navegación por teclado.                  | Formularios, filtros y modales son operables.           |
| WEATHER-01 | Consulta real de clima con conectividad. | Se muestran clima actual y pronóstico de siete días.    |
| BUILD-01   | `npm run build:prod`.                    | Finaliza sin errores y genera `dist/climaTrip/browser`. |

No se realizaron pruebas reales contra Firebase porque el proyecto todavía no debe estar creado ni conectado.
