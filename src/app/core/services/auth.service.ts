import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, User, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from '@angular/fire/auth';
import { FirebaseError } from 'firebase/app';
import { Observable, catchError, from, map, of, shareReplay, switchMap, take, throwError } from 'rxjs';
import { firebaseIsConfigured } from './firebase-config.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth, { optional: true });
  private readonly state$ = this.auth
    ? authState(this.auth).pipe(shareReplay({ bufferSize: 1, refCount: true }))
    : of(null);

  readonly user$ = this.state$;
  readonly user = toSignal(this.state$, { initialValue: null });
  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly configured = firebaseIsConfigured;

  register(displayName: string, email: string, password: string): Observable<User> {
    if (!this.auth) return this.configurationError();

    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(({ user }) => from(updateProfile(user, { displayName })).pipe(map(() => user))),
      catchError((error: FirebaseError) => throwError(() => new Error(this.translateError(error.code)))),
    );
  }

  login(email: string, password: string): Observable<User> {
    if (!this.auth) return this.configurationError();

    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map(({ user }) => user),
      catchError((error: FirebaseError) => throwError(() => new Error(this.translateError(error.code)))),
    );
  }

  logout(): Observable<void> {
    if (!this.auth) return of(undefined);
    return from(signOut(this.auth)).pipe(
      catchError((error: FirebaseError) => throwError(() => new Error(this.translateError(error.code)))),
    );
  }

  getCurrentUser(): User | null {
    return this.auth?.currentUser ?? this.user();
  }

  waitForAuthInitialization(): Observable<User | null> {
    return this.user$.pipe(take(1));
  }

  private configurationError(): Observable<never> {
    return throwError(() => new Error('Firebase todavía no está configurado. Completá src/environments/environment.development.ts con las credenciales de tu proyecto.'));
  }

  private translateError(code: string): string {
    const messages: Record<string, string> = {
      'auth/email-already-in-use': 'Ya existe una cuenta con ese correo electrónico.',
      'auth/invalid-email': 'Ingresá un correo electrónico válido.',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
      'auth/invalid-credential': 'El correo o la contraseña no son correctos.',
      'auth/user-not-found': 'No encontramos una cuenta con ese correo electrónico.',
      'auth/wrong-password': 'El correo o la contraseña no son correctos.',
      'auth/too-many-requests': 'Demasiados intentos. Esperá unos minutos antes de volver a probar.',
      'auth/network-request-failed': 'No se pudo conectar con Firebase. Revisá tu conexión.',
    };

    return messages[code] ?? 'No se pudo completar la operación. Intentá nuevamente.';
  }
}
