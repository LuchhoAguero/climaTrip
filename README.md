# ClimaTrip

SPA académica para buscar destinos, consultar el clima y organizar ciudades favoritas. Usa Open-Meteo para geocoding y pronóstico, Firebase Authentication para cuentas y Cloud Firestore para las ciudades guardadas.

## Tecnologías

- Angular 21 con componentes standalone y lazy loading
- Reactive Forms, HttpClient y RxJS
- Open-Meteo Geocoding y Forecast API
- Firebase Authentication y Cloud Firestore mediante AngularFire
- Chart.js para estadísticas
- SCSS responsive

## Requisitos e instalación

Requiere Node.js 20 o superior y npm.

```bash
npm install
npm start
```

La aplicación queda disponible en `http://localhost:4200/`.

Para validar producción:

```bash
npx ng build
npm test -- --run
```

## Configuración de Firebase

1. Creá un proyecto en Firebase Console.
2. Agregá una aplicación web y copiá su objeto de configuración.
3. En Authentication, activá el proveedor **Correo electrónico/Contraseña**.
4. En Firestore Database, creá la base en modo producción.
5. Reemplazá los seis valores `REEMPLAZAR` de `src/environments/environment.development.ts` y `src/environments/environment.ts`.
6. Publicá las reglas con `firebase deploy --only firestore:rules`.

No hay claves administrativas ni cuentas de prueba incluidas. Sin esa configuración, las pantallas de autenticación y ciudades guardadas informan claramente que Firebase está pendiente; la búsqueda y el clima siguen funcionando con Open-Meteo.

La colección utilizada es:

```text
users/{uid}/savedCities/{cityExternalId}
```

Cada documento contiene los datos de la ciudad, estado, notas, fecha planificada, temperatura preferida y timestamps de creación/actualización. Las reglas están en `firestore.rules` y restringen el acceso al usuario dueño.

## Rutas

| Ruta | Descripción |
| --- | --- |
| `/inicio` | Inicio |
| `/buscar` | Buscador Open-Meteo |
| `/clima/:cityId` | Detalle y pronóstico de siete días |
| `/login` | Inicio de sesión |
| `/registro` | Registro |
| `/mis-ciudades` | CRUD de destinos, requiere sesión |
| `/estadisticas` | Gráficos dinámicos, requiere sesión |

Las rutas privadas redirigen a `/login` y conservan `returnUrl`.

## Despliegue en Firebase Hosting

El archivo `firebase.json` ya apunta a `dist/climaTrip/browser` y contiene el rewrite de SPA.

```bash
npm install -g firebase-tools
firebase login
firebase use --add
npx ng build
firebase deploy --only hosting,firestore:rules
```

No se debe desplegar hasta completar Firebase Console y verificar la aplicación localmente.

## Estructura principal

```text
src/app/core/          modelos, guard, servicios y utilidades
src/app/features/      pantallas lazy de la aplicación
src/app/shared/        formulario reutilizable de ciudad guardada
src/environments/      configuración Firebase a completar
docs/                  plan de pruebas
```

## Limitaciones conocidas

- Open-Meteo no requiere API key, pero depende de conectividad externa.
- Firebase no se puede habilitar sin crear el proyecto y pegar su configuración real.
- La versión disponible de AngularFire declara compatibilidad con Angular 20; se validó con build en Angular 21, pero conviene reevaluar la dependencia al actualizar Angular.
