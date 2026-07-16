import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Register } from './register';
import { AuthService } from '../../../core/services/auth.service';

describe('Register', () => {
  let fixture: ComponentFixture<Register>;
  let component: Register;
  let auth: { configured: boolean; register: ReturnType<typeof vi.fn> };
  let router: { navigateByUrl: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    auth = {
      configured: true,
      register: vi.fn(() => of({ uid: 'user' })),
    };
    router = {
      navigateByUrl: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
  });

  it('keeps the form invalid when academic terms are not accepted and does not register', () => {
    fillValidData(false);
    component.submit();
    expect(component.form.invalid).toBe(true);
    expect(auth.register).not.toHaveBeenCalled();
  });

  it('marks the form valid when academic terms are accepted and registers', () => {
    fillValidData(true);
    expect(component.form.valid).toBe(true);
    component.submit();
    expect(auth.register).toHaveBeenCalledWith('Ada', 'ada@example.com', '123456');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/mis-ciudades');
  });

  function fillValidData(academicTerms: boolean): void {
    component.form.setValue({
      displayName: 'Ada',
      email: 'ada@example.com',
      password: '123456',
      confirmPassword: '123456',
      academicTerms,
    });
  }
});
