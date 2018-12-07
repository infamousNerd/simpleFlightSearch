import { ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export const invalidSearch: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const origin = control.get('sourceControl');
  const destination = control.get('destinationControl');
  const flight = control.get('flightsControl');
  const invalidCombination1 = (!origin.value && 
                                (destination.value !== null || destination.value !== "")
                              ) ||
                              (!destination.value && 
                                (origin.value !== null || origin.value !== "")
                              );
  // please bare with me here. Some bad code :(
  const invalidCombination2 = (flight.value !== null || flight.value !== "") && invalidCombination1;
  const invalidTouched = origin.touched && destination.touched;

  return (invalidCombination1 && invalidTouched) || invalidCombination2 ? { 'invalidSearch': true } : null;
};
