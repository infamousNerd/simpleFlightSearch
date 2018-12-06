import { ValidatorFn, AbstractControl } from '@angular/forms';

export function invalidSelection(array: Array<string>): ValidatorFn {

  return (control: AbstractControl) : { [key: string]: boolean }  | null => {
    const selectboxValue = control.value;
    const picked = array.find(alias => {return alias === selectboxValue});
    const blankValue = "";

    return (picked || selectboxValue === blankValue || selectboxValue === null) ? null : { 'match': true };
  }
}
