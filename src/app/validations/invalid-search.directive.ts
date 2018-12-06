import { ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export const invalidSearch: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const origin = control.get('sourceControl').value;
  const destination = control.get('destinationControl').value;
  const flight = control.get('flightsControl').value;
  const invalidCombination = (origin && !destination && flight) || (!origin && destination && flight);
  const invalidTouched = origin === "" || destination === "";

  return invalidCombination && !invalidTouched ? { 'invalid': true } : null;
};

