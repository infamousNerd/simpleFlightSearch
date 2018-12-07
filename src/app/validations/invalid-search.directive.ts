import { ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export const invalidSearch: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const origin = control.get('sourceControl');
  const destination = control.get('destinationControl');
  const flight = control.get('flightsControl');
  // please bare with me here. Some bad code :(
  const invalidCombination1 = (!origin.value && 
                                (destination.value !== null && destination.value !== "")
                              ) ||
                              (!destination.value && 
                                (origin.value !== null && origin.value !== "")
                              );
  const invalidCombination2 = (flight.value !== null && flight.value !== "") && invalidCombination1;
  const invalidTouched1 = origin.touched && destination.touched;
  const invalidTouched2 = invalidTouched1 && (origin.value === "" && destination.value === "");

  return (invalidCombination1 && invalidTouched1 && !invalidTouched2) || (invalidCombination2 && flight.touched) ? { 'invalidSearch': true } : null;
};
