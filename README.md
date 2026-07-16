# ClimaTrip

ClimaTrip es una SPA académica desarrollada con Angular para buscar ciudades, consultar clima actual y pronóstico, guardar destinos por usuario y visualizar estadísticas de viaje.

## Requisitos

- Node.js 20.19 o superior, 22.12 o superior, o 24.x.
- npm 11.x.
- Proyecto Firebase pendiente de creación manual.

Versiones validadas en esta estabilización:

- Angular CLI / build 20.3.x.
- Angular 20.3.x.
- AngularFire 20.0.x.
- Firebase Web SDK 11.10.x.
- RxJS 7.8.x.
- TypeScript 5.9.x.
- Vitest 3.2.x.
- Chart.js 4.5.x.

## Instalación

```bash
npm ci
```

## Desarrollo

```bash
npm start
```

La aplicación queda disponible en `http://localhost:4200/`.

## Pruebas y build

```bash
npm run test:ci
npm run build:prod
npm run check
```

`npm run check` ejecuta las pruebas unitarias y luego el build de producción.

## Firebase pendiente

Firebase está preparado, pero no conectado. Los archivos que deben recibir la configuración web real son:

- `src/environments/environment.development.ts`
- `src/environments/environment.ts`

Ambos mantienen placeholders `REEMPLAZAR`. No subas cuentas de servicio, claves privadas, archivos `.env` con secretos ni credenciales administrativas. La API key web de Firebase solo debe copiarse desde tu app web real cuando crees el proyecto en Firebase Console.

Sin Firebase configurado, las rutas públicas de búsqueda y clima siguen funcionando. Las funcionalidades de autenticación y ciudades guardadas muestran un mensaje claro indicando que falta completar la configuración.

## Funciones principales

- Búsqueda de ciudades mediante Open-Meteo Geocoding.
- Filtros por país, región y población mínima.
- Ordenamiento por nombre y población.
- Clima actual y pronóstico de siete días mediante Open-Meteo Forecast.
- Registro, login y logout mediante Firebase Authentication.
- Rutas privadas con Angular Guards.
- CRUD de ciudades guardadas por usuario en Cloud Firestore.
- Estadísticas con Chart.js.

## Estructura

```text
src/app/core/          modelos, guards, servicios y utilidades puras
src/app/features/      pantallas lazy de búsqueda, clima, auth, guardados y estadísticas
src/app/shared/        formulario reutilizable para ciudades guardadas
src/environments/      placeholders de Firebase
docs/                  plan de pruebas y material de informe
public/                assets públicos
```

## Hosting

`firebase.json` apunta al build real generado por Angular:

```text
dist/climaTrip/browser
```

Incluye rewrite SPA hacia `/index.html`. No ejecutes `firebase login`, `firebase use` ni `firebase deploy` hasta haber creado el proyecto Firebase manualmente y verificado la aplicación.

## Próximo paso manual

1. Crear el proyecto en Firebase Console.
2. Registrar una aplicación web.
3. Copiar el objeto `firebaseConfig` real en los environments.
4. Activar Authentication con correo y contraseña.
5. Crear Cloud Firestore en modo producción.
6. Revisar `firestore.rules`.
7. Probar registro, login y CRUD reales localmente.
8. Recién después, configurar Firebase Hosting y desplegar manualmente.
