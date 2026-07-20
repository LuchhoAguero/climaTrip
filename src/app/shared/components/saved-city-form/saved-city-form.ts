import { Component, DestroyRef, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SavedCity, SavedCityFormValue, SavedCityStatus } from '../../../core/models/saved-city.model';

@Component({
  selector: 'app-saved-city-form',
  imports: [ReactiveFormsModule],
  templateUrl: './saved-city-form.html',
  styleUrl: './saved-city-form.scss',
})
export class SavedCityForm implements OnChanges {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  @Input() initialValue: Partial<SavedCity> | null = null;
  @Input() submitting = false;
  @Output() saveCity = new EventEmitter<SavedCityFormValue>();
  @Output() cancel = new EventEmitter<void>();

  readonly form = this.formBuilder.group({
    status: this.formBuilder.nonNullable.control<SavedCityStatus>('interested', Validators.required),
    plannedDate: this.formBuilder.nonNullable.control(''),
    visitedDate: this.formBuilder.nonNullable.control(''),
    preferredTemperature: this.formBuilder.control<number | null>(null, [Validators.min(-60), Validators.max(60)]),
    notes: this.formBuilder.nonNullable.control('', Validators.maxLength(500)),
  }, { validators: [this.dateValidator] });

  constructor() {
    this.form.controls.status.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((status) => {
        if (status === 'visited' && !this.form.controls.visitedDate.value) {
          this.form.controls.visitedDate.setValue(this.todayKey());
        }
      });
  }

  ngOnChanges(): void {
    if (!this.initialValue) return;

    this.form.patchValue({
      status: this.initialValue.status ?? 'interested',
      plannedDate: this.initialValue.plannedDate ?? '',
      visitedDate: this.initialValue.visitedDate ?? '',
      preferredTemperature: this.initialValue.preferredTemperature ?? null,
      notes: this.initialValue.notes ?? '',
    }, { emitEvent: false });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.saveCity.emit({
      status: value.status,
      plannedDate: value.plannedDate || null,
      visitedDate: value.visitedDate || null,
      preferredTemperature: value.preferredTemperature,
      notes: value.notes.trim(),
    });
  }

  private dateValidator(control: AbstractControl): ValidationErrors | null {
    const status = control.get('status')?.value as SavedCityStatus | undefined;
    const plannedDate = control.get('plannedDate')?.value as string | undefined;
    const visitedDate = control.get('visitedDate')?.value as string | undefined;

    if (status === 'planned' && !plannedDate) return { plannedDateRequired: true };
    if (status === 'visited' && !visitedDate) return { visitedDateRequired: true };
    return null;
  }

  private todayKey(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
