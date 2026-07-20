import { TestBed } from '@angular/core/testing';
import { GuardResult, Router, RouterStateSnapshot, provideRouter } from '@angular/router';
import { Observable, firstValueFrom, isObservable, of } from 'rxjs';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  it('allows an authenticated user', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: { waitForAuthInitialization: () => of({ uid: 'user' }) } }],
    });
    const result = await resolveGuard(TestBed.runInInjectionContext(() => authGuard({} as never, { url: '/mis-ciudades' } as RouterStateSnapshot)));
    expect(result).toBe(true);
  });

  it('redirects a guest user to login with the requested return URL', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: { waitForAuthInitialization: () => of(null) } }],
    });
    const result = await resolveGuard(TestBed.runInInjectionContext(() => authGuard({} as never, { url: '/estadisticas' } as RouterStateSnapshot)));
    expect((result as ReturnType<Router['createUrlTree']>).toString()).toBe('/login?returnUrl=%2Festadisticas');
  });
});

function resolveGuard(result: GuardResult | Promise<GuardResult> | Observable<GuardResult>): Promise<GuardResult> {
  return isObservable(result) ? firstValueFrom(result) : Promise.resolve(result);
}
