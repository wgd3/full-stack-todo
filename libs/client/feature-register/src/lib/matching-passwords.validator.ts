import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export const MATCHING_ERROR_KEY = 'passwordsMatch';

export const MatchingPasswords = (
  controlName: string,
  matchingControlName: string
): ValidatorFn => {
  return (fg: AbstractControl): ValidationErrors | null => {
    if (!(fg instanceof FormGroup)) {
      throw new Error(
        `Can not use MatchingPasswords validator on a control that is not a FormGroup!`
      );
    }

    const passwordControl = fg.controls[controlName];
    const matchingControl = fg.controls[matchingControlName];

    if (!passwordControl.touched && !matchingControl.touched) {
      return null;
    }
    if (passwordControl.value !== matchingControl.value) {
      return { [MATCHING_ERROR_KEY]: true };
    }
    return null;
  };
};
