import { ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export const equalityValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const origin = control.get('sourceControl');
  const destination = control.get('destinationControl');

  return origin && 
         destination && 
         origin.value === destination.value &&
         (origin.value !== null && destination.value !== null) &&
         (origin.value !== "" && destination.value !== "")
  ? { 'equality': true } : null;
};

