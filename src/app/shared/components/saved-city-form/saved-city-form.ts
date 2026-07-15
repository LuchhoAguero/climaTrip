import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { SavedCity, SavedCityFormValue, SavedCityStatus } from '../../../core/models/saved-city.model';

@Component({
  selector: 'app-saved-city-form',
  imports: [ReactiveFormsModule],
  templateUrl: './saved-city-form.html',
  styleUrl: './saved-city-form.scss',
})
export class SavedCityForm implements OnChanges {
  private readonly formBuilder = inject(FormBuilder);

  @Input() initialValue: Partial<SavedCity> | null = null;
  @Input() submitting = false;
  @Output() saveCity = new EventEmitter<SavedCityFormValue>();
  @Output() cancel = new EventEmitter<void>();

  readonly form = this.formBuilder.group({
    status: this.formBuilder.nonNullable.control<SavedCityStatus>('interested', Validators.required),
    plannedDate: this.formBuilder.nonNullable.control(''),
    preferredTemperature: this.formBuilder.control<number | null>(null, [Validators.min(-60), Validators.max(60)]),
    notes: this.formBuilder.nonNullable.control('', Validators.maxLength(500)),
  }, { validators: [this.plannedDateValidator] });

  ngOnChanges(): void {
    if (!this.initialValue) return;

    this.form.patchValue({
      status: this.initialValue.status ?? 'interested',
      plannedDate: this.initialValue.plannedDate ?? '',
      preferredTemperature: this.initialValue.preferredTemperature ?? null,
      notes: this.initialValue.notes ?? '',
    });
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
      preferredTemperature: value.preferredTemperature,
      notes: value.notes.trim(),
    });
  }

  private plannedDateValidator(control: AbstractControl): ValidationErrors | null {
    const status = control.get('status')?.value as SavedCityStatus | undefined;
    const plannedDate = control.get('plannedDate')?.value as string | undefined;
    return status === 'planned' && !plannedDate ? { plannedDateRequired: true } : null;
  }
}
