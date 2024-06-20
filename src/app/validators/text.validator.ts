import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export function hasUpperCase(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]+/.test(value);

    return !hasUpperCase ? { missingUpperCase: true } : null;
  };
}

export function hasLowerCase(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasLowerCase = /[a-z]+/.test(value);

    return !hasLowerCase ? { missingLowerCase: true } : null;
  };
}

export function hasNumeric(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasNumeric = /[0-9]+/.test(value);

    return !hasNumeric ? { missingNumeric: true } : null;
  };
} 

export function hasSpecialCharacter(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]+/.test(value);

    return !hasSpecialCharacter ? { missingSpecialCharacter: true } : null;
  };
} 

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const isEmail = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,3}$/.test(value);

    return !isEmail ? { invalidEmail: true } : null;
  };
}

export function passwordMatchValidator(group: FormGroup): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}