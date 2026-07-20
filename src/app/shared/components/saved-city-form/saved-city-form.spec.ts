import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SavedCityForm } from './saved-city-form';

describe('SavedCityForm', () => {
  let fixture: ComponentFixture<SavedCityForm>;
  let component: SavedCityForm;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedCityForm],
    }).compileComponents();

    fixture = TestBed.createComponent(SavedCityForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('muestra y completa la fecha de visita al marcar una ciudad como visitada', () => {
    component.form.controls.status.setValue('visited');
    fixture.detectChanges();

    expect(component.form.controls.visitedDate.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(fixture.nativeElement.textContent).toContain('Fecha de visita');
  });

  it('emite las fechas planificada y de visita sin perder el historial', () => {
    const saved = vi.fn();
    component.saveCity.subscribe(saved);
    component.form.setValue({
      status: 'visited',
      plannedDate: '2026-07-10',
      visitedDate: '2026-07-20',
      preferredTemperature: 24,
      notes: 'Recorrido realizado',
    });

    component.submit();

    expect(saved).toHaveBeenCalledWith({
      status: 'visited',
      plannedDate: '2026-07-10',
      visitedDate: '2026-07-20',
      preferredTemperature: 24,
      notes: 'Recorrido realizado',
    });
  });
});
